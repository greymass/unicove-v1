const branch = import.meta.env.SNOWPACK_PUBLIC_BRANCH || 'local'
const rev = import.meta.env.SNOWPACK_PUBLIC_REV || 'head'

/** App identifier, used for anchor link (session persistence). */
export const appId = branch !== 'deploy' ? `w.${branch}.gm` : 'wallet.gm'

export const version = `${branch}-${rev}`

interface ChainConfig {
    /** Short identifier. */
    id: string
    /** Display name. */
    name: string
    /** Chain ID. */
    chainId: string
    /** Node URL to use. */
    nodeUrl: string
}

/** Supported chains. */
export const chains: ChainConfig[] = [
    {
        id: 'eos',
        name: 'EOS',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        nodeUrl: 'https://eos.greymass.com',
    },
    {
        id: 'jungle3',
        name: 'Jungle 3 (Testnet)',
        chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        nodeUrl: 'https://jungle3.greymass.com',
    },
]
