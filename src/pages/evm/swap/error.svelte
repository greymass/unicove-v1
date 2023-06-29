<script lang="ts">
    import Button from "~/components/elements/button.svelte"

    export let error: string
    export let handleBack: () => void
</script>

<div class="container">
    <div class="top-section">
        <h1>Transfer Failed</h1>
    </div>

    <table>
        <tr>
            <td>Error</td>
            <td>{error}</td>
        </tr>
    </table>

    <Button on:click={handleBack}>
        Retry
    </Button>
</div>