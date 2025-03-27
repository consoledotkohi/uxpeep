import React, { useState, useEffect, InputHTMLAttributes, useRef } from 'react'
import { usePeepContext } from './context'

type PeepTrigger = 'focus' | 'input' | 'always'

type PeepFieldProps = {
  label?: string
  peep?: (value: string) => string
  peepDelay?: number
  peepOn?: PeepTrigger
} & InputHTMLAttributes<HTMLInputElement>

export const PeepField: React.FC<PeepFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  peep,
  peepDelay,
  peepOn,
  onChange,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [showPeep, setShowPeep] = useState(false)
  const [peepMessage, setPeepMessage] = useState('')
  const context = usePeepContext()
  const delayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const delay = peepDelay ?? context?.peepDelay ?? 0
  const trigger: PeepTrigger =
    peepOn ?? (context?.showOnFocus ? 'focus' : 'input')

  const runPeep = () => {
    if (peep) {
      const msg = peep(String(value))
      setPeepMessage(msg)
      setShowPeep(!!msg)
    }
  }

  // Trigger logic
  useEffect(() => {
    if (trigger === 'input') {
      if (delayTimeout.current) clearTimeout(delayTimeout.current)
      delayTimeout.current = setTimeout(() => runPeep(), delay)
    } else if (trigger === 'always') {
      runPeep()
    }
    // cleanup
    return () => {
      if (delayTimeout.current) clearTimeout(delayTimeout.current)
    }
  }, [value, trigger, peep, delay])

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
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {showPeep && peepMessage && (
        <div
          className='peep-hint'
          style={{ fontSize: '0.875rem', color: context?.peepColor ?? '#888' }}
        >
          {peepMessage}
        </div>
      )}
    </div>
  )
}
