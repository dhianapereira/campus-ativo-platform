import React, { useState } from "react";
import {
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  CloseButton,
  FilterSection,
  FilterLabel,
  CheckboxGroup,
  CheckboxItem,
  CheckboxLabel,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
} from "./styles";
import { Checkbox } from "../Checkbox";
import { X } from "phosphor-react";

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOption[]) => void;
  title?: string;
  description?: string;
  filterOptions: FilterOption[];
}

export const FilterDialog = ({
  isOpen,
  onClose,
  onApply,
  title = "Filtrar Problemas",
  description = "Selecione os filtros para refinar sua busca",
  filterOptions = [],
}: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterOption[]>(
    filterOptions.map((option) => ({ ...option })),
  );

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    setFilters((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, checked } : option,
      ),
    );
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters(filters.map((option) => ({ ...option, checked: false })));
  };

  const getActiveFiltersCount = () => {
    return filters.filter((f) => f.checked).length;
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>

        <FilterSection>
          <FilterLabel>Filtros</FilterLabel>
          <CheckboxGroup>
            {filters.map((option) => (
              <CheckboxItem key={option.id}>
                <Checkbox
                  checked={option.checked}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(option.id, checked as boolean)
                  }
                />
                <CheckboxLabel>{option.label}</CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FilterSection>

        <ButtonGroup>
          <CancelButton onClick={handleClear}>Limpar Filtros</CancelButton>
          <ConfirmButton onClick={handleApply}>
            Aplicar Filtros ({getActiveFiltersCount()})
          </ConfirmButton>
        </ButtonGroup>
      </DialogContent>
    </DialogOverlay>
  );
};

FilterDialog.displayName = "FilterDialog";
