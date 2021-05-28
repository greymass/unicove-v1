<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import {tokens} from '~/stores/tokens'

    import {Step, transferData} from '~/pages/transfer/transfer'

    import TokenSelector from '~/components/elements/input/token/selector.svelte'

    export let token: Token
    export let balance: Readable<Balance | undefined>

    function changeToken(token) {
        console.log({token})
    }
</script>

<style type="scss">
    .control {
        margin-left: auto;
        :global(.button) {
            line-height: 24px;
        }
    }
</style>

<div class="control">
    <TokenSelector
      defaultToken={token}
      tokens={$tokens}
      onTokenSelect={changeToken}
    />
</div>
