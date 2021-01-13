<script lang="ts">
    import {currentAccount} from '../store'
    import Page from '../components/page.svelte'
</script>

<Page title="Dashboard">
    <p>
        Hello <b>{$currentAccount?.account_name}</b> looks like you are using
        <b>{$currentAccount?.ram_usage}</b> of RAM.
    </p>
</Page>
