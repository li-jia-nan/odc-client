import { IndexRange, ITableColumn, ITableIndex } from '@/d.ts';
import { DeleteOutlined, EditOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi';
// @ts-ignore
import { actionTypes, WorkspaceAcess } from '@/component/Acess';
import Toolbar from '@/component/Toolbar';
import { generateUniqKey } from '@/util/utils';
import { RowsChangeData } from '@alipay/ob-react-data-grid/lib/types';
import memoizeOne from 'memoize-one';
import EditableTable from '../EditableTable';
import { WrapSelectEditor } from '../EditableTable/Editors/SelectEditor';
import { TextEditor } from '../EditableTable/Editors/TextEditor';
import CheckboxFormatter from './CheckboxFormatter';
import styles from './index.less';

const ToolbarButton = Toolbar.Button;

interface IProps {
  hideBorder?: boolean;
  fixedFooter?: boolean;
  modified: boolean;
  showRequired?: boolean;
  rangeInitialValue: IndexRange;
  rangeDisabled: boolean;
  tableHeight?: string;
  allowRefresh?: boolean;
  allowReset?: boolean;
  indexes: Array<Partial<ITableIndex>>;
  columns: Array<Partial<ITableColumn>>;
  onAddIndex: (index: Partial<ITableIndex>) => void;
  onDeleteIndex: (rowIdx: number) => void;
  onCancelDeleteIndex?: (rowIdx: number) => void;
  onSave: () => void;
  onRefresh?: () => void;
  /**
   * 点击编辑按钮编辑
   */
  onStartEditIndex: (rowIdx: number) => void;
  onReset?: () => void;
  onUpdate: (newRows: ITableIndex[], data: RowsChangeData<ITableIndex, any>) => void;
  onModified: () => void;
  onCreated?: (value: any) => void;
}

export const defaultIndex = {
  name: '',
  type: 'BTREE',
  range: IndexRange.GLOBAL,
};

export default class CreateTableIndexForm extends Component<
  IProps,
  {
    selectedRowIndex: number;
    showEditModal: boolean;
    isDeleted: boolean;
    onCreated?: () => void;
  }
> {
  public readonly state = {
    selectedRowIndex: -1,
    showEditModal: false,
    isDeleted: false,
  };
  private WrapSelectEditorMemo = memoizeOne((columns) => {
    return WrapSelectEditor(columns?.map((c) => c.columnName).filter(Boolean) || []);
  });

  public columnKeys: string[] = [];

  public handleSubmit = () => {
    this.props.onSave();
  };

  public handleAddColumn = () => {
    this.props.onAddIndex({ ...defaultIndex, key: generateUniqKey() });
  };

  public handleEditColumn = () => {
    this.props.onStartEditIndex(this.state.selectedRowIndex);
  };

  public handleDeleteColumn = () => {
    this.setState({
      isDeleted: !this.state.isDeleted,
    });
    this.props.onDeleteIndex(this.state.selectedRowIndex);
  };

  public handleCancelDeleteColumn = () => {
    this.setState({
      isDeleted: !this.state.isDeleted,
    });
    if (this.props.onCancelDeleteIndex) {
      this.props.onCancelDeleteIndex(this.state.selectedRowIndex);
    }
  };

  public handleRefreshColumn = () => {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  };

  public handleSelect = (keys: React.Key[]) => {
    const { indexes } = this.props;
    const rowIdx = indexes.findIndex((index) => keys.includes(index.key));
    const isDeleted = !!indexes[rowIdx]?._deleted;
    this.setState({
      selectedRowIndex: rowIdx,
      isDeleted,
    });
  };

  public render() {
    const {
      hideBorder,
      fixedFooter,
      indexes,
      columns,
      allowRefresh,
      tableHeight,
      rangeDisabled,
      rangeInitialValue,
      onModified,
      onCreated,
    } = this.props;
    const { isDeleted, selectedRowIndex } = this.state;

    const enableEdit = !!indexes[selectedRowIndex]?._created;

    defaultIndex.range = rangeInitialValue;

    const tableColumns = [
      {
        key: 'name',
        name: formatMessage({ id: 'workspace.window.createTable.index.name' }),
        sortable: false,
        required: true,
        editable: (row) => !!row?._created,
        editor: TextEditor,
      },
      {
        key: 'range',
        name: formatMessage({ id: 'workspace.window.createTable.index.range' }),
        sortable: false,
        // 只有oracle mode的分区表，才会有索引范围设置
        // @see aone/issue/22383865
        editable: (row) => !!row?._created && !rangeDisabled,
        editor: WrapSelectEditor([IndexRange.GLOBAL, IndexRange.LOCAL], false),
        width: 140,
      },
      {
        key: 'type',
        name: formatMessage({ id: 'workspace.window.createTable.index.type' }),
        resizable: true,
        sortable: false,
        width: 140,
      },
      {
        key: 'columnNames',
        name: formatMessage({
          id: 'workspace.window.createTable.index.columnNames',
        }),
        resizable: true,
        sortable: false,
        filterable: false,
        required: true,
        editable: (row) => !!row?._created,
        editor: this.WrapSelectEditorMemo(columns),
        formatter: (props) => props?.row?.['columnNames']?.join?.(',') || '',
      },
      {
        key: 'unique',
        name: formatMessage({
          id: 'workspace.window.createTable.index.unique',
        }),
        resizable: true,
        sortable: false,
        filterable: false,
        width: 160,
        editable: false,
        formatter: CheckboxFormatter,
      },
    ];

    this.columnKeys = tableColumns.map((t) => t.key);
    const isEmpty = !indexes.length;

    return (
      <>
        <div
          className={styles.container}
          style={{
            height: fixedFooter ? 'calc(100vh - 115px)' : 'initial',
            border: hideBorder ? 'none' : '1px solid var(--odc-border-color)',
          }}
        >
          <Toolbar>
            <WorkspaceAcess action={actionTypes.create}>
              <ToolbarButton
                text={<FormattedMessage id="workspace.header.create" />}
                icon={<PlusOutlined />}
                onClick={this.handleAddColumn}
              />
            </WorkspaceAcess>
            <WorkspaceAcess action={actionTypes.update}>
              <ToolbarButton
                disabled={!enableEdit || isEmpty}
                text={<FormattedMessage id="workspace.window.session.button.edit" />}
                icon={<EditOutlined />}
                onClick={this.handleEditColumn}
              />
            </WorkspaceAcess>
            <WorkspaceAcess action={actionTypes.delete}>
              <ToolbarButton
                text={formatMessage({ id: 'workspace.tree.table.delete' })}
                disabled={isEmpty}
                icon={<DeleteOutlined />}
                onClick={this.handleDeleteColumn}
              />
            </WorkspaceAcess>
            {allowRefresh && (
              <ToolbarButton
                text={<FormattedMessage id="workspace.window.session.button.refresh" />}
                icon={<SyncOutlined />}
                onClick={this.handleRefreshColumn}
              />
            )}
          </Toolbar>
          <EditableTable
            // emptyContent={formatMessage({ id: 'workspace.window.createTable.index.empty' })}
            minHeight={tableHeight || '200px'}
            columns={tableColumns}
            rows={indexes}
            rowKey="key"
            onSelectChange={this.handleSelect}
            // @ts-ignore
            onRowsChange={this.props.onUpdate}
            gridRef={(ref) => {
              onCreated?.(ref);
            }}
          />
        </div>
        {fixedFooter ? (
          <>
            <div className={styles.footer}>{this.renderButtons()}</div>
          </>
        ) : (
          <>
            <Divider className={styles.divider} />
            {this.renderButtons()}
          </>
        )}
      </>
    );
  }

  private renderButtons() {
    const { allowReset, onReset, modified } = this.props;

    return (
      <>
        {allowReset && (
          <Button
            disabled={!modified}
            size="small"
            onClick={onReset}
            className={styles.submitButton}
            style={{
              marginRight: 8,
            }}
          >
            <FormattedMessage id="app.button.cancel" />
          </Button>
        )}
        <Button
          disabled={!modified}
          size="small"
          onClick={this.handleSubmit}
          type="primary"
          className={styles.submitButton}
        >
          <FormattedMessage id="app.button.ok" />
        </Button>
      </>
    );
  }
}