import type { ReactNode } from "react"

export interface Section {
  id: string
  title?: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  scrollToId?: string
  isCalculator?: boolean
}

export interface SectionProps extends Section {
  isActive: boolean
}
