/**
 * 后端的API需要的path
 */
import connection, { ConnectionPropertyType } from '@/store/connection';
import schema from '@/store/schema';
import { encodeObjName } from '@/util/utils';

export function generateDatabaseSid(databaseName: string = '', sessionId?: string): string {
  databaseName = databaseName || schema.database.name;
  return `sid:${sessionId || connection.sessionId}:d:${encodeObjName(databaseName)}`;
}
export function generateSessionSid(sessionId?: string): string {
  return `sid:${sessionId || connection.sessionId}`;
}

export function generateTableSid(tableName: string, databaseName: string = ''): string {
  return `${generateDatabaseSid(databaseName)}:t:${encodeObjName(tableName)}`;
}

export function generateViewSid(viewName: string, databaseName: string = ''): string {
  return `${generateDatabaseSid(databaseName)}:v:${encodeObjName(viewName)}`;
}

export function generateFunctionSid(funName: string): string {
  return `${generateDatabaseSid()}:f:${encodeObjName(funName)}`;
}

export function generateProcedureSid(pName: string): string {
  return `${generateDatabaseSid()}:p:${encodeObjName(pName)}`;
}

export function generateSequenceSid(sName: string): string {
  return `${generateDatabaseSid()}:s:${encodeObjName(sName)}`;
}

export function generatePackageSid(paName: string): string {
  return `${generateDatabaseSid()}:pkg:${encodeObjName(paName)}`;
}

export function generateTriggerSid(triggerName: string): string {
  return `${generateDatabaseSid()}:tr:${encodeObjName(triggerName)}`;
}

export function generateSynonymSid(synonymName: string): string {
  return `${generateDatabaseSid()}:syn:${encodeObjName(synonymName)}`;
}

export function generateTypeSid(typeName: string): string {
  return `${generateDatabaseSid()}:ty:${encodeObjName(typeName)}`;
}

export function generateVarSid(type: ConnectionPropertyType, sessionId?: string): string {
  return `${generateDatabaseSid(null, sessionId)}:var:${type}`;
}