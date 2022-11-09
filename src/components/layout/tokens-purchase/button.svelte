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
    let tokenPurchaseUrl

    function handleBuyingTokens() {
        loadingPopup = true

        generateWidget($activeSession?.auth?.actor).then(({ widgetUrl }) => {
            tokenPurchaseUrl = 'http://localhost:8080/banxa/success' // widgetUrl

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
        window.addEventListener("message", (e) => {
            const data = e.data;

            if (data.command === "close") {
                $displayModal = false
            } else if (data.command === "allow-close") {
                allowClose = true
            }
        });
    }

    function handleClose() {
        if (allowClose) {
            close()
        }
        const confirmed = window.confirm('Are you sure you want to close this modal and end the token purchase?')

        if (confirmed) {
            close()
        }
    }

    close() {
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
    }
</style>

{#if shouldDisplayButton}
    <Modal header="Tokens Purchase" size="large" delegateClose onClose={handleClose} bind:display={displayModal}>
        <iframe on:load={setupIframeListener} id="banxa-widget" src={tokenPurchaseUrl} width="100%" height="100%" />
    </Modal>

    <div class="buy-tokens-button">
        <Button on:action={handleBuyingTokens} style="primary">
            {loadingPopup ? 'Loading...' : 'Buy Tokens'}
        </Button>
    </div>
{/if}
