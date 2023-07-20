import { useState } from "react";
import {
    FullscreenOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import { Modal } from "antd";
import DDLResultSet from "../../DDLResultSet";
import SessionStore from "@/store/sessionManager/session";
import { IPLOutParam, IResultSet } from "@/d.ts";
import { IServerTableColumn } from "@/d.ts/table";

interface ICursorCellProps {
    record: IPLOutParam & { 
        cursorResultSet: {
            resultSetMetaData: {
                columnList: IServerTableColumn[];
            },
            rows: IResultSet["rows"]
    }};
    session: SessionStore;
}

const CursorCell: React.FC<ICursorCellProps> = (props) => {
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const { rows, resultSetMetaData } = props?.record?.cursorResultSet ?? {};
    const columns = resultSetMetaData?.columnList?.map((field, index) => {
        return {
            key: `${field.name}_${index}`,
            name: field.name,
            columnName: field.name,
            columnType: field.typeName,
            columnIndex: index,
            columnComment: field.comment,
            internal: null,
            readonly: true,
        };
    });

    const _rows = rows?.map((row, i) => {
        return row.reduce(
            (newRowMap, value, rowIdx) => {
                const columnKey = columns[rowIdx].key;
                newRowMap[columnKey] = value;
                return newRowMap;
            },
            { _rowIndex: i },
        );
    });

    return (
        <>
            <div
                className={styles.viewBtn}
                onClick={(e) => {
                    setDetailModalVisible(true);
                    e.stopPropagation();
                }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <FullscreenOutlined />
            </div>
            {detailModalVisible && (
                <Modal
                    title={props?.record?.paramName}
                    open={true}
                    centered
                    width={720}
                    onCancel={() => {
                        setDetailModalVisible(false);
                    }}
                    footer={null}
                    wrapClassName={styles['cursor-modal']}
                >
                    <DDLResultSet
                        session={null}
                        showExplain={false}
                        disableEdit={true}
                        autoCommit={false}
                        isEditing={false}
                        onExport={null}
                        showPagination={true}
                        columns={columns}
                        rows={_rows}
                        sqlId=""
                        enableRowId={true}
                        resultHeight={420}
                    />
                </Modal>
            )}
        </>
    );

}

export default CursorCell;