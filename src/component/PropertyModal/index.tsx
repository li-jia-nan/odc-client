import { IConnectionProperty, IConnectionPropertyType } from '@/d.ts';
import { SettingStore } from '@/store/setting';
import { formatMessage } from '@/util/intl';
import { Alert, Form, Input, InputNumber, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
const { Option } = Select;
interface IProps {
  model: Partial<IConnectionProperty>;
  settingStore?: SettingStore;
  onSave: (values: IConnectionProperty) => void;
  visible: boolean;
  onCancel: () => void;
}

const formItemProps = {
  name: 'value',
  label: formatMessage({
    id: 'workspace.window.session.form.value',
  }),
  style: {
    marginBottom: 0,
  },
  rules: [
    {
      required: true,
      message: formatMessage({
        id: 'workspace.window.session.form.value.validation',
      }),
    },
  ],
};

class PropertyModal extends Component<IProps> {
  public formRef = React.createRef<FormInstance>();

  public save = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { onSave } = this.props;
    this.formRef.current
      .validateFields()
      .then((data) => {
        onSave(data);
      })
      .catch((error) => {
        console.error(JSON.stringify(error));
      });
  };

  public render() {
    const { visible, model, settingStore, onCancel } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },

      wrapperCol: {
        span: 14,
      },
    };

    const { valueType, valueEnums, value } = model;
    const isAutocommit = model.key?.toLowerCase?.() == 'autocommit';
    const isShowAutocommitTip = isAutocommit && !settingStore.enableMultiSession;
    const initialValues = {
      value,
    };

    return (
      <Modal
        destroyOnClose={true}
        title={formatMessage({
          id: 'workspace.window.session.modal.title',
        })}
        visible={visible}
        onOk={this.save}
        onCancel={onCancel}
      >
        {isShowAutocommitTip && (
          <Alert
            type="warning"
            showIcon
            message={formatMessage({
              id: 'odc.component.PropertyModal.RiskTips',
            })}
            /*风险提示*/
            style={{
              marginBottom: 12,
            }}
            description={
              <div>
                <div>
                  {
                    formatMessage({
                      id: 'odc.component.PropertyModal.TheSharedSessionModeIs',
                    }) /*当前使用的是共享 Session 模式，因此：*/
                  }
                </div>
                <div>
                  {
                    formatMessage({
                      id: 'odc.component.PropertyModal.WhenTheValueIsOff',
                    })
                    /*1、当该值为 OFF
            时：主动触发提交/回滚操作；或通过产品功能创建、修改、删除数据库对象，执行 DDL
            语句被动触发提交操作，会在所有窗口生效。*/
                  }
                </div>
                <div>
                  {
                    formatMessage({
                      id: 'odc.component.PropertyModal.WhenTheValueIsOn',
                    })
                    /*2、当该值为 ON 时：如果存在未提交的内容，会默认自动提交。*/
                  }
                </div>
              </div>
            }
          />
        )}

        <Form {...formItemLayout} initialValues={initialValues} ref={this.formRef}>
          <Form.Item
            label={formatMessage({
              id: 'workspace.window.session.form.key',
            })}
          >
            <span className="ant-form-text">{model.key}</span>
          </Form.Item>

          {(!valueType || valueType === IConnectionPropertyType.STRING) && (
            <Form.Item {...formItemProps}>
              <Input
                placeholder={formatMessage({
                  id: 'workspace.window.session.form.value.placeholder',
                })}
              />
            </Form.Item>
          )}

          {valueType === IConnectionPropertyType.NUMERIC && (
            <>
              <Form.Item {...formItemProps}>
                <InputNumber
                  style={{
                    width: 180,
                  }}
                />
              </Form.Item>
              <span
                style={{
                  marginLeft: 8,
                }}
              >
                {model.unit}
              </span>
            </>
          )}

          {valueType === IConnectionPropertyType.ENUM && (
            <Form.Item {...formItemProps}>
              <Select>
                {valueEnums &&
                  valueEnums.map((v) => (
                    <Option key={v} value={v}>
                      {v}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  }
}

export default inject('settingStore')(observer(PropertyModal));