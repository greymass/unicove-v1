<script lang="ts">
    import {activeSession} from '../store'
    import Page from '../components/layout.svelte'
</script>

<Page title="Dashboard">
    <p>Hello <b>{$activeSession?.auth.actor}</b></p>
</Page>
