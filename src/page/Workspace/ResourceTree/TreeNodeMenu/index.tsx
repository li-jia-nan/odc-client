import { AcessResult, canAcessWorkspace } from '@/component/Acess';
import { Dropdown, Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import MenuConfig from './config';
import styles from './index.less';
import { IMenuItemConfig, IProps } from './type';

const TreeNodeMenu = (props: IProps & Partial<AcessResult>) => {
  const { type = '', dbSession, options, node } = props;
  const menuItems = MenuConfig[type];
  if (!dbSession || !menuItems?.length) {
    return <span className="ant-tree-title">{node.title}</span>;
  }

  function onMenuClick(item: IMenuItemConfig) {
    const { run } = item;
    run?.(dbSession, node);
  }
  return (
    <Dropdown
      overlay={
        <Menu
          style={{
            width: '160px',
          }}
          onClick={(e) => {
            e.domEvent.preventDefault();
            e.domEvent.stopPropagation();
          }}
        >
          {menuItems
            ? menuItems.map((item: IMenuItemConfig) => {
                // 菜单子项 显隐可独立配置
                const disabledItem = item.disabled ? item.disabled(options) : false;
                const isHideItem = item.isHide ? item.isHide(options) : false;
                const acessible =
                  canAcessWorkspace(item.actionType, dbSession?.connection?.visibleScope) || true;
                let menuItems = [];
                if (!isHideItem && acessible) {
                  if (item.children?.length) {
                    menuItems = [
                      <Menu.SubMenu
                        key={item.key}
                        title={item.text}
                        className={styles.ellipsis}
                        disabled={disabledItem}
                      >
                        {item.children.map((child) => {
                          return (
                            <Menu.Item
                              onClick={() => onMenuClick(child)}
                              key={child.key}
                              className={styles.ellipsis}
                            >
                              {child.text}
                            </Menu.Item>
                          );
                        })}
                      </Menu.SubMenu>,
                    ];
                  } else {
                    menuItems = [
                      <Menu.Item
                        onClick={() => onMenuClick(item)}
                        key={item.key}
                        className={styles.ellipsis}
                        disabled={disabledItem}
                      >
                        {item.text}
                      </Menu.Item>,
                    ];
                  }
                }
                return item.hasDivider && !disabledItem
                  ? menuItems.concat(<Menu.Divider />)
                  : menuItems;
              })
            : []}
        </Menu>
      }
      trigger={['contextMenu']}
    >
      <span className="ant-tree-title">{node.title}</span>
    </Dropdown>
  );
};

TreeNodeMenu.defaultProps = {
  style: {},
  disabled: false,
  options: {},
};

export default inject('connectionStore')(observer(TreeNodeMenu));
