<script lang="ts">
    import type {Asset} from 'anchor-link'

    export let asset: Asset

    let whole: number
    let int: string
    let dec: string

    $: {
        whole = Math.floor(Number(asset.value)) || 0
        int = new Intl.NumberFormat().format(whole)
        dec = (Number(asset.value) - whole).toFixed(asset.symbol.precision || 1).split('.')[1]
    }
</script>

<style type="scss">
    .int,
    .dec {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 13px;
        line-height: 300%;

        display: flex;
        align-items: center;
        letter-spacing: -0.04px;
    }
    .int {
        justify-content: flex-end;
        flex: 1;
    }
    .dec {
        color: var(--dark-grey);
        min-width: 5em;
    }
</style>

<div class="int">{int}</div>
<div class="dec">
    {#if dec}
        .{dec}
    {/if}
</div>
