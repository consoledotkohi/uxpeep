import React, { useState, useEffect, useRef } from 'react'
import { cx } from '../../utils/classnames'
import { getAutoPeepStrategy } from '../../utils/strategies'
import { usePeepConfig } from '../../hooks/usePeepConfig'
import { usePeepRunner } from '../../hooks/usePeepRunner'
import { usePeepError } from '../../hooks/usePeepError'
import { PeepTrigger, PeepMessage } from '../../types/peep'
import styles from './Select.module.css'

export type SelectOption = {
  label: string
  value: string
}

export type PeepSelectProps = {
  label?: string
  options: SelectOption[]
  peep?: (value: string) => PeepMessage
  peepDelay?: number
  peepOn?: PeepTrigger
  labelClassName?: string
  selectClassName?: string
  peepClassName?: string
  name?: string
  value?: string
  required?: boolean
  onChange?: (e: { target: { name?: string; value: string } }) => void
}

export const PeepSelect: React.FC<PeepSelectProps> = ({
  label,
  name,
  value = '',
  options,
  peep,
  required,
  peepDelay,
  peepOn,
  onChange,
  labelClassName,
  selectClassName,
  peepClassName,
}) => {
  const [open, setOpen] = useState(false)
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

  const selectedLabel = options.find((opt) => opt.value === value)?.label || ''

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

  const handleSelect = (val: string) => {
    onChange?.({ target: { name, value: val } })
    setOpen(false)
  }

  return (
    <div className={cx('peep-select')}>
      {label && (
        <label
          htmlFor={name}
          className={`${styles['peep-label']} ${labelClassName || ''}`}
        >
          {label}
        </label>
      )}
      <div
        className={cx(
          styles['select-box'],
          open && styles['select-box--open'],
          selectClassName
        )}
      >
        <button
          type='button'
          className={styles.trigger}
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedLabel || '선택해주세요'}
        </button>
        {open && (
          <ul className={styles.options}>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={cx(
                  styles.option,
                  value === opt.value && styles.selected
                )}
                onMouseDown={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
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
