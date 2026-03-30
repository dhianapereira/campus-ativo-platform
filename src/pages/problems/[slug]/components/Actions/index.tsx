import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  Button,
  Heading,
  Text,
  TextArea,
  Dropdown,
  RadioGroup,
} from '@/components'
import {
  Column,
  Container,
  Form,
  Header,
  Helper,
  Input,
  Section,
} from './styles'
import type { ProblemActionsProps } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { actionsFormSchema, ActionsFormData } from '@/validators/actions-form'
import { problemStatusOptions } from '@/constants/problems/status'
import { maintenanceTypeOptions } from '@/constants/problems/maintenance-types'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  toBackendMaintenanceType,
  toBackendStatus,
  toFrontendMaintenanceType,
} from '../../../problem-mapping'

export function Actions({
  problemId,
  problemQueryKey,
  initialStatus,
  initialMaintenanceType,
  initialNote,
}: ProblemActionsProps) {
  const queryClient = useQueryClient()

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
      maintenance: normalizedInitialMaintenanceType,
      note: initialNote || '',
    },
  })

  const [status, maintenance] = useWatch({
    control,
    name: ['status', 'maintenance'],
  })

  const handleStatusChange = (value: string) => {
    setValue('status', value, { shouldValidate: true })
    trigger('status')
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
        maintenanceType: toBackendMaintenanceType(data.maintenance),
        note: noteChanged ? trimmedNote : undefined,
      }),
    })

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}))
      throw new Error(responseData.message || 'Falha ao salvar ações.')
    }

    await queryClient.invalidateQueries({
      queryKey: ['problem', problemQueryKey],
    })
    await queryClient.invalidateQueries({
      queryKey: ['problems'],
      refetchType: 'all',
    })
    await queryClient.invalidateQueries({
      queryKey: ['dashboard'],
    })

    reset(
      {
        status: data.status,
        maintenance: data.maintenance,
        note: data.note || '',
      },
      {
        keepErrors: false,
        keepDirty: false,
      },
    )

    toast.success('Operação realizada com sucesso.')
  }

  useEffect(() => {
    trigger()
  }, [trigger])

  useEffect(() => {
    reset({
      status: initialStatus || '',
      maintenance: normalizedInitialMaintenanceType,
      note: initialNote || '',
    })
  }, [initialNote, initialStatus, normalizedInitialMaintenanceType, reset])

  async function onSubmit(data: ActionsFormData) {
    try {
      await handleSave(data)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Falha ao atualizar histórico do problema.',
      )
    }
  }

  return (
    <Container>
      <Header>
        <Heading size="md">Ações</Heading>
        <Helper>
          <span className="helper-dot" aria-hidden="true" />
          <Text size="sm">
            Atualize o andamento do problema e registre o contexto dessa
            atualização para o histórico.
          </Text>
        </Helper>
      </Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Section>
          <Column>
            <Text
              size="sm"
              css={{
                color: '$gray',
                fontWeight: '$bold',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Andamento
            </Text>
            <Input>
              <Dropdown
                id="status"
                label="Status"
                hint="Selecione o status"
                items={problemStatusOptions}
                itemSelected={status}
                onChange={handleStatusChange}
                hasError={!!errors.status}
                errorMessage={errors.status?.message}
              />
            </Input>
          </Column>
          <Column>
            <Text
              size="sm"
              css={{
                color: '$gray',
                fontWeight: '$bold',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Informações Complementares
            </Text>
            <Input>
              <RadioGroup
                title="Manutenção"
                name="maintenance"
                options={maintenanceTypeOptions}
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
