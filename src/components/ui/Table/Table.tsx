import { Table as AntTable } from 'antd'
import type { TableProps as AntTableProps } from 'antd'
import './Table.scss'

export interface TableProps<RecordType> extends AntTableProps<RecordType> {
  borderRadius?: string
  width?: string
}

const Table = <RecordType extends object = any>({
  borderRadius,
  width,
  style,
  className = '',
  ...props
}: TableProps<RecordType>) => {
  const customStyle: React.CSSProperties = {
    ...(borderRadius && { borderRadius }),
    ...(width && { width }),
    ...style,
  }

  const classes = ['app-table', className].filter(Boolean).join(' ')

  return <AntTable style={customStyle} className={classes} {...props} />
}

export default Table
export type { AntTableProps }
