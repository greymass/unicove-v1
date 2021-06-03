<script context="module" lang="ts">
    interface TokenIcon {
        src: string
        name: string
        darkSrc?: string
    }
    const tokenIcons: Record<string, TokenIcon> = {
        'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906-eosio.token-eos': {
            name: 'EOS',
            src: '/images/token-eos.svg',
            darkSrc: '/images/token-eos-dark.svg',
        },
    }
</script>

<script lang="ts">
    import {tokens} from '~/stores/tokens'
    import Image from '~/components/elements/image.svelte'
    import {darkMode} from '~/store'

    export let tokenKey: string
    export let width: string = '32'
    export let height: string = '32'

    let src: string | undefined
    let name: string
    $: {
        if (tokenIcons[tokenKey]) {
            const icon = tokenIcons[tokenKey]
            src = $darkMode ? icon.darkSrc || icon.src : icon.src
            name = icon.name
        } else {
            const token = ($tokens || []).find((t) => t.key === tokenKey)
            if (token) {
                src = token.logo
                name = String(token.name)
            }
        }
    }
</script>

{#if src}
    <Image {height} {width} alt={name} {src} />
{/if}
