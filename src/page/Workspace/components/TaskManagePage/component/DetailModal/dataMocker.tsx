import RuleConfigTable from '@/component/DataMockerDrawer/RuleConfigTable';
import { convertServerColumnsToFormColumns } from '@/component/DataMockerDrawer/RuleContent';
import { MockStrategyTextMap } from '@/component/DataMockerDrawer/type';
import {
  IMockDataParams,
  IServerMockTable,
  ITaskResult,
  TaskDetail,
  TaskExecStrategy,
} from '@/d.ts';
import { TaskExecStrategyMap } from '@/page/Workspace/components/TaskManagePage';
import { formatMessage } from '@/util/intl';
import { getFormatDateTime } from '@/util/utils';
import Form from 'antd/lib/form/Form';

export function getItems(task: TaskDetail<IMockDataParams>, result: ITaskResult, hasFlow: boolean) {
  if (!task) {
    return [];
  }
  const {
    id,
    parameters: { taskDetail },
    status,
    connection,
  } = task;
  const taskDetailObj: {
    tables: IServerMockTable;
  } = JSON.parse(taskDetail);
  const taskDbMode = connection?.dbMode;
  let taskDetailItems;
  let columnsItems;
  let schemaName;
  try {
    if (taskDetail) {
      const table = taskDetailObj?.tables?.[0];
      if (table) {
        schemaName = table.schemaName;
        taskDetailItems = {
          textItems: [
            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.TargetTable',
              }),

              // 目标表
              table.tableName,
              2,
            ],

            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.SimulateTheGeneratedDataVolume',
              }),

              // 模拟生成数据量
              table.totalCount,
            ],

            [
              formatMessage({ id: 'odc.TaskManagePage.DataMocker.BatchSize' }), // 批处理大小
              table.batchSize,
            ],

            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.ClearTheTableBeforeInserting',
              }),

              // 插入模拟数据前清空表
              table.whetherTruncate
                ? formatMessage({ id: 'odc.TaskManagePage.DataMocker.Is' }) // 是
                : formatMessage({ id: 'odc.TaskManagePage.DataMocker.No' }), // 否
            ],
            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.DataConflictHandlingMethod',
              }),

              // 数据冲突处理方式
              MockStrategyTextMap[table.strategy],
            ],

            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.ActualInsertRecord',
              }),

              // 实际插入记录
              result?.writeCount,
            ],

            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.ConflictRecords',
              }),

              // 冲突记录
              result?.conflictCount,
            ],

            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.IgnoreInsert',
              }),

              // 忽略插入
              result?.ignoreCount,
            ],

            [
              formatMessage({
                id: 'odc.TaskManagePage.DataMocker.ClearRecords',
              }),

              // 清除记录
              result?.clearCount,
            ],
          ],
        };

        const { columns } = table;
        if (columns?.length) {
          columnsItems = {
            sectionName: formatMessage({
              id: 'odc.TaskManagePage.DataMocker.RuleSettings',
            }),

            // 规则设置展示
            textItems: [],
            sectionRender: (task: TaskDetail<IMockDataParams>) => {
              const tableColumns = convertServerColumnsToFormColumns(columns, taskDbMode);
              return (
                <Form
                  key={id + status}
                  initialValues={{
                    columns: tableColumns,
                  }}
                >
                  <RuleConfigTable dbMode={taskDbMode} readonly value={tableColumns} />
                </Form>
              );
            },
          };
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  const res: {
    sectionName?: string;
    textItems: [string, string | number, number?][];
    /**
     * 自定义渲染逻辑
     */
    sectionRender?: (task: TaskDetail<IMockDataParams>) => void;
  }[] = [
    {
      textItems: [
        [
          formatMessage({ id: 'odc.component.DetailModal.dataMocker.TaskNo' }), //任务编号
          task?.id,
        ],

        [
          formatMessage({
            id: 'odc.component.DetailModal.dataMocker.Connection',
          }),

          //所属连接
          task?.connection?.name || '-',
        ],

        [
          formatMessage({
            id: 'odc.component.DetailModal.dataMocker.Database',
          }),

          //所属数据库
          task?.databaseName || '-',
        ],

        [
          formatMessage({
            id: 'odc.component.DetailModal.dataMocker.TaskType',
          }),

          //任务类型
          formatMessage({
            id: 'odc.component.DetailModal.dataMocker.AnalogData',
          }),

          //模拟数据
        ],

        [
          formatMessage({
            id: 'odc.component.DetailModal.dataMocker.ExecutionMethod',
          }),

          //执行方式
          TaskExecStrategyMap[task?.executionStrategy],
        ],
      ],
    },

    taskDetailItems,
    columnsItems,
    {
      textItems: [
        [
          formatMessage({ id: 'odc.component.DetailModal.dataMocker.Created' }), //创建人
          task?.creator?.name || '-',
        ],

        [
          formatMessage({ id: 'odc.TaskManagePage.DataMocker.CreationTime' }), // 创建时间
          getFormatDateTime(task.createTime),
        ],
      ],
    },
  ].filter(Boolean);

  if (task?.executionStrategy === TaskExecStrategy.TIMER) {
    res[0].textItems.push([
      formatMessage({
        id: 'odc.component.DetailModal.dataMocker.ExecutionTime',
      }), //执行时间
      getFormatDateTime(task?.executionTime),
    ]);
  }

  if (hasFlow) {
    const maxRiskLevel = task?.maxRiskLevel;
    const flowInfo: [string, string | number, number?][] = [
      [
        formatMessage({ id: 'odc.component.DetailModal.dataMocker.RiskLevel' }), //风险等级
        formatMessage(
          {
            id: 'odc.component.DetailModal.dataMocker.Maxrisklevel',
          },

          { maxRiskLevel: maxRiskLevel },
        ),
        //风险等级
      ],
    ];

    flowInfo.forEach((item) => {
      res[0].textItems.push(item);
    });
  }
  return res;
}