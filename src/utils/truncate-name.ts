import { useMemo } from 'react'

export interface TruncateNameOptions {
  maxLength?: number
  suffix?: string
  preserveWords?: boolean
}

/**
 * Truncates user name when it exceeds character limit
 * @param name - Full user name
 * @param options - Configuration options
 * @returns Truncated name with suffix if necessary
*/
export const truncateName = (
  name: string,
  options: TruncateNameOptions = {},
): string => {
  const { maxLength = 20, suffix = '...', preserveWords = true } = options

  if (name.length <= maxLength) {
    return name
  }

  if (preserveWords) {
    const words = name.split(' ')
    let truncated = words[0]

    for (let i = 1; i < words.length; i++) {
      const testName = `${truncated} ${words[i]}`
      if (testName.length + suffix.length <= maxLength) {
        truncated = testName
      } else {
        break
      }
    }

    if (truncated !== name) {
      return `${truncated}${suffix}`
    }
    return truncated
  }

  const truncatedLength = maxLength - suffix.length
  return `${name.substring(0, truncatedLength)}${suffix}`
}

export const truncateUserName = (name: string): string => {
  return truncateName(name, {
    maxLength: 18,
    suffix: '...',
    preserveWords: true,
  })
}

export const truncateDisplayName = (name: string): string => {
  return truncateName(name, {
    maxLength: 25,
    suffix: '...',
    preserveWords: true,
  })
}

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
