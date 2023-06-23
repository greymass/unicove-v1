<script lang="ts">
    import { Asset } from "@greymass/eosio"
    import Button from "~/components/elements/button.svelte"

    export let from: string
    export let to: string
    export let amount: string
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
            <td>{Asset.from(Number(amount), "4,EOS")}</td>
        </tr>
    </table>
    <Button on:click={handleConfirm}>
        Sign Transaction
    </Button>
</div>

<style>
.container {
    max-width: 500px;
    margin: auto;
    padding: 3em;
    background-color: transparent;
    text-align: center;
    border: 2px solid var(--main-grey);
}

.top-section {
    margin-bottom: 2em;
}

table {
    width: 100%;
    margin-bottom: 2em;
}

table td {
    padding: 1.5em;
    border-top: 1px solid #ddd;
}

table tr:first-child td {
    border: none;
}
</style>
