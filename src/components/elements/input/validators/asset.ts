import {Asset} from '@greymass/eosio'

function unitsFromValue(value: string, symbol: Asset.Symbol) {
    return Math.floor(parseFloat(value) * Math.pow(10, symbol.precision))
}

export function validateBalance(value: string, balance: Asset) {
    const units = unitsFromValue(value, balance.symbol)

    if (units > Number(balance.units)) {
        throw {
            valid: false,
            message: 'Insufficient funds available.',
        }
    }
}

export function validateIsNumber(value: string, symbol: Asset.Symbol) {
    const units = unitsFromValue(value, symbol)
    const unitsAreNotNumber = isNaN(units)

    if (unitsAreNotNumber) {
        throw {
            valid: false,
            message: 'Should be a number.',
        }
    }
}

export function validateNonZero(value: string, symbol: Asset.Symbol) {
    const units = unitsFromValue(value, symbol)
    const isLessThanZero = Asset.fromUnits(units, symbol).value <= 0

    if (isLessThanZero) {
        throw {
            valid: false,
            message: 'Should be greater than zero.',
        }
    }
}
