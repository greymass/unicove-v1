<script>
    import Button from '~/components/elements/button.svelte'
    import Progress from '~/components/elements/progress.svelte'

    let percent = 50

    function inc() {
        percent += 10
        if (percent >= 100) {
            percent = 100
        }
    }

    function dec() {
        percent -= 10
        if (percent <= 0) {
            percent = 0
        }
    }
</script>

<style lang="scss">
</style>

<p>
    <Progress {percent} />
</p>
<p>
    <Button on:action={() => inc()}>Increase</Button>
    <Button on:action={() => dec()}>Decrease</Button>
</p>
