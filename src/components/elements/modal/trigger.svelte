<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import {writable} from 'svelte/store'

    export let content = 'Open Modal'
    export let disabled: boolean = false
    export let display = writable<boolean>(false)

    const open = () => {
        if (!disabled) {
            $display = true
        }
    }

    let close = () => ($display = false)
</script>

<style type="scss">
</style>

<Button {disabled} on:action={open}>
    {content}
</Button>

<slot {display} {close} />
