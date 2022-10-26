<script>
    import {writable} from 'svelte/store'
    import Button from '~/components/elements/button.svelte'
    import {generateWidget} from '~/lib/token-purchase'
    import {activeSession, activeBlockchain} from '~/store'

    import Modal from '~/components/elements/modal.svelte'

    let displayModal = writable<boolean>(false)

    $: shouldDisplayButton = $activeBlockchain?.id === 'eos'

    let loadingPopup = false
    let tokenPurchaseUrl

    function handleBuyingTokens() {
        loadingPopup = true

        generateWidget($activeSession?.auth?.actor).then(({ widgetUrl }) => {
                tokenPurchaseUrl = widgetUrl
                $displayModal = true
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                loadingPopup = false
            })
    }

    function handleClose() {
        const confirmed = window.confirm('Are you sure you want to close this modal and end the token purchase?')

        console.log({confirmed})
        if (confirmed) {
            $displayModal = false

            tokenPurchaseUrl = undefined
        }
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
        <iframe src={tokenPurchaseUrl} width="100%" height="100%" />
    </Modal>

    <div class="buy-tokens-button">
        <Button on:action={handleBuyingTokens} style="primary">
            {loadingPopup ? 'Loading...' : 'Buy Tokens'}
        </Button>
    </div>
{/if}
