<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'
    import type {Token} from '~/stores/tokens'

    import {tokens} from '~/stores/tokens'
    import {balances} from '~/stores/balances'

    import {Step, transferData} from '~/pages/transfer/transfer'

    import TokenSelector from '~/components/elements/input/token/selector.svelte'

    export let token: Token

    interface TokenWithBalance extends Token {
      balance: Balance
    }

    let tokensWithBalances: TokenWithBalance[] = []
    let tokenWithBalance: TokenWithBalance | undefined = undefined

    $: {
      tokensWithBalances = $tokens.map(token => {
        const balance = $balances.find(balance => balance.tokenKey === token.key)
        return {
          ...token,
          balance: balance.quantity,
        }
      });

      tokenWithBalance = tokensWithBalances.find(tokenWithBalance => tokenWithBalance.name === token.name)
    }

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
      tokens={tokensWithBalances}
      onTokenSelect={changeToken}
    />
</div>
