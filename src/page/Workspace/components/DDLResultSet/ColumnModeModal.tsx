import { formatMessage } from '@/util/intl';
import { Button, Modal } from 'antd';
import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'umi';

import type { ResultSetColumn } from '@/d.ts';
import type { FormatterProps } from '@alipay/ob-react-data-grid';
import { LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons';
import type { RowType } from '../EditableTable';
import EditableTable from '../EditableTable';
import TextFormatter from './hooks/components/TextFormatter';
import { getCellFormatter } from './hooks/useColumns';
import styles from './index.less';
import ResultContext from './ResultContext';

interface IProps {
  visible: boolean;
  selectedRow: any;
  currentIdx: number;
  columns: ResultSetColumn[];
  useUniqueColumnName: boolean;
  total: number;
  onClose: () => void;
  setSelectedRowIndex: (rowIdx: number) => void;
}

interface DataInColumnMode extends RowType {
  columnName: string;
  columnValue: string;
  columnType: string;
  columnKey?: string;
}

function Formatter(props: FormatterProps<DataInColumnMode, any>) {
  const { row } = props;
  const FormatterComponent = getCellFormatter(row.columnType, false, true);
  if (FormatterComponent) {
    return <FormatterComponent {...props} />;
  }
  return null;
}

const ColumnModeModal: React.FC<IProps> = function (props) {
  const {
    visible,
    selectedRow,
    useUniqueColumnName,
    columns,
    total,
    currentIdx,
    setSelectedRowIndex,
    onClose,
  } = props;

  const resultContext = useContext(ResultContext);

  const tableColumns = useMemo(() => {
    return [
      {
        name: formatMessage({
          id: 'odc.components.DDLResultSet.ColumnModeModal.ColumnName',
        }),

        // 列名
        key: 'columnName',
        width: 200,
      },

      {
        name: formatMessage({
          id: 'odc.components.DDLResultSet.ColumnModeModal.Value',
        }),

        // 值
        key: 'columnValue',
        formatter: Formatter,
      },

      {
        name: formatMessage({
          id: 'odc.components.DDLResultSet.ColumnModeModal.Comment',
        }), //注释
        key: 'columnComment',
        formatter: TextFormatter,
      },
    ];
  }, []);

  const columnsInColumnMode: {
    title: string;
    dataIndex: string;
    render?: any;
    width?: number;
  }[] = [];
  let dataInColumnMode: DataInColumnMode[] = [];

  if (selectedRow) {
    dataInColumnMode = columns.map((c, i) => {
      const uniqueColumnName = c.key;
      return {
        ...selectedRow,
        columnName: c.name,
        columnKey: c.key,
        // 展示时使用 name 而非 key
        columnValue: selectedRow[uniqueColumnName],
        columnComment: c.columnComment ?? '',
        columnType: c.columnType,
      };
    });
  }

  return (
    <Modal
      destroyOnClose
      bodyStyle={{
        paddingBottom: 0,
      }}
      title={formatMessage({
        id: 'workspace.window.sql.button.columnMode',
      })}
      visible={visible}
      onCancel={() => onClose()}
      footer={[
        <Button key="close" type="primary" onClick={() => onClose()}>
          <FormattedMessage id="app.button.close" />
        </Button>,
      ]}
    >
      <ResultContext.Provider
        value={{
          ...resultContext,
          isEditing: false,
          isColumnMode: true,
        }}
      >
        <EditableTable
          rowKey="columnName"
          rows={dataInColumnMode}
          columns={tableColumns}
          enableFilterRow={false}
          enableColumnRecord={false}
          enableRowRecord={false}
          readonly={true}
        />
      </ResultContext.Provider>

      <footer className={styles.columnModeFooter}>
        <span>
          <FormattedMessage
            id="workspace.window.sql.result.pagination.current"
            values={{
              current: currentIdx + 1,
            }}
          />
          /
          <FormattedMessage
            id="workspace.window.sql.result.pagination.total"
            values={{
              total,
            }}
          />
        </span>
        <span>
          <LeftSquareOutlined
            style={{
              fontSize: 14,
              marginRight: 8,
            }}
            onClick={() => setSelectedRowIndex(currentIdx - 1 < 0 ? total - 1 : currentIdx - 1)}
          />

          <RightSquareOutlined
            style={{
              fontSize: 14,
            }}
            onClick={() => setSelectedRowIndex(currentIdx + 1 > total - 1 ? 0 : currentIdx + 1)}
          />
        </span>
      </footer>
    </Modal>
  );
};

export default ColumnModeModal;