export interface IServerTable {
  name: string;
  tableOptions: Partial<IServerTableOptions>;
  columns: Partial<IServerTableColumn>[];
  indexes: Partial<IServerTableIndex>[];
  constraints: Partial<IServerTableConstraint>[];
  partition: {
    partitionOption?: Partial<{
      type: string;
      expression: string;
      columnNames: string[];
      partitionsNum: number;
      automatic: boolean;
      verticalColumnNames: string[];
    }>;
    partitionDefinitions?: Partial<IServerTablePartitionDefinition>[];
  };
  DDL: string;
  createTime: number;
  updateTime: number;
  owner: string;
  schemaName: string;
  warning: string;
  stats: {
    rowCount?: number | undefined;
    tableSize?: string | undefined;
  };
}

export interface IServerTableOptions {
  charsetName: string;
  collationName: string;
  comment: string;
  encryption: boolean;
  autoIncrementInitialValue: number;
  primaryZone: string;
  locality: string;
  replicaNum: number;
  tablegroupName: string;
  rowFormat: string;
  compressionOption: string;
  blockSize: number;
  tabletSize: number;
  useBloomFilter: boolean;
  updateTime?: number;
  createTime?: number;
}

export interface IServerTableColumn {
  schemaName: string;
  tableName: string;
  name: string;
  typeName: string;
  fullTypeName: string;
  scale: number | string;
  precision: number | string;
  typeModifiers: string[];
  nullable: boolean;
  defaultValue: string;
  virtual: boolean;
  comment: string;
  ordinalPosition: number;
  maxLength: number | string;
  charsetName: string;
  collationName: string;
  genExpression: string;
  autoIncrement: boolean;
  unsigned: boolean;
  zerofill: boolean;
  enumValues: string[];
  stored: boolean;
  onUpdateCurrentTimestamp: boolean;
  extraInfo: string;
  charUsed: 'BYTE' | 'CHAR';
  hidden: boolean;
  warning: string;
  keyType: 'PRI' | 'UNI' | 'MUL';
  secondPrecision?: number | string;
  dayPrecision?: number | string;
  yearPrecision?: number | string;
}

export interface IServerTableIndex {
  schemaName: string;
  tableName: string;
  name: string;
  type: string;
  comment: string;
  global: boolean;
  unique: boolean;
  primary: boolean;
  visible: boolean;
  columnNames: string[];
  additionalInfo: string;
  compressInfo: string;
  computeStatistics: boolean;
  nonUnique: boolean;
  cardinality: number;
  createTime: number;
  updateTime: number;
  owner: string;
  collation: string;
  parserName: string;
  keyBlockSize: number;
  warning: string;
  algorithm: string;
  ordinalPosition: number;
}

export interface IServerTableConstraint {
  schemaName: string;
  tableName: string;
  ordinalPosition: number;
  name: string;
  type: string;
  columnNames: string[];
  referenceSchemaName: string;
  referenceTableName: string;
  referenceColumnNames: string[];
  comment: string;
  checkClause: string;
  validate: boolean;
  deferability: TableConstraintDefer;
  matchType: 'SIMPLE' | 'FULL' | 'PARTIAL' | 'DEFAULT';
  onUpdateRule: TableForeignConstraintOnUpdateType;
  onDeleteRule: TableForeignConstraintOnDeleteType;
  createTime: number;
  updateTime: number;
  owner: string;
  warning: string;
  enabled: boolean;
}

export interface IServerTablePartitionDefinition {
  name: string;
  type: string;
  maxValues: string[];
  valuesList: string[][];
  comment: string;
  maxRows: number;
  minRows: number;
  ordinalPosition: number;
}

/**
 * 延迟状态
 */
export enum TableConstraintDefer {
  /**
   * 约束不能延迟
   */
  NOT = 'NOT_DEFERRABLE',
  /**
   * 可延迟约束的可延迟检查
   */
  DEFERRABLE_DEFER = 'INITIALLY_DEFERRED',
  /**
   * 可延迟约束的立即检查
   */
  DEFERRABLE_IMMEDIATE = 'INITIALLY_IMMEDIATE',
}

export enum TableForeignConstraintOnDeleteType {
  CASCADE = 'CASCADE',
  NO_ACTION = 'NO_ACTION',
  SET_NULL = 'SET_NULL',
  /**
   * oracle 没这个，效果同 no action
   */
  RESTRICT = 'RESTRICT',
}

export enum TableForeignConstraintOnUpdateType {
  CASCADE = 'CASCADE',
  NO_ACTION = 'NO_ACTION',
  SET_NULL = 'SET_NULL',
  /**
   * oracle 没这个，效果同 no action
   */
  RESTRICT = 'RESTRICT',
}