<script lang="ts">
    export let step: number = 1
</script>

<style type="scss">
    .progress {
        margin: 18px 0 42px;
        text-align: center;
        .step {
            display: inline-block;
            height: 4px;
            width: 105px;
            margin: 0 3px 0 0;
            background: var(--main-blue);
            opacity: 0.3;
        }
        &.step-1 .step:nth-child(-n + 1),
        &.step-2 .step:nth-child(-n + 2) {
            opacity: 1;
        }
    }
</style>

<div class={`progress step-${step}`}>
    <div class="step" />
    <div class="step" />
</div>
