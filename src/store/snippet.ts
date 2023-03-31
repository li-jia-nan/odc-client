import { formatMessage } from '@/util/intl';

/**
 * snippets
 */
import {
  createCustomerSnippet,
  deleteCustomerSnippet,
  queryCustomerSnippets,
  updateCustomerSnippet,
} from '@/common/network/snippet';
import { DbObjectType } from '@/d.ts';
import type { IEditorFactory } from '@alipay/ob-editor';
import {
  ISnippet as EditorSnippet,
  SnippetType as EditorSnippetType,
} from '@alipay/ob-language-sql-common';
import { action, observable } from 'mobx';
export interface ISnippet extends EditorSnippet {
  id?: number;
  type?: EditorSnippetType;
  userId?: number;
  objType?: DbObjectType;
} // 枚举不能继承，暂时这样处理

export const EnumSnippetType = { ...EditorSnippetType, ALL: 'ALL' };
export enum EnumSnippetAction {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}
export const SNIPPET_TYPES = [
  {
    name: formatMessage({ id: 'odc.src.store.snippet.AllTypes' }), //全部类型
    key: EnumSnippetType.ALL,
  },
  {
    name: formatMessage({ id: 'odc.src.store.snippet.Regular' }), //常规
    key: EnumSnippetType.NORMAL,
  },
  {
    name: 'DML',
    key: EnumSnippetType.DML,
  },
  {
    name: 'DDL',
    key: EnumSnippetType.DDL,
  },
  {
    name: formatMessage({ id: 'odc.src.store.snippet.ProcessControlStatement' }), //流程控制语句
    key: EnumSnippetType.FLOW,
  },
];
export const SNIPPET_ACTIONS = [
  {
    name: formatMessage({ id: 'odc.src.store.snippet.New' }), //新建
    key: EnumSnippetAction.CREATE,
  },
  {
    name: formatMessage({ id: 'odc.src.store.snippet.Editing' }), //编辑
    key: EnumSnippetAction.EDIT,
  },
  {
    name: formatMessage({ id: 'odc.src.store.snippet.Delete' }), //删除
    key: EnumSnippetAction.DELETE,
  },
];
export const SNIPPET_BODY_TAG = {
  BEGIN: '<com.oceanbase.odc.snippet>',
  END: '</com.oceanbase.odc.snippet>',
};
export class SnippetStore {
  @observable
  public snippetDragging: Partial<ISnippet>;
  public editorFactory: IEditorFactory;
  public language: string;
  @observable
  public snippets: ISnippet[] = [];

  public registerEditor(cfg: { factory: IEditorFactory; language: string }) {
    this.editorFactory = cfg.factory;
    this.language = cfg.language;
  }

  @action
  public async resetSnippets() {
    const { editorFactory, language } = this;

    if (!editorFactory || !language) {
      return;
    }

    const customerSnippets = await queryCustomerSnippets();
    editorFactory.resetSQLSnippet(customerSnippets, language);
    this.snippets = editorFactory
      .getSQLMode(language)
      .getSnippets()
      .filter((snippet) => !!snippet.snippetType);
  }

  @action
  public async createCustomerSnippet(snippet: ISnippet) {
    return await createCustomerSnippet(snippet);
  }

  @action
  public async updateCustomerSnippet(snippet: ISnippet) {
    return await updateCustomerSnippet(snippet);
  }

  @action
  public async deleteCustomerSnippet(snippet: ISnippet) {
    return await deleteCustomerSnippet(snippet);
  }
}
export default new SnippetStore();