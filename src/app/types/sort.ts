export type SortOrderDirection = 'asc' | 'desc' | false

export type SortOrderType =
  | 'title'
  | 'start'
  | 'end'
  | 'date'
  | 'type'
  | 'order'

export interface SortData {
  direction: SortOrderDirection
  type: SortOrderType
}
