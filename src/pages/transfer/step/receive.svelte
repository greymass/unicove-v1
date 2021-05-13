<script lang="ts">
    import {activeBlockchain, currentAccount} from '~/store'
</script>

<style type="scss">
    .container {
        text-align: center;
    }
    h2,
    h4 {
        line-height: 2em;
    }
    h2 {
        font-size: 2em;
    }
</style>

{#if $currentAccount}
    <div class="container">
        <h4>
            To receive tokens on {$activeBlockchain.name}, send them directly to your account name:
        </h4>
        <h2>{$currentAccount.account_name}</h2>
    </div>
{/if}
