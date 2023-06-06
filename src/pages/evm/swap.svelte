<script context="module">
    declare let window: any
</script>

<script lang="ts">
    import {writable} from 'svelte/store'
    import type {Writable} from 'svelte/store'
   
    import Label from '~/components/elements/input/label.svelte'
    import Input from '~/components/elements/input.svelte'
    import Page from '~/components/layout/page.svelte'
    import Form from '~/components/elements/form.svelte'
    import Button from '~/components/elements/button.svelte'
    import Selector from '~/components/elements/input/token/selector.svelte'

    import type {EthAccount} from '~/lib/evm'

    const ethAccount: Writable<EthAccount | null> = writable(null)
        
    let transferEosToEth = true

    function swap() {
        transferEosToEth = !transferEosToEth
    }

    function transfer() {
        console.log('transfer')
    }
</script>

<style>
    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 1em;
        text-align: center;
        padding: 100px;
    }

    h3 {
        margin-bottom: 2em;
    }

    strong {
        font-weight: bold;
    }

    hr {
        margin: 3em 0 1.5em 0;
    }

    .options {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2em;
    }

    button {
        padding: 0.5em 1em;
        font-size: 1em;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #ddd;
    }

    button.active {
        background-color: #aaa;
    }
</style>

<Page divider={false}>
    <div class="container">
        <Form on:submit={transfer}>
            <div class="left-section">
                <Selector bind:value={amount} />
                <Label>Amount</Label>
                <Input bind:value={amount} />
            </div>
            <div class="right-section">
                <Selector bind:value={amount} />
            </div>
            <Button on:action={swap}>Swap</Button>
            <Button>Continue</Button>
        </Form>
    </div>
</Page>
