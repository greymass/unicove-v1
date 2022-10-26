<script>
    import Button from '~/components/elements/button.svelte'
    import {openPopupForAccount} from '~/lib/token-purchase'
    import {activeSession, activeBlockchain} from '~/store'

    $: shouldDisplayButton = $activeBlockchain?.id === 'eos'

    let loadingPopup = false

    function handleBuyingTokens() {
        loadingPopup = true

        openPopupForAccount($activeSession?.auth?.actor)
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                loadingPopup = false
            })
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
    <div class="buy-tokens-button">
        <Button on:action={handleBuyingTokens} style="primary">
            {loadingPopup ? 'Loading...' : 'Buy Tokens'}
        </Button>
    </div>
{/if}
