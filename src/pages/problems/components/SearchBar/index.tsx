import React, { useState } from 'react'
import { MagnifyingGlass } from 'phosphor-react'
import {
  SearchContainer,
  SearchInputContainer,
  SearchIcon,
  SearchInput,
} from './styles'

export interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onInputChange?: (value: string) => void
  onFilter?: () => void
  value?: string
  buttonText?: string
  filterText?: string
}

export const SearchBar = ({
  placeholder = 'Busque pelo título ou local do problema...',
  onSearch,
  onInputChange,
  value: controlledValue,
}: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState('')

  const inputValue =
    controlledValue !== undefined ? controlledValue : internalValue

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onInputChange?.(newValue)
  }

  const handleSearch = () => {
    onSearch?.(inputValue)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <SearchContainer>
      <SearchInputContainer>
        <SearchIcon>
          <MagnifyingGlass size={20} weight="regular" />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          aria-label="Campo de pesquisa"
        />
      </SearchInputContainer>
    </SearchContainer>
  )
}

SearchBar.displayName = 'SearchBar'
