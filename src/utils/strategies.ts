import { PeepMessage } from '../types/peep'

export function getAutoPeepStrategy(
  name?: string,
  required?: boolean
): (value: string) => PeepMessage {
  return (value: string) => {
    const v = value.trim()

    if (required && !v) {
      return { message: '필수 입력입니다.', type: 'error' }
    }

    if (!name || !v) return ''

    if (name === 'email') {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      return valid
        ? ''
        : { message: '올바른 이메일 형식이 아닙니다.', type: 'error' }
    }

    if (name === 'phone') {
      const valid = /^[0-9\-+\s()]+$/.test(v)
      return valid
        ? ''
        : { message: '전화번호 형식이 올바르지 않습니다.', type: 'error' }
    }

    if (name === 'name' || name === 'nickname' || name === 'username') {
      return v.length >= 2
        ? ''
        : { message: '2자 이상 입력해주세요.', type: 'error' }
    }

    if (name === 'url' || name === 'website') {
      try {
        new URL(v)
        return ''
      } catch {
        return { message: '올바른 URL 형식이 아닙니다.', type: 'error' }
      }
    }

    if (name === 'postalCode' || name === 'zip') {
      const valid = /^[0-9]{5,6}$/.test(v)
      return valid
        ? ''
        : { message: '우편번호 형식이 올바르지 않습니다.', type: 'error' }
    }

    return ''
  }
}
