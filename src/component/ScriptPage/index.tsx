import DropWrapper from '@/component/Dragable/component/DropWrapper';
import EditorToolBar from '@/component/EditorToolBar';
import GrammerHelpSider from '@/component/GrammerHelpSider';
import { SQLCodeEditor } from '@/component/SQLCodeEditor';
import StatusBar from '@/component/StatusBar';
import { EDITOR_TOOLBAR_HEIGHT, SQL_PAGE_RESULT_HEIGHT } from '@/constant';
import { DbObjectType } from '@/d.ts/index';
import { IDebugStackItem } from '@/store/debug/type';
import { SettingStore } from '@/store/setting';
import snippetStore from '@/store/snippet';
import editorUtils from '@/util/editor';
import { getUnWrapedSnippetBody } from '@/util/snippet';
import type { IEditor } from '@alipay/ob-editor';
import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import SplitPane from 'react-split-pane';
import CustomDragLayer from '../GrammerHelpSider/component/CustomDragLayer';
import TemplateInsertModal, { CLOSE_INSERT_PROMPT_KEY, getCopyText } from '../TemplateInsertModal';
import styles from './index.less';

const { Content } = Layout;

interface IProps {
  settingStore?: SettingStore;
  ctx: any;
  style?: any;
  language: string;
  editor: any;
  toolbar?: any;
  stackbar?: {
    onClick: any;
    list: IDebugStackItem[] | null;
  };
  statusBar?: any;
  Result?: React.ReactNode;
  Others: any;
  handleChangeSplitPane?: (size: number) => void;
}

interface IPageState {
  // esultHeight: number;
  templateInsertModalVisible: boolean;
  templateName: string;
  offset: {
    line: number;
    column: number;
  };
}

@inject('settingStore')
@observer
export default class ScriptPage extends PureComponent<IProps> {
  public readonly state: IPageState = {
    templateInsertModalVisible: false,
    templateName: '',
    offset: null,
    /// resultHeight: RESULT_HEIGHT
  };

  renderPanels = () => {
    const { ctx, language, toolbar, stackbar, editor, statusBar, settingStore } = this.props;
    const isShowDebugStackBar = !!stackbar?.list?.length;
    return (
      <Layout
        style={{
          minHeight: 'auto',
          height: '100%',
          background: 'var(--background-primary-color)',
        }}
      >
        <Content style={{ position: 'relative' }}>
          {toolbar && <EditorToolBar {...toolbar} ctx={ctx} />}
          {isShowDebugStackBar ? (
            <div className={styles.stackList}>
              {stackbar.list.map((stack) => {
                return (
                  <div
                    className="stack-item"
                    onClick={() => {
                      stackbar.onClick(stack);
                    }}
                    title={stack.plName}
                  >
                    {stack.plName} {stack.isActive && <i className="icon-active" />}
                  </div>
                );
              })}
            </div>
          ) : null}
          <DropWrapper
            style={{
              position: 'absolute',
              top: EDITOR_TOOLBAR_HEIGHT + (isShowDebugStackBar ? 28 : 0),
              bottom: statusBar && statusBar.status ? 32 : 0,
              left: 0,
              right: 0,
            }}
            onHover={(item, monitor) => {
              ctx.editor?.focus();
              const clientOffset = monitor.getClientOffset();
              editorUtils.updateEditorCursorPositionByClientPosition(ctx.editor, {
                clientX: clientOffset.x,
                clientY: clientOffset.y,
              });
            }}
            onDrop={async (item, monitor) => {
              const snippetBody = snippetStore.snippetDragging?.body;
              if (!snippetBody) {
                return;
              }
              const snippetTemplate = getUnWrapedSnippetBody(snippetBody);
              if (snippetTemplate) {
                editorUtils.insertSnippetTemplate(ctx.editor, snippetTemplate);
              } else if (
                [DbObjectType.table, DbObjectType.view].includes(
                  snippetStore.snippetDragging?.objType,
                )
              ) {
                const position = (ctx.editor as IEditor)?.UNSAFE_getCodeEditor().getPosition();
                if (!position) {
                  return;
                }
                const CLOSE_INSERT_PROMPT = localStorage.getItem(CLOSE_INSERT_PROMPT_KEY);
                if (CLOSE_INSERT_PROMPT === 'true') {
                  const name = snippetBody;
                  const type = snippetStore.snippetDragging?.objType;
                  const value =
                    settingStore.configurations['sqlexecute.defaultObjectDraggingOption'];
                  const insertText = await getCopyText(name, type, value, true);
                  const editor = (ctx.editor as IEditor).UNSAFE_getCodeEditor();
                  editor.focus();
                  editorUtils.insertSnippetTemplate(ctx.editor, insertText);
                } else {
                  this.setState({
                    templateInsertModalVisible: true,
                    templateName: snippetBody,
                    offset: {
                      line: position.lineNumber,
                      column: position.column,
                    },
                  });
                }
              } else {
                editorUtils.insertTextToCurrectPosition(ctx.editor, snippetBody);
              }
            }}
          >
            <SQLCodeEditor {...editor} language={language} />
          </DropWrapper>
          {this.props.Others}
        </Content>
        {editor?.enableSnippet && ctx.state.showGrammerHelpSider ? (
          <GrammerHelpSider
            collapsed={!ctx.state.showGrammerHelpSider}
            onCollapse={() => {
              ctx.setState({ showGrammerHelpSider: false });
            }}
          />
        ) : null}
      </Layout>
    );
  };

  render() {
    const { statusBar, style, Result, ctx } = this.props;
    const { templateInsertModalVisible, templateName, offset } = this.state;
    return (
      <Layout
        style={{
          ...{
            minHeight: 'auto',
            height: '100%',
            background: 'var(--background-primary-color)',
          },
          ...style,
        }}
      >
        {Result ? (
          <SplitPane
            split="horizontal"
            primary={'second'}
            minSize={statusBar?.status ? 66 : 32}
            maxSize={-100}
            defaultSize={SQL_PAGE_RESULT_HEIGHT}
            onChange={this.props.handleChangeSplitPane}
          >
            {this.renderPanels()}
            {Result}
          </SplitPane>
        ) : (
          this.renderPanels()
        )}
        <StatusBar statusBar={statusBar} />
        <TemplateInsertModal
          visible={templateInsertModalVisible}
          name={templateName}
          type={snippetStore.snippetDragging?.objType}
          onClose={() => {
            this.setState({
              templateInsertModalVisible: false,
              templateName: '',
              offset: null,
            });
          }}
          onOk={(insertText) => {
            const editor = (ctx.editor as IEditor).UNSAFE_getCodeEditor();
            editor.focus();
            // editor.setPosition({
            //   lineNumber: offset?.line,
            //   column: offset?.column
            // });
            this.setState(
              {
                templateInsertModalVisible: false,
                templateName: '',
                offset: null,
              },
              () => {
                editorUtils.insertSnippetTemplate(ctx.editor, insertText);
              },
            );
          }}
        />
        <CustomDragLayer />
      </Layout>
    );
  }
}