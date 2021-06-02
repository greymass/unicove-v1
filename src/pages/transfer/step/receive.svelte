<script lang="ts">
    import {activeBlockchain, currentAccount} from '~/store'

    import Button from '~/components/elements/button.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import Clipboard from '~/components/elements/clipboard.svelte'
</script>

<style type="scss">
    .container {
        text-align: center;
    }
    h2,
    p {
        line-height: 2em;
    }
    h2 {
        font-size: 2em;
        margin: 0.5em 0;
    }
    p {
        color: var(--light-grey);
        margin-top: 1em;
    }
</style>

{#if $currentAccount}
    <div class="container">
        <h2>{$currentAccount.account_name}</h2>
        <Clipboard text={$currentAccount.account_name} let:copy>
            <Button on:action={copy} primary>
                <Icon name="clipboard" />
                <Text>Copy to clipboard</Text>
            </Button>
        </Clipboard>
        <p>
            To receive tokens on {$activeBlockchain.name}, send them directly to your account name
            as shown above.
        </p>
    </div>
{/if}
