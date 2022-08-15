<script>
    import type {Asset, LinkSession} from 'anchor-link'
    import type {Writable} from 'svelte/store'
    import {router} from 'tinro'

    import {currentREXBalance} from '~/stores/account'
    import {earnData, resetEarnData, Step} from '~/pages/earn/earn'

    import REXConfirm from './confirm.svelte'
    import REXDeposit from './deposit.svelte'
    import REXWithdraw from './withdraw.svelte'
    import REXOverview from './overview.svelte'
    import REXSetup from './setup.svelte'

    export let activeSession: Writable<LinkSession | undefined>

    // Cache of the current active session
    let currentSession: LinkSession | undefined = $activeSession

    // Reset Earn section when the active session changes
    activeSession.subscribe((session?: LinkSession) => {
        if (session && session !== currentSession) {
            currentSession = session
            resetEarnData()
            router.goto('/earn/rex')
        }
    })

    // Determine initial page based on current REX balance
    currentREXBalance.subscribe((data: Asset | undefined) => {
        if (data) {
            if (data.value > 0) {
                $earnData.step = Step.Overview
            } else {
                $earnData.step = Step.Setup
            }
        }
    })
</script>

<style type="scss">
</style>

{#if $earnData.step === Step.Loading}
    Loading...
{:else if $earnData.step === Step.Setup}
    <REXSetup />
{:else if $earnData.step === Step.Overview}
    <REXOverview />
{:else if $earnData.step === Step.Confirm}
    <REXConfirm />
{:else if $earnData.step === Step.Deposit}
    <REXDeposit />
{:else if $earnData.step === Step.Withdraw}
    <REXWithdraw />
{:else}
    An unknown error occurred.
{/if}
