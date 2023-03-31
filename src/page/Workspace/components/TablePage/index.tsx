import { getTableInfo } from '@/common/network/table';
import { ConstraintType, DbObjectType } from '@/d.ts';
import { PageStore } from '@/store/page';
import { SchemaStore } from '@/store/schema';
import { SettingStore } from '@/store/setting';
import { formatMessage } from '@/util/intl';
import { ExportOutlined } from '@ant-design/icons';
import { Layout, Radio, Spin, Tabs } from 'antd';
import type { RadioChangeEvent } from 'antd/lib/radio';
import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'umi';
import { ITableModel } from '../CreateTable/interface';
import TableColumns from './Columns';
import TableConstraints from './Constraints';
import TablePageContext from './context';
import TableDDL from './DDL';
import TableIndexes from './Indexes';
import TablePartitions from './Partitions';
import ShowExecuteModal from './showExecuteModal';
import ShowTableBaseInfoForm from './ShowTableBaseInfoForm';
import TableData from './TableData';

import Toolbar from '@/component/Toolbar';
import modal from '@/store/modal';
import styles from './index.less';

const Content = Layout.Content;
const TabPane = Tabs.TabPane;

interface IProps {
  pageKey: string;
  pageStore?: PageStore;
  settingStore?: SettingStore;
  schemaStore?: SchemaStore;
  params: {
    tableName: string;
    topTab: TopTab;
    propsTab: PropsTab;
    constraintsTab: ConstraintType;
  };
}

// 顶层 Tab key 枚举
export enum TopTab {
  PROPS = 'PROPS',
  DATA = 'DATA',
}

// 属性 Tab key 枚举
export enum PropsTab {
  INFO = 'INFO',
  COLUMN = 'COLUMN',
  INDEX = 'INDEX',
  CONSTRAINT = 'CONSTRAINT',
  DDL = 'DDL',
  PARTITION = 'PARTITION',
}

