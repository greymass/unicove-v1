<script lang="ts">
    export let showExtra = false
</script>

<style type="scss">
    .state {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--main-grey);
        border-radius: 20px;
        color: var(--main-black);
        padding: 22px 26px;
        .content {
            flex: 1;
            min-height: 250px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .extra {
            flex: 1 1 auto;
            :global(ul li) {
                color: var(--dark-grey);
                font-size: 16px;
                line-height: 16px;
                padding: 0.25em;
                text-align: right;
                &:first-child {
                    font-weight: bold;
                    font-size: 12px;
                    line-height: 14px;
                }
            }
        }
        :global(h3) {
            font-size: 16px;
            font-weight: normal;
            line-height: 19px;
            margin-bottom: 8px;
            color: var(--main-black);
            text-align: center;
        }
        :global(h4) {
            font-weight: bold;
            font-size: 18px;
            line-height: 22px;
            color: var(--black);
            text-transform: uppercase;
            text-align: center;
        }
        :global(.gauge) {
            padding: 0 30px;
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

<div class="state">
    <div class="content">
        <slot />
    </div>
    {#if showExtra}
        <div class="extra">
            <slot name="extra" />
        </div>
    {/if}
</div>
