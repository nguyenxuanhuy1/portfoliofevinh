import type { TableProps as GlobalTableProps } from '../../../../../components/ui/Table/Table'
import GlobalTable from '../../../../../components/ui/Table/Table'
import './Table.scss'

export type TableProps<RecordType> = GlobalTableProps<RecordType>

const Table = <RecordType extends object = any>(props: TableProps<RecordType>) => {
  return <GlobalTable {...props} />
}

export default Table