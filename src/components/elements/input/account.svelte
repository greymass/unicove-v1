<script lang="ts">
    import {Name} from '@greymass/eosio'

    import Input from '~/components/elements/input.svelte'

    export let name: string = ''
    export let value: string = ''

    export let onChange: any = () => {}

    const validate = (value: string) => {
        try {
            return Name.from(value).toString() === value
        } catch (error) {
            // might be nice to catch errors for form validation errors
            return false
        }
    }
</script>

<style type="scss">
</style>

<Input {onChange} {name} bind:value isValid={validate} />
