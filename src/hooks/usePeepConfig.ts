import { usePeepContext } from './usePeepContext'
import { PeepTrigger } from '../types/peep'

export const usePeepConfig = ({
  peepOn,
  peepDelay,
}: {
  peepOn?: PeepTrigger
  peepDelay?: number
}) => {
  const context = usePeepContext()
  const trigger: PeepTrigger =
    peepOn ?? (context?.showOnFocus ? 'focus' : 'input')
  const delay = peepDelay ?? context?.peepDelay ?? 0
  return { trigger, delay }
}
