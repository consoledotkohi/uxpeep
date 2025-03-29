import React, {
  useState,
  useEffect,
  useRef,
  TextareaHTMLAttributes,
} from 'react'
import { cx } from '../../utils/classnames'
import { usePeepConfig } from '../../hooks/usePeepConfig'
import { usePeepRunner } from '../../hooks/usePeepRunner'
import { PeepTrigger, PeepMessage } from '../../types/peep'
import styles from '../Field/Field.module.css'

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
  value,
  peep,
  peepDelay,
  peepOn,
  onChange,
  onFocus,
  onBlur,
  labelClassName,
  textareaClassName,
  peepClassName,
  ...rest
}) => {
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const [peepType, setPeepType] = useState<'info' | 'error' | 'success'>('info')

  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { trigger, delay } = usePeepConfig({ peepOn, peepDelay })
  const runPeep = usePeepRunner(
    peep,
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
    <div className={cx('peep-textarea')}>
      {label && (
        <label
          htmlFor={name}
          className={`${styles['peep-label']} ${labelClassName || ''}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles['peep-input']} ${textareaClassName || ''}`}
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
