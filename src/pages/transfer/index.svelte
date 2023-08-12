<script lang="ts">
    import type {Readable} from 'svelte/store'
    import type {TinroRouteMeta} from 'tinro'

    import {Name} from '@wharfkit/antelope'
    import {onMount} from 'svelte'
    import {derived} from 'svelte/store'
    import {router} from 'tinro'

    import {activeBlockchain, activeSession} from '~/store'
    import type {Token, TokenKeyParams} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import {balances, makeBalanceKey} from '~/stores/balances'
    import {tokens, makeTokenKey} from '~/stores/tokens'
    import {systemTokenKey} from '~/stores/tokens'
    import {transferData, Step} from '~/pages/transfer/transfer'
    import {syncTxFee, stopSyncTxFee, fetchTxFee} from '~/pages/transfer/fio'

    import Text from '~/components/elements/text.svelte'
    import TransactionForm from '~/components/elements/form/transaction.svelte'
    import Page from '~/components/layout/page.svelte'

    import TransferMain from '~/pages/transfer/main.svelte'
    import type {Session} from '@wharfkit/session'

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
                const key = makeBalanceKey($token, $activeSession?.actor)
                return $currentBalances.find((b) => b.key === key)
            }
        }
    )

    let currentSession: Session | undefined = $activeSession

    $: {
        if ($activeSession !== currentSession) {
            resetData()
            router.goto('/transfer')
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
        border: 1px solid var(--divider-grey);
        border-radius: 20px;
        padding: 26px;
        :global(.button) {
            margin-top: 31px;
        }
    }
    .options {
        display: inline-flex;
        padding: 22px 0px 15px;
        text-align: right;
        .toggle {
            font-weight: bold;
            margin-right: 10px;
            font-size: 10px;
            line-height: 12px;
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.1px;
            text-transform: uppercase;
            padding: 10px;
            cursor: pointer;
            color: var(--main-blue);
            border-radius: 8px;
            &.active {
                opacity: 1;
                background-color: var(--main-grey);
                color: var(--main-black);
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
    @media only screen and (max-width: 999px) {
        .container {
            margin: 0 32px;
        }
    }

    @media only screen and (max-width: 600px) {
        .container {
            border: none;
            padding: 12px;
            margin: 0 8px;
        }
    }
</style>

<Page divider={false}>
    <span slot="submenu">
        <div class="options">
            <span
                class="toggle"
                class:active={$transferData.step !== Step.Receive}
                on:click={() => ($transferData.step = Step.Recipient)}
            >
                <Text>↑ Send</Text>
            </span>
            <span
                class="toggle"
                class:active={$transferData.step === Step.Receive}
                on:click={() => ($transferData.step = Step.Receive)}
            >
                <Text>↓ Receive</Text>
            </span>
        </div>
    </span>
    <TransactionForm {resetCallback} {retryCallback}>
        <div class="container">
            <TransferMain {balance} {token} {resetData} />
        </div>
    </TransactionForm>
</Page>
