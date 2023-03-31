import {
  AuditEventActionType,
  AuditEventResult,
  AuditEventType,
  ConnectionMode,
  IAudit,
  IAuditEvent,
  IAuditExport,
  IAutoAuthEvent,
  IAutoAuthRule,
  IConnectionType,
  IManagerPublicConnection,
  IManagerResourceGroup,
  IManagerResourceType,
  IManagerRole,
  IManagerUser,
  IManagerUserPermission,
  IManageUserListParams,
  IMaskRule,
  IRequestListParamsV2,
  IResponseData,
  IUserConfig,
  TaskPageType,
} from '@/d.ts';
import type { ITaskFlowConfig } from '@/page/Manage/interface';
import request from '@/util/request';
import { encrypt } from '@/util/utils';
interface IRoleForUpdate extends IManagerRole {
  bindUserIds: number[];
  unbindUserIds: number[];
}

/**
 * 新建用户
 */
export async function createUser(data: Partial<IManagerUser>[]): Promise<IManagerUser> {
  const result = await request.post('/api/v2/iam/users/batchCreate', {
    data: data?.map((item) => Object.assign({}, item, { password: encrypt(item.password) })),
  });
  return result?.data;
}

/**
 * 删除用户详情
 */
export async function deleteUser(id: number): Promise<IManagerUser> {
  const result = await request.delete(`/api/v2/iam/users/${id}`);
  return result?.data;
}

/**
 * 更新用户
 */
