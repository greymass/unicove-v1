import {Asset, Name} from '@greymass/eosio'
import type {ChainId} from 'anchor-link'

const branch = import.meta.env.SNOWPACK_PUBLIC_BRANCH || 'local'
const rev = import.meta.env.SNOWPACK_PUBLIC_REV || 'head'

/** Only true in a production build. */
export const isRelease = branch === 'deploy'

/** App identifier, used for anchor link (session persistence). */
export const appId = !isRelease ? `w.${branch}.gm` : 'wallet.gm'

export const version = `${branch}-${rev}`

export enum ChainFeatures {
    /** eosio.namebid https://github.com/EOSIO/eosio.contracts/blob/master/contracts/eosio.system/src/name_bidding.cpp */
    BidName,
    /** eosio.buyram / eosio.buyrambytes https://github.com/EOSIO/eosio.contracts/blob/master/contracts/eosio.system/src/delegate_bandwidth.cpp#L43 */
    BuyRAM,
    /** FIO Bundled Transactions https://fio.wiki/knowledge-base/protocol/bundling-and-fees/ */
    FIOBundledFees,
    /** Fuel https://greymass.com/fuel */
    Fuel,
    /** eosio.powerup https://github.com/EOSIO/eosio.contracts/pull/397 */
    PowerUp,
    /** eosio.rentcpu / eosio.rentnet https://github.com/EOSIO/eosio.contracts/blob/master/contracts/eosio.system/src/powerup.cpp */
    REX,
    /** eosio.delegatebw https://github.com/EOSIO/eosio.contracts/blob/master/contracts/eosio.system/src/delegate_bandwidth.cpp#L372 */
    Staking,
    /** eosio.voteproducer https://github.com/EOSIO/eosio.contracts/blob/master/contracts/eosio.system/src/voting.cpp */
    VoteProducer,
}

export interface ChainConfig {
    /** Short identifier. */
    id: string
    /** Display name. */
    name: string
    /** Chain Features */
    chainFeatures: Set<ChainFeatures>
    /** Chain ID. */
    chainId: string
    /** System Token Contract Name */
    coreTokenContract: Name
    /** System Token Symbol */
    coreTokenSymbol: Asset.Symbol
    /** System Token Transfer Action */
    coreTokenTransfer: Name
    /** Node URL to use. */
    nodeUrl: string
    /** Bloks url  */
    bloksUrl: string
}

/** Supported chains. */
export const chains: ChainConfig[] = [
    {
        id: 'eos',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.REX,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
        ]),
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        coreTokenSymbol: Asset.Symbol.from('4,EOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'EOS',
        nodeUrl: 'https://eos.greymass.com',
        bloksUrl: 'https://bloks.io',
    },
    {
        id: 'fio',
        chainFeatures: new Set([ChainFeatures.FIOBundledFees, ChainFeatures.VoteProducer]),
        chainId: '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
        coreTokenSymbol: Asset.Symbol.from('9,FIO'),
        coreTokenContract: Name.from('fio.token'),
        coreTokenTransfer: Name.from('trnsfiopubky'),
        name: 'FIO',
        nodeUrl: 'https://fio.greymass.com',
        bloksUrl: 'https://fio.bloks.io',
    },
    {
        id: 'jungle3',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.PowerUp,
            ChainFeatures.REX,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
        ]),
        chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        coreTokenSymbol: Asset.Symbol.from('4,EOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Jungle 3 (Testnet)',
        nodeUrl: 'https://jungle3.greymass.com',
        bloksUrl: 'https://jungle3.bloks.io',
    },
    {
        id: 'telos',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.REX,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
        ]),
        chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        coreTokenSymbol: Asset.Symbol.from('4,TLOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Telos',
        nodeUrl: 'https://telos.greymass.com',
    },
]

export function chainConfig(chainId: ChainId): ChainConfig {
    return chains.find((c) => c.chainId === String(chainId))!
}
