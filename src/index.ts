import { PeepProvider } from './components/Provider'
import { PeepField } from './components/Field'
import { PeepTextarea } from './components/Textarea'
import { PeepSelect } from './components/Select'
import { PeepCheckbox } from './components/Checkbox'
import './index.css'

export const Peep = {
  Provider: PeepProvider,
  Field: PeepField,
  Textarea: PeepTextarea,
  Select: PeepSelect,
  Checkbox: PeepCheckbox,
}

export type { PeepFieldProps } from './components/Field'
export type { PeepTextareaProps } from './components/Textarea'
export type { PeepSelectProps } from './components/Select'
export type { PeepCheckboxProps } from './components/Checkbox'
