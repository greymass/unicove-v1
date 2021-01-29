<script lang="ts">
    import {Asset, Name, UInt64} from 'anchor-link'

    import {isRelease} from '../config'
    import {activeBlockchain, activeSession, currentAccount} from '../store'
    import {FIOTransfer, Transfer} from '../abi-types'

    import Page from '~/components/layout/page.svelte'

    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'
    import InputAsset from '~/components/elements/input/asset.svelte'
    import Form from '~/components/elements/form.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let toAccount = ''
    let toAddress = ''
    let value = ''
    let quantity = Asset.fromUnits(parseFloat(value), $activeBlockchain.coreTokenSymbol)
    let memo = ''
    let txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    // Set form data to valid data in dev mode
    if (!isRelease) {
        toAccount = 'teamgreymass'
        toAddress = 'FIO7hF6waZH6pBvVLrLj5ZLNTcUfcT6nNYiCVtYAmahnmzanqU1aA'
        value = '1'
        quantity = Asset.fromUnits(parseFloat(value), $activeBlockchain.coreTokenSymbol)
        memo = '🦄🧠🥌'
    }

    async function loadBalance() {
        ;[balance] = await $activeSession!.client.v1.chain.get_currency_balance(
            $activeBlockchain.coreTokenContract,
            $activeSession!.auth.actor
        )
    }

    $: if ($activeBlockchain.id === 'fio') {
        loadFee()
        loadBalance()
    } else {
        txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    }

    // TODO: find or build some form builder and validation instead
    //       sextant admin ui has the beginnings of one that can handle core types we could build on
    $: {
        let toName = Name.from(toAccount)
        toAccount = String(toName)
    }
    $: {
        let parsed = parseFloat(value)
        if (isNaN(parsed) || parsed === 0) {
            quantity = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
        } else {
            quantity = Asset.fromFloat(parsed, $activeBlockchain.coreTokenSymbol)
        }
    }
</script>

<style>
    table {
        border: 1;
    }
    table td {
        text-align: right;
    }
</style>

<Page title="Transfer">
    <p>
        You have <i
            on:click={() => {
                value = String(balance.value)
                quantity = Asset.fromUnits(value, $activeBlockchain.coreTokenSymbol)
            }}
        >
            {balance}
        </i>
    </p>
    <Form>
        Send
        <InputAsset name="amount" bind:value />
        to
        {#if $activeBlockchain.id === 'fio'}
            <Input name="to" bind:value={toAddress} />
        {:else}
            <InputAccount name="to" bind:value={toAccount} />
            with memo
            <Input name="memo" bind:value={memo} />
        {/if}
        {#if txfee.value > 0}
            <table>
                <tr>
                    <td>Sending:</td>
                    <td>{quantity}</td>
                </tr>
                <tr>
                    <td>Fee:</td>
                    <td>{txfee}</td>
                </tr>
                <tr>
                    <td>Total:</td>
                    <td
                        >{Asset.fromUnits(
                            quantity.units.toNumber() + txfee.units.toNumber(),
                            $activeBlockchain.coreTokenSymbol
                        )}</td
                    >
                </tr>
            </table>
        {/if}
        <Button formValidation on:action={transfer}>Go</Button>
    </Form>
</Page>
