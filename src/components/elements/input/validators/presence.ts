export function validatePresence(value: string) {
    if (value.length === 0) {
        throw {
            valid: false,
            message: undefined,
        }
    }
}
