import React, { useState, useRef } from 'react'
import { Button, Text } from '@/styles'
import { Image as ImageIcon } from 'phosphor-react'
import {
  UploadContainer,
  UploadArea,
  IconContainer,
  InfoText,
  UploadControls,
  StatusText,
  HiddenInput,
  ErrorText,
  ImagePreview,
  RemoveButton,
  ContentWrapper,
} from './styles'

export interface ImageUploadProps {
  onImageSelect?: (file: File | null) => void
  maxSizeKB?: number
  acceptedTypes?: string[]
  placeholder?: string
  buttonText?: string
  errorMessage?: string
  showPreview?: boolean
  disabled?: boolean
}

export default function ImageUpload({
  onImageSelect,
  maxSizeKB = 100,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  placeholder = `Faça o upload de uma imagem com tamanho inferior a ${maxSizeKB}KB.`,
  buttonText = 'Escolher Imagem',
  errorMessage,
  showPreview = true,
  disabled = false,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      clearSelection()
      return
    }

    if (!acceptedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.')
      clearSelection()
      return
    }

    const fileSizeKB = file.size / 1024
    if (fileSizeKB > maxSizeKB) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSizeKB}KB`)
      clearSelection()
      return
    }

    setError('')
    setSelectedFile(file)
    onImageSelect?.(file)

    if (showPreview) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setError('')
    onImageSelect?.(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    clearSelection()
  }

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024
    return `${kb.toFixed(1)}KB`
  }

  return (
    <UploadContainer>
      <UploadArea hasError={!!error} hasImage={!!selectedFile}>
        {selectedFile && previewUrl ? (
          <ImagePreview>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview da imagem" />
            <RemoveButton onClick={handleRemoveImage} type="button">
              ×
            </RemoveButton>
          </ImagePreview>
        ) : (
          <IconContainer>
            <ImageIcon size={32} weight="regular" />
          </IconContainer>
        )}
      </UploadArea>

      <ContentWrapper>
        {' '}
        <InfoText>
          <Text size="sm" style={{ color: '#6B7280', fontStyle: 'italic' }}>
            {placeholder}
          </Text>
        </InfoText>
        <UploadControls>
          <Button
            variant="secondary"
            onClick={handleButtonClick}
            disabled={disabled}
            style={{
              borderColor: '#059669',
              color: '#00875F',
              backgroundColor: 'transparent',
              border: '1.5px solid #00875F',
              borderRadius: '4px',
            }}
          >
            {buttonText}
          </Button>

          <StatusText>
            {selectedFile ? (
              <Text size="sm" style={{ color: '#059669' }}>
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </Text>
            ) : (
              <Text size="sm" style={{ color: '#6B7280' }}>
                Nenhuma imagem escolhida
              </Text>
            )}
          </StatusText>
        </UploadControls>
        {(error || errorMessage) && (
          <ErrorText>
            <Text size="sm" style={{ color: '#DC2626' }}>
              {error || errorMessage}
            </Text>
          </ErrorText>
        )}
      </ContentWrapper>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        disabled={disabled}
      />
    </UploadContainer>
  )
}
