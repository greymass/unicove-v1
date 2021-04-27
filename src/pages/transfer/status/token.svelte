<script lang="ts">
    import type {Token} from '~/stores/tokens'
    import Completed from '~/pages/transfer/status/template/completed.svelte'

    export let token: Token
</script>

<style type="scss">
    img {
        height: 32px;
        margin-left: 16px;
        width: 32px;
    }
    span {
        line-height: 32px;
        vertical-align: middle;
    }
</style>

<Completed header="Token">
    <span>{token.name}</span>
    <img alt={String(token.name)} src={token.logo} />
</Completed>
