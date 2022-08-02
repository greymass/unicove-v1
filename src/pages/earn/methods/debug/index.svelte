<script>
    import type {LinkSession} from 'anchor-link'
    import type {Readable, Writable} from 'svelte/store'

    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'

    import {derived} from 'svelte/store'

    import type {Token} from '~/stores/tokens'
    import type {Balance} from '~/stores/balances'
    import {currentREXBalance} from '~/stores/account'
    import {tokens} from '~/stores/tokens'
    import {systemTokenKey} from '~/stores/tokens'
    import type {ChainConfig} from '~/config'

    export let activeSession: Writable<LinkSession | undefined>
    export let activeBlockchain: Readable<ChainConfig>
    export let balances: Readable<Balance[]>

    const token: Readable<Token | undefined> = derived(
        [activeSession, systemTokenKey, tokens],
        ([$activeSession, $systemTokenKey, $tokens]) => {
            if ($activeSession && $systemTokenKey && $tokens) {
                return $tokens.find((t) => t.key === $systemTokenKey)
            }
        }
    )
</script>

<style type="scss">
</style>

<div class="title">
    <SegmentGroup vertical>
        <Segment>
            <h2>Blockchain</h2>
            {#if $activeBlockchain}
                <p>{$activeBlockchain.id}</p>
            {:else}
                <p>No blockchain</p>
            {/if}
            <h2>System Token Key</h2>
            {#if $activeBlockchain}
                <p>{$systemTokenKey}</p>
            {:else}
                <p>No blockchain</p>
            {/if}
            <h2>Session</h2>
            {#if $activeSession}
                <p>{$activeSession.auth}</p>
            {:else}
                <p>No session</p>
            {/if}
        </Segment>
        <Segment>
            <h2>Data: Balances</h2>
            {#each $balances as balance}
                <p>{balance.account} {balance.quantity}</p>
            {/each}
            <h2>Data: REX</h2>
            {$currentREXBalance}
        </Segment>
        <Segment>
            <h2>Data: Selected Token</h2>
            {#if $token}
                <p>{$token.contract} {$token.name}</p>
            {/if}
            <h2>Data: All Tokens</h2>
            {#each $tokens as token}
                <p>{token.contract} {token.name}</p>
            {/each}
        </Segment>
    </SegmentGroup>
</div>
