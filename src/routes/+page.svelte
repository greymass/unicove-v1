<script lang="ts">
    // import {browser} from '$app/environment'
    import {onMount} from 'svelte'
    // import App from '~/app.svelte'
    let loaded = false
    let App

    // $: if (browser) {
    //     let getApp = async () => await import('~/app.svelte')
    //     const app = getApp().then((App) => {
    //         return new App({
    //             target: document.body,
    //         })
    //     })
    // }

    onMount(async () => {
        let main = await (await import('~/main')).default
        App = main()
    })
</script>

{#if loaded}
    <h1>Should be a component here</h1>
    <!-- <svelte:component this={App} /> -->
{:else}
    <div class="app-loading">I'm in page</div>
{/if}

<style lang="scss"></style>
