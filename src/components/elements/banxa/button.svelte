<script>
    import {writable} from 'svelte/store'
    import Button from '~/components/elements/button.svelte'
    import {generateWidget} from '~/lib/banxa'
    import {activeSession, activeBlockchain} from '~/store'

    import Modal from '~/components/elements/modal.svelte'

    let displayModal = writable<boolean>(false)
    let allowClose = false

    $: shouldDisplayButton = $activeBlockchain?.id === 'eos'

    let loadingPopup = false
    let tokenPurchaseUrl: string | undefined

    function handleBuyingTokens() {
        loadingPopup = true

        generateWidget($activeSession?.auth?.actor)
            .then((widgetData) => {
                tokenPurchaseUrl = widgetData?.widgetUrl

                $displayModal = true
                allowClose = false
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                loadingPopup = false
            })
    }

    function setupIframeListener() {
        window.addEventListener('message', (e) => {
            const data = e.data

            if (data.command === 'close') {
                $displayModal = false
            } else if (data.command === 'allow-close') {
                allowClose = true
            }
        })
    }

    function handleClose() {
        if (allowClose) {
            return close()
        }
        const confirmed = window.confirm(
            'Are you sure you want to close this modal and end the token purchase?'
        )

        if (!!confirmed) {
            close()
        }
    }

    function close() {
        $displayModal = false
        allowClose = true

        tokenPurchaseUrl = undefined
    }
</script>

<style type="scss">
    .buy-tokens-button {
        display: flex;
        align-items: center;
        padding: 10px;
        width: 100%;
    }

    .warning-container {
        display: absolute;
        height: 10%;
        width: 100%;
        bottom: 0;
        left: 0;
    }

    h2 {
        text-align: center;
        margin: 10px 0;

        a {
            color: var(--main-blue);
            text-decoration: none;
        }
    }
</style>

{#if shouldDisplayButton}
    <Modal
        header="Tokens Purchase"
        size="large"
        delegateClose
        onClose={handleClose}
        bind:display={displayModal}
    >
        <iframe
            on:load={setupIframeListener}
            id="banxa-widget"
            src={tokenPurchaseUrl}
            width="100%"
            height="90%"
        />

        <h2>This service is provided by <a href="https://banxa.com/">Banxa</a></h2>
    </Modal>

    <div class="buy-tokens-button">
        <Button size="large" style="secondary" on:action={handleBuyingTokens}>
            {loadingPopup ? 'Loading...' : 'Banxa'}
        </Button>
    </div>
{/if}
