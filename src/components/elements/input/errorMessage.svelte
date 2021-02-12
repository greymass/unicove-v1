<script lang="ts">
    export let errorMessage: string | undefined
</script>

<style type="scss">
    div {
        padding: 10px 0;

        h3 {
            color: var(--error-red);
        }
    }
</style>

{#if !!errorMessage}
    <div>
        <h3>
            {errorMessage}
        </h3>
    </div>
{/if}
