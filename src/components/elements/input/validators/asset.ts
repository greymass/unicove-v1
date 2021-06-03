import {Asset} from '@greymass/eosio'

export function validateBalance(value: string, balance: Asset) {
    const {units} = Asset.from(Number(value), balance.symbol)
    if (Number(units) > Number(balance.units)) {
        throw {
            valid: false,
            message: 'Insufficient funds available.',
        }
    }
}

export function validateIsNumber(value: string, symbol: Asset.Symbol) {
    const {units} = Asset.from(Number(value), symbol)
    const unitsAreNotNumber = isNaN(Number(units))

    if (unitsAreNotNumber) {
        throw {
            valid: false,
            message: 'Should be a number.',
        }
    }
}

export function validateNonZero(value: string, symbol: Asset.Symbol) {
    const asset = Asset.from(Number(value), symbol)
    const isLessThanZero = asset.value <= 0

    if (isLessThanZero) {
        throw {
            valid: false,
            message: 'Should be greater than zero.',
        }
    }
}
