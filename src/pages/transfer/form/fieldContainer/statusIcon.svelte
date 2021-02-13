<script>
    import Icon from '~/components/elements/icon.svelte'

    export let valid: boolean
    export let noError: boolean = false
</script>

<style type="scss">
    span.icon {
        border: none;
        padding: 8px;
        width: 30px;

        &.success {
            color: var(--success-green);
        }

        &.error {
            color: var(--error-red);
        }
    }
</style>

{#if valid}
    <span class="success icon">
        <Icon name="check" size="large" />
    </span>
{:else if !noError}
    <span class="error icon">
        <Icon name="alert-circle" size="large" />
    </span>
{:else}
    <span class="icon" />
{/if}
