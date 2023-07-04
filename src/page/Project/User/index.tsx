import { deleteProjectMember } from '@/common/network/project';
import Action from '@/component/Action';
import FilterIcon from '@/component/Button/FIlterIcon';
import Reload from '@/component/Button/Reload';
import MiniTable from '@/component/Table/MiniTable';
import TableCard from '@/component/Table/TableCard';
import { IProject, ProjectRole } from '@/d.ts/project';
import { Button, message, Popconfirm } from 'antd';
import React, { useContext, useMemo, useState } from 'react';
import ProjectContext from '../ProjectContext';
import AddUserModal from './AddUserModal';
import UpdateUserModal from './UpdateUserModal';
interface IProps {
  id: string;
}
const User: React.FC<IProps> = ({ id }) => {
  const context = useContext(ProjectContext);

  const [addUserModalVisiable, setAddUserModalVisiable] = useState(false);

  const [editUserId, setEditUserId] = useState<number>(null);

  const dataSource: (IProject['members'][0] & { roles: ProjectRole[] })[] = useMemo(() => {
    const userMap = new Map<number, IProject['members'][0] & { roles: ProjectRole[] }>();
    context?.project?.members?.forEach((mem) => {
      const { id, role } = mem;
      if (userMap.has(id)) {
        userMap.get(id).roles.push(role);
      } else {
        userMap.set(id, {
          ...mem,
          roles: [role],
        });
      }
    });
    return [...userMap.values()];
  }, [context?.project?.members]);

  async function deleteUser(id: number) {
    const isSuccess = await deleteProjectMember({
      projectId: context?.project?.id,
      userId: id,
    });
    if (isSuccess) {
      message.success('删除成功');
      context.reloadProject();
    }
  }

  async function updateUser(id: number) {
    setEditUserId(id);
  }

  return (
    <TableCard
      title={
        <Button type="primary" onClick={() => setAddUserModalVisiable(true)}>
          添加成员
        </Button>
      }
      extra={
        <FilterIcon onClick={context.reloadProject}>
          <Reload />
        </FilterIcon>
      }
    >
      <MiniTable<IProject['members'][0]>
        rowKey={'id'}
        columns={[
          {
            title: '用户名称',
            dataIndex: 'name',
          },
          {
            title: '账号',
            dataIndex: 'accountName',
            width: 370,
          },
          {
            title: '项目角色',
            dataIndex: 'roles',
            width: 370,
            render(v) {
              return v?.join(' | ');
            },
          },
          {
            title: '操作',
            dataIndex: 'name',
            width: 135,
            render(_, record) {
              return (
                <Action.Group size={3}>
                  <Action.Link onClick={() => updateUser(record.id)} key={'export'}>
                    编辑
                  </Action.Link>
                  <Popconfirm title="确定删除该成员吗？" onConfirm={() => deleteUser(record.id)}>
                    <Action.Link key={'import'}>移除</Action.Link>
                  </Popconfirm>
                </Action.Group>
              );
            },
          },
        ]}
        dataSource={dataSource}
        pagination={{
          total: dataSource?.length,
        }}
        loadData={(page) => {}}
      />
      <AddUserModal
        visible={addUserModalVisiable}
        close={() => setAddUserModalVisiable(false)}
        onSuccess={() => {
          context.reloadProject();
        }}
        project={context.project}
      />
      <UpdateUserModal
        visible={!!editUserId}
        userId={editUserId}
        close={() => {
          setEditUserId(null);
        }}
        onSuccess={() => {
          context.reloadProject();
        }}
        projectId={context.project?.id}
        roles={
          context.project?.members?.filter((m) => m.id === editUserId)?.map((m) => m.role) || []
        }
      />
    </TableCard>
  );
};

export default User;