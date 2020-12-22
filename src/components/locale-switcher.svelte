<script>
    import { createEventDispatcher } from 'svelte'

    export let value = 'en'

    const dispatch = createEventDispatcher()

    function switchLocale(event) {
        event.preventDefault()

        dispatch('locale-changed', event.target.value)
    }
</script>

<style>
</style>

<div class="choose-locale">
    <div class="select">
        <select value={value} on:change={switchLocale}>
            <option value="en">English</option>
            <option value="fr">French</option>
        </select>
    </div>
</div>