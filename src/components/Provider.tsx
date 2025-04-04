import { ReactNode } from 'react'
import { PeepContext } from '../hooks/usePeepContext'

export type PeepProviderProps = {
  children: ReactNode
  peepColor?: string
  showOnFocus?: boolean
  peepDelay?: number
}

export const PeepProvider = ({ children, ...config }: PeepProviderProps) => {
  return <PeepContext.Provider value={config}>{children}</PeepContext.Provider>
}
