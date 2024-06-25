export const rexIsAvailable = (chainData: ChainConfig | undefined): boolean => {
    return !!chainData?.rexEnabled
}
