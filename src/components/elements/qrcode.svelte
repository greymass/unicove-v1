<script lang="ts">
    import {onMount} from 'svelte'

    import Icon from '~/components/elements/icon.svelte'

    export let data: string = ''

    let QrCode: typeof import('svelte-qrcode') | undefined

    onMount(() => {
        import('svelte-qrcode')
            .then((mod) => {
                QrCode = mod.default
            })
            .catch((error) => {
                console.warn('Unable to load svelte-qrcode', error)
            })
    })

    export let size: number = 250
</script>

<style lang="scss">
    div {
        background: #ffffff;
        border: 1px solid #e0e6ee;
        box-sizing: border-box;
        border-radius: 24px;
        margin: 0 auto;
        padding: 15px;
        position: relative;
        width: 280px;
    }
    div :global(.icon) {
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        color: #fff;
        background: var(--lapis-lazuli);
        border-radius: 50%;
        padding: 7px;
        :global(.darkmode) & {
            background: var(--middle-green-eagle);
        }
    }
</style>

<div>
    {#if QrCode}
        <QrCode value={String(data)} {size} />
    {/if}
    <Icon size="huge" name="zoom-in" />
</div>
