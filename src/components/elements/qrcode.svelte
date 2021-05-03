<script lang="ts">
    import QrCode from 'svelte-qrcode'
    import Icon from '~/components/elements/icon.svelte'

    export let data: string = ''

    export let size: number = 250
</script>

<style>
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
        background: #2d8eff;
        border-radius: 50%;
        padding: 7px;
    }
</style>

<div>
    <QrCode value={String(data)} {size} />
    <Icon size="huge" name="zoom-in" />
</div>
