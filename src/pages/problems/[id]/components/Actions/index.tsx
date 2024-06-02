import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Heading, Text, TextArea } from '@campusativo-ui/react'
import { Container, Form, Input, Section } from './styles'
import { Dropdown } from '../Dropdown'
import { IProps } from './index.d'
import { zodResolver } from '@hookform/resolvers/zod'
import { actionsFormSchema } from '@/validators/actions-form'
import { ActionsFormData } from '@/@types/form'
import { StatusDataList } from '@/data/static/status-data'
import { CategoryDataList } from '@/data/static/category-data'

export function Actions({ initialStatus, initialCategory }: IProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<ActionsFormData>({
    resolver: zodResolver(actionsFormSchema),
    defaultValues: {
      status: initialStatus || '',
      category: initialCategory || '',
    },
  })

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setValue('status', value, { shouldValidate: true })
    trigger('status')
  }

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value
    setValue('category', value, { shouldValidate: true })
    trigger('category')
  }

  async function handleSave(data: ActionsFormData) {
    console.log(data)
  }

  /// The trigger method in useEffect force initial validation
  /// and ensure that fields are validated correctly from the start
  useEffect(() => {
    trigger()
  }, [trigger])

  return (
    <Container>
      <Heading size="md">Ações</Heading>
      <Form onSubmit={handleSubmit(handleSave)}>
        <Section>
          <Input>
            <Dropdown
              id="status"
              label="Status"
              hint="Selecione o status"
              items={StatusDataList}
              itemSelected={initialStatus}
              onChange={handleStatusChange}
            />
            {errors.status && (
              <Text className="error-message" size="sm">
                {errors.status.message}
              </Text>
            )}
          </Input>

          <Input>
            <Dropdown
              id="category"
              label="Categoria"
              hint="Selecione a categoria"
              items={CategoryDataList}
              itemSelected={initialCategory}
              onChange={handleCategoryChange}
            />
            {errors.category && (
              <Text className="error-message" size="sm">
                {errors.category.message}
              </Text>
            )}
          </Input>
        </Section>
        <Section>
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
        </Section>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Salvar
        </Button>
      </Form>
    </Container>
  )
}
