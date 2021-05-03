<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'

    export let showExtra = false
    export let icon = 'help-circle'
</script>

<style type="scss">
    :global(.state > .icon) {
        position: absolute;
        top: 0;
        color: var(--light-grey);
        left: -10px;
        height: 32px;
        width: 32px;
    }
    .state {
        position: relative;
        display: flex;
        flex-direction: row;
        :global(.icon + .content) {
            margin-left: 32px;
        }
        .extra {
            flex: 1 1 auto;
            :global(ul li) {
                color: var(--dark-grey);
                font-family: Inter;
                font-style: normal;
                font-weight: normal;
                font-size: 16px;
                line-height: 16px;
                letter-spacing: -0.26px;
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
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 24px;
            /* identical to box height */
            margin-bottom: 16px;

            letter-spacing: -0.47px;

            color: var(--main-black);
        }
        :global(h3 > span) {
            font-weight: normal;
            font-size: 18px;
            color: var(--light-grey);
        }
        :global(h4) {
            color: var(--dark-grey);
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 10px;
            line-height: 12px;
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.1px;
            text-transform: uppercase;
        }
        :global(p) {
            font-family: Inter;
            font-style: normal;
            font-weight: normal;
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

<Segment>
    <div class="state">
        <Icon name={icon} />
        <div class="content">
            <slot />
        </div>
        {#if showExtra}
            <div class="extra">
                <slot name="extra" />
            </div>
        {/if}
    </div>
</Segment>
