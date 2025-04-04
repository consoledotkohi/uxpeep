import React, {
  useState,
  useEffect,
  useRef,
  TextareaHTMLAttributes,
} from 'react'
import { getAutoPeepStrategy } from '../utils/strategies'
import { usePeepConfig } from '../hooks/usePeepConfig'
import { usePeepRunner } from '../hooks/usePeepRunner'
import { PeepTrigger, PeepMessage } from '../types/peep'

export type PeepTextareaProps = {
  label?: string
  peep?: (value: string) => PeepMessage
  peepDelay?: number
  peepOn?: PeepTrigger
  labelClassName?: string
  textareaClassName?: string
  peepClassName?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const PeepTextarea: React.FC<PeepTextareaProps> = ({
  label,
  name,
  required,
  peep,
  peepDelay,
  peepOn,
  labelClassName,
  textareaClassName,
  peepClassName,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const [peepType, setPeepType] = useState<'info' | 'error' | 'success'>('info')

  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { trigger, delay } = usePeepConfig({ peepOn, peepDelay })

  const fallbackPeep = getAutoPeepStrategy(name, required)
  const value = (rest.value ?? '').toString()
  const peepFn = peep ?? (() => fallbackPeep(value))

  const runPeep = usePeepRunner(
    peepFn,
    value,
    setPeepMessage,
    setPeepType,
    setShowPeep
  )

  useEffect(() => {
    if (trigger === 'input') {
      if (delayTimeout.current) clearTimeout(delayTimeout.current)
      delayTimeout.current = setTimeout(() => runPeep(), delay)
    } else if (trigger === 'always') {
      runPeep()
    }
    return () => {
      if (delayTimeout.current) clearTimeout(delayTimeout.current)
    }
  }, [value, trigger, delay])

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (trigger === 'focus') {
      delayTimeout.current = setTimeout(() => runPeep(), delay)
    }
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (trigger === 'focus') {
      if (delayTimeout.current) clearTimeout(delayTimeout.current)
      setShowPeep(false)
    }
    onBlur?.(e)
  }

  return (
    <div className='peep-label'>
      {label && (
        <label htmlFor={name} className={`peep-label ${labelClassName}`}>
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`peep-textarea ${textareaClassName}`}
        {...rest}
      />
      {showPeep && peepMessage && (
        <div
          className={`peep-message peep-message--${peepType} ${peepClassName}`}
        >
          {peepMessage}
        </div>
      )}
    </div>
  )
}
