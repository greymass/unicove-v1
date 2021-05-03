<script lang="ts">
    import Container from '~/pages/transfer/status/template/container.svelte'
    import StatusChange from '~/pages/transfer/status/template/change.svelte'

    export let header: string
    export let subheader: string | undefined = undefined
    export let changeStep: (() => void) | undefined = undefined
</script>

<style type="scss">
    .label-container {
        padding: 10px 3px;

        h3 {
            display: block;
            margin: 5px 0;
            font-weight: bold;
        }
    }

    .value-container {
        margin-left: auto;
        padding: 13px;
        display: flex;
    }
</style>

<Container>
    <div class="label-container">
        <h3>{header}</h3>
        {#if subheader}
            <p>{subheader}</p>
        {/if}
        {#if changeStep}
            <StatusChange {changeStep} />
        {/if}
    </div>

    <div class="value-container">
        <slot />
    </div>
</Container>
