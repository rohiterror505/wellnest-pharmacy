// @ts-nocheck
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface LocalThemeProviderProps extends React.PropsWithChildren {
  themes?: string[]
  forcedTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
  storageKey?: string
  defaultTheme?: string
  attribute?: string | string[]
  value?: { [themeName: string]: string }
  nonce?: string
  scriptProps?: React.ScriptHTMLAttributes<HTMLScriptElement>
}

export function ThemeProvider({ children, ...props }: LocalThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
