<script lang="ts">
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    interface Option {
        value: string
        label: string
    }

    export let value = ''
    export let options: Option[] = []
    export let fluid: boolean = false

    function handleChange(event: Event) {
        value = (event.target as HTMLSelectElement).value
        dispatch('change', value)
    }
</script>

<style type="scss">
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 170px;
        padding: 10px 12px;
        margin-bottom: 15px;
        border: 1px solid var(--dark-grey);
        border-radius: 12px;
        background-color: var(--main-grey);
        font-size: 12px;
        color: var(--main-black);

        &.fullWidth {
            width: 100%;
        }
    }
</style>

<select class={fluid ? 'fullWidth' : ''} bind:value on:change={handleChange}>
    {#each options as option (option.value)}
        <option value={option.value}>
            {option.label}
        </option>
    {/each}
</select>
