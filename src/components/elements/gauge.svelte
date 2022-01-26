<script lang="ts">
    import {tweened} from 'svelte/motion'
    import {cubicInOut} from 'svelte/easing'

    import Icon from '~/components/elements/icon.svelte'

    export let icon: string
    export let percentage: number
    export let fallback: string = ''

    const initialAngle = -140
    const finalAngle = 140

    function polarToCartesian(
        center: {
            x: number
            y: number
        },
        radius: number,
        angle: number
    ): {x: number; y: number} {
        const radians = ((angle - 90) * Math.PI) / 180.0
        return {x: center.x + radius * Math.cos(radians), y: center.y + radius * Math.sin(radians)}
    }

    function svgCircleArcPath({
        center,
        radius,
        startAngle,
        endAngle,
    }: {
        center: {
            x: number
            y: number
        }
        radius: number
        startAngle: number
        endAngle: number
    }): string {
        const start = polarToCartesian(center, radius, endAngle)
        const end = polarToCartesian(center, radius, startAngle)
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
    }

    const percentageAnimated = tweened(0, {
        duration: 400,
        easing: cubicInOut,
    })

    $: percentageAnimatedRound =
        $percentageAnimated >= 0 ? ($percentageAnimated * 100).toFixed(1) : 0

    $: path = svgCircleArcPath({
        center: {x: 50, y: 50},
        radius: 40,
        startAngle: initialAngle,
        endAngle:
            ($percentageAnimated >= 0 ? $percentageAnimated : 0) * (finalAngle - initialAngle) +
            initialAngle,
    })

    $: percentageAnimated.set(percentage / 100)
</script>

<style lang="scss">
    .container {
        position: relative;
    }
    path {
        stroke-width: 9;
        stroke: var(--main-blue);
        stroke-opacity: 0.15;
        fill: none;

        &.color {
            stroke-opacity: 1;
        }
    }
    .icon {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    p {
        margin-top: -30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .percentage {
            font-size: 16px;
            font-weight: 600;
            line-height: 19px;
            color: var(--main-black);
        }
        .usage {
            margin-top: 5px;
            font-weight: 500;
            font-size: 10px;
            line-height: 12px;
            color: var(--main-black);
        }
    }
</style>

<div class="container">
    <svg viewBox="0 0 100 100">
        <path
            d={svgCircleArcPath({
                center: {x: 50, y: 50},
                radius: 40,
                startAngle: initialAngle,
                endAngle: finalAngle,
            })}
        />
        <path class="color" d={path} />
    </svg>
    <div class="icon">
        <Icon name={icon} size="massive" />
    </div>
    <p>
        {#if percentage < 100}
            <span class="percentage">{percentageAnimatedRound}%</span>
            <span class="usage">Quota used</span>
        {:else}
            {fallback}
        {/if}
    </p>
</div>
