import {TransferManager} from './transferManager'
import {TelosEvmCreate, TelosEvmOpenWallet, Transfer} from '~/abi-types'
import {Asset, Name} from 'anchor-link'
import {getTelosEvmAccount} from '~/lib/evm'

export class TelosEvmBridge extends TransferManager {
    static supportedChains = ['telos']
    static evmRequired = true

    get fromAddress() {
        return String(this.nativeSession.auth.actor)
    }

    get toAddress() {
        return this.evmSession.address
    }

    async transfer(amount: string) {
        const telosEvmAccount = await getTelosEvmAccount(this.nativeSession.auth.actor)

        const actions = []

        if (!telosEvmAccount) {
            actions.push(this.telosEvmCreate())
        }

        const transfer = Transfer.from({
            from: this.nativeSession.auth.actor,
            to: 'eosio.evm',
            quantity: String(Asset.fromFloat(Number(amount), '4,TLOS')),
            memo: this.evmSession.checksumAddress || '',
        })

        actions.push({
            authorization: [this.nativeSession.auth],
            account: Name.from('eosio.token'),
            name: Name.from('transfer'),
            data: transfer,
        })

        return this.nativeSession.transact({
            actions,
        })
    }

    telosEvmOpenWalletAction() {
        const action = TelosEvmOpenWallet.from({
            account: this.nativeSession.auth.actor,
            address: this.evmSession.checksumAddress,
            actor: this.nativeSession.auth.actor,
            permission: this.nativeSession.auth.permission,
        })

        return {
            authorization: [this.nativeSession.auth],
            account: Name.from('eosio.evm'),
            name: Name.from('openwallet'),
            data: action,
        }
    }

    telosEvmCreate() {
        const action = TelosEvmCreate.from({
            account: this.nativeSession.auth.actor,
            data: this.evmSession.checksumAddress,
            actor: this.nativeSession.auth.actor,
            permission: this.nativeSession.auth.permission,
        })

        return {
            authorization: [this.nativeSession.auth],
            account: Name.from('eosio.evm'),
            name: Name.from('create'),
            data: action,
        }
    }
}
