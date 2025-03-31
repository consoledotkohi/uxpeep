import React, { useState, useEffect, useRef, InputHTMLAttributes } from 'react'
import { getAutoPeepStrategy } from '../utils/strategies'
import { usePeepConfig } from '../hooks/usePeepConfig'
import { usePeepRunner } from '../hooks/usePeepRunner'
import { PeepTrigger, PeepMessage } from '../types/peep'

export type PeepCheckboxProps = {
  label?: string
  peep?: (value: string) => PeepMessage
  peepDelay?: number
  peepOn?: PeepTrigger
  labelClassName?: string
  checkboxClassName?: string
  peepClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

export const PeepCheckbox: React.FC<PeepCheckboxProps> = ({
  label,
  name,
  required,
  checked,
  peep,
  peepDelay,
  peepOn,
  labelClassName,
  checkboxClassName,
  peepClassName,
  onFocus,
  onBlur,
  onChange,
  ...rest
}) => {
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const [peepType, setPeepType] = useState<'info' | 'error' | 'success'>('info')

  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { trigger, delay } = usePeepConfig({ peepOn, peepDelay })

  const value = checked ? 'true' : ''
  const fallbackPeep = getAutoPeepStrategy(name, required)
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
  }, [checked, trigger, delay])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (trigger === 'focus') {
      delayTimeout.current = setTimeout(() => runPeep(), delay)
    }
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (trigger === 'focus') {
      if (delayTimeout.current) clearTimeout(delayTimeout.current)
      setShowPeep(false)
    }
    onBlur?.(e)
  }

  return (
    <div className='peep-checkbox'>
      <label className={`checkbox-label ${labelClassName}`}>
        <input
          type='checkbox'
          name={name}
          checked={checked}
          required={required}
          className={`checkbox ${checkboxClassName}`}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <span>{label}</span>
      </label>
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
