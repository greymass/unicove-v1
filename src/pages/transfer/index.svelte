<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {TinroRouteMeta} from 'tinro'
    import type {LinkSession} from 'anchor-link'

    import {onMount} from 'svelte'
    import {derived} from 'svelte/store'
    import {Name} from 'anchor-link'

    import {activeBlockchain, activeSession} from '~/store'
    import type {Token, TokenKeyParams} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import {balances, makeBalanceKey} from '~/stores/balances'
    import {tokens, makeTokenKey} from '~/stores/tokens'
    import {systemTokenKey} from '~/stores/tokens'
    import {transferData, Step} from '~/pages/transfer/transfer'
    import {syncTxFee, stopSyncTxFee, fetchTxFee} from '~/pages/transfer/fio'

    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import TransactionForm from '~/components/elements/form/transaction.svelte'
    import Page from '~/components/layout/page.svelte'

    import TransferMain from '~/pages/transfer/main.svelte'

    export let meta: TinroRouteMeta | undefined = undefined

    onMount(() => {
        resetData()
        syncTxFee()
        return () => {
            stopSyncTxFee()
        }
    })

    const token: Readable<Token | undefined> = derived(
        [activeSession, systemTokenKey, transferData, tokens],
        ([$activeSession, $systemTokenKey, $transferData, $tokens]) => {
            if ($activeSession && $systemTokenKey && $tokens) {
                // If this transfer session data has a token key, use it first
                if ($transferData.tokenKey) {
                    return $tokens.find((t) => t.key === $transferData.tokenKey)
                }
                // If the URL has a token key, use it second
                if (meta) {
                    const params: TokenKeyParams = {
                        chainId: $activeBlockchain!.chainId,
                        contract: Name.from(meta.params.contract),
                        name: Name.from(meta.params.token),
                    }
                    const key = makeTokenKey(params)
                    return $tokens.find((t) => t.key === key)
                }
                // Otherwise return the system token key
                return $tokens.find((t) => t.key === $systemTokenKey)
            }
        }
    )

    const balance: Readable<Balance | undefined> = derived(
        [activeSession, balances, token],
        ([$activeSession, $currentBalances, $token]) => {
            if ($token) {
                const key = makeBalanceKey($token, $activeSession!.auth.actor)
                return $currentBalances.find((b) => b.key === key)
            }
        }
    )

    let currentSession: LinkSession | undefined = undefined

    $: {
        if ($activeSession !== currentSession) {
            resetData()

            currentSession = $activeSession
        }
    }

    function resetData() {
        transferData.set({
            step: Step.Recipient,
        })
        fetchTxFee()
    }

    function retryCallback() {
        // Upon retry, move back to the confirm step to allow the user to retry
        $transferData.step = Step.Confirm
    }

    function resetCallback() {
        // Upon retry, move back to the confirm step to allow the user to retry
        $transferData.step = Step.Recipient
    }
</script>

<style type="scss">
    .container {
        border: 1px solid var(--light-blue);
        border-radius: 20px;
        padding: 26px;
    }
    .options {
        display: inline-flex;
        padding: 15px 30px;
        text-align: right;
        .toggle {
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
            padding: 15px;
            cursor: pointer;
            color: var(--main-blue);
            opacity: 0.3;
            &.active {
                opacity: 1;
            }
            :global(.icon) {
                margin-right: 0.5em;
            }
        }
    }
    @media only screen and (max-width: 600px) {
        .container {
            border: none;
            padding: 12px;
        }
    }
</style>

<Page>
    <span slot="submenu">
        <div class="options">
            <span
                class="toggle"
                class:active={$transferData.step !== Step.Receive}
                on:click={() => ($transferData.step = Step.Recipient)}
            >
                <Icon name="arrow-up" />
                <Text>Send</Text>
            </span>
            <span
                class="toggle"
                class:active={$transferData.step === Step.Receive}
                on:click={() => ($transferData.step = Step.Receive)}
            >
                <Icon name="arrow-down" />
                <Text>Receive</Text>
            </span>
        </div>
    </span>
    <TransactionForm {resetCallback} {retryCallback} completeAction="New transfer">
        <div class="container">
            <TransferMain {balance} {token} {resetData} />
        </div>
    </TransactionForm>
</Page>
