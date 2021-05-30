<script lang="ts">
    import type {Readable} from 'svelte/store'
    import {derived} from 'svelte/store'
    import type {Token} from '~/stores/tokens'
    import {tokens} from '~/stores/tokens'
    import Image from '~/components/elements/image.svelte'

    export let tokenKey: string
    export let width: string = "32"
    export let height: string = "32"

    const token: Readable<Token | undefined> = derived([tokens], ([$tokens]) => {
        if ($tokens) {
            return $tokens.find((t) => t.key === tokenKey)
        }
    })
</script>

{#if $token}
    <Image height={height} width={width} alt={String($token.name)} src={$token.logo} />
{/if}
