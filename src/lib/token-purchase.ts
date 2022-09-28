import type {Name} from '@greymass/eosio'

import {addToast} from '~/stores/toast'

const creationServiceUrl = import.meta.env.SNOWPACK_PUBLIC_WHALESPLAINER_URL
const unicoveUrl = import.meta.env.SNOWPACK_PUBLIC_UNICOVE_URL

const tokenOrderUrl = `${creationServiceUrl}/api/tokens/order`

export const openPopup = async (accountName: Name): Promise<void> => {
    let whalesplainerTokenOrderResponse
    let whalesplainerTokenOrder

    try {
        whalesplainerTokenOrderResponse = await fetch(tokenOrderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wallet_address: accountName.toString(),
                account_reference: accountName.toString(),
                fiat_code: 'USD',
                coin_code: 'EOS',
                return_url_on_success: unicoveUrl,
            }),
        })

        whalesplainerTokenOrder = await whalesplainerTokenOrderResponse.json()
    } catch (error) {
        addToast({
            title: 'An error occurred when creating your order.',
            message: error.message,
        })
    }

    const popup = window.open(
        whalesplainerTokenOrder.checkout_url,
        'targetWindow',
        `toolbar=no,
            location=no,
            status=no,
            menubar=no,
            scrollbars=yes,
            resizable=yes,
            width=400,
            height=600`
    )!
    if (popup) {
        popup.focus()
    } else {
        addToast({
            title: 'Unable to open token purchase popup.',
            message: 'Please make sure that popups are allowed for this website.',
        })
    }
}
