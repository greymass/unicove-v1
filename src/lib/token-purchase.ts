import type {Name} from '@greymass/eosio'

import {addToast} from '~/stores/toast'

const creationServiceUrl = import.meta.env.SNOWPACK_PUBLIC_WHALESPLAINER_URL
const unicoveUrl = import.meta.env.SNOWPACK_PUBLIC_UNICOVE_URL

const tokenOrderUrl = `${creationServiceUrl}/api/tokens/order`

interface WidgetData {
    widgetUrl: URL
    order: {
        [key: string]: any
    }
}

export const generateWidget = async (accountName: Name | undefined): Promise<WidgetData | void> => {
    let whalesplainerTokenOrderResponse
    let whalesplainerTokenOrder

    try {
        whalesplainerTokenOrderResponse = await fetch(tokenOrderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wallet_address: accountName?.toString(),
                account_reference: accountName?.toString(),
                fiat_code: 'USD',
                coin_code: 'EOS',
                return_url_on_success: unicoveUrl,
                iframe_domain: unicoveUrl,
            }),
        })

        whalesplainerTokenOrder = await whalesplainerTokenOrderResponse.json()
    } catch (error) {
        addToast({
            title: 'An error occurred when creating your order.',
            message: error.message,
        })
    }

    const widgetUrl = whalesplainerTokenOrder?.data?.order?.checkout_url

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
