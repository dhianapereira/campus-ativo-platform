import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Heading,
  Text,
  TextArea,
  Dropdown,
  RadioGroup,
} from '@campusativo-ui/react'
import { Column, Container, Form, Input, Section } from './styles'
import { IProps } from './index.d'
import { zodResolver } from '@hookform/resolvers/zod'
import { actionsFormSchema } from '@/validators/actions-form'
import { ActionsFormData } from '@/@types/form'
import { StatusDataList } from '@/data/static/status-data'
import { CategoryDataList } from '@/data/static/category-data'
import { maintenanceTypes } from '@/data/static/maintenance-types'

export function Actions({
  initialStatus,
  initialCategory,
  initialMaintenanceType,
}: IProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
                itemSelected={watch('status')}
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
                items={CategoryDataList}
                itemSelected={watch('category')}
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
                value={watch('maintenance')}
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
