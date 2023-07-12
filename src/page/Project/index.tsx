import PageContainer, { TitleType } from '@/component/PageContainer';
import { Button, Menu, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import Database from './Database';
import Setting from './Setting';
import Task from './Task';
import User from './User';

import { getProject, listProjects } from '@/common/network/project';
import { IProject, ProjectRole } from '@/d.ts/project';
import { IPageType } from '@/d.ts/_index';
import { gotoSQLWorkspace } from '@/util/route';
import { Link, useNavigate } from '@umijs/max';
import { useRequest } from 'ahooks';
import { isNumber } from 'lodash';
import ProjectContext from './ProjectContext';
import Sensitive from './Sensitive';

const menu = (
  <Menu>
    <Menu.Item>菜单项一</Menu.Item>
    <Menu.Item>菜单项二</Menu.Item>
  </Menu>
);

const ExtraContent = ({ projectId }) => {
  return (
    <Space size={12}>
      <Button onClick={() => gotoSQLWorkspace(projectId)} type="primary">
        登录数据库
      </Button>
      {/* <Dropdown.Button
        overlay={menu}
        buttonsRender={() => [null, <Button icon={<EllipsisOutlined />} />]}
      /> */}
    </Space>
  );
};

interface IProps {}

const Pages = {
  [IPageType.Project_Database]: {
    component: Database,
  },
  [IPageType.Project_Setting]: {
    component: Setting,
  },
  [IPageType.Project_Task]: {
    component: Task,
  },
  [IPageType.Project_User]: {
    component: User,
  },
  [IPageType.Sensitive]: {
    component: Sensitive,
  },
};

const tabs = [
  {
    tab: '数据库',
    key: IPageType.Project_Database,
  },
  {
    tab: '工单',
    key: IPageType.Project_Task,
  },
  {
    tab: '成员',
    key: IPageType.Project_User,
  },
  {
    tab: '敏感数据',
    key: IPageType.Sensitive,
  },
  {
    tab: '设置',
    key: IPageType.Project_Setting,
  },
];

const Index: React.FC<IProps> = function () {
  const params = useParams<{ id: string; page: IPageType }>();
  const navigate = useNavigate();
  const { id, page } = params;
  const Component = Pages[page].component;
  const projectId = parseInt(id);
  const handleChange = (key: string) => {
    history.push(`/project/${id}/${key}`);
  };

  const handleProjectChange = (value: string) => {
    history.push(`/project/${value}/${page}`);
  };

  const [project, setProject] = useState<IProject>(null);
  async function fetchProject(projectId: number) {
    const data = await getProject(projectId);
    if (data) {
      setProject(data);
    }
  }
  const reloadProject = useCallback(() => {
    fetchProject(projectId);
  }, [project]);

  useEffect(() => {
    if (isNumber(projectId)) {
      fetchProject(projectId);
    }
  }, [projectId]);
  useEffect(() => {
    if (page === IPageType.Sensitive) {
      // 当前项目中只有Developer身份的用户通过url访问Sensitive页面时，跳转到Project，避免用户通过url直接进入Sensitvie页面导致发起错误请求。
      if (
        !project?.currentUserResourceRoles?.some((role) =>
          [ProjectRole.DBA, ProjectRole.OWNER].includes(role),
        )
      ) {
        navigate('/project');
      }
    }
  }, [page]);
  const { data } = useRequest(listProjects, {
    defaultParams: [null, 1, 10],
  });

  const options = [
    {
      label: project?.name,
      value: projectId,
    },
  ].concat(
    data?.contents
      ?.map((p) => {
        if (p.id === projectId) {
          return null;
        }
        return {
          label: p.name,
          value: p.id,
        };
      })
      ?.filter(Boolean) || [],
  );

  return (
    <PageContainer
      titleProps={{
        type: TitleType.SELECT,
        defaultValue: projectId,
        options: options,
        onChange: handleProjectChange,
      }}
      containerWrapStyle={
        [IPageType.Sensitive].includes(page)
          ? {
              padding: '0px 12px',
            }
          : {}
      }
      // 当前项目中拥有DBA或OWNER身份的用户拥有完整的Tabs，否则隐藏“敏感数据”入口。
      tabList={
        project?.currentUserResourceRoles?.some((role) =>
          [ProjectRole.DBA, ProjectRole.OWNER].includes(role),
        )
          ? tabs
          : tabs?.filter((tab) => tab.key !== IPageType.Sensitive)
      }
      tabActiveKey={page}
      tabBarExtraContent={<ExtraContent projectId={projectId} />}
      onTabChange={handleChange}
      bigSelectBottom={<Link to={'/project'}>查看所有项目</Link>}
    >
      <ProjectContext.Provider value={{ project, projectId, reloadProject }}>
        <Component key={id} id={id} />
      </ProjectContext.Provider>
    </PageContainer>
  );
};

export default Index;
