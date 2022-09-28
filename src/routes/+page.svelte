<script lang="ts">
    import type {PageData} from './$types'
    import App from '../App.svelte'

    export let data: PageData
    let loading = true
</script>

{#if loading}
    <div class="app-loading" />
{:else}
    <App />
{/if}
