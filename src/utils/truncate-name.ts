import { useMemo } from 'react'

export interface TruncateNameOptions {
  maxLength?: number
  suffix?: string
  preserveWords?: boolean
}

/**
 * Trunca o nome de usuário quando excede o limite de caracteres
 * @param name - Nome completo do usuário
 * @param options - Opções de configuração
 * @returns Nome truncado com sufixo se necessário
 */
export const truncateName = (
  name: string,
  options: TruncateNameOptions = {},
): string => {
  const { maxLength = 20, suffix = '...', preserveWords = true } = options

  // Se o nome já está dentro do limite, retorna como está
  if (name.length <= maxLength) {
    return name
  }

  // Se preserveWords é true, tenta quebrar em palavras
  if (preserveWords) {
    const words = name.split(' ')
    let truncated = words[0] // Sempre mantém o primeiro nome

    // Adiciona palavras enquanto couber no limite
    for (let i = 1; i < words.length; i++) {
      const testName = `${truncated} ${words[i]}`
      if (testName.length + suffix.length <= maxLength) {
        truncated = testName
      } else {
        break
      }
    }

    // Se o resultado é diferente do nome original, adiciona o sufixo
    if (truncated !== name) {
      return `${truncated}${suffix}`
    }

    return truncated
  }

  // Trunca no meio da palavra se preserveWords é false
  const truncatedLength = maxLength - suffix.length
  return `${name.substring(0, truncatedLength)}${suffix}`
}

/**
 * Versão específica para nomes de usuário em headers/avatares
 */
export const truncateUserName = (name: string): string => {
  return truncateName(name, {
    maxLength: 18,
    suffix: '...',
    preserveWords: true,
  })
}

/**
 * Versão específica para nomes em cards/listas
 */
export const truncateDisplayName = (name: string): string => {
  return truncateName(name, {
    maxLength: 25,
    suffix: '...',
    preserveWords: true,
  })
}

/**
 * Versão mais agressiva para espaços muito limitados
 */
export const truncateShortName = (name: string): string => {
  return truncateName(name, {
    maxLength: 12,
    suffix: '...',
    preserveWords: false,
  })
}

export const useTruncatedName = (
  name: string,
  options?: TruncateNameOptions,
) => {
  return useMemo(() => {
    return truncateName(name, options)
  }, [name, options])
}
