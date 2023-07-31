import { AuditEventActionType, AuditEventType, IAuditEvent } from '@/d.ts';
import { formatMessage } from '@/util/intl';

export interface IUserMap {
  [key: string]: {
    name: string;
    accountName: string;
    roleNames?: string[];
  };
}

export const AuditEventMetaMap = {
  [AuditEventType.PERSONAL_CONFIGURATION]: formatMessage({
    id: 'odc.components.RecordPage.PersonalSettings',
  }),

  //个人设置
  [AuditEventType.MEMBER_MANAGEMENT]: formatMessage({
    id: 'odc.components.RecordPage.MemberManagement',
  }),

  //成员管理
  [AuditEventType.PASSWORD_MANAGEMENT]: formatMessage({
    id: 'odc.components.RecordPage.PasswordManagement',
  }),

  //密码管理
  [AuditEventType.CONNECTION_MANAGEMENT]: formatMessage({
    id: 'odc.components.RecordPage.ConnectionManagement',
  }),

  //连接管理
  [AuditEventType.SCRIPT_MANAGEMENT]: formatMessage({
    id: 'odc.components.RecordPage.ScriptManagement',
  }),

  //脚本管理
  [AuditEventType.DATABASE_OPERATION]: formatMessage({
    id: 'odc.components.RecordPage.DatabaseOperations',
  }),

  //数据库操作
  [AuditEventType.ORGANIZATION_CONFIGURATION]: formatMessage({
    id: 'odc.components.RecordPage.OrganizationConfiguration',
  }),

  //组织配置
  [AuditEventType.RESOURCE_GROUP_MANAGEMENT]: formatMessage({
    id: 'odc.components.RecordPage.ResourceGroupManagement',
  }),

  //资源组管理
  [AuditEventType.ASYNC]: formatMessage({
    id: 'odc.components.RecordPage.DatabaseChanges',
  }),

  //数据库变更
  [AuditEventType.IMPORT]: formatMessage({
    id: 'odc.components.RecordPage.Import',
  }),

  //导入
  [AuditEventType.EXPORT]: formatMessage({
    id: 'odc.components.RecordPage.Export',
  }),

  //导出
  [AuditEventType.MOCKDATA]: formatMessage({
    id: 'odc.components.RecordPage.AnalogData',
  }),

  //模拟数据
  [AuditEventType.AUDIT_EVENT]: formatMessage({
    id: 'odc.components.RecordPage.OperationRecords',
  }),

  [AuditEventType.SHADOWTABLE_SYNC]: formatMessage({
    id: 'odc.components.RecordPage.ShadowTableSynchronization',
  }),
  //影子表同步
  [AuditEventType.PARTITION_PLAN]: formatMessage({
    id: 'odc.components.RecordPage.PartitionPlan',
  }),
  //分区计划 //操作记录
  [AuditEventType.FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.TaskFlow',
  }),

  //任务流程
  [AuditEventType.DATA_MASKING_RULE]: formatMessage({
    id: 'odc.components.RecordPage.DesensitizationRules',
  }),

  //脱敏规则
  [AuditEventType.DATA_MASKING_POLICY]: formatMessage({
    id: 'odc.components.RecordPage.DesensitizationStrategy',
  }),

  //脱敏策略
  [AuditEventType.ALTER_SCHEDULE]: formatMessage({
    id: 'odc.components.RecordPage.PlannedChange',
  }), //计划变更

  // 数据库管理
  [AuditEventType.DATABASE_MANAGEMENT]: '数据库管理',

  // 权限申请
  [AuditEventType.PERMISSION_APPLY]: '权限申请',

  // 数据源管理
  [AuditEventType.DATASOURCE_MANAGEMENT]: '数据源管理',

  // 项目管理
  [AuditEventType.PROJECT_MANAGEMENT]: '项目管理',
};

