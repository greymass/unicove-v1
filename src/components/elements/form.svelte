<script lang="ts">
    import {setContext} from 'svelte'
    import type {inputResponse} from '~/ui-types'

    interface Form {
        setInput: (name: string, valid: boolean) => void
        onChange: (response: inputResponse) => void
        valid: boolean
    }

    let fields: any = {}
    let valid: boolean = false

    const form: Form = {
        setInput: (name: string, valid: boolean = false) => {
            fields[name] = valid
        },
        onChange: (response: inputResponse) => {
            fields[response.name] = response.valid
            validate()
        },
        valid,
    }
    setContext('form', form)

    function submit() {
        if (valid) {
            // submit
        }
        console.log('submit', fields)
    }

    function validate() {
        valid = Object.values(fields).every((v) => v === true)
    }
</script>

<style type="scss">
</style>

<form on:submit|preventDefault={submit}>
    <p>Form field validation status</p>
    <ul>
        {#each Object.keys(fields) as field}
            <li>{field}: {fields[field]}</li>
        {/each}
    </ul>
    <hr />
    <p>Form overall validation: {valid}</p>
    <hr />
    <slot />
</form>
