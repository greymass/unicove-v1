<script lang="ts">
    import { currentAccountBalance } from '~/store'

    import Label from '~/components/elements/input/label.svelte'
    import Input from '~/components/elements/input.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'
    import Select from '~/components/elements/select.svelte'

    export let handleContinue: () => void
    export let amount: string
    export let transferOption: string = 'nativeToEvm'

    function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        transferOption = target.value;
    }

    $: nativeToEVMLabel = `Native (${$currentAccountBalance})`
    $: evmToNativeLabel = `EVM (not connected)`
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

        form {
            select {
                -webkit-appearance: none;  /* Remove default select dropdown indicator */
                -moz-appearance: none;
                appearance: none;
                width: 170px;
                padding: 10px 12px;
                margin: 8px 0;
                border: 1px solid var(--dark-grey);
                border-radius: 12px;
                background-color: var(--main-grey);
                font-size: 12px;
                color: var(--main-black)
            }
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
                <Select
                    bind:value={transferOption}
                    on:change={handleChange}
                    options={[ {value: 'nativeToEvm', label: nativeToEVMLabel}, {value: 'evmToNative', label: evmToNativeLabel}]}
                />
                <Label>Amount</Label>
                <Input bind:value={amount} />
            </div>
            <div class="right-section">
                <Label>To</Label>
                <Select
                    bind:value={transferOption}
                    on:change={handleChange}
                    options={[ {value: 'nativeToEvm', label: evmToNativeLabel}, {value: 'evmToNative', label: nativeToEVMLabel}]}
                />
            </div>
        </div>
        <div class="bottom-section">  
            <Button on:action={handleContinue}>Continue</Button>
        </div>
    </Form>
</div>
