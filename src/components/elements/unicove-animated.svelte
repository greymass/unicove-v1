<script lang="ts">
    import {LottiePlayer} from '@lottiefiles/svelte-lottie-player'
    export let style = ''

    let controlsLayout = [
        'previousFrame',
        'playpause',
        'stop',
        'nextFrame',
        'progress',
        'frame',
        'loop',
        'spacer',
        'background',
        'snapshot',
        'zoom',
        'info',
    ]
</script>

<style lang="scss">
    .container {
        display: flex;
        justify-content: center;
        :global(.darkmode) & :global(g > rect) {
            fill: #c4c4c4;
        }
    }
</style>

<div class="container">
    <LottiePlayer
        src="/images/logo-animated.json"
        autoplay={true}
        loop={true}
        controls={false}
        renderer="svg"
        background="transparent"
        width={undefined}
        height={undefined}
        {style}
        {controlsLayout}
    />
</div>
