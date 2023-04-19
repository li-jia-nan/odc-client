import { getTypeCreateSQL } from '@/common/network/type';
import { ITypeForm, TypeCode } from '@/d.ts';
import { openCreateTypePage } from '@/store/helper/page';
import { ModalStore } from '@/store/modal';
import { formatMessage } from '@/util/intl';
import { Button, Form, Input, Modal, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';

interface IProps {
  modalStore?: ModalStore;
}

export enum CheckOption {
  NONE = 'NONE',
}

const { Option } = Select;

class CreateTypeModal extends Component<
  IProps,
  {
    loading: boolean;
  }
> {
  state = {
    loading: false,
  };
  private formRef = React.createRef<FormInstance>();

  handleCancel = () => {
    this.handleSwitchLoading(false);
    this.props.modalStore.changeCreateTypeModalVisible(false);
  };

  handleSwitchLoading = (loading: boolean) => {
    this.setState({
      loading,
    });
  };

  handleConfirm = () => {
    this.formRef.current
      .validateFields()
      .then(async (values: ITypeForm) => {
        const { modalStore } = this.props;
        this.handleSwitchLoading(true);
        const sql = await getTypeCreateSQL(
          values.typeName,
          values,
          modalStore.createTypeModalData.sessionId,
          modalStore.createTypeModalData.dbName,
        );
        openCreateTypePage(
          sql,
          modalStore.createTypeModalData.sessionId,
          modalStore.createTypeModalData.dbName,
        );
        this.handleSwitchLoading(false);
        modalStore.changeCreateTypeModalVisible(false);
      })
      .catch((errorInfo) => {
        throw new Error({ ...errorInfo });
      });
  };

  public render() {
    const { modalStore } = this.props;
    const { loading } = this.state;
    return (
      <Modal
        width={480}
        destroyOnClose
        title={formatMessage({ id: 'odc.component.CreateTypeModal.NewType' })}
        /* 新建类型 */
        visible={modalStore.createTypeModalVisible}
        onCancel={this.handleCancel}
        maskClosable={false}
        centered
        footer={
          <Space>
            <Button onClick={this.handleCancel}>
              {
                formatMessage({
                  id: 'odc.component.CreateTypeModal.Cancel',
                })
                /* 取消 */
              }
            </Button>
            <Button type="primary" loading={loading} onClick={this.handleConfirm}>
              {
                formatMessage({
                  id: 'odc.component.CreateTypeModal.NextConfirmTheSqlStatement',
                })
                /* 下一步: 确认SQL */
              }
            </Button>
          </Space>
        }
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          requiredMark={false}
          onFinish={this.handleConfirm}
        >
          <Form.Item
            name="typeName"
            label={formatMessage({
              id: 'odc.component.CreateTypeModal.Type.1',
            })} /* 类型名称 */
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'odc.component.CreateTypeModal.EnterATypeName',
                }),
                // 请输入类型名称
              },
              {
                max: 128,
                message: formatMessage({
                  id: 'odc.component.CreateTypeModal.TheLengthCannotExceedCharacters',
                }),

                // 长度不超过 128 个字符
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'odc.component.CreateTypeModal.EnterATypeName',
              })}
            />
          </Form.Item>
          <Form.Item
            name="typeCode"
            label={formatMessage({ id: 'odc.component.CreateTypeModal.Type' })}
            /* 类型 */
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'odc.component.CreateTypeModal.TheTypeMustBeSpecified',
                }),

                // 类型不能为空
              },
            ]}
            initialValue={TypeCode.OBJECT}
            style={{ width: '144px' }}
          >
            <Select
              placeholder={formatMessage({
                id: 'odc.component.CreateTypeModal.EnterAType',
              })}

              /* 请输入类型 */
            >
              <Option value={TypeCode.OBJECT}>
                {
                  formatMessage({
                    id: 'odc.component.CreateTypeModal.ObjectType',
                  })
                  /* 对象类型 */
                }
              </Option>
              <Option value={TypeCode.VARRAY}>
                {
                  formatMessage({
                    id: 'odc.component.CreateTypeModal.ArrayType',
                  })
                  /* 数组类型 */
                }
              </Option>
              <Option value={TypeCode.TABLE}>
                {
                  formatMessage({
                    id: 'odc.component.CreateTypeModal.TableType',
                  })
                  /* 表类型 */
                }
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default inject('modalStore')(observer(CreateTypeModal));
