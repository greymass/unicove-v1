<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'

    export let icon = 'help-circle'
</script>

<style type="scss">
    :global(.segment > .icon) {
        position: absolute;
        top: 1em;
        color: var(--light-grey);
        left: 1em;
        height: 32px;
        width: 32px;
    }
    :global(.segment) {
        position: relative;
        :global(.icon + .content) {
            margin-left: 32px;
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

            color: #585d6e;
        }
        :global(h4) {
            color: #b7c1cb;
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
            color: #585d6e;
            margin-bottom: 8px;
        }
    }
</style>

<Segment>
    <Icon name={icon} />
    <div class="content">
        <slot />
    </div>
</Segment>
