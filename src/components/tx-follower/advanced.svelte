<script lang="ts">
    import type {TransactionStatus} from './utils'
    export let status: TransactionStatus
</script>

<style type="scss">
    pre {
        overflow: auto;
        font-family: monospace;
        padding: 2em;
    }
</style>

<pre>
    {JSON.stringify(status, null, 4)}
</pre>
