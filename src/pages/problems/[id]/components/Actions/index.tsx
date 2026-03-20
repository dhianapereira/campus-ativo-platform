import React, { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Heading, Text, TextArea, Dropdown, RadioGroup } from '@/styles'
import { Column, Container, Form, Input, Section } from './styles'
import type { ProblemActionsProps } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { actionsFormSchema } from '@/validators/actions-form'
import { ActionsFormData } from '@/@types/form'
import { StatusDataList } from '@/data/static/status-data'
import { maintenanceTypes } from '@/data/static/maintenance-types'
import { useQuery } from '@tanstack/react-query'
import type { DropdownItem } from '@/styles/components/Dropdown'
import type { CategoryResponse } from '@/server/client/models/categoryResponse'

export function Actions({
  initialStatus,
  initialCategory,
  initialMaintenanceType,
}: ProblemActionsProps) {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const response = await fetch('/api/categories?isActive=true', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias')
      }

      return (await response.json()) as { categories?: CategoryResponse[] }
    },
  })

  const categoryItems = useMemo<DropdownItem[]>(
    () =>
      (categoriesData?.categories ?? []).map((category) => ({
        name: category.name,
        value: category.id,
      })),
    [categoriesData?.categories],
  )

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<ActionsFormData>({
    resolver: zodResolver(actionsFormSchema),
    defaultValues: {
      status: initialStatus || '',
      category: initialCategory || '',
      maintenance: initialMaintenanceType || '',
    },
  })

  const [status, category, maintenance] = useWatch({
    control,
    name: ['status', 'category', 'maintenance'],
  })

  const handleStatusChange = (value: string) => {
    setValue('status', value, { shouldValidate: true })
    trigger('status')
  }

  const handleCategoryChange = (value: string) => {
    setValue('category', value, { shouldValidate: true })
    trigger('category')
  }

  const handleMaintenanceChange = (value: string) => {
    setValue('maintenance', value, { shouldValidate: true })
    trigger('maintenance')
  }

  async function handleSave(data: ActionsFormData) {
    console.log(data)
  }

  useEffect(() => {
    trigger()
  }, [trigger])

  return (
    <Container>
      <Heading size="md">Ações</Heading>
      <Form onSubmit={handleSubmit(handleSave)}>
        <Section>
          <Column>
            <Input>
              <Dropdown
                id="status"
                label="Status"
                hint="Selecione o status"
                items={StatusDataList}
                itemSelected={status}
                onChange={handleStatusChange}
                hasError={!!errors.status}
                errorMessage={errors.status?.message}
              />
            </Input>

            <Input>
              <Dropdown
                id="category"
                label="Categoria"
                hint="Selecione a categoria"
                items={categoryItems}
                itemSelected={category}
                onChange={handleCategoryChange}
                hasError={!!errors.category}
                errorMessage={errors.category?.message}
              />
            </Input>
          </Column>
          <Column>
            <Input>
              <RadioGroup
                title="Manutenção"
                name="maintenance"
                options={maintenanceTypes}
                value={maintenance}
                onChange={handleMaintenanceChange}
                hasError={!!errors.maintenance}
                errorMessage={errors.maintenance?.message}
              />
            </Input>
            <Input>
              <Text size="md">Observações</Text>
              <TextArea
                placeholder="Adicione aqui as observações relacionadas ao status escolhido."
                {...register('note')}
              />
              {errors.note && (
                <Text className="error-message" size="sm">
                  {errors.note.message}
                </Text>
              )}
            </Input>
          </Column>
        </Section>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Salvar
        </Button>
      </Form>
    </Container>
  )
}
