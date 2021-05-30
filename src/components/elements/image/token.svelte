<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'
    import type {Token} from '~/stores/tokens'
    import {tokens} from '~/stores/tokens'
    import Image from '~/components/elements/image.svelte'

    export let tokenKey: string

    const token: Readable<Token | undefined> = derived([tokens], ([$tokens]) => {
        if ($tokens) {
            return $tokens.find((t) => t.key === tokenKey)
        }
    })

    console.log({token: $token})
</script>

{#if $token}
    <Image height="32" width="32" alt={String($token.name)} src={$token.logo} />
{/if}
