/**
 * 编辑器（只读）的场景下，也可以具备编辑的能力（格式化）
 * 说明：当前odc编辑器在（只读）模式下，不具备可编辑的原生能力（格式化）
 * 场景：目前只用于DDL查看场景
 */
import { ISQLCodeEditorProps, SQLCodeEditor } from '@/component/SQLCodeEditor';
import type { IEditor } from '@alipay/ob-editor';
import React from 'react';

export class SQLCodeEditorDDL extends React.PureComponent<ISQLCodeEditorProps> {
  render() {
    return (
      <>
        <SQLCodeEditor
          {...this.props}
          onEditorCreated={(editor: IEditor) => {
            const newEditor = Object.create(editor);
            this.props.onEditorCreated?.(
              Object.assign(newEditor, {
                doFormat() {
                  import('@alipay/ob-parser-js').then((module) => {
                    const doc = new module.SQLDocument({
                      text: editor.getValue(),
                    });
                    editor.setValue(doc.getFormatText());
                  });
                },
              }),
            );
          }}
        />
      </>
    );
  }
}