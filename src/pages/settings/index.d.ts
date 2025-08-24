export interface LocationItem {
  id: string
  nome: string
  numero: string
  descricao: string
  selected?: boolean
}

export interface CategoryItem {
  id: string
  nome: string
  descricao: string
  selected?: boolean
}

export interface TabData {
  label: string
  value: 'localizacao' | 'categoria'
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export interface TableProps {
  data: LocationItem[] | CategoryItem[]
  selectedItems: string[]
  onSelectItem: (id: string) => void
  onSelectAll: () => void
  isAllSelected: boolean
  activeTab: 'localizacao' | 'categoria'
}

export interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch: () => void
}

export interface ActionButtonsProps {
  selectedCount: number
  onDeleteSelected: () => void
  onAddNew: () => void
  activeTab: 'localizacao' | 'categoria'
}
