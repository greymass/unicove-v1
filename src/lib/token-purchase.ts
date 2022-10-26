import type {Name} from '@greymass/eosio'

import {addToast} from '~/stores/toast'

const creationServiceUrl = import.meta.env.SNOWPACK_PUBLIC_WHALESPLAINER_URL
const unicoveUrl = import.meta.env.SNOWPACK_PUBLIC_UNICOVE_URL

const tokenOrderUrl = `${creationServiceUrl}/api/tokens/order`

export const openPopupForAccount = async (accountName: Name | undefined): Promise<void> => {
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
            }),
        })

        whalesplainerTokenOrder = await whalesplainerTokenOrderResponse.json()

        console.log({whalesplainerTokenOrder})
    } catch (error) {
        addToast({
            title: 'An error occurred when creating your order.',
            message: error.message,
        })
    }

    const checkoutUrl = whalesplainerTokenOrder?.data?.order?.checkout_url

    const popup =
        checkoutUrl &&
        window.open(
            checkoutUrl,
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
