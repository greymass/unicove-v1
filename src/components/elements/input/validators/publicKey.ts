import {PublicKey} from '@greymass/eosio'

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
