import { createContext, useContext } from 'react'

export type PeepContextType = {
  peepColor?: string
  showOnFocus?: boolean
  peepDelay?: number
}

export const PeepContext = createContext<PeepContextType | null>(null)

export const usePeepContext = () => useContext(PeepContext)
