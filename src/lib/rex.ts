import type {ChainConfig} from '~/config'

export const rexIsAvailable = (chainData: ChainConfig | undefined): boolean => {
    return !!chainData?.rexEnabled
}
