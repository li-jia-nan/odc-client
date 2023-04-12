import { ITableModel } from '@/page/Workspace/components/CreateTable/interface';
import { formatMessage } from '@/util/intl';
import { getQuoteTableName } from '@/util/utils';
import { Form, FormInstance, Input, message, Modal } from 'antd';
import React, { Component } from 'react';

interface IProps {
  model: Partial<ITableModel>;
  onSave: (values: Partial<ITableModel>) => void;
  visible: boolean;
  onCancel: () => void;
}

class TableRenameModal extends Component<IProps> {
  form = React.createRef<FormInstance>();
  public save = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { onSave, model } = this.props;
    const data = await this.form.current.validateFields();
    if (!data) {
      return;
    }
    if (getQuoteTableName(model.info.tableName) === data.tableName) {
      message.error(
        formatMessage({
          id: 'odc.component.TableRenameModal.TheTableNameHasNot',
        }),
        // 表名称未修改
      );
      return;
    }
    const newData = Object.assign({}, this.props.model, {
      info: {
        ...model.info,
        tableName: data.tableName,
      },
    });
    onSave(newData);
  };

  public render() {
    const { visible, onCancel, model } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Modal
        destroyOnClose={true}
        title={formatMessage({ id: 'workspace.tree.table.rename.modal.title' })}
        visible={visible}
        onOk={this.save}
        onCancel={onCancel}
        centered={true}
      >
        <Form
          ref={this.form}
          initialValues={{ tableName: getQuoteTableName(model?.info?.tableName) }}
          {...formItemLayout}
        >
          <Form.Item
            extra={formatMessage({
              id: 'odc.component.TableRenameModal.TheContentInQuotationMarks',
            })} /*引号中内容区分大小写*/
            label={formatMessage({
              id: 'workspace.window.createTable.baseInfo.tableName',
            })}
            name="tableName"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'workspace.window.createTable.baseInfo.tableName.validation',
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: 'workspace.window.createTable.baseInfo.tableName.placeholder',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default TableRenameModal;
