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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { DropdownItem } from '@/styles/components/Dropdown'
import type { CategoryResponse } from '@/server/client/models/categoryResponse'
import type { FetchProblemsControllerHandle200 } from '@/server/client/models'
import { toast } from 'sonner'
import {
  toBackendMaintenanceType,
  toBackendStatus,
  toFrontendMaintenanceType,
} from '@/utils/problem-mapping'

export function Actions({
  problemId,
  problemQueryKey,
  initialStatus,
  initialCategory,
  initialMaintenanceType,
  initialNote,
}: ProblemActionsProps) {
  const queryClient = useQueryClient()
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

  const normalizedInitialMaintenanceType =
    toFrontendMaintenanceType(initialMaintenanceType) || ''

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<ActionsFormData>({
    resolver: zodResolver(actionsFormSchema),
    defaultValues: {
      status: initialStatus || '',
      category: initialCategory || '',
      maintenance: normalizedInitialMaintenanceType,
      note: initialNote || '',
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
    const nextBackendStatus = toBackendStatus(data.status)
    const trimmedNote = data.note?.trim() || ''
    const trimmedInitialNote = initialNote.trim()
    const noteChanged = trimmedNote !== trimmedInitialNote

    const response = await fetch(`/api/problems/${problemId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: nextBackendStatus,
        categoryId: data.category || undefined,
        maintenanceType: toBackendMaintenanceType(data.maintenance),
        note: noteChanged ? trimmedNote : undefined,
      }),
    })

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}))
      throw new Error(responseData.message || 'Falha ao salvar ações')
    }

    await queryClient.invalidateQueries({
      queryKey: ['problem', problemQueryKey],
    })
    await queryClient.invalidateQueries({
      queryKey: ['problems'],
    })
    await queryClient.invalidateQueries({
      queryKey: ['dashboard'],
    })

    queryClient.setQueriesData<FetchProblemsControllerHandle200>(
      { queryKey: ['problems'] },
      (currentData) => {
        if (!currentData?.problems) {
          return currentData
        }

        return {
          ...currentData,
          problems: currentData.problems.map((problem) =>
            problem.id === problemId
              ? {
                  ...problem,
                  status: (nextBackendStatus ??
                    problem.status) as typeof problem.status,
                }
              : problem,
          ),
        }
      },
    )

    reset(
      {
        status: data.status,
        category: data.category,
        maintenance: data.maintenance,
        note: data.note || '',
      },
      {
        keepErrors: false,
        keepDirty: false,
      },
    )

    toast.success('Operação realizada com sucesso')
  }

  useEffect(() => {
    trigger()
  }, [trigger])

  useEffect(() => {
    reset({
      status: initialStatus || '',
      category: initialCategory || '',
      maintenance: normalizedInitialMaintenanceType,
      note: initialNote || '',
    })
  }, [
    initialCategory,
    initialNote,
    initialStatus,
    normalizedInitialMaintenanceType,
    reset,
  ])

  async function onSubmit(data: ActionsFormData) {
    try {
      await handleSave(data)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Falha ao atualizar histórico do problema',
      )
    }
  }

  return (
    <Container>
      <Heading size="md">Ações</Heading>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
                css={{ width: '100%', minHeight: '120px' }}
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
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </Form>
    </Container>
  )
}
