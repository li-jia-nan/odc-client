import { getFunctionByFuncName, getProcedureByProName } from '@/common/network';
import {
  generateDatabaseSid,
  generatePackageSid,
  generateViewSid,
} from '@/common/network/pathUtil';
import { getSynonymList } from '@/common/network/synonym';
import { getTableInfo } from '@/common/network/table';
import { getType, getTypeList } from '@/common/network/type';
import {
  IFunction,
  IPackage,
  IProcedure,
  ISequence,
  ISynonym,
  ITable,
  ITrigger,
  IType,
  IView,
  SynonymType,
} from '@/d.ts';
import { ITableModel } from '@/page/Workspace/components/CreateTable/interface';
import { formatMessage } from '@/util/intl';
import request from '@/util/request';
import { action, observable, runInAction } from 'mobx';

class DatabaseStore {
  @observable.shallow
  public tables: Array<Partial<ITableModel>> = [];

  @observable.shallow
  public views: Array<Partial<IView>> = [];

  @observable.shallow
  public functions: Array<Partial<IFunction>> = [];

  @observable.shallow
  public procedures: Array<Partial<IProcedure>> = [];

  @observable.shallow
  public sequences: Array<Partial<ISequence>> = [];

  @observable.shallow
  public packages: Array<Partial<IPackage>> = [];

  @observable.shallow
  public triggers: Array<Partial<ITrigger>> = [];

  @observable.shallow
  public synonyms: Array<Partial<ISynonym>> = [];

  @observable.shallow
  public publicSynonyms: Array<Partial<ISynonym>> = [];

  @observable.shallow
  public types: Array<Partial<IType>> = [];

  /**
   * version 用来标识这个列表的获取时间，在很多场景下，需要感知当前对象的版本，以此来区分新老版本来做出对应的变化
   * 这里的 version 目前使用时间戳来标识
   */

  public tableVersion: number = 0;
  public viewVersion: number = 0;
  public functionVersion: number = 0;
  public procedureVersion: number = 0;
  public sequenceVersion: number = 0;
  public packageVersion: number = 0;
  public triggerVersion: number = 0;
  public synonymVersion: number = 0;
  public publicSynonymVersion: number = 0;
  public typeVersion: number = 0;

  public readonly sessionId: string = null;

  public readonly dbName: string = null;

  public readonly databaseId: number = null;

  static async createInstance(sessionId: string, dbName: string, databaseId: number) {
    const db = new DatabaseStore(sessionId, dbName, databaseId);
    return db;
  }

  constructor(sessionId, dbName, databaseId) {
    this.sessionId = sessionId;
    this.dbName = dbName;
    this.databaseId = databaseId;
  }

  @action
  public async getTableList() {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const data = await request.get(`/api/v1/table/list/${sid}`);
    runInAction(() => {
      this.tables =
        data?.data?.map((table: ITable) => ({
          info: {
            tableName: table.tableName,
            character: table.character,
            collation: table.collation,
            comment: table.comment,
            DDL: table.ddlSql,
            updateTime: table.gmtModified,
            createTime: table.gmtCreated,
            tableSize: table.tableSize,
          },
        })) || [];
      this.tableVersion = Date.now();
    });
  }

  @action
  public async loadTable(tableName: string) {
    const table = await getTableInfo(tableName, this.dbName, this.sessionId);
    if (!table) {
      return;
    }
    const idx = this.tables.findIndex((t) => t.info.tableName === tableName);
    if (idx > -1) {
      const newTables = [...this.tables];
      newTables[idx] = table;
      runInAction(() => {
        this.tables = newTables;
      });
    }
  }

  @action
  public async getViewList() {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const ret = await request.get(`/api/v1/view/list/${sid}`);
    runInAction(() => {
      this.viewVersion = Date.now();
      this.views = ret?.data || [];
    });
  }

  @action
  public async loadView(viewName: string) {
    const sid = generateViewSid(viewName, this.dbName, this.sessionId);
    const { data: view } = (await request.get(`/api/v1/view/${sid}`)) || {};
    const newView = { ...view, columns: view.columns || [] };
    const idx = this.views.findIndex((t) => t.viewName === viewName);
    if (idx > -1) {
      const newViews = [...this.views];
      newViews[idx] = newView;
      runInAction(() => {
        this.views = newViews;
      });
    }
  }

  @action
  public async getFunctionList(ignoreError?: boolean) {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const ret = await request.get(`/api/v1/function/list/${sid}`, {
      params: {
        ignoreError,
      },
    });
    runInAction(() => {
      this.functionVersion = Date.now();
      this.functions = ret?.data || [];
    });
  }

