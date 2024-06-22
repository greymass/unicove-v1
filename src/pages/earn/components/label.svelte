<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'

    export let header: string
    export let subheader: string | undefined = undefined
    export let changeStep: (() => void) | undefined = undefined
</script>

<style type="scss">
    .container {
        display: flex;
        min-height: 60px;
        border-bottom: 1px solid var(--divider-grey);
        align-items: center;
    }
    .label {
        h3 {
            display: block;
            font-weight: bold;
        }
    }

    .value {
        flex: 1;
        text-align: right;
    }
    changeStep {
        color: var(--main-blue);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 16px 0 16px 16px;
    }
</style>

<div class="container">
    <div class="label">
        <h3>{header}</h3>
        {#if subheader}
            <p>{subheader}</p>
        {/if}
    </div>

    <div class="value">
        <slot />
    </div>
    {#if changeStep}
        <div class="changeStep" on:click={changeStep}>
            <Icon size="large" name="edit-2" />
        </div>
    {/if}
</div>
