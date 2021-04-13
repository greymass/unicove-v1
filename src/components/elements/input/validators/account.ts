export function validateAccountLength(value: string) {
    if (value.length > 12) {
        throw {
            valid: false,
            message: 'Should be 12 characters or less.',
        }
    }
}
