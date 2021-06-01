<script lang="ts">
    import {setContext} from 'svelte'
    import {get, writable} from 'svelte/store'
    import type {Name} from '@greymass/eosio'

    import {activeBlockchain, activeSession, currentAccount} from '~/store'
    import {getAccount} from '~/stores/account-provider'
    import type {FormTransaction} from '~/ui-types'
    import Button from '~/components/elements/button.svelte'
    import Form from '~/components/elements/form.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'

    import TxFollower from '~/components/tx-follower/index.svelte'

    export let retryCallback: (() => void) | undefined = undefined
    export let resetCallback: (() => void) | undefined = undefined
    export let completeAction: string = 'Done'

    let error: boolean = false
    let errorMessage: string = ''
    let transaction_id = writable<string | undefined>(undefined)
    let refreshInterval: number

    function refreshAccount(account_name: Name) {
        // Refresh the account data
        getAccount(account_name, $activeSession!.chainId, true)
        // Force update of activeSession, triggering update of currentAccount
        activeSession.update((state) => state)
    }

    function complete() {
        context.clear()
        if (resetCallback) {
            resetCallback()
        }
    }

    const context: FormTransaction = {
        awaitAccountUpdate: (field: any) => {
            // Create a copy of the initial value
            const initialValue = get(field)

            // Set the current value equal to the initial value
            let currentValue: any = initialValue

            // Start an interval to continously monitor for changes to that value
            refreshInterval = setInterval(() => {
                // Refresh the account
                refreshAccount($currentAccount!.account_name)
                // Subscribe to changes on the store passed in
                field.subscribe((v: any) => (currentValue = v))
                // If the store changed, stop the interval
                if (!currentValue.equals(initialValue)) {
                    clearInterval(refreshInterval)
                }
            }, 1000)

            // Timeout after 30 seconds
            setTimeout(() => {
                clearInterval(refreshInterval)
            }, 30000)
        },
        clear: () => {
            error = false
            transaction_id.set(undefined)
        },
        retryTransaction: () => {
            // Clear previous transaction context
            context.clear()
            // If a retry callback was specified, call that too
            if (retryCallback) {
                retryCallback()
            }
        },
        setTransaction: (id: string) => {
            transaction_id.set(id)
        },
        setTransactionError: (err: any) => {
            error = true
            errorMessage = String(err)
        },
    }

    setContext('transaction', context)
</script>

<style type="scss">
    :global(.segment) {
        .controls,
        .header {
            padding: 51px 0 24px;
            text-align: center;
            :global(.icon) {
                color: var(--main-green);
            }
        }
        p.txid a {
            color: var(--main-blue);
            text-decoration: none;
        }
        p.txid,
        div.error {
            color: var(--main-black);
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            padding: 24px 0 0;
        }
    }
    .error {
        text-align: center;
        :global(.icon) {
            color: var(--error-red);
            margin-bottom: 10px;
        }
        h2 {
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 29px;
            text-align: center;
            letter-spacing: -0.47px;
        }
    }

    :global(form) {
        margin: 0 auto;
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
    <TxFollower id={$transaction_id} chain={$activeBlockchain} />
{:else if error}
    <Segment color="white">
        <div class="error">
            <Icon name="alert-circle" size="massive" />
            <h2>Transaction Failed</h2>
            <p>{errorMessage}</p>
        </div>
        <div class="controls">
            {#if retryCallback}
                <Button size="large" primary on:action={context.retryTransaction}>Try Again</Button>
            {/if}
        </div>
    </Segment>
{:else}
    <Form>
        <slot />
    </Form>
{/if}
