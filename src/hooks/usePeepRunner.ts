import { PeepMessage } from '../types/peep'

export function extractPeep(raw: PeepMessage): {
  message: string
  type: 'info' | 'error' | 'success'
} {
  if (typeof raw === 'string') {
    return { message: raw, type: 'info' }
  }
  const validTypes = ['info', 'error', 'success']
  return {
    message: raw.message,
    type: validTypes.includes(raw.type || '')
      ? (raw.type as 'info' | 'error' | 'success')
      : 'info',
  }
}

export const usePeepRunner = (
  peep: ((value: string) => PeepMessage) | undefined,
  value: string,
  setMessage: (msg: string) => void,
  setType: (t: 'info' | 'error' | 'success') => void,
  setShow: (show: boolean) => void
) => {
  return () => {
    if (!peep) return
    const raw = peep(String(value ?? ''))
    const { message, type } = extractPeep(raw)
    setMessage(message)
    setType(type)
    setShow(!!message)
  }
}
