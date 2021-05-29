<script lang="ts">
    import {Asset} from '@greymass/eosio'

    import type {Balance} from '~/stores/balances'
    import type {Token, TokenWithBalance} from '~/stores/tokens'
    import type {Readable} from 'svelte/store'
    import type {Balance} from '~/stores/balances'

    import InputAsset from '~/components/elements/input/asset.svelte'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'

    import {transferData, Step} from '~/pages/transfer/transfer'

    import {tokens} from '~/stores/tokens'
    import {balances} from '~/stores/balances'

    import TokenSelector from '~/components/elements/input/token/selector.svelte'

    export let balance: Readable<Balance | undefined>
    export let token: Token

    let tokensWithBalances: TokenWithBalance[] = []
    let tokenWithBalance: TokenWithBalance | undefined = undefined

    let amount: string = String(($transferData.quantity && $transferData.quantity.value) || '')
    let amountValid: boolean = false

    $: {
        tokensWithBalances = $tokens.map((token) => {
            const balance = $balances.find((balance) => balance.tokenKey === token.key)
            return {
                ...token,
                balance: balance.quantity,
            }
        })

        tokenWithBalance = tokensWithBalances.find(
            (tokenWithBalance) => tokenWithBalance.name === token.name
        )
    }

    function changeToken(token) {
        transferData.update((data) => ({
            ...data,
            quantity: undefined,
            tokenKey: token.key,
        }))

        amount = ''
        amountValid = false
    }

    function confirmChange() {
        transferData.update((data) => ({
            ...data,
            quantity: Asset.from(Number(amount), token.symbol),
            step: data.backStep || Step.Confirm,
            backStep: undefined,
        }))
    }

    function maxBalance() {
        if ($balance) {
            amount = String($balance.quantity.value)
            amountValid = true
        }
    }
</script>

<style type="scss">
    .token-selector {
        margin-bottom: 32px;
    }
    .controls {
        display: flex;
        padding: 1em;
        .actions {
            cursor: pointer;
            margin-left: auto;
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 10px;
            line-height: 12px;
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.1px;
            text-transform: uppercase;
            color: var(--main-blue);
            user-select: none;
            -webkit-user-select: none;
        }
        .value {
            font-family: Inter;
            font-style: normal;
            font-weight: 600;
            font-size: 10px;
            line-height: 12px;
            display: flex;
            align-items: center;
            letter-spacing: 0.1px;
            text-transform: uppercase;
            color: var(--main-black);
        }
    }
</style>

<div class="container">
    {#if $balance}
        <Form on:submit={confirmChange}>
            <div class="token-selector">
                <TokenSelector
                    defaultToken={tokenWithBalance}
                    tokens={tokensWithBalances}
                    onTokenSelect={changeToken}
                />
            </div>
            <InputAsset
                bind:valid={amountValid}
                bind:value={amount}
                focus
                fluid
                name="amount"
                placeholder={`Enter amount of tokens`}
                balance={$balance.quantity}
            />
            <div class="controls">
                {#if token && token.price}
                    <div class="value">≈ $ {(Number(amount) * token.price).toFixed(2)} USD</div>
                {/if}
                <div class="actions">
                    <span on:click={maxBalance}>Entire Balance</span>
                </div>
            </div>
        </Form>
    {/if}
    <Button
        fluid
        primary
        size="large"
        disabled={!amountValid}
        formValidation
        on:action={confirmChange}
    >
        {#if $transferData.backStep}
            Done
        {:else}
            Continue
        {/if}
    </Button>
</div>
