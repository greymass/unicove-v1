<script lang="ts">
    import Completed from '~/pages/transfer/status/template/completed.svelte'
    import {Step, transferData} from '../transfer'

    export let memo: string | undefined
</script>

<style type="scss">
    span {
        line-height: 32px;
    }
</style>

<Completed
    header="Memo"
    changeStep={() => {
        $transferData.step = Step.Memo
    }}
>
    <span>{memo ? memo : '(Optional)'}</span>
</Completed>
