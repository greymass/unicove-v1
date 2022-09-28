<script>
    import Button from "~/components/elements/button.svelte";
    import { openPopup } from "~/lib/token-purchase";
    import {activeSession, activeBlockchain} from "~/store";

    $: shouldDisplayButton = $activeBlockchain?.id === 'eos';
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
        <Button on:action={() => openPopup($activeSession?.auth?.actor)} style="primary">
            Buy Tokens
        </Button>
    </div>
{/if}
