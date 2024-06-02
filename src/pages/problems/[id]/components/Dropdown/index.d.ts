export interface IProps {
  id: string
  label: string
  hint: string
  itemSelected: string | null
  items: Item[]
  onChange: function
}