  @action
  public async loadFunction(funName: string) {
    const func = await getFunctionByFuncName(funName, false, this.sessionId, this.dbName);
    const idx = this.functions.findIndex((t) => t.funName === funName);
    if (!func) {
      return;
    }
    if (idx !== -1) {
      this.functions[idx] = {
        ...func,
        // 漠高：status 只能在列表里查到
        status: this.functions[idx].status,
      };
    }

    return func;
  }

  @action
  public async getProcedureList() {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const ret = await request.get(`/api/v1/procedure/list/${sid}`);
    runInAction(() => {
      this.procedureVersion = Date.now();
      this.procedures = ret?.data || [];
    });
  }

  @action
  public async loadProcedure(procName: string) {
    const func = await getProcedureByProName(procName, false, this.sessionId, this.dbName);
    const idx = this.procedures.findIndex((t) => t.proName === procName);
    if (!func) {
      return;
    }
    if (idx !== -1) {
      this.procedures[idx] = {
        ...func,
        // 漠高：status 只能在列表里查到
        status: this.procedures[idx].status,
      };
    }

    return func;
  }

  @action
  public async getTriggerList() {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const res = await request.get(`/api/v1/trigger/list/${sid}`);
    runInAction(() => {
      this.triggerVersion = Date.now();
      this.triggers = res?.data || [];
    });
  }

  @action
  public async getSequenceList() {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const ret = (await request.get(`/api/v1/sequence/list/${sid}`)) || {};
    this.sequenceVersion = Date.now();
    this.sequences = ret?.data || [];
  }

  @action
  public async getTypeList() {
    const types = await getTypeList(this.dbName, this.sessionId);

    this.typeVersion = Date.now();
    this.types = types || [];
  }

  @action
  public async loadType(typeName: string) {
    const type = await getType(typeName, false, this.dbName, this.sessionId);
    if (!type) {
      return;
    }
    const idx = this.types.findIndex((t) => t.typeName === typeName);
    if (idx !== -1) {
      this.types[idx] = {
        ...type,
        status: this.types[idx].status,
      };
    }
    return type;
  }

  @action
  public async getPackageList() {
    const sid = generateDatabaseSid(this.dbName, this.sessionId);
    const ret = await request.get(`/api/v1/package/list/${sid}`);
    this.packageVersion = Date.now();
    this.packages = ret?.data || [];
  }

  @action
  public async loadPackage(pkgName: string, ignoreError?: boolean) {
    const sid = generatePackageSid(pkgName, this.sessionId, this.dbName);
    const res = await request.get(`/api/v1/package/${sid}`, {
      params: {
        ignoreError,
      },
    });
    const data = res?.data;
    const packageName = data?.packageName;
    if (data) {
      const dbId = this.databaseId;
      function addKey(target, paramName) {
        const keyMap = {};
        target[paramName] = target[paramName]
          ?.map((obj) => {
            const { params, returnType, proName, funName } = obj;
            const name = proName || funName;
            const key = btoa(
              encodeURIComponent(
                params
                  ?.map((p) => {
                    return p.paramName + ':' + p.dataType;
                  })
                  ?.join('$@p@$') +
                  '$@' +
                  returnType,
              ),
            );
            const uniqKey = `id:${dbId}-` + packageName + '.' + name + '*' + key;
            if (keyMap[uniqKey]) {
              /**
               * 去除完全一致的子程序
               */
              return null;
            }
            keyMap[uniqKey] = key;
            return {
              ...obj,
              params: params?.map((param) =>
                Object.assign({}, param, {
                  originDefaultValue: param.defaultValue,
                }),
              ),
              key: uniqKey,
            };
          })
          .filter(Boolean);
      }
      const pkgBody = data.packageBody;
      const pkgHead = data.packageHead;
      if (pkgBody) {
        addKey(pkgBody, 'functions');
        addKey(pkgBody, 'procedures');
      }
      if (pkgHead) {
        addKey(pkgHead, 'functions');
        addKey(pkgHead, 'procedures');
      }
    } else {
      return null;
    }
    const { packageBody, packageHead } = data || {};

    if (!packageHead && !packageBody) {
      throw new Error(
        formatMessage({ id: 'odc.src.store.schema.TheHeaderOfTheObtained' }), //获取包体包头为空
      );
    }
    const idx = this.packages.findIndex((t) => t.packageName === packageName);
    if (idx !== -1) {
      this.packages[idx] = { ...this.packages[idx], packageBody, packageHead };
    }
    return data;
  }

  @action
  public async getSynonymList() {
    const synonym = await getSynonymList(SynonymType.COMMON, this.dbName, this.sessionId);
    this.synonymVersion = Date.now();

    this.synonyms = synonym || [];
  }

  @action
  public async getPublicSynonymList() {
    const synonym = await getSynonymList(SynonymType.PUBLIC, this.dbName, this.sessionId);
    this.publicSynonymVersion = Date.now();

    this.publicSynonyms = synonym || [];
  }
}

export default DatabaseStore;
