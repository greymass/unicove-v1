<script lang="ts">
    import {Asset, LinkSession, Name, UInt64} from 'anchor-link'

    import {activeBlockchain, activeSession, currentAccount} from '../store'
    import {FIOTransfer, Transfer} from '../abi-types'

    import Page from '~/components/layout/page.svelte'

    import type {returnType} from '~/components/elements/input.svelte'
    import Button from '~/components/elements/button.svelte'
    import Input from '~/components/elements/input.svelte'
    import InputAccount from '~/components/elements/input/account.svelte'

    $: balance =
        $currentAccount?.core_liquid_balance ||
        Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)
    let validFields = {
        to: false,
        amount: false,
        memo: true,
    }
    let validForm = false
    let toAccount = 'teamgreymass'
    let toAddress = 'FIO7hF6waZH6pBvVLrLj5ZLNTcUfcT6nNYiCVtYAmahnmzanqU1aA'
    let value = '0'
    let quantity = Asset.fromUnits(parseFloat(value), $activeBlockchain.coreTokenSymbol)
    let memo = '🦄🧠🥌'
    let txfee = Asset.fromUnits(0, $activeBlockchain.coreTokenSymbol)

    async function loadFee() {
        const fees = await $activeSession!.client.v1.chain.get_table_rows({
            code: 'fio.fee',
            table: 'fiofees',
            scope: 'fio.fee',
            key_type: 'i64',
            index_position: 'primary',
            lower_bound: UInt64.from(5),
            upper_bound: UInt64.from(5),
            limit: 1,
        })
        txfee = Asset.fromUnits(fees.rows[0].suf_amount, $activeBlockchain.coreTokenSymbol)
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

    function validate(data: returnType) {
        validFields[data.name] = data.valid
        validForm = Object.values(validFields).every((v) => v === true)
    }

    async function transfer() {
        // TODO: status display && error handling
        let data
        switch ($activeBlockchain.id) {
            case 'fio': {
                await loadFee()
                data = FIOTransfer.from({
                    payee_public_key: toAddress,
                    amount: quantity.units,
                    max_fee: txfee.units,
                    actor: $activeSession!.auth.actor,
                    tpid: 'tpid@greymass',
                })
                break
            }
            default: {
                data = Transfer.from({
                    from: $activeSession!.auth.actor,
                    to: toAccount,
                    quantity,
                    memo,
                })
                break
            }
        }
        await $activeSession!.transact({
            action: {
                authorization: [$activeSession!.auth],
                account: $activeBlockchain.coreTokenContract,
                name: $activeBlockchain.coreTokenTransfer,
                data,
            },
        })
        // adjust balance to reflect transfer
        switch ($activeBlockchain.id) {
            case 'fio': {
                balance.units = UInt64.from(
                    balance.units.toNumber() -
                        Asset.from(quantity).units.toNumber() -
                        Asset.from(txfee).units.toNumber()
                )
                break
            }
            default: {
                balance.units = UInt64.from(
                    balance.units.toNumber() - Asset.from(quantity).units.toNumber()
                )
                break
            }
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
            }}> {balance} </i>
    </p>
    <p>
        Send
        <Input onChange={validate} name="amount" bind:value />
        to
        {#if $activeBlockchain.id === 'fio'}
            <Input onChange={validate} name="to" bind:value={toAddress} />
        {:else}
            <InputAccount onChange={validate} name="to" bind:value={toAccount} />
            with memo
            <Input onChange={validate} name="memo" bind:value={memo} />
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
        <Button disabled={!validForm} on:click={transfer}>Go</Button>
    </p>
</Page>
