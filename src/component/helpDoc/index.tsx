import React from 'react';

import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { Tooltip } from 'antd';
import Doc from './doc';
import styles from './index.less';

interface IDocProps {
  doc?: string;
  title?: string;
  isTip?: boolean;
  leftText?: boolean;
  overlayStyle?: { [key: string]: string };
}

const HelpDoc: React.FC<IDocProps> = function (props) {
  const { isTip = true, leftText, overlayStyle, doc: propDoc, title } = props;
  const doc = title ? title : Doc[propDoc];
  const iconStyle = {
    margin: '0px 4px',
    color: 'var(--text-color-hint)',
  };
  return (
    <span>
      {leftText ? props.children : null}
      <Tooltip
        overlayClassName={styles['c-helpdoc']}
        title={typeof doc === 'function' ? doc() : doc}
        overlayStyle={overlayStyle || {}}
      >
        {isTip ? (
          <QuestionCircleOutlined style={iconStyle} />
        ) : (
          <InfoCircleOutlined style={iconStyle} />
        )}
      </Tooltip>
      {!leftText ? props.children : null}
    </span>
  );
};

export default HelpDoc;