export async function updateUser(data: Partial<IManagerUser>): Promise<IManagerUser> {
  const result = await request.put(`/api/v2/iam/users/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 设置用户状态
 */
export async function setUserEnable(data: { id: number; enabled: boolean }): Promise<IManagerUser> {
  const result = await request.post(`/api/v2/iam/users/${data.id}/setEnabled`, {
    data: {
      enabled: data.enabled,
    },
  });
  return result?.data;
}

/**
 * 获取用户详情
 */
export async function getUserDetail(id: number): Promise<IManagerUser> {
  const result = await request.get(`/api/v2/iam/users/${id}`);
  return result?.data;
}

/**
 * 获取用户列表
 */
export async function getUserList(
  params?: IManageUserListParams,
): Promise<IResponseData<IManagerUser>> {
  const result = await request.get('/api/v2/iam/users', {
    params: {
      ...params,
      minPrivilege: params?.minPrivilege ?? 'update',
    },
  });
  return result?.data;
}

/**
 * 获取公共连接直接关联的用户和权限列表
 */
export async function getUserPermissionsList(params?: {
  resourceIdentifier: string;
}): Promise<IManagerUserPermission[]> {
  const result = await request.get('/api/v2/iam/userPermissions', {
    params,
  });
  return result?.data;
}

/**
 * 批量更新用户权限
 */
export async function batchUpdateUserPermissions(
  data: Partial<{
    resourceIdentifier: string;
    userActions: {
      userId: number;
      action: string;
    }[];
  }>,
): Promise<IManagerUserPermission[]> {
  const result = await request.post('/api/v2/iam/userPermissions/batchUpdateForConnection', {
    data,
  });
  return result?.data;
}

/**
 * 重置密码
 */
export async function resetPassword(data: {
  id: number;
  newPassword: string;
}): Promise<IManagerUser> {
  if (data) {
    data = Object.assign({}, data, { newPassword: encrypt(data.newPassword) });
  }
  const result = await request.post(`/api/v2/iam/users/resetPassword?id=${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 账号重名验证
 */
export async function getAccountExist(name: string): Promise<boolean> {
  const res = await request.get(`/api/v1/manage/user/exist`, {
    params: {
      name,
    },
  });
  return res?.data;
}

/**
 * 新建角色
 */
export async function createRole(data: Partial<IManagerRole>): Promise<IManagerRole> {
  const result = await request.post('/api/v2/iam/roles', {
    data,
  });
  return result?.data;
}

/**
 * 角色名称查重
 */
export async function getRoleExists(name: string): Promise<boolean> {
  const result = await request.get(`/api/v2/iam/roles/exists`, {
    params: {
      name,
    },
  });
  return result?.data;
}

/**
 * 删除角色
 */
export async function deleteRole(id: number): Promise<IManagerRole> {
  const result = await request.delete(`/api/v2/iam/roles/${id}`);
  return result?.data;
}

/**
 * 更新角色
 */
export async function updateRole(data: Partial<IRoleForUpdate>): Promise<IManagerRole> {
  const result = await request.put(`/api/v2/iam/roles/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 设置角色状态
 */
export async function setRoleEnable(data: { id: number; enabled: boolean }): Promise<IManagerRole> {
  const result = await request.post(`/api/v2/iam/roles/${data.id}/setEnabled`, {
    data: {
      enabled: data.enabled,
    },
  });
  return result?.data;
}

/**
 * 获取角色详情
 */
export async function getRoleDetail(roleId: number): Promise<IManagerRole> {
  const result = await request.get(`/api/v2/iam/roles/${roleId}`);
  return result?.data;
}

/**
 * 获取角色列表
 */
export async function getRoleList(
  params?: IRequestListParamsV2,
): Promise<IResponseData<IManagerRole>> {
  const result = await request.get('/api/v2/iam/roles', {
    params: {
      ...params,
      minPrivilege: params?.minPrivilege ?? 'update',
    },
  });
  return result?.data;
}

/**
 * 新建公共连接
 */
export async function createPublicConnection(
  data: Partial<IManagerPublicConnection>,
): Promise<IManagerPublicConnection> {
  const result = await request.post('/api/v2/connect/connections', {
    data: {
      ...data,
      visibleScope: IConnectionType.ORGANIZATION,
    },
  });
  return result?.data;
}

/**
 * 公共连接有效性检测
 */
export async function checkPublicConnection(data: Partial<IManagerPublicConnection>): Promise<{
  allCheckPass: boolean;
  messages: {
    accountName: string;
    accountType: string;
    message: string;
  }[];
}> {
  const result = await request.post('/api/v2/connect/verify', {
    data: {
      ...data,
      visibleScope: IConnectionType.ORGANIZATION,
    },
  });
  return result?.data;
}

/**
 * 删除公共连接
 */
export async function deletePublicConnection(id: number): Promise<IManagerPublicConnection> {
  const result = await request.delete(`/api/v2/connect/connections/${id}`);
  return result?.data;
}

/**
 * 更新公共连接
 */
export async function updatePublicConnection(
  data: Partial<IManagerPublicConnection>,
): Promise<IManagerPublicConnection> {
  const result = await request.put(`/api/v2/connect/connections/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 设置公共连接状态
 */
export async function setPublicConnectionEnable(data: {
  id: number;
  enabled: boolean;
}): Promise<IManagerPublicConnection> {
  const result = await request.post(`/api/v2/connect/connections/${data.id}/setEnabled`, {
    data,
  });
  return result?.data;
}

/**
 * 获取公共连接详情
 */
export async function getPublicConnectionDetail(
  connectionId: number,
): Promise<IManagerPublicConnection> {
  const result = await request.get(`/api/v2/connect/connections/${connectionId}`);
  return result?.data;
}

/**
 * 获取公共连接列表
 */
export async function getPublicConnectionList(params?: {
  name?: string;
  enabled?: boolean[];
  resourceGroupId?: number[];
  dialectType?: ConnectionMode[];
  sort?: string;
  page?: number;
  size?: number;
  userId?: number;
  minPrivilege?: string;
}): Promise<IResponseData<IManagerPublicConnection>> {
  const result = await request.get('/api/v2/connect/connections', {
    params: {
      ...params,
      visibleScope: IConnectionType.ORGANIZATION,
      minPrivilege: params?.minPrivilege ?? 'update',
    },
  });
  return result?.data;
}

/**
 * 批量导入公共连接
 */
export async function batchImportPublicConnection(
  data: IManagerPublicConnection[],
): Promise<IManagerPublicConnection[]> {
  const result = await request.post('/api/v2/connect/connections/batchCreate', {
    data,
  });
  return result?.data;
}

/**
 * 批量导入用户
 */
export async function batchImportUser(data: IManagerUser[]): Promise<IManagerUser[]> {
  const result = await request.post('/api/v2/iam/users/batchImport', {
    data,
  });
  return result?.data;
}

/**
 * 新建资源组
 */
export async function createResourceGroup(
  data: Partial<IManagerResourceGroup>,
): Promise<IManagerResourceGroup> {
  const result = await request.post('/api/v2/resource/resourcegroups/', {
    data,
  });
  return result?.data;
}

/**
 * 删除资源组
 */
export async function deleteResourceGroup(id: number): Promise<IManagerResourceGroup> {
  const result = await request.delete(`/api/v2/resource/resourcegroups/${id}`);
  return result?.data;
}

/**
 * 更新资源组
 */
export async function updateResourceGroup(
  data: Partial<IManagerResourceGroup>,
): Promise<IManagerResourceGroup> {
  const result = await request.put(`/api/v2/resource/resourcegroups/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 设置资源组状态
 */
export async function setPublicResourceGroup(data: {
  id: number;
  enabled: boolean;
}): Promise<IManagerResourceGroup> {
  const result = await request.post(`/api/v2/resource/resourcegroups/${data.id}/setEnabled`, {
    data,
  });
  return result?.data;
}

/**
 * 获取资源组详情
 */
export async function getResourceGroupDetail(connectionId: number): Promise<IManagerResourceGroup> {
  const result = await request.get(`/api/v2/resource/resourcegroups/${connectionId}`);
  return result?.data;
}

/**
 * 获取资源组列表
 */
export async function getResourceGroupList(params?: {
  nameLike?: string;
  status?: boolean[];
  sort?: string;
  page?: number;
  size?: number;
  minPrivilege?: string;
}): Promise<IResponseData<IManagerResourceGroup>> {
  const result = await request.get('/api/v2/resource/resourcegroups/', {
    params: {
      ...params,
      minPrivilege: params?.minPrivilege ?? 'update',
    },
  });
  return result?.data;
}

/**
 * 获取资源组名称是否重复
 */
export async function getResourceGroupExists(name: string): Promise<boolean> {
  const result = await request.get(`/api/v2/resource/resourcegroups/exists`, {
    params: {
      name,
    },
  });
  return result?.data;
}

/**
 * 获取用户权限详情
 */
export async function getCurrentUserPermissions(): Promise<any> {
  const result = await request.get(`/api/v2/iam/users/me`);
  return result?.data;
}
/**
 * 获取系统配置
 */
export async function getSystemConfig(): Promise<IUserConfig> {
  const result = await request.get('/api/v2/config/organization/configurations');
  const res = result?.data?.contents ?? [];
  return res.reduce((data, item) => {
    data[item.key] = item.value;
    return data;
  }, {});
}

/**
 * 提交系统配置
 */
export async function setSystemConfig(
  data: Record<string, string>[],
): Promise<Record<string, string>[]> {
  const result = await request.post('/api/v2/config/organization/configurations', {
    data,
  });
  return result?.data;
}

/**
 * 新建任务流程
 */
export async function createTaskFlow(data: Partial<ITaskFlowConfig>): Promise<ITaskFlowConfig> {
  const result = await request.post('/api/v2/flow/flowConfigs/', {
    data,
  });
  return result?.data;
}

/**
 * 删除任务流程
 */
export async function deleteTaskFlow(id: number): Promise<ITaskFlowConfig> {
  const result = await request.delete(`/api/v2/flow/flowConfigs/${id}`);
  return result?.data;
}

/**
 * 更新任务流程
 */
export async function updateTaskFlow(data: Partial<ITaskFlowConfig>): Promise<ITaskFlowConfig> {
  const result = await request.put(`/api/v2/flow/flowConfigs/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 设置任务流程状态
 */
export async function setTaskFlowEnable(data: {
  id: number;
  enabled: boolean;
}): Promise<ITaskFlowConfig> {
  const result = await request.post(`/api/v2/flow/flowConfigs/${data.id}/setEnabled`, {
    data: {
      enabled: data.enabled,
    },
  });
  return result?.data;
}

/**
 * 获取任务流程详情
 */
export async function getTaskFlowDetail(id: number): Promise<ITaskFlowConfig> {
  const result = await request.get(`/api/v2/flow/flowConfigs/${id}`);
  return result?.data;
}

/**
 * 获取任务流程列表
 */
export async function getTaskFlowList(
  params?: Partial<{
    name: string;
    taskType: TaskPageType;
    creatorName: number;
    enabled: boolean;
    sort: string;
    resourceId: number;
    resourceType: IManagerResourceType;
    page: number;
    size: number;
  }>,
): Promise<IResponseData<ITaskFlowConfig>> {
  const result = await request.get('/api/v2/flow/flowConfigs/', {
    params,
  });
  return result?.data;
}

/**
 * 任务流程名称 重名验证
 */
export async function getTaskFlowExists(name: string): Promise<boolean> {
  const result = await request.post('/api/v2/flow/flowConfigs/exists', {
    data: {
      name,
    },
  });
  return result?.data;
}

/**
 * 任务流程名称 批量删除
 */
export async function batchDeleteTaskFlow(ids: number[]): Promise<boolean> {
  const result = await request.post('/api/v2/flow/flowConfigs/batchDelete', {
    data: ids,
  });
  return result?.data;
}

/**
 * 任务流程 优先级设置
 */
export async function updatePriority(
  data: Record<TaskPageType, ITaskFlowConfig[]>,
): Promise<IResponseData<ITaskFlowConfig>> {
  const result = await request.put('/api/v2/flow/flowConfigs/setPriority', {
    data,
  });
  return result?.data;
}

/**
 * 获取操作记录列表
 */
export async function getAuditList(params?: {
  type?: AuditEventType;
  action?: AuditEventActionType;
  fuzzyClientIPAddress?: string;
  fuzzyConnectionName?: string;
  fuzzyUsername?: string;
  result?: AuditEventResult;
  userId?: string;
  startTime?: number;
  endTime?: number;
  sort?: string;
  page?: number;
  size?: number;
}): Promise<IResponseData<IAudit>> {
  const result = await request.get('/api/v2/audit/events', {
    params,
  });
  return result?.data;
}

/**
 * 获取操作记录详情
 */
export async function getAuditDetail(id: number): Promise<IAudit> {
  const result = await request.get(`/api/v2/audit/events/${id}`);
  return result?.data;
}

/**
 * 获取操作记录事件类型
 */
export async function getAuditEventMeta(): Promise<IAuditEvent[]> {
  const result = await request.get('/api/v2/audit/eventMeta');
  return result?.data?.contents;
}

/**
 * 导出操作记录
 */
export async function exportAudit(data: Partial<IAuditExport>): Promise<string> {
  const result = await request.post('/api/v2/audit/events/export', {
    data,
  });
  return result?.data;
}

/**
 * 获取用户选项列表
 */
export async function getUserOptionList(): Promise<IResponseData<IManagerUser>> {
  const result = await request.get('/api/v2/audit/events/users');
  return result?.data;
}

/**
 * 获取连接选项列表
 */
export async function getConnectionOptionList(): Promise<IResponseData<IManagerPublicConnection>> {
  const result = await request.get('/api/v2/audit/events/connections');
  return result?.data;
}

/**
 * 新建脱敏规则
 */
export async function createMaskRule(data: Partial<IMaskRule>): Promise<IMaskRule> {
  const result = await request.post('/api/v2/mask/rules', {
    data,
  });
  return result?.data;
}

/**
 * 删除脱敏规则
 */
export async function deleteMaskRule(id: number): Promise<IMaskRule> {
  const result = await request.delete(`/api/v2/mask/rules/${id}`);
  return result?.data;
}

/**
 * 更新脱敏规则
 */
export async function updateMaskRule(data: Partial<IMaskRule>): Promise<IMaskRule> {
  const result = await request.put(`/api/v2/mask/rules/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 设置脱敏规则状态
 */
export async function setMaskRuleEnable(data: {
  id: number;
  enabled: boolean;
}): Promise<IMaskRule> {
  const result = await request.post(`/api/v2/mask/rules/${data.id}/setEnabled`, {
    data,
  });
  return result?.data;
}

/**
 * 获取脱敏规则详情
 */
export async function getMaskRule(connectionId: number): Promise<IMaskRule> {
  const result = await request.get(`/api/v2/mask/rules/${connectionId}`);
  return result?.data;
}

/**
 * 获取脱敏规则列表
 */
export async function getMaskRuleList(params?: {
  name?: string;
  enabled?: boolean[];
  sort?: string;
  page?: number;
  size?: number;
}): Promise<IResponseData<IMaskRule>> {
  const result = await request.get('/api/v2/mask/rules', {
    params,
  });
  return result?.data;
}

/**
 * 获取脱敏规则名称是否重复
 */
export async function getMaskRuleExists(name: string): Promise<boolean> {
  const result = await request.post(`/api/v2/mask/rules/exists`, {
    data: {
      name,
    },
  });
  return result?.data;
}

/**
 * 测试脱敏规则
 */
export async function testMaskRule(data: Partial<IMaskRule>): Promise<string> {
  const result = await request.post('/api/v2/mask/rules/test', {
    data,
  });
  return result?.data;
}

/**
 * 获取自动授权规则列表
 */
export async function getAutoRuleList(params?: {
  name?: string;
  enabled?: boolean[];
  sort?: string;
  page?: number;
  size?: number;
}): Promise<IResponseData<IAutoAuthRule>> {
  const result = await request.get('/api/v2/management/auto/rules', {
    params,
  });
  return result?.data;
}

/**
 * 设置自动授权规则状态
 */
export async function setAutoRuleEnable(data: {
  id: number;
  enabled: boolean;
}): Promise<IAutoAuthRule> {
  const result = await request.post(`/api/v2/management/auto/rules/${data.id}/setEnabled`, {
    data,
  });
  return result?.data;
}

/**
 * 删除自动授权规则
 */
export async function deleteAutoRule(id: number): Promise<IAutoAuthRule> {
  const result = await request.delete(`/api/v2/management/auto/rules/${id}`);
  return result?.data;
}

/**
 * 获取自动授权规则详情
 */
export async function getAutoRule(id: number): Promise<IAutoAuthRule> {
  const result = await request.get(`/api/v2/management/auto/rules/${id}`);
  return result?.data;
}

/**
 * 获取自动授权规则事件列表
 */
export async function getAutoRuleEventList(): Promise<IAutoAuthEvent[]> {
  const result = await request.get('/api/v2/management/auto/eventMetadata');
  return result?.data?.contents;
}

/**
 * 新建自动授权规则
 */
export async function createAutoRule(data: Partial<IAutoAuthRule>): Promise<IAutoAuthRule> {
  const result = await request.post('/api/v2/management/auto/rules', {
    data,
  });
  return result?.data;
}

/**
 * 更新自动授权规则
 */
export async function updateAutoRule(data: Partial<IAutoAuthRule>): Promise<IAutoAuthRule> {
  const result = await request.put(`/api/v2/management/auto/rules/${data.id}`, {
    data,
  });
  return result?.data;
}

/**
 * 自动授权规则名称是否重复
 */
export async function geteAutoRuleExists(name: string): Promise<boolean> {
  const result = await request.get(`/api/v2/management/auto/rules/exists`, {
    params: {
      name,
    },
  });
  return result?.data;
}