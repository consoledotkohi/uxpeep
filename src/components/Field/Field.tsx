import React, { useState, useEffect, useRef, InputHTMLAttributes } from 'react'
import { cx } from '../../utils/classnames'
import { getAutoPeepStrategy } from '../../utils/strategies'
import { usePeepConfig } from '../../hooks/usePeepConfig'
import { usePeepRunner } from '../../hooks/usePeepRunner'
import { usePeepError } from '../../hooks/usePeepError'
import { PeepTrigger, PeepMessage } from '../../types/peep'
import styles from './Field.module.css'

export type PeepFieldProps = {
  label?: string
  peep?: (value: string) => PeepMessage
  peepDelay?: number
  peepOn?: PeepTrigger
  labelClassName?: string
  inputClassName?: string
  peepClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

export const PeepField: React.FC<PeepFieldProps> = ({
  label,
  name,
  type = 'text',
  value = '',
  peep,
  required,
  peepDelay,
  peepOn,
  onChange,
  onFocus,
  onBlur,
  labelClassName,
  inputClassName,
  peepClassName,
  ...rest
}) => {
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const [peepType, setPeepType] = useState<'info' | 'error' | 'success'>('info')

  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { trigger, delay } = usePeepConfig({ peepOn, peepDelay })
  const externalError = usePeepError(name)
  const fallbackPeep = getAutoPeepStrategy(name, required)

  const peepFn = peep ?? (() => externalError || fallbackPeep(String(value)))

  const runPeep = usePeepRunner(
    peepFn,
    String(value),
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
    <div className='peep-field'>
      {label && (
        <label
          htmlFor={name}
          className={`${styles['peep-label']} ${labelClassName || ''}`}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles['peep-input']} ${inputClassName || ''}`}
        required={required}
        {...rest}
      />
      {showPeep && peepMessage && (
        <div
          className={cx(
            styles['peep-message'],
            styles[`peep-message--${peepType}`],
            peepClassName
          )}
        >
          {peepMessage}
        </div>
      )}
    </div>
  )
}