export const AuditEventActionMap = {
  // 个人配置
  [AuditEventActionType.UPDATE_PERSONAL_CONFIGURATION]: formatMessage({
    id: 'odc.components.RecordPage.Modify',
  }),
  // 密码管理
  // 修改密码
  [AuditEventActionType.CHANGE_PASSWORD]: formatMessage({
    id: 'odc.components.RecordPage.ChangePassword',
  }),

  // 重置密码
  [AuditEventActionType.RESET_PASSWORD]: '重置密码',

  // 设置密码
  [AuditEventActionType.SET_PASSWORD]: formatMessage({
    id: 'odc.components.RecordPage.SetPassword',
  }),

  // 连接管理
  [AuditEventActionType.CREATE_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.CreateConnection',
  }),

  //新建连接
  [AuditEventActionType.DELETE_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.DeleteAConnection',
  }),

  //删除连接
  [AuditEventActionType.UPDATE_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.ModifyAConnection',
  }),

  //修改连接
  [AuditEventActionType.USE_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.CreateASession',
  }),

  //创建会话
  [AuditEventActionType.QUIT_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.CloseSession',
  }),

  //关闭会话
  [AuditEventActionType.ENABLE_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.Enable',
  }),

  //启用
  [AuditEventActionType.DISABLE_CONNECTION]: formatMessage({
    id: 'odc.components.RecordPage.Disable',
  }),

  //停用 // 脚本管理
  [AuditEventActionType.CREATE_SCRIPT]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.UPDATE_SCRIPT]: formatMessage({
    id: 'odc.components.RecordPage.Modify',
  }),

  //修改
  [AuditEventActionType.DELETE_SCRIPT]: formatMessage({
    id: 'odc.components.RecordPage.Delete',
  }),

  //删除
  [AuditEventActionType.DOWNLOAD_SCRIPT]: formatMessage({
    id: 'odc.components.RecordPage.Download',
  }),

  //下载
  [AuditEventActionType.UPLOAD_SCRIPT]: formatMessage({
    id: 'odc.components.RecordPage.Upload',
  }),

  //上传 // 组织配置
  [AuditEventActionType.UPDATE_ORGANIZATION_CONFIGURATION]: formatMessage({
    id: 'odc.components.RecordPage.Modify',
  }),

  //修改 // 成员管理
  [AuditEventActionType.ADD_USER]: formatMessage({
    id: 'odc.components.RecordPage.AddUser',
  }),

  //新增用户
  [AuditEventActionType.UPDATE_USER]: formatMessage({
    id: 'odc.components.RecordPage.ModifyUser',
  }),

  //修改用户
  [AuditEventActionType.DELETE_USER]: formatMessage({
    id: 'odc.components.RecordPage.DeleteAUser',
  }),

  //删除用户
  [AuditEventActionType.ADD_ROLE]: formatMessage({
    id: 'odc.components.RecordPage.AddRole',
  }),

  //新增角色
  [AuditEventActionType.UPDATE_ROLE]: formatMessage({
    id: 'odc.components.RecordPage.ModifyARole',
  }),

  //修改角色
  [AuditEventActionType.DELETE_ROLE]: formatMessage({
    id: 'odc.components.RecordPage.DeleteARole',
  }),

  //删除角色
  [AuditEventActionType.ENABLE_USER]: formatMessage({
    id: 'odc.components.RecordPage.EnableUsers',
  }),

  //启用用户
  [AuditEventActionType.DISABLE_USER]: formatMessage({
    id: 'odc.components.RecordPage.DisableUser',
  }),

  //停用用户
  [AuditEventActionType.ENABLE_ROLE]: formatMessage({
    id: 'odc.components.RecordPage.EnableRole',
  }),

  //启用角色
  [AuditEventActionType.DISABLE_ROLE]: formatMessage({
    id: 'odc.components.RecordPage.DisableARole',
  }),

  //停用角色 // 资源组管理
  [AuditEventActionType.ADD_RESOURCE_GROUP]: formatMessage({
    id: 'odc.components.RecordPage.AddResourceGroup',
  }),

  //新增资源组
  [AuditEventActionType.UPDATE_RESOURCE_GROUP]: formatMessage({
    id: 'odc.components.RecordPage.ModifyAResourceGroup',
  }),

  //修改资源组
  [AuditEventActionType.DELETE_RESOURCE_GROUP]: formatMessage({
    id: 'odc.components.RecordPage.DeleteAResourceGroup',
  }),

  //删除资源组
  [AuditEventActionType.ENABLE_RESOURCE_GROUP]: formatMessage({
    id: 'odc.components.RecordPage.EnableResourceGroups',
  }),

  //启用资源组
  [AuditEventActionType.DISABLE_RESOURCE_GROUP]: formatMessage({
    id: 'odc.components.RecordPage.DisableAResourceGroup',
  }),

  //停用资源组 // 数据库操作
  [AuditEventActionType.SELECT]: 'SELECT',
  [AuditEventActionType.DELETE]: 'DELETE',
  [AuditEventActionType.INSERT]: 'INSERT',
  [AuditEventActionType.REPLACE]: 'REPLACE',
  [AuditEventActionType.UPDATE]: 'UPDATE',
  [AuditEventActionType.SET]: 'SET',
  [AuditEventActionType.DROP]: 'DROP',
  [AuditEventActionType.ALTER]: 'ALTER',
  [AuditEventActionType.TRUNCATE]: 'TRUNCATE',
  [AuditEventActionType.CREATE]: 'CREATE',
  [AuditEventActionType.OTHERS]: 'OTHERS',
  // 任务流程
  [AuditEventActionType.CREATE_ASYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.CREATE_MOCKDATA_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.CREATE_IMPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.CREATE_EXPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.APPROVE_ASYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }),

  //通过
  [AuditEventActionType.APPROVE_MOCKDATA_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }),

  //通过
  [AuditEventActionType.APPROVE_IMPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }),

  //通过
  [AuditEventActionType.APPROVE_EXPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }),

  //通过
  [AuditEventActionType.REJECT_ASYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }),

  //拒绝
  [AuditEventActionType.REJECT_MOCKDATA_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }),

  //拒绝
  [AuditEventActionType.REJECT_IMPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }),

  //拒绝
  [AuditEventActionType.REJECT_EXPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }),

  //拒绝
  [AuditEventActionType.EXECUTE_ASYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Run',
  }),

  //执行
  [AuditEventActionType.EXECUTE_MOCKDATA_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Run',
  }),

  //执行
  [AuditEventActionType.EXECUTE_IMPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Run',
  }),

  //执行
  [AuditEventActionType.EXECUTE_EXPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Run',
  }),

  //执行
  [AuditEventActionType.STOP_ASYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Terminate',
  }),

  //终止
  [AuditEventActionType.STOP_MOCKDATA_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Terminate',
  }),

  //终止
  [AuditEventActionType.STOP_IMPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Terminate',
  }),

  //终止
  [AuditEventActionType.STOP_EXPORT_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Terminate',
  }),

  //终止
  [AuditEventActionType.ROLLBACK_TASK]: formatMessage({
    id: 'odc.components.RecordPage.RollBack',
  }),

  //拒绝 //回滚 // 操作记录
  [AuditEventActionType.EXPORT_AUDIT_EVENT]: formatMessage({
    id: 'odc.components.RecordPage.ExportOperationRecords',
  }),

  //导出操作记录 // 流程管理
  [AuditEventActionType.CREATE_FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.CreateProcess',
  }),

  //新建流程
  [AuditEventActionType.UPDATE_FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.ChangeProcess',
  }),

  //修改流程
  [AuditEventActionType.ENABLE_FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.Process',
  }),

  //启用流程
  [AuditEventActionType.DISABLE_FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.DeactivateProcess',
  }),

  //停用流程
  [AuditEventActionType.DELETE_FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.DeleteProcess',
  }),

  //删除流程
  [AuditEventActionType.BATCH_DELETE_FLOW_CONFIG]: formatMessage({
    id: 'odc.components.RecordPage.BatchDelete',
  }),

  //批量删除
  [AuditEventActionType.CREATE_DATA_MASKING_RULE]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.UPDATE_DATA_MASKING_RULE]: formatMessage({
    id: 'odc.components.RecordPage.Modify',
  }),

  //修改
  [AuditEventActionType.ENABLE_DATA_MASKING_RULE]: formatMessage({
    id: 'odc.components.RecordPage.Enable',
  }),

  //启用
  [AuditEventActionType.DISABLE_DATA_MASKING_RULE]: formatMessage({
    id: 'odc.components.RecordPage.Disable',
  }),

  //停用
  [AuditEventActionType.DELETE_DATA_MASKING_RULE]: formatMessage({
    id: 'odc.components.RecordPage.Delete',
  }),

  //删除
  [AuditEventActionType.CREATE_DATA_MASKING_POLICY]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),

  //新建
  [AuditEventActionType.UPDATE_DATA_MASKING_POLICY]: formatMessage({
    id: 'odc.components.RecordPage.Modify',
  }),

  //修改
  [AuditEventActionType.DELETE_DATA_MASKING_POLICY]: formatMessage({
    id: 'odc.components.RecordPage.Delete',
  }),

  //删除

  [AuditEventActionType.CREATE_SHADOWTABLE_SYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),
  //新建
  [AuditEventActionType.EXECUTE_SHADOWTABLE_SYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Execute',
  }),
  //执行
  [AuditEventActionType.APPROVE_SHADOWTABLE_SYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }),
  //通过
  [AuditEventActionType.REJECT_SHADOWTABLE_SYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }),
  //拒绝
  [AuditEventActionType.STOP_SHADOWTABLE_SYNC_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Termination',
  }),
  //终止
  [AuditEventActionType.CREATE_PARTITION_PLAN_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }),
  //新建
  [AuditEventActionType.EXECUTE_PARTITION_PLAN_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Execute',
  }),
  //执行
  [AuditEventActionType.APPROVE_PARTITION_PLAN_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }),
  //通过
  [AuditEventActionType.REJECT_PARTITION_PLAN_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }),
  //拒绝
  [AuditEventActionType.STOP_PARTITION_PLAN_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Termination',
  }),
  //终止

  [AuditEventActionType.CREATE_ALTER_SCHEDULE_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Create',
  }), //新建
  [AuditEventActionType.STOP_ALTER_SCHEDULE_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Termination',
  }), //终止
  [AuditEventActionType.EXECUTE_ALTER_SCHEDULE_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Execute',
  }), //执行
  [AuditEventActionType.APPROVE_ALTER_SCHEDULE_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Pass',
  }), //通过
  [AuditEventActionType.REJECT_ALTER_SCHEDULE_TASK]: formatMessage({
    id: 'odc.components.RecordPage.Reject',
  }), //拒绝

  // 数据管理事件操作
  [AuditEventActionType.ADD_DATABASE]: '增加数据库',
  [AuditEventActionType.TRANSFER_DATABASE_TO_PROJECT]: '转移项目',
  [AuditEventActionType.DELETE_DATABASE]: '删除数据库',

  // 权限申请任务事件操作
  [AuditEventActionType.CREATE_PERMISSION_APPLY_TASK]: '创建权限申请任务',
  [AuditEventActionType.APPROVE_PERMISSION_APPLY_TASK]: '同意权限申请任务',
  [AuditEventActionType.REJECT_PERMISSION_APPLY_TASK]: '拒绝权限申请任务',

  // 数据源管理事件操作
  [AuditEventActionType.CREATE_DATASOURCE]: '创建数据源',
  [AuditEventActionType.DELETE_DATASOURCE]: '删除数据源',
  [AuditEventActionType.UPDATE_DATASOURCE]: '更新数据源',

  // 项目管理事件操作
  [AuditEventActionType.CREATE_PROJECT]: '创建项目',
};

export function getEventFilterAndOptions(eventMeta: IAuditEvent[]) {
  const metas =
    eventMeta?.reduce((meta, { type, action }) => {
      if (meta[type]) {
        meta[type].push(action);
      } else {
        meta[type] = [action];
      }
      return meta;
    }, {}) ?? {};

  const filter = [];
  const options =
    Object.keys(metas)?.map((type) => {
      const children =
        metas[type]?.map((value) => {
          return {
            title: AuditEventActionMap[value],
            key: value,
            value,
          };
        }) ?? [];

      filter.push({
        text: AuditEventMetaMap[type],
        value: type,
      });

      return {
        title: AuditEventMetaMap[type],
        key: type,
        value: type,
        children: children,
      };
    }) ?? [];

  return {
    filter,
    options,
  };
}