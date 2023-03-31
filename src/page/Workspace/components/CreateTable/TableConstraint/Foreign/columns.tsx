import { IDatabase, ITable, ITableColumn } from '@/d.ts';
import {
  TableForeignConstraintOnDeleteType,
  TableForeignConstraintOnUpdateType,
} from '@/d.ts/table';
import schemaStore from '@/store/schema';
import { formatMessage } from '@/util/intl';
import { Column } from '@alipay/ob-react-data-grid';
import { useRequest } from 'ahooks';
import { uniq } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { SelectEditor, WrapSelectEditor } from '../../../EditableTable/Editors/SelectEditor';
import { TextEditor } from '../../../EditableTable/Editors/TextEditor';
import { TableColumn, TableForeignConstraint } from '../../interface';
import { useDeferColumn, useEnableColumn } from '../baseColumn';

function TableSelect(props) {
  const { row } = props;
  const schemaname = row['schemaname'];
  const [tableList, setTableList] = useState<ITable[]>([]);
  const { loading, run: _fetchTable } = useRequest(schemaStore?.getTableListByDatabaseName, {
    manual: true,
  });

  const fetchTable = async () => {
    const list = await _fetchTable(schemaname);
    setTableList(list);
  };
  useEffect(() => {
    if (schemaname) {
      fetchTable();
    } else {
      setTableList([]);
    }
  }, [schemaname]);
  return (
    <SelectEditor
      loading={loading}
      multiple={false}
      options={tableList?.map((t) => t.tableName)}
      {...props}
    />
  );
}

function ColumnSelect(props) {
  const { row } = props;
  const tableName = row['tableName'];
  const [columnList, setColumnList] = useState<ITableColumn[]>([]);
  const { loading, run: _fetchTable } = useRequest(schemaStore?.getTableColumnList, {
    manual: true,
  });

  const fetchColumns = async () => {
    const list = await _fetchTable(tableName, false, row['schemaname']);
    setColumnList(list);
  };
  useEffect(() => {
    if (tableName) {
      fetchColumns();
    } else {
      setColumnList([]);
    }
  }, [tableName]);
  return (
    <SelectEditor
      loading={loading}
      multiple={false}
      options={columnList?.map((t) => t.columnName)}
      {...props}
    />
  );
}

export function useColumns(
  columns: TableColumn[],
  databases: IDatabase[],
): Column<TableForeignConstraint, TableForeignConstraint>[] {
  const enableColumn = useEnableColumn();
  const deferColumn = useDeferColumn();
  const validColumns = useMemo(() => {
    return uniq(columns?.filter((column) => !!column.name?.trim()).map((column) => column.name));
  }, [columns]);
  const ColumnsMultipleSelect = useMemo(() => {
    return WrapSelectEditor(validColumns);
  }, [columns]);
  const schemaSelect = useMemo(() => {
    return WrapSelectEditor(
      databases.map((d) => d.name),
      false,
    );
  }, []);

  const onDeleteSelect = useMemo(() => {
    return WrapSelectEditor(
      [
        TableForeignConstraintOnDeleteType.CASCADE,
        TableForeignConstraintOnDeleteType.NO_ACTION,
        TableForeignConstraintOnDeleteType.RESTRICT,
        TableForeignConstraintOnDeleteType.SET_NULL,
      ],

      false,
    );
  }, []);
  const onUpdateSelect = useMemo(() => {
    return WrapSelectEditor(
      [
        TableForeignConstraintOnUpdateType.CASCADE,
        TableForeignConstraintOnUpdateType.NO_ACTION,
        TableForeignConstraintOnUpdateType.RESTRICT,
        TableForeignConstraintOnUpdateType.SET_NULL,
      ],

      false,
    );
  }, []);
  return [
    {
      key: 'name',
      name: formatMessage({
        id: 'odc.CreateTable.Columns.columns.Name',
      }),
      //名称
      resizable: true,
      editable: true,
      editor: TextEditor,
      width: 120,
    },

    {
      key: 'columns',
      name: formatMessage({ id: 'odc.TableConstraint.Foreign.columns.Column' }), //列
      resizable: true,
      minWidth: 150,
      filterable: false,
      editable: true,
      editor: ColumnsMultipleSelect,
      formatter: ({ row }) => {
        return <span>{row.columns?.join?.(',')}</span>;
      },
    },

    {
      key: 'schemaname',
      name: formatMessage({
        id: 'odc.TableConstraint.Foreign.columns.AssociatedSchema',
      }),
      //关联 Schema
      resizable: true,
      editable: true,
      editor: schemaSelect,
      width: 150,
    },

    {
      key: 'tableName',
      name: formatMessage({
        id: 'odc.TableConstraint.Foreign.columns.AssociatedTable',
      }),
      //关联表
      resizable: true,
      editable: true,
      editor: TableSelect,
      width: 150,
    },

    {
      key: 'parentColumns',
      name: formatMessage({
        id: 'odc.TableConstraint.Foreign.columns.AssociatedColumn',
      }), //关联列
      resizable: true,
      editable: true,
      editor: ColumnSelect,
      width: 150,
    },

    {
      key: 'onDelete',
      name: formatMessage({ id: 'odc.TableConstraint.Foreign.columns.Delete' }), //删除
      resizable: true,
      editable: true,
      editor: onDeleteSelect,
      width: 120,
    },

    {
      key: 'onUpdate',
      name: formatMessage({ id: 'odc.TableConstraint.Foreign.columns.Update' }), //更新
      resizable: true,
      editable: true,
      editor: onUpdateSelect,
      width: 120,
    },

    enableColumn,
    deferColumn,
  ].filter(Boolean);
}