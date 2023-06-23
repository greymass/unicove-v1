<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    interface Option {
        value: string;
        label: string;
    }

    export let value = '';
    export let options: Option[]  = [];

    function handleChange(event: Event) {
        value = (event.target as HTMLSelectElement).value;
        dispatch('change', value);
    }
</script>

<select bind:value={value} on:change={handleChange}>
    {#each options as option (option.value)}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>

<style type="scss">
    select {
        -webkit-appearance: none;
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
</style>
