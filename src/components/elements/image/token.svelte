<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'
    import type {Token} from '~/stores/tokens'
    import {tokens} from '~/stores/tokens'

    export let tokenKey: string

    const token: Readable<Token | undefined> = derived([tokens], ([$tokens]) => {
        if ($tokens) {
            return $tokens.find((t) => t.key === tokenKey)
        }
    })
</script>

<style type="scss">
    img {
        height: 32px;
        width: 32px;
    }
</style>

{#if $token}
    <img alt={String($token.name)} src={$token.logo} />
{/if}
