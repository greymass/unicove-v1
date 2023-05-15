import BN from 'bn.js'

export class EthAccount {
    private _ethAddress: string

    static from(ethAddress: string) {
        // Implement your logic here
        return new EthAccount(ethAddress)
    }

    constructor(ethAddress: string) {
        this._ethAddress = ethAddress
    }

    // Placeholder for the function to convert Ethereum address to EOS address
    convertToEvmAddress(eosAccountName: string): string {
        const blockList = ['binancecleos', 'huobideposit', 'okbtothemoon']
        if (blockList.includes(eosAccountName)) {
            throw new Error('This CEX has not fully support the EOS-EVM bridge yet.')
        }
        return convertToEthAddress(eosAccountName)
    }

    // Returns the Ethereum address
    ethAddress(): string {
        return this._ethAddress
    }
}

function convertToEthAddress(eosAddress: string) {
    try {
        return uint64ToAddr(strToUint64(eosAddress))
    } catch (err) {
        return err
    }
}

function charToSymbol(c: string) {
    const a = 'a'.charCodeAt(0)
    const z = 'z'.charCodeAt(0)
    const one = '1'.charCodeAt(0)
    const five = '5'.charCodeAt(0)
    const charCode = c.charCodeAt(0)
    if (charCode >= a && charCode <= z) {
        return charCode - a + 6
    }
    if (charCode >= one && charCode <= five) {
        return charCode - one + 1
    }
    if (c === '.') {
        return 0
    }
    throw new Error('Address include illegal character')
}

function strToUint64(str: string) {
    var n = new BN(0)
    var i = str.length
    if (i >= 13) {
        // Only the first 12 characters can be full-range ([.1-5a-z]).
        i = 12

        // The 13th character must be in the range [.1-5a-j] because it needs to be encoded
        // using only four bits (64_bits - 5_bits_per_char * 12_chars).
        n = new BN(charToSymbol(str[12]))
        if (n.gte(new BN(16))) {
            throw new Error('Invalid 13th character')
        }
    }
    // Encode full-range characters.

    while (--i >= 0) {
        n = n.or(new BN(charToSymbol(str[i])).shln(64 - 5 * (i + 1)))
    }
    return n.toString(16, 16)
}

function uint64ToAddr(str: string) {
    return '0xbbbbbbbbbbbbbbbbbbbbbbbb' + str
}
