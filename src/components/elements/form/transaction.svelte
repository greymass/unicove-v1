<script lang="ts">
    import {setContext} from 'svelte'
    import {writable} from 'svelte/store'

    import {activeSession, currentAccount} from '~/store'
    import {getAccount} from '~/account-cache'
    import type {FormTransaction} from '~/ui-types'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'

    let pending = false
    let success = false
    let transaction_id = writable<string | undefined>(undefined)
    let refreshInterval: number

    function refreshAccount(account: any, start: number) {
        // Refresh the account data
        getAccount(account.account_name, $activeSession!.chainId, true)
        // Force update of activeSession, triggering update of currentAccount
        activeSession.update((state) => state)
        // Check the new head block time to see if it changed
        const current = $currentAccount!.head_block_time.toMilliseconds()
        // If a change occurred, stop this process
        if (current !== start) {
            clearInterval(refreshInterval)
            pending = false
            success = true
        }
    }

    const context: FormTransaction = {
        awaitAccountUpdate: (account: any) => {
            pending = true
            success = false
            // Capture current head block time
            const start = account.head_block_time.toMilliseconds()
            refreshInterval = setInterval(() => refreshAccount(account, start), 1000)
            // Timeout after 30 seconds
            setTimeout(() => {
                pending = false
                success = false
                clearInterval(refreshInterval)
            }, 30000)
        },
        setTransaction: (id: string) => {
            transaction_id.set(id)
        },
        clear: () => transaction_id.set(undefined),
    }

    setContext('transaction', context)
</script>

<style type="scss">
    :global(.segment) {
        p.txid,
        div.success,
        div.error {
            max-width: 70vw;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            padding: 0 0 2em;
        }
    }
    .loader {
        color: var(--main-black);
        text-align: center;
        p {
            margin-top: 1em;
        }
        :global(.icon) {
            width: 36px;
            height: 36px;
            animation-name: spin;
            animation-duration: 3000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>

{#if $transaction_id}
    <Segment>
        <h2>Transaction Submitted</h2>
        <p class="txid">
            <a href="https://bloks.io/transaction/{$transaction_id}" target="_new">
                {$transaction_id}
            </a>
        </p>
        {#if pending}
            <div class="loader">
                <Icon name="settings" />
                <p>Updating account...</p>
            </div>
        {/if}
        {#if !pending && !success}
            <div class="error">
                <p>
                    No changes to the account detected, check the transaction to see if it
                    succeeded.
                </p>
            </div>
        {/if}
        {#if !pending && success}
            <div class="success">
                <p>Account data updated!</p>
            </div>
        {/if}
        <Button fluid on:action={context.clear} primary size="large">Close</Button>
    </Segment>
{:else}
    <Form>
        <slot />
    </Form>
{/if}
