import {PublicKey} from 'anchor-link'

export function validatePublicKey(value: string) {
    try {
        PublicKey.from(value)
    } catch (error) {
        throw {
            valid: false,
            message: 'Invalid public key.',
        }
    }
}
