<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import Progress from '~/components/elements/progress.svelte'
    import Segment from '~/components/elements/segment.svelte'

    // force type to be unwrapped since we cannot use typescript inside svelte templates
    export let account: any
    let storage = 0
    let capacity = 100

    function getStorage() {
        console.log('getStorage')
        let total = 0
        if (account) {
            total += (account.ram_quota.toNumber() - account.ram_usage.toNumber()) / 1000
        }
        capacity = (1 - account.ram_usage.toNumber() / account.ram_quota.toNumber()) * 100
        console.log(capacity)
        return total
    }

    $: if (account) {
        storage = getStorage()
    }
</script>

<style type="scss">
</style>

{#if account}
    <Segment>
        <h2>
            {storage} Storage available
        </h2>
        <Progress percent={capacity} />
        <hr />
        <Button primary>Buy Storage</Button>
    </Segment>
{/if}
