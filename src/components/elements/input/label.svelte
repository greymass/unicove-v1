<script>
    export let align: 'center' | 'left' | 'right' = 'center'
</script>

<style type="scss">
    .label {
        color: var(--main-black);
        font-weight: 600;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.1px;
        text-transform: uppercase;
        margin-bottom: 12px;
    }
</style>

<div class="label" style="text-align: {align};">
    <slot />
</div>
