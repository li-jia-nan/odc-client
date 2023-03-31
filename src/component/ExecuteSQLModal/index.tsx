import { formatMessage } from '@/util/intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'umi';
// compatible
import { runSQLLint } from '@/common/network/sql';
import { ConnectionMode } from '@/d.ts';
import { ConnectionStore } from '@/store/connection';
import type { IEditor } from '@alipay/ob-editor';
import { useUpdate } from 'ahooks';
import { Alert, Button, message, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SQLCodeEditor } from '../SQLCodeEditor';
import LintDrawer from '../SQLLintResult/Drawer';

interface IProps {
  connectionStore?: ConnectionStore;
  sql: string;
  tip?: string;
  onSave: (sql?: string) => Promise<boolean | void>;
  visible: boolean;
  onCancel: () => void;
  readonly?: boolean;
  onChange?: (sql: string) => void;
}

const ExecuteSQLModal: React.FC<IProps> = (props) => {
  const { tip, sql, visible, readonly, connectionStore, onCancel, onSave } = props;
  const [loading, setLoading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [lintVisible, setLintVisible] = useState(false);
  const [lintResult, setLintResult] = useState(null);
  const update = useUpdate();
  const editorRef = useRef<IEditor>();

  const connectionMode = connectionStore.connection?.dbMode;
  const isMySQL = connectionMode === ConnectionMode.MYSQL;

  useEffect(() => {
    if (sql !== editorRef?.current?.getValue()) {
      editorRef.current?.setValue(sql);
    }
  }, [sql, editorRef.current]);

  const handleSubmit = useCallback(async () => {
    const updateSQL = editorRef.current?.getValue();
    if (!updateSQL) {
      return;
    }
    setLoading(true);
    try {
      await onSave(updateSQL);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [onSave]);

  const handleFormat = () => {
    setIsFormatting(true);
    setTimeout(() => {
      editorRef.current.doFormat();
      setTimeout(() => {
        setIsFormatting(false);
      }, 100);
    }, 200);
  };

  const handleSQLChanged = (sql: string) => {
    props?.onChange?.(sql);
  };

  const handleLint = async () => {
    const value = editorRef?.current?.getValue();
    if (!value) {
      return;
    }
    const lint = await runSQLLint(connectionStore?.sessionId, ';', value);
    if (lint) {
      if (!lint.length) {
        message.success(
          formatMessage({ id: 'odc.component.ExecuteSQLModal.SqlCheckPassed' }), //SQL 检查通过
        );
        return;
      }
      setLintVisible(true);
      setLintResult(lint);
    }
  };

  return (
    <>
      <Modal
        zIndex={1002}
        width={840}
        destroyOnClose={true}
        title={formatMessage({
          id: 'workspace.window.session.modal.sql.title',
        })}
        visible={visible}
        onOk={handleSubmit}
        onCancel={onCancel}
        footer={[
          <Button key="lint" onClick={handleLint}>
            {
              formatMessage({
                id: 'odc.component.ExecuteSQLModal.SqlCheck',
              }) /*SQL 检查*/
            }
          </Button>,
          <Button key="format" onClick={handleFormat}>
            {
              formatMessage({
                id: 'odc.component.ExecuteSQLModal.Format',
              })
              /*格式化*/
            }
          </Button>,
          <CopyToClipboard
            key="copy"
            text={sql}
            onCopy={() => {
              message.success(
                formatMessage({
                  id: 'workspace.window.session.modal.sql.copied',
                }),
              );
            }}
          >
            <Button>
              <FormattedMessage id="app.button.copy" />
            </Button>
          </CopyToClipboard>,
          <Button key="back" onClick={onCancel}>
            <FormattedMessage id="app.button.cancel" />
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
            <FormattedMessage id="app.button.execute" />
          </Button>,
        ]}
      >
        {tip && <Alert message={tip} type="info" showIcon={true} style={{ marginBottom: 4 }} />}
        <div
          style={{
            height: 400,
            width: '100%',
            padding: 4,
            border: '1px solid var(--odc-border-color)',
            borderRadius: 4,
          }}
        >
          <SQLCodeEditor
            readOnly={readonly && !isFormatting}
            initialValue={sql}
            disableAutoUpdateInitialValue={true}
            language={`sql-oceanbase-${isMySQL ? 'mysql' : 'oracle'}`}
            onValueChange={handleSQLChanged}
            onEditorCreated={(editor) => {
              editorRef.current = editor;
              update();
            }}
          />
        </div>
      </Modal>
      <LintDrawer visible={lintVisible} closePage={() => setLintVisible(false)} data={lintResult} />
    </>
  );
};

export default inject('connectionStore')(observer(ExecuteSQLModal));