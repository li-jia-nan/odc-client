import {
  deleteSensitiveRule,
  listSensitiveRules,
  setEnabled,
} from '@/common/network/sensitiveRule';
import { CommonTableMode, IOperationOptionType } from '@/component/CommonTable/interface';
import StatusSwitch from '@/component/StatusSwitch';
import TooltipContent from '@/component/TooltipContent';
import { ISensitiveRule, SensitiveRuleType } from '@/d.ts/sensitiveRule';
import SecureTable from '@/page/Secure/components/SecureTable';
import {
  CommonTableBodyMode,
  ITableInstance,
  ITableLoadOptions,
} from '@/page/Secure/components/SecureTable/interface';
import { message, Modal, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useRef, useState } from 'react';
import { DetectRuleTypeMap, FilterItemProps } from '../../interface';
import SensitiveContext from '../../SensitiveContext';
import FormDrawer from './components/FormSensitiveRuleDrawer';
import ViewDrawer from './components/ViewSensitiveRuleDrawer';

const getColumns: (columnsFunction: {
  handleViewDrawerOpen;
  hanldeEditDrawerOpen;
  handleDelete;
  maskingAlgorithmFilters;
  handleStatusSwitch;
  maskingAlgorithmIdMap;
}) => ColumnsType<ISensitiveRule> = ({
  handleViewDrawerOpen,
  hanldeEditDrawerOpen,
  handleDelete,
  maskingAlgorithmFilters,
  handleStatusSwitch,
  maskingAlgorithmIdMap,
}) => {
  return [
    {
      title: '规则名称',
      width: 170,
      dataIndex: 'name',
      key: 'name',
      onCell: () => {
        return {
          style: {
            maxWidth: '170px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        };
      },
      render: (text) => <TooltipContent content={text} />,
    },
    // {
    //   title: '规则描述',
    //   width: 170,
    //   dataIndex: 'description',
    //   key: 'description',
    //   render: (text) => text || '-',
    // },
    {
      title: '识别方式',
      width: 170,
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: '路径',
          value: SensitiveRuleType.PATH,
        },
        {
          text: '正则',
          value: SensitiveRuleType.REGEX,
        },
        {
          text: '脚本',
          value: SensitiveRuleType.GROOVY,
        },
      ],
      onCell: () => {
        return {
          style: {
            maxWidth: '170px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        };
      },
      render: (text, record) => <TooltipContent content={DetectRuleTypeMap[record.type] || '-'} />,
    },
    {
      title: '脱敏算法',
      width: 156,
      dataIndex: 'maskingAlgorithmId',
      key: 'maskingAlgorithmId',
      filters: maskingAlgorithmFilters,
      onCell: () => {
        return {
          style: {
            maxWidth: '156px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
        };
      },
      render: (text, record) => (
        <TooltipContent content={maskingAlgorithmIdMap[record?.maskingAlgorithmId] || '-'} />
      ),
    },
    // {
    //   title: '规则详情',
    //   width: 184,
    //   dataIndex: 'columnCommentRegexExpression',
    //   key: 'columnCommentRegexExpression',
    //   render: (text) => text || '-',
    // },
    {
      title: '启用状态',
      width: 80,
      dataIndex: 'enabled',
      key: 'enabled',
      filters: [
        {
          text: '启用',
          value: true,
        },
        {
          text: '禁用',
          value: false,
        },
      ],
      render: (_, { id, enabled }, index) => (
        <StatusSwitch
          checked={enabled}
          onConfirm={() => handleStatusSwitch(id, !enabled)}
          onCancel={() => handleStatusSwitch(id, !enabled)}
        />
      ),
    },
    {
      title: '操作',
      width: 154,
      key: 'action',
      render: (_, record, index) => (
        <>
          <Space>
            <a onClick={() => handleViewDrawerOpen(record)}>查看</a>
            <a onClick={() => hanldeEditDrawerOpen(record)}>编辑</a>
            <a onClick={() => handleDelete(record)}>删除</a>
          </Space>
        </>
      ),
    },
  ];
};

const SensitiveRule = ({ projectId }) => {
  const tableRef = useRef<ITableInstance>();
  const { maskingAlgorithmIdMap, maskingAlgorithms } = useContext(SensitiveContext);
  const [selectedRecord, setSelectedRecord] = useState<ISensitiveRule>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formDrawerVisible, setFormDrawerVisible] = useState<boolean>(false);
  const [viewDrawerVisible, setViewDrawerVisible] = useState<boolean>(false);
  const [sensitiveRules, setSensitiveRules] = useState<ISensitiveRule[]>();
  const [maskingAlgorithmFilters, setMaskingAlgorithmFilters] = useState<FilterItemProps[]>();

  const initSensitiveRule = () => {
    setMaskingAlgorithmFilters(
      maskingAlgorithms.map((d) => ({
        text: d.name,
        value: d.id,
      })),
    );
  };
  const handleViewDrawerOpen = (record: any) => {
    setIsEdit(false);
    setSelectedRecord(record);
    setViewDrawerVisible(true);
  };

  const hanldeEditDrawerOpen = (record: any) => {
    setIsEdit(true);
    setSelectedRecord(record);
    setFormDrawerVisible(true);
  };

  const handleCreateClick = () => {
    setIsEdit(false);
    setFormDrawerVisible(true);
  };

  const initData = async (args?: ITableLoadOptions) => {
    const { searchValue, filters, sorter, pagination, pageSize } = args ?? {};
    const { enabled, type, maskingAlgorithmId } = filters ?? {};
    const { column, order } = sorter ?? {};
    const { current = 1 } = pagination ?? {};
    const wrapArgs = (args) => {
      if (Array.isArray(args)) {
        return args;
      }
      return [args];
    };
    const data = {
      name: searchValue,
      enabled: wrapArgs(enabled),
      type: type,
      maskingAlgorithm: wrapArgs(maskingAlgorithmId),
      sort: column?.dataIndex,
      page: current,
      size: pageSize,
    };
    data.enabled = enabled?.length ? enabled : undefined;
    data.sort = column ? `${column.dataIndex},${order === 'ascend' ? 'asc' : 'desc'}` : undefined;
    const rawData = await listSensitiveRules(projectId, data);
    setSensitiveRules(rawData);
  };

  const handleFormDrawerClose = (fn?: () => void) => {
    setFormDrawerVisible(false);
    fn?.();
    tableRef.current?.reload?.();
  };

  const handleViewDrawerClose = () => {
    setViewDrawerVisible(false);
  };

  const handleDelete = async (record: any) => {
    return Modal.confirm({
      title: '确认要删除敏感列吗？',
      onOk: async () => {
        const result = await deleteSensitiveRule(projectId, record?.id);
        if (result) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
        tableRef.current?.reload();
      },
      onCancel: () => {},
      okText: '确定',
      cancelText: '取消',
    });
  };

  const handleStatusSwitch = async (id: number, enabled: boolean) => {
    const result = await setEnabled(projectId, id, enabled);
    if (result) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
    tableRef.current?.reload?.();
  };

  const columns = getColumns({
    handleViewDrawerOpen,
    hanldeEditDrawerOpen,
    handleDelete,
    maskingAlgorithmIdMap,
    maskingAlgorithmFilters,
    handleStatusSwitch,
  });

  const operationOptions = [];
  operationOptions.push({
    type: IOperationOptionType.button,
    content: '新建识别规则',
    //新建流程
    isPrimary: true,
    onClick: handleCreateClick,
  });

  useEffect(() => {
    initSensitiveRule();
  }, [maskingAlgorithms]);

  return (
    <>
      <SecureTable
        ref={tableRef}
        mode={CommonTableMode.SMALL}
        body={CommonTableBodyMode.BIG}
        titleContent={null}
        showToolbar={true}
        showPagination={false}
        filterContent={{
          searchPlaceholder: '请输入规则名称',
        }}
        operationContent={{
          options: operationOptions,
        }}
        onLoad={initData}
        onChange={initData}
        tableProps={{
          columns: columns,
          dataSource: sensitiveRules,
          rowKey: 'id',
          pagination: false,
        }}
      />
      <FormDrawer
        {...{
          isEdit,
          selectedRecord,
          formDrawerVisible,
          handleFormDrawerClose,
        }}
      />
      <ViewDrawer
        {...{
          projectId: projectId,
          sensitiveRuleId: selectedRecord?.id,
          maskingAlgorithmIdMap,
          viewDrawerVisible,
          handleViewDrawerClose,
          selectedRecord,
        }}
      />
    </>
  );
};

export default SensitiveRule;