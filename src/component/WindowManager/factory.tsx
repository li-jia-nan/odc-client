import { IPage } from '@/d.ts';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { Component, ReactNode } from 'react';
import { FormattedMessage } from 'umi';

import styles from './index.less';

export default function withConfirmModal(WrappedComponent: any) {
  return class extends Component<
    {
      pageKey: string;
      page: IPage;
      isSaved: boolean;
      startSaving: boolean;
      isShow: boolean;
      params: any;
      showUnsavedModal: boolean;
      /**
       * 未保存的修改
       */
      onUnsavedChange: (pageKey: string) => void;
      /**
       * 修改已保存
       */
      onChangeSaved: (pageKey: string) => void;
      /**
       * 关闭但不保存
       */
      onCloseUnsavedModal: (pageKey: string) => void;
      /**
       * 取消
       */
      onCancelUnsavedModal: () => void;
      /**
       * 关闭并保存
       */
      onSaveAndCloseUnsavedModal: (pageKey: string, closeImmediately?: boolean) => void;
      /**
       * 关闭当前页面
       */
      closeSelf: () => void;
    },
    {
      unsavedModalTitle: string;
      unsavedModalContent: string;
      unsavedModalSaveButtonText: string | ReactNode;
      disableUnsavedModalCloseUnsaveButton: boolean;
      closeImmediately: boolean;
    }
  > {
    public readonly state = {
      unsavedModalTitle: '',
      unsavedModalContent: '',
      unsavedModalSaveButtonText: <FormattedMessage id="app.button.save" />,
      disableUnsavedModalCloseUnsaveButton: false,
      closeImmediately: false,
    };

    public render() {
      const {
        pageKey,
        page,
        isSaved,
        startSaving,
        params,
        showUnsavedModal,
        onCloseUnsavedModal,
        onSaveAndCloseUnsavedModal,
        onCancelUnsavedModal,
        onUnsavedChange,
        onChangeSaved,
        closeSelf,
        isShow,
      } = this.props;
      const {
        unsavedModalTitle,
        unsavedModalContent,
        unsavedModalSaveButtonText,
        disableUnsavedModalCloseUnsaveButton,
        closeImmediately,
      } = this.state;
      return (
        <div
          style={{
            // 减去 topbar 和 tabbar 高度
            height: 'calc(100vh - 40px - 28px)',
            background: 'var(--background-secondry-color)',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          <WrappedComponent
            pageKey={pageKey}
            page={page}
            isSaved={isSaved}
            startSaving={startSaving}
            isShow={isShow}
            params={params}
            onUnsavedChange={onUnsavedChange}
            onChangeSaved={onChangeSaved}
            onSetUnsavedModalTitle={(t: string) => this.setState({ unsavedModalTitle: t })}
            onSetUnsavedModalContent={(t: string) => this.setState({ unsavedModalContent: t })}
            onSetUnsavedModalSaveButtonText={(t: string | ReactNode) =>
              this.setState({ unsavedModalSaveButtonText: t })
            }
            onSetDisableUnsavedModalCloseUnsaveButton={(t: boolean) =>
              this.setState({ disableUnsavedModalCloseUnsaveButton: t })
            }
            onSetCloseImmediately={(t: boolean) => this.setState({ closeImmediately: t })}
            closeSelf={closeSelf}
          />
          {showUnsavedModal && (
            <Modal
              className={styles.modal}
              centered={true}
              visible={showUnsavedModal}
              onOk={() => onSaveAndCloseUnsavedModal(pageKey, closeImmediately)}
              onCancel={onCancelUnsavedModal}
              footer={[
                !disableUnsavedModalCloseUnsaveButton && (
                  <Button key="close" onClick={() => onCloseUnsavedModal(pageKey)}>
                    <FormattedMessage id="app.button.dontsave" />
                  </Button>
                ),
                <Button key="back" onClick={onCancelUnsavedModal}>
                  <FormattedMessage id="app.button.cancel" />
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => onSaveAndCloseUnsavedModal(pageKey, closeImmediately)}
                >
                  {unsavedModalSaveButtonText}
                </Button>,
              ]}
            >
              <div className="ant-modal-confirm-body">
                <QuestionCircleFilled style={{ color: 'rgb(250, 173, 20)' }} />
                <span className="ant-modal-confirm-title">{unsavedModalTitle}</span>
                <div className="ant-modal-confirm-content">{unsavedModalContent}</div>
              </div>
            </Modal>
          )}
        </div>
      );
    }
  };
}