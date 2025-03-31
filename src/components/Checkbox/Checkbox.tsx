import React, { useState, useEffect, useRef } from 'react'
import { cx } from '../../utils/classnames'
import { getAutoPeepStrategy } from '../../utils/strategies'
import { usePeepConfig } from '../../hooks/usePeepConfig'
import { usePeepRunner } from '../../hooks/usePeepRunner'
import { PeepTrigger, PeepMessage } from '../../types/peep'
import styles from './Checkbox.module.css'

export type PeepCheckboxProps = {
  label?: string
  peep?: (value: string) => PeepMessage
  peepDelay?: number
  peepOn?: PeepTrigger
  labelClassName?: string
  checkboxClassName?: string
  peepClassName?: string
  name?: string
  checked?: boolean
  required?: boolean
  onChange?: (e: { target: { name?: string; checked: boolean } }) => void
}

export const PeepCheckbox: React.FC<PeepCheckboxProps> = ({
  label,
  name,
  checked = false,
  peep,
  required,
  peepDelay,
  peepOn,
  onChange,
  peepClassName,
  labelClassName,
  checkboxClassName,
}) => {
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const [peepType, setPeepType] = useState<'info' | 'error' | 'success'>('info')

  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { trigger, delay } = usePeepConfig({ peepOn, peepDelay })
  const peepFn = peep ?? getAutoPeepStrategy(name, required)
  const runPeep = usePeepRunner(
    peepFn,
    checked ? 'true' : '',
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

  const handleChange = () => {
    onChange?.({ target: { name, checked: !checked } })
  }

  return (
    <div className={cx('peep-checkbox')}>
      <label className={cx(styles['checkbox-label'], labelClassName)}>
        <input
          type='checkbox'
          name={name}
          checked={checked}
          onChange={handleChange}
          className={cx(styles.checkbox, checkboxClassName)}
        />
        <span>{label}</span>
      </label>
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
