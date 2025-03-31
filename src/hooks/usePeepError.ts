export const usePeepError = (name?: string): string | undefined => {
  if (!name) return undefined

  try {
    // Dynamically import react-hook-form only if it's installed
    const { useFormContext } = require('react-hook-form') as {
      useFormContext: () => { formState: { errors: Record<string, any> } }
    }

    const { formState } = useFormContext()
    const fieldError = formState?.errors?.[name]

    if (
      fieldError &&
      typeof fieldError === 'object' &&
      'message' in fieldError
    ) {
      return fieldError.message as string
    }
  } catch (err) {
    // react-hook-form not installed or not in context — silently ignore
    return undefined
  }

  return undefined
}
