import Toolbar from '@/component/Toolbar';
import { IConStatus } from '@/component/Toolbar/statefulIcon';
import type { IFunction } from '@/d.ts';
import { ConnectionMode } from '@/d.ts';
import type { PageStore } from '@/store/page';
import type { SchemaStore } from '@/store/schema';
import type { SQLStore } from '@/store/sql';
import {
  AlignLeftOutlined,
  CloudDownloadOutlined,
  EditOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Layout, message, Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi';

import { getFunctionByFuncName } from '@/common/network';
import { actionTypes, WorkspaceAcess } from '@/component/Acess';
import { SQLCodeEditorDDL } from '@/component/SQLCodeEditorDDL';
import { PLType } from '@/constant/plType';
import type { ConnectionStore } from '@/store/connection';
import { openFunctionEditPageByFuncName } from '@/store/helper/page';
import { parseDataType } from '@/util/dataType';
import { downloadPLDDL } from '@/util/sqlExport';
import type { IEditor } from '@alipay/ob-editor';
import EditableTable from '../EditableTable';
import ShowFunctionBaseInfoForm from '../ShowFunctionBaseInfoForm';
import styles from './index.less';

const ToolbarButton = Toolbar.Button;

const { Content } = Layout;
const { TabPane } = Tabs;

// 顶层 Tab key 枚举
export enum TopTab {
  PROPS = 'PROPS',
}

// 属性 Tab key 枚举
export enum PropsTab {
  INFO = 'INFO',
  PARAMS = 'PARAMS',
  DDL = 'DDL',
}

interface IProps {
  sqlStore: SQLStore;
  pageStore: PageStore;
  schemaStore: SchemaStore;
  connectionStore: ConnectionStore;
  pageKey: string;
  params: {
    funName: string;
    propsTab: PropsTab;
  };

  onUnsavedChange: (pageKey: string) => void;
}

@inject('sqlStore', 'schemaStore', 'pageStore', 'connectionStore')
@observer
export default class FunctionPage extends Component<
  IProps,
  {
    propsTab: PropsTab;
    func: Partial<IFunction>;
    dataLoading: boolean;
    formated: boolean;
  }
> {
  public editor: IEditor;

  public readonly state = {
    propsTab: this.props.params.propsTab || PropsTab.INFO,
    func: null,
    dataLoading: false,
    formated: false,
  };

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (
      nextProps.params &&
      this.props.params &&
      this.props.params.propsTab &&
      nextProps.params.propsTab !== this.state.propsTab
    ) {
      this.setState({
        propsTab: nextProps.params.propsTab,
      });
    }
  }

  public handlePropsTabChanged = (propsTab: PropsTab) => {
    const { pageStore, pageKey } = this.props;
    const { func } = this.state;
    this.setState({ propsTab });

    // 更新 url
    pageStore.updatePage(pageKey, undefined, {
      path: true,
      funName: func.funName,
      topTab: TopTab.PROPS,
      propsTab,
    });
  };

  public reloadFunction = async (funName: string) => {
    const { schemaStore } = this.props;
    const func: IFunction = await getFunctionByFuncName(funName);
    if (func) {
      func.params = func.params.map((param) => {
        const { dataType, dataLength } = parseDataType(param.dataType);
        return {
          ...param,
          dataType,
          dataLength,
        };
      });
      this.setState({ func });
    } else {
      message.error(formatMessage({ id: 'workspace.window.function.load.error' }));
    }
  };

  public async componentDidMount() {
    const {
      params: { funName },
    } = this.props;

    await this.reloadFunction(funName);
  }

  public async editFunction(funName: string) {
    const { schemaStore, pageStore } = this.props;
    await openFunctionEditPageByFuncName(funName);
  }

  private showSearchWidget() {
    const codeEditor = this.editor.UNSAFE_getCodeEditor();
    codeEditor.trigger('FIND_OR_REPLACE', 'actions.find', null);
  }

  private handleFormat = () => {
    const { formated, func } = this.state;
    if (!formated) {
      this.editor.doFormat();
    } else {
      this.editor.setValue(func?.ddl || '');
    }
    this.setState({
      formated: !formated,
    });
  };

  public render() {
    const {
      pageKey,
      params: { funName },
      connectionStore,
    } = this.props;
    const { propsTab, func, formated } = this.state;
    const isMySQL = connectionStore.connection.dbMode === ConnectionMode.OB_MYSQL;

    const tableColumns = [
      {
        key: 'paramName',
        name: formatMessage({
          id: 'workspace.window.createFunction.paramName',
        }),

        width: isMySQL ? undefined : 150,
        sortable: false,
      },

      {
        key: 'paramMode',
        name: formatMessage({
          id: 'workspace.window.createFunction.paramMode',
        }),

        width: isMySQL ? 150 : 100,
        sortable: false,
      },

      {
        key: 'dataType',
        name: formatMessage({ id: 'workspace.window.createFunction.dataType' }),
        sortable: false,
        width: isMySQL ? 160 : 120,
      },

      isMySQL
        ? {
            key: 'dataLength',
            name: formatMessage({ id: 'odc.components.FunctionPage.Length' }), // 长度
            sortable: false,
            width: 100,
          }
        : null,

      isMySQL
        ? null
        : {
            key: 'defaultValue',
            name: formatMessage({
              id: 'workspace.window.createFunction.defaultValue',
            }),

            sortable: false,
          },
    ].filter(Boolean);

    return (
      func && (
        <>
          <Content>
            <Tabs
              activeKey={propsTab}
              tabPosition="left"
              className={styles.propsTab}
              onChange={this.handlePropsTabChanged as any}
            >
              <TabPane
                tab={formatMessage({
                  id: 'workspace.window.table.propstab.info',
                })}
                key={PropsTab.INFO}
              >
                <ShowFunctionBaseInfoForm model={func} />
              </TabPane>
              <TabPane
                tab={formatMessage({
                  id: 'workspace.window.function.propstab.params',
                })}
                key={PropsTab.PARAMS}
              >
                <Toolbar>
                  <ToolbarButton
                    text={<FormattedMessage id="workspace.window.session.button.refresh" />}
                    icon={<SyncOutlined />}
                    onClick={this.reloadFunction.bind(this, func.funName)}
                  />
                </Toolbar>
                <EditableTable
                  minHeight={'calc(100vh - 106px)'}
                  rowKey={'paramName'}
                  columns={tableColumns}
                  rows={func.params || []}
                  bordered={false}
                  readonly={true}
                />
              </TabPane>
              <TabPane tab={'DDL'} key={PropsTab.DDL}>
                <Toolbar>
                  {!isMySQL && (
                    <WorkspaceAcess action={actionTypes.update}>
                      <ToolbarButton
                        text={<FormattedMessage id="workspace.window.session.button.edit" />}
                        icon={<EditOutlined />}
                        onClick={this.editFunction.bind(this, func.funName)}
                      />
                    </WorkspaceAcess>
                  )}

                  <ToolbarButton
                    text={
                      formatMessage({
                        id: 'odc.components.FunctionPage.Download',
                      }) //下载
                    }
                    icon={<CloudDownloadOutlined />}
                    onClick={() => {
                      downloadPLDDL(funName, PLType.FUNCTION, func?.ddl);
                    }}
                  />

                  <ToolbarButton
                    text={<FormattedMessage id="workspace.window.sql.button.search" />}
                    icon={<FileSearchOutlined />}
                    onClick={this.showSearchWidget.bind(this)}
                  />

                  <ToolbarButton
                    text={
                      formated
                        ? formatMessage({
                            id: 'odc.components.FunctionPage.Unformat',
                          })
                        : // 取消格式化
                          formatMessage({
                            id: 'odc.components.FunctionPage.Formatting',
                          })

                      // 格式化
                    }
                    icon={<AlignLeftOutlined />}
                    onClick={this.handleFormat}
                    status={formated ? IConStatus.ACTIVE : IConStatus.INIT}
                  />

                  <ToolbarButton
                    text={<FormattedMessage id="workspace.window.session.button.refresh" />}
                    icon={<SyncOutlined />}
                    onClick={this.reloadFunction.bind(this, func.funName)}
                  />
                </Toolbar>
                <div style={{ height: `calc(100vh - ${40 + 28 + 39}px)` }}>
                  <SQLCodeEditorDDL
                    readOnly
                    initialValue={(func && func.ddl) || ''}
                    language={`sql-oceanbase-${isMySQL ? 'mysql-pl' : 'oracle-pl'}`}
                    onEditorCreated={(editor: IEditor) => {
                      this.editor = editor;
                    }}
                  />
                </div>
              </TabPane>
            </Tabs>
          </Content>
        </>
      )
    );
  }
}