import type { Name } from '@greymass/eosio'
import type { ChainId } from 'anchor-link'

import { addToast } from '~/stores/toast'
import type { ChainConfig } from '~/config'
import { chainConfig } from '~/config'

const creationServiceUrl = import.meta.env.SNOWPACK_PUBLIC_WHALESPLAINER_URL
const unicoveUrl = import.meta.env.SNOWPACK_PUBLIC_UNICOVE_URL

const tokenOrderUrl = `${creationServiceUrl}/api/tokens/order`

interface WidgetData {
    widgetUrl: string
    order: {
        [key: string]: any
    }
}

export const banxaIsAvailable = (chainData: ChainConfig): boolean => {
    return !!chainData?.banxaEnabled && !!chainData?.coreTokenSymbol
}

export const generateWidget = async (accountName: Name, targetChain: ChainId): Promise<WidgetData | void> => {
    let whalesplainerTokenOrderResponse
    let whalesplainerTokenOrder

    const chainData = chainConfig(targetChain)

    if (!banxaIsAvailable(chainData)) {
        throw new Error('Banxa token purchase not available for this chain.')
    }

    try {
        whalesplainerTokenOrderResponse = await fetch(tokenOrderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wallet_address: String(accountName),
                account_reference: String(accountName),
                fiat_code: 'USD',
                coin_code: chainData.coreTokenSymbol,
                return_url_on_success: unicoveUrl,
                return_url_on_failure: `${unicoveUrl}/banxa/failure`,
                iframe_domain: unicoveUrl.replace('https://', ''),
            }),
        })

        whalesplainerTokenOrder = await whalesplainerTokenOrderResponse.json()
    } catch (error) {
        addToast({
            title: 'An error occurred when creating your order.',
            message: error.message,
        })
    }

    const widgetUrl = whalesplainerTokenOrder?.data?.order?.checkout_iframe

    if (!widgetUrl) {
        return addToast({
            title: 'An error occurred when creating your order.',
            message: 'Unable to open token purchase modal.',
        })
    }

    return {
        widgetUrl,
        order: whalesplainerTokenOrder?.data?.order,
    }
}
