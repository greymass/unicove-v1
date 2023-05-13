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
    toEOSAddress(): string {
        // Implement your logic here
        return 'eosAddress'
    }

    // Returns the Ethereum address
    ethAddress(): string {
        return this._ethAddress
    }
}
