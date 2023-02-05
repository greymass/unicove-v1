import {Asset, Name} from '@greymass/eosio'
import {Checksum256} from '@greymass/eosio'

const branch = import.meta.env.SNOWPACK_PUBLIC_BRANCH || 'local'
const rev = import.meta.env.SNOWPACK_PUBLIC_REV || 'head'
const ver = import.meta.env.SNOWPACK_PUBLIC_VERSION || 'unknown'

/** Only true in a production build. */
export const isRelease = branch === 'HEAD'

/** App identifier, used for anchor link (session persistence). */
export const appId = !isRelease
    ? `w.${branch.replace(/[^1-5a-z]+/g, '').slice(0, 7)}.gm`
    : 'wallet.gm'

export const version = `${ver} (${branch}-${rev})`
export const releaseVersion = `Version ${ver}`

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
    /** delphioracle https://github.com/eostitan/delphioracle */
    DelphiOracle,
}

// List of features involving resources
export const resourceFeatures = [
    ChainFeatures.Fuel,
    ChainFeatures.Staking,
    ChainFeatures.REX,
    ChainFeatures.PowerUp,
]

// Available Balance Providers
export enum BalanceProviders {
    // https://www.api.bloks.io/account/teamgreymass?type=getAccountTokens&coreSymbol=4,EOS
    Bloks,
}

export interface ChainConfig {
    /** Short identifier. */
    id: string
    /** Display name. */
    name: string
    /** Chain Features */
    chainFeatures: Set<ChainFeatures>
    /** Chain ID. */
    chainId: Checksum256
    /** System Token Contract Name */
    coreTokenContract: Name
    /** System Token Symbol */
    coreTokenSymbol: Asset.Symbol
    /** System Token Transfer Action */
    coreTokenTransfer: Name
    /** Node URL to use. */
    nodeUrl: string
    /** True if network is a testnet. */
    testnet: boolean
    /** Account to use for resource sampling */
    resourceSampleAccount?: string
    /** The number of milliseconds to base sample prices on */
    resourceSampleMilliseconds?: number
    /** Bloks url  */
    bloksUrl: string
    /** Available Balance Providers */
    balanceProviders?: Set<BalanceProviders>
    /** Is Banxa available for this chain */
    banxaEnabled?: boolean
    /** Banxa coin_code */
    banxa_coin_code?: string
}

/** Supported chains. */
export const chains: ChainConfig[] = [
    {
        id: 'eos',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.PowerUp,
            ChainFeatures.REX,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
            ChainFeatures.DelphiOracle,
        ]),
        chainId: Checksum256.from(
            'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
        ),
        coreTokenSymbol: Asset.Symbol.from('4,EOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'EOS',
        nodeUrl: 'https://eos.greymass.com',
        testnet: false,
        bloksUrl: 'https://bloks.io',
        balanceProviders: new Set([BalanceProviders.Bloks]),
        banxaEnabled: true,
    },
    {
        id: 'fio',
        chainFeatures: new Set([ChainFeatures.FIOBundledFees, ChainFeatures.VoteProducer]),
        chainId: Checksum256.from(
            '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c'
        ),
        coreTokenSymbol: Asset.Symbol.from('9,FIO'),
        coreTokenContract: Name.from('fio.token'),
        coreTokenTransfer: Name.from('trnsfiopubky'),
        name: 'FIO',
        nodeUrl: 'https://fio.greymass.com',
        testnet: false,
        bloksUrl: 'https://fio.bloks.io',
        balanceProviders: new Set([BalanceProviders.Bloks]),
    },
    {
        id: 'fio-testnet',
        chainFeatures: new Set([ChainFeatures.FIOBundledFees, ChainFeatures.VoteProducer]),
        chainId: Checksum256.from(
            'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e'
        ),
        coreTokenSymbol: Asset.Symbol.from('9,FIO'),
        coreTokenContract: Name.from('fio.token'),
        coreTokenTransfer: Name.from('trnsfiopubky'),
        name: 'FIO (Testnet)',
        nodeUrl: 'https://fiotestnet.greymass.com',
        testnet: true,
        bloksUrl: 'https://fio-test.bloks.io',
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
        chainId: Checksum256.from(
            '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840'
        ),
        coreTokenSymbol: Asset.Symbol.from('4,EOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Jungle 3 (Testnet)',
        nodeUrl: 'https://jungle3.greymass.com',
        testnet: true,
        bloksUrl: 'https://jungle3.bloks.io',
        balanceProviders: new Set([BalanceProviders.Bloks]),
    },
    {
        id: 'jungle4',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.PowerUp,
            ChainFeatures.REX,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
        ]),
        chainId: Checksum256.from(
            '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d'
        ),
        coreTokenSymbol: Asset.Symbol.from('4,EOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Jungle 4 (Testnet)',
        nodeUrl: 'https://jungle4.greymass.com',
        testnet: true,
        bloksUrl: 'https://eosauthority.com/?network=jungle',
    },
    {
        id: 'proton',
        chainFeatures: new Set([ChainFeatures.Staking, ChainFeatures.VoteProducer]),
        chainId: Checksum256.from(
            '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0'
        ),
        coreTokenSymbol: Asset.Symbol.from('4,XPR'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Proton',
        nodeUrl: 'https://proton.greymass.com',
        testnet: false,
        bloksUrl: 'https://proton.bloks.io',
        balanceProviders: new Set([BalanceProviders.Bloks]),
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
        chainId: Checksum256.from(
            '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
        ),
        coreTokenSymbol: Asset.Symbol.from('4,TLOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Telos',
        nodeUrl: 'https://telos.greymass.com',
        resourceSampleAccount: 'greymassfuel',
        resourceSampleMilliseconds: 1000,
        testnet: false,
        bloksUrl: 'https://telos.bloks.io',
        balanceProviders: new Set([BalanceProviders.Bloks]),
    },
    {
        id: 'telos-testnet',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.REX,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
        ]),
        chainId: Checksum256.from(
            '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f'
        ),
        coreTokenSymbol: Asset.Symbol.from('4,TLOS'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'Telos (Testnet)',
        nodeUrl: 'https://testnet.telos.net',
        resourceSampleAccount: 'greymassfuel',
        resourceSampleMilliseconds: 1000,
        testnet: true,
        bloksUrl: 'https://telos-test.bloks.io',
        balanceProviders: new Set([BalanceProviders.Bloks]),
    },
    {
        id: 'wax',
        chainFeatures: new Set([
            ChainFeatures.BidName,
            ChainFeatures.BuyRAM,
            ChainFeatures.Fuel,
            ChainFeatures.Staking,
            ChainFeatures.VoteProducer,
            ChainFeatures.DelphiOracle,
        ]),
        chainId: Checksum256.from(
            '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'
        ),
        coreTokenSymbol: Asset.Symbol.from('8,WAX'),
        coreTokenContract: Name.from('eosio.token'),
        coreTokenTransfer: Name.from('transfer'),
        name: 'WAX',
        banxa_coin_code: 'WAXP',
        nodeUrl: 'https://wax.greymass.com',
        resourceSampleAccount: 'teamgreymass',
        testnet: false,
        bloksUrl: 'https://wax.bloks.io',
        banxaEnabled: true,
    },
]

export function chainConfig(chainId: Checksum256): ChainConfig {
    return chains.find((c) => c.chainId.equals(chainId))!
}
