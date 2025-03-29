export type PeepTrigger = 'focus' | 'input' | 'always'

export type PeepMessage =
  | string
  | {
      message: string
      type?: 'info' | 'error' | 'success'
    }
