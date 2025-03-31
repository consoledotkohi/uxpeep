import React, { useState, useEffect, useRef } from 'react'
import { cx } from '../utils/classnames'
import { getAutoPeepStrategy } from '../utils/strategies'
import { usePeepConfig } from '../hooks/usePeepConfig'
import { usePeepRunner } from '../hooks/usePeepRunner'
import { PeepTrigger, PeepMessage } from '../types/peep'

export type SelectOption = {
  label: string
  value: string
}

export type PeepSelectProps = {
  label?: string
  name?: string
  value?: string
  options: SelectOption[]
  required?: boolean
  peep?: (value: string) => PeepMessage
  peepDelay?: number
  peepOn?: PeepTrigger
  labelClassName?: string
  selectClassName?: string
  peepClassName?: string
  onChange?: (e: { target: { name?: string; value: string } }) => void
}

export const PeepSelect: React.FC<PeepSelectProps> = ({
  label,
  name,
  value = '',
  options,
  required,
  peep,
  peepDelay,
  peepOn,
  labelClassName,
  selectClassName,
  peepClassName,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const [peepType, setPeepType] = useState<'info' | 'error' | 'success'>('info')

  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { trigger, delay } = usePeepConfig({ peepOn, peepDelay })

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
  }, [value, trigger, delay])

  const handleSelect = (val: string) => {
    onChange?.({ target: { name, value: val } })
    setOpen(false)
  }

  const selectedLabel = options.find((opt) => opt.value === value)?.label || ''

  return (
    <div className='peep-select'>
      {label && (
        <label htmlFor={name} className={`peep-label ${labelClassName}`}>
          {label}
        </label>
      )}
      <div
        className={`select-box ${
          open && 'select-box--open'
        } ${selectClassName}`}
      >
        <button
          type='button'
          className='trigger'
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedLabel || '선택해주세요'}
        </button>
        {open && (
          <ul className='options'>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`option ${value === opt.value && 'selected'}`}
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
          className={`peep-message peep-message--${peepType} ${peepClassName}`}
        >
          {peepMessage}
        </div>
      )}
    </div>
  )
}
