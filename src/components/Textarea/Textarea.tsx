import React, {
  useState,
  useEffect,
  useRef,
  TextareaHTMLAttributes,
} from 'react'
import { usePeepContext } from '../context'
import { cx } from '../../utils/classnames'
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

  const context = usePeepContext()
  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const delay = peepDelay ?? context?.peepDelay ?? 0
  const trigger: PeepTrigger =
    peepOn ?? (context?.showOnFocus ? 'focus' : 'input')

  const runPeep = () => {
    if (peep) {
      const raw = peep(String(value ?? ''))

      const { message, type } =
        typeof raw === 'string' ? { message: raw, type: 'info' } : raw

      setPeepMessage(message)

      const isValidType = (t: any): t is 'info' | 'error' | 'success' =>
        ['info', 'error', 'success'].includes(t)

      setPeepType(isValidType(type) ? type : 'info')
      setShowPeep(!!message)
    }
  }

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
  }, [value, trigger, peep, delay])

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
    <div className='peep-textarea'>
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