const TablePage: React.FC<IProps> = function ({
  params,
  settingStore,
  pageStore,
  schemaStore,
  pageKey,
}) {
  const [table, setTable] = useState<Partial<ITableModel>>(null);
  const [version, setVersion] = useState(0);
  const [topTab, setTopTab] = useState(TopTab.PROPS);
  const [propsTab, setPropsTab] = useState(PropsTab.INFO);
  const executeRef = useRef<{
    showExecuteModal: (sql: any, tableName: any) => Promise<boolean>;
  }>();
  const showPartition = !!table?.partitions?.partType;
  const enableConstraint = schemaStore.enableConstraint;

  async function fetchTable() {
    if (table?.info?.tableName === params.tableName) {
      return;
    }
    const newTable = await getTableInfo(params.tableName);
    if (newTable) {
      setTable(newTable);
      setVersion(version + 1);
      /**
       * 加一个校验的逻辑，避免名字不同步
       */
      const newTableName = newTable?.info?.tableName;
      if (newTableName && newTableName !== params.tableName) {
        setTable({
          ...newTable,
          info: Object.assign({}, newTable?.info, { tableName: newTableName }),
        });
        await pageStore.updatePage(
          pageKey,
          {
            title: newTableName,
            updateKey: true,
          },

          {
            tableName: newTableName,
          },
        );
      }
    }
  }

  const refresh = useCallback(async () => {
    await fetchTable();
  }, [params.tableName]);

  useEffect(() => {
    fetchTable();
  }, []);

  useEffect(() => {
    if (params.topTab) {
      setTopTab(params.topTab);
    }
    if (params.propsTab) {
      setPropsTab(params.propsTab);
    }
  }, [params.propsTab, params.topTab]);

  const handleTopTabChanged = (v: RadioChangeEvent) => {
    const topTab = v.target.value;

    // 更新 url
    pageStore.updatePage(
      pageKey,
      {},
      {
        topTab,
      },
    );
  };

  const handlePropsTabChanged = async (propsTab: PropsTab) => {
    pageStore.updatePage(
      pageKey,
      {},
      {
        propsTab,
      },
    );
  };

  const oldTable = useMemo(() => {
    return {
      tableName: table?.info?.tableName,
      columns: table?.columns,
    };
  }, [table]);

  return table ? (
    <>
      <Content>
        <div className={styles.header}>
          <Radio.Group onChange={handleTopTabChanged} value={topTab} className={styles.topbar}>
            <Radio.Button value={TopTab.PROPS}>
              <FormattedMessage id="workspace.window.table.toptab.props" />
            </Radio.Button>
            <Radio.Button value={TopTab.DATA}>
              <FormattedMessage id="workspace.window.table.toptab.data" />
            </Radio.Button>
          </Radio.Group>
          <Toolbar.Button
            text={
              formatMessage({ id: 'odc.components.TablePage.Export' }) //导出
            }
            icon={ExportOutlined}
            isShowText
            onClick={() => {
              modal.changeExportModal(true, {
                type: DbObjectType.table,
                name: table?.info?.tableName,
              });
            }}
          />
        </div>
        <TablePageContext.Provider
          value={{
            table: table,
            onRefresh: refresh,
            showExecuteModal: executeRef.current?.showExecuteModal,
            editMode: true,
          }}
        >
          <Tabs
            defaultActiveKey={TopTab.PROPS}
            activeKey={topTab}
            className={styles.topbarTab}
            animated={false}
          >
            <TabPane key={TopTab.PROPS} tab="">
              <Tabs
                activeKey={propsTab}
                tabPosition="left"
                className={styles.propsTab}
                onChange={handlePropsTabChanged}
              >
                <TabPane
                  tab={formatMessage({
                    id: 'workspace.window.table.propstab.info',
                  })}
                  key={PropsTab.INFO}
                >
                  <ShowTableBaseInfoForm pageKey={pageKey} />
                </TabPane>
                <TabPane
                  tab={formatMessage({
                    id: 'workspace.window.table.propstab.column',
                  })}
                  key={PropsTab.COLUMN}
                >
                  <Spin spinning={false}>
                    <TableColumns />
                  </Spin>
                </TabPane>
                <TabPane
                  tab={formatMessage({
                    id: 'workspace.window.table.propstab.index',
                  })}
                  key={PropsTab.INDEX}
                >
                  <Spin spinning={false}>
                    <TableIndexes />
                  </Spin>
                </TabPane>
                {enableConstraint && (
                  <TabPane
                    tab={formatMessage({
                      id: 'workspace.window.table.propstab.constraint',
                    })}
                    key={PropsTab.CONSTRAINT}
                  >
                    <Spin spinning={false}>
                      <TableConstraints />
                    </Spin>
                  </TabPane>
                )}

                {showPartition ? (
                  <TabPane
                    tab={formatMessage({
                      id: 'workspace.window.table.propstab.partition',
                    })}
                    key={PropsTab.PARTITION}
                  >
                    <Spin spinning={false}>
                      <TablePartitions />
                    </Spin>
                  </TabPane>
                ) : null}
                <TabPane
                  tab={formatMessage({
                    id: 'workspace.window.table.propstab.ddl',
                  })}
                  key={PropsTab.DDL}
                >
                  <TableDDL />
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane key={TopTab.DATA} tab="">
              {version > 0 ? (
                <TableData
                  table={oldTable}
                  tableName={table?.info.tableName}
                  pageKey={pageKey}
                  key={version}
                />
              ) : null}
            </TabPane>
          </Tabs>
        </TablePageContext.Provider>
      </Content>
      <ShowExecuteModal ref={executeRef} />
    </>
  ) : (
    <Spin style={{ marginLeft: '50%', marginTop: 40 }} />
  );
};

export default inject('pageStore', 'schemaStore', 'settingStore')(observer(TablePage));