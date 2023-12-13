import {Asset, Name} from 'anchor-link'

import type {ChainConfig} from '~/config'
import {makeTokenKey, Token} from '~/stores/tokens'
import {Balance, makeBalanceKey} from '~/stores/balances'

import type {BalanceProvider} from './types'

interface RawTokenBalance {
    currency: string
    amount: number
    usd_value: number
    decimals: number
    contract: string
    metadata: {
        logo?: string
    }
}

export class BloksProvider implements BalanceProvider {
    chain: ChainConfig

    constructor(chain: ChainConfig) {
        this.chain = chain
    }

    async fetchBalances(account: Name): Promise<Balance[]> {
        const data = await this.fetchData(account)
        const balances = this.parseTokenBalances(account, data)
        return balances
    }

    async fetchData(account: Name) {
        //Example: https://www.api.bloks.io/account/teamgreymass?type=getAccountTokens&coreSymbol=4,EOS
        const apiUrl = `https://www.api.bloks.io${
            this.chain.id === 'eos' ? '' : `/${this.chain.id}`
        }/account/${account}?type=getAccountTokens&coreSymbol=${this.chain.coreTokenSymbol}`

        return await fetch(apiUrl)
            .then(async (response) => {
                const jsonBody =
                    response &&
                    (await response.json().catch((error) => {
                        console.warn(
                            'An error occured while parsing the token balances response body:',
                            {
                                error,
                            }
                        )
                    }))
                return jsonBody.tokens
            })
            .catch((error) => {
                console.warn('An error occured while fetching token balances:', {error})
                return []
            })
    }

    parseTokenBalances(account: Name, balances: RawTokenBalance[]) {
        return balances.map((balance) => {
            const symbol: Asset.Symbol = Asset.Symbol.from(
                `${balance.decimals},${balance.currency}`
            )
            const token = this.parseTokenInfo(balance)
            const asset = Asset.from(balance.amount || 0, symbol)
            const key = makeBalanceKey(token, account)
            const record: Balance = {
                key,
                chainId: this.chain.chainId,
                account: account,
                contract: Name.from(token.contract),
                tokenKey: token.key,
                quantity: asset,
            }
            return record
        })
    }

    parseTokenInfo(balance: RawTokenBalance): Token {
        const symbol: Asset.Symbol = Asset.Symbol.from(`${balance.decimals},${balance.currency}`)
        const key = makeTokenKey({
            chainId: this.chain.chainId,
            contract: balance.contract,
            name: symbol.name,
        })
        return {
            key,
            chainId: this.chain.chainId,
            contract: balance.contract,
            symbol: symbol,
            name: symbol.name,
        }
    }
}
