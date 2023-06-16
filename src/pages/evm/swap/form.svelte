<script lang="ts">
    import Label from '~/components/elements/input/label.svelte'
    import Input from '~/components/elements/input.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'

    export let handleContinue: () => void
    export let amount: string
    export let transferOption: string

    function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        transferOption = target.value;
    }
</script>

<style type="scss">
    .container {
        width: 100%;
        margin: 0 auto;
        padding: 1em;
        text-align: center;

        .top-section {
            padding: 20px;
        }
        .middle-section {
            display: flex;
            justify-content: space-between;

            .left-section, .right-section {
                width: 50%;  /* or set a flex-basis instead */
            }

            .left-section {
                border-right: 1px solid #ddd;
            }
        }

        .bottom-section {
            padding: 30px;
        }
    }
</style>

<div class="container">
    <div class="top-section">
        <h1>Transfer</h1>
        <h3>Select your accounts and amount</h3>
    </div>
    <Form>
        <div class="middle-section">
            <div class="left-section">
                <Label>From</Label>
                <select bind:value={transferOption} on:change={handleChange}>
                    <option value="eosToEth">EOS (Native)</option>
                    <option value="ethToEos">EOS (EVM)</option>
                </select>
                <Label>Amount</Label>
                <Input bind:value={amount} />
            </div>
            <div class="right-section">
                <Label>From</Label>
                <select bind:value={transferOption} on:change={handleChange}>
                    <option value="ethToEos">EOS (Native)</option>
                    <option value="eosToEth">EOS (EVM)</option>
                </select>
            </div>
        </div>
        <div class="bottom-section">  
            <Button on:action={handleContinue}>Continue</Button>
        </div>
    </Form>
</div>
