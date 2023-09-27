<script lang="ts">
    import type {Token} from '~/stores/tokens'
    import Completed from '~/pages/send/status/template/completed.svelte'
    import {Step, transferData} from '../transfer'

    export let token: Token

    function changeToken() {
        transferData.update((data) => ({
            ...data,
            step: Step.Token,
            backStep: data.step,
        }))
    }
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

<Completed header="Token" changeStep={changeToken}>
    <span>{token.name}</span>
    <img alt={String(token.name)} src={token.logo} />
</Completed>
