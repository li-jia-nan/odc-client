import { IDataTypeParamType, IDataTypes } from './interface';

/**
 * params: 参数
 */
export const dataTypes: IDataTypes = {
  integer: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isNumber: true,
  },
  int: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isNumber: true,
  },
  numeric: {
    params: [IDataTypeParamType.DISPLAY_WIDTH, IDataTypeParamType.SCALE],
    isNumber: true,
    defaultValues: [10, 2],
  },
  decimal: {
    params: [IDataTypeParamType.DISPLAY_WIDTH, IDataTypeParamType.SCALE],
    isNumber: true,
    defaultValues: [10, 2],
  },
  bit: {
    params: [IDataTypeParamType.BIT_LENGTH],
    isBit: true,
    defaultValues: [1],
  },
  tinyint: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isNumber: true,
  },
  smallint: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isNumber: true,
  },
  mediumint: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isNumber: true,
  },
  bigint: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isNumber: true,
  },
  float: {
    params: [IDataTypeParamType.DISPLAY_WIDTH, IDataTypeParamType.SCALE],
    isNumber: true,
    defaultValues: [10],
  },
  double: {
    params: [IDataTypeParamType.DISPLAY_WIDTH, IDataTypeParamType.SCALE],
    isNumber: true,
    defaultValues: [10],
  },
  varchar: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isChar: true,
    defaultValues: [120],
  },
  char: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isChar: true,
    defaultValues: [120],
  },
  tinytext: {
    params: [],
    isText: true,
  },
  mediumtext: {
    params: [],
    isText: true,
  },
  text: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isText: true,
  },
  longtext: {
    params: [],
    isText: true,
  },
  tinyblob: {
    params: [],
    isBlob: true,
  },
  blob: {
    params: [IDataTypeParamType.BYTE_LENGTH],
    isBlob: true,
  },
  mediumblob: {
    params: [],
    isBlob: true,
  },
  longblob: {
    params: [],
    isBlob: true,
  },
  binary: {
    params: [IDataTypeParamType.BYTE_LENGTH],
    isBinary: true,
    defaultValues: [120],
  },
  varbinary: {
    params: [IDataTypeParamType.BYTE_LENGTH],
    isBinary: true,
    defaultValues: [120],
  },
  timestamp: {
    params: [IDataTypeParamType.FSP],
    defaultValues: [0],
    isDate: true,
    canSync: true,
  },
  date: {
    params: [],
    isDate: true,
  },
  time: {
    params: [IDataTypeParamType.FSP],
    defaultValues: [0],
    isDate: true,
    canSync: true,
  },
  datetime: {
    params: [IDataTypeParamType.FSP],
    defaultValues: [0],
    isDate: true,
    canSync: true,
  },
  year: {
    params: [IDataTypeParamType.DISPLAY_WIDTH],
    isDate: true,
  },
  enum: {
    params: [],
    isEnum: true,
  },
  set: {
    params: [],
    isEnum: true,
  },
  bool: {
    params: [],
  },
  boolean: {
    params: [],
  },
};