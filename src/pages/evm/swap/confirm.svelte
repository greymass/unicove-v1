<script lang="ts">
    import Button from "~/components/elements/button.svelte"

    export let from: string
    export let to: string
    export let amount: string
    export let handleBack: () => void
    export let handleConfirm: () => void
</script>

<div class="container">
    <div class="top-section">
        <h1>Transfer</h1>
        <h3>Review and Sign</h3>
    </div>

    <table>
        <tr>
            <td>From</td>
            <td>{from}</td>
        </tr>
        <tr>
            <td>To</td>
            <td>{to}</td>
        </tr>
        <tr>
            <td>Amount</td>
            <td>{amount}</td>
        </tr>
    </table>
    <Button on:click={handleBack}>
        Back
    </Button>
    <Button on:click={handleConfirm}>
        Confirm
    </Button>
</div>