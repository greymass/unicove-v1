<script lang="ts">
    import Input from '~/components/elements/input.svelte'
    import ErrorMessage from './errorMessage.svelte'
    import type {inputType} from '~/ui-types'

    export let errorMessage: string | undefined = undefined

    export let name: string = ''
    export let fluid: boolean = false
    export let focus: boolean = false
    export let inputmode: inputType = null
    export let isValid: any = () => true
    export let placeholder: string | undefined = undefined
    export let value: string = ''
</script>

<style type="scss">
</style>

<div>
    <Input
        on:changed
        bind:name
        bind:fluid
        bind:focus
        bind:inputmode
        bind:isValid
        bind:placeholder
        bind:value
    />
    <ErrorMessage {errorMessage} />
</div>
