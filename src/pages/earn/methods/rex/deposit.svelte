<script>
    import Button from '~/components/elements/button.svelte'
    import {EarnData, earnData, Step} from '~/pages/earn/earn'

    function back() {
        earnData.update((data: EarnData) => ({
            ...data,
            step: data.backStep ? data.backStep : Step.Overview,
            backStep: undefined,
        }))
    }
</script>

<style type="scss">
    @import './style.scss';
</style>

<div class="title">
    <h1>Deposit</h1>
    <h3>Add to your staked balance.</h3>
    <Button style="no-frame" on:action={back}>Cancel</Button>
</div>
