export const getLengthHint = (
  value: string,
  minLength?: number,
  maxLength?: number
): string | undefined => {
  const len = value?.length ?? 0

  if (minLength && len < minLength) {
    return `${minLength}자 이상 입력해주세요`
  }

  if (maxLength && len > maxLength) {
    return `${maxLength}자 이하로 입력해주세요`
  }

  return undefined
}
