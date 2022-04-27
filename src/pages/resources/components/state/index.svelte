<script lang="ts">
    export let showExtra = false
</script>

<style type="scss">
    .state {
        display: flex;
        justify-content: center;
        background: var(--main-grey);
        border-radius: 20px;
        color: var(--main-black);
        padding: 22px 26px;
        &.extra {
            background: transparent;
            padding-left: 0;
            padding-right: 0;
        }

        .content {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        &.extra .content {
            max-width: 120px;
        }
        .extra {
            flex: 1 1 auto;
            margin-left: 20px;
            :global(ul li) {
                color: var(--light-grey);
                font-size: 16px;
                line-height: 16px;
                padding: 2px 0;
                display: flex;
                max-width: 200px;
                justify-content: space-between;
            }
        }
        :global(h3) {
            font-size: 16px;
            font-weight: normal;
            line-height: 19px;
            margin-bottom: 8px;
            color: var(--light-grey);
            text-align: center;
        }
        :global(.extra h3) {
            margin-top: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
            text-transform: uppercase;
        }
        :global(h4) {
            font-weight: bold;
            font-size: 18px;
            line-height: 22px;
            color: var(--black);
            text-transform: uppercase;
            text-align: center;
        }
        :global(.extra h4) {
            text-align: left;
        }
        :global(.gauge) {
            display: flex;
            justify-content: center;
        }
        :global(p) {
            display: flex;
            flex-direction: column;
            font-size: 16px;
            line-height: 19px;
            letter-spacing: -0.26px;
            color: var(--light-grey);
            margin-bottom: 8px;
        }
    }
    @media (max-width: 460px) {
        .extra {
            display: none;
        }
    }
</style>

<div class="state" class:extra={showExtra}>
    <div class="content">
        <slot />
    </div>
    {#if showExtra}
        <div class="extra">
            <slot name="extra" />
        </div>
    {/if}
</div>
