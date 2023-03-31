import { IConStatus } from '@/component/Toolbar/statefulIcon';
import { formatMessage } from '@/util/intl';
import { downloadPLDDL } from '@/util/sqlExport';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Modal } from 'antd'; // @ts-ignore
import { ToolBarActions } from '..';

const { confirm } = Modal;
const scriptActions: ToolBarActions = {
  SNIPPET: {
    name: formatMessage({ id: 'odc.EditorToolBar.actions.script.SyntaxHelp' }), // 代码片段
    icon: 'SNIPPET',
    statusFunc: (ctx) => {
      return ctx.state.showGrammerHelpSider ? IConStatus.ACTIVE : IConStatus.INIT;
    },

    async action(ctx: any) {
      ctx.setState({
        showGrammerHelpSider: !ctx.state.showGrammerHelpSider,
      });
    },
  },

  SNIPPET_SECTION_GROUP: {
    name: formatMessage({ id: 'odc.EditorToolBar.actions.script.Placeholder' }), // 占位符
    icon: 'ADD_SNIPPET_SECTION',
    menu: ['ADD_SNIPPET_SECTION', 'REMOVE_SNIPPET_SECTION'],
  },

  ADD_SNIPPET_SECTION: {
    name: formatMessage({
      id: 'odc.EditorToolBar.actions.script.AddPlaceholder',
    }),
    // 添加占位符
    icon: 'ADD_SNIPPET_SECTION',
    async action(ctx: any) {
      const { codeEditor } = ctx.editor;
      const value = codeEditor.getValue();
      const snippetSections = value.match(/\$\{\d\:(.*?)\}/g) || [];
      const snipptSectionText = `\${${snippetSections.length + 1}:string}`;
      const position = codeEditor.getPosition();
      codeEditor.executeEdits('ADD_SNIPPET_SECTION', [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },

          text: snipptSectionText,
        },
      ]);
      import('@alipay/ob-editor').then((module) => {
        const monaco = module.monaco;
        const range = new monaco.Range(
          position.lineNumber,
          position.column + 4,
          position.lineNumber,
          position.column + 10,
        );

        codeEditor.setSelection(range);
        ctx.editor?.focus();
      });
    },
  },

  REMOVE_SNIPPET_SECTION: {
    name: formatMessage({
      id: 'odc.EditorToolBar.actions.script.DeletePlaceholder',
    }),
    // 删除占位符
    icon: 'REMOVE_SNIPPET_SECTION',
    async action(ctx: any) {
      const { codeEditor } = ctx.editor;
      const selectText = ctx.editor.getSelection();
      if (!selectText) {
        return;
      }
      const capitalizeText = selectText.replace(/\$\{\d\:(.*?)\}/g, '$1');
      const selection = codeEditor.getSelection();
      import('@alipay/ob-editor').then((module) => {
        const monaco = module.monaco;
        const range = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn,
        );

        const op = {
          identifier: {
            major: 1,
            minor: 1,
          },

          range,
          text: capitalizeText,
          forceMoveMarkers: true,
        };

        codeEditor.executeEdits('REMOVE_SNIPPET_SECTION', [op]);
        ctx.editor?.focus();
      });
    },
  },

  DOWNLOAD: {
    name: formatMessage({ id: 'odc.EditorToolBar.actions.script.Download' }), //下载
    icon: CloudDownloadOutlined,
    async action(ctx) {
      const text = ctx?.props?.params?.scriptText || '';
      const type = ctx?.props?.params?.plType || ctx?.props?.params?.plSchema?.plType;
      const plName =
        ctx?.props?.params?.plName ||
        ctx?.props?.params?.plSchema?.plName ||
        ctx?.props?.params?.triggerName;
      downloadPLDDL(plName, type, text);
    },
  },
};

export default scriptActions;