<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'

    window.parent.postMessage({command: 'allow-close', banxaStatus: 'failure'}, '*')
</script>

<style lang="scss">
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        vertical-align: middle;
        height: 100vh;

        .text-container {
            display: block;

            h2 {
                font-size: 1.5rem;
                font-weight: 500;
                margin-top: 20px;
            }

            h3 {
                margin-top: 20px;
            }
        }
    }
</style>

<div class="container">
    <div class="text-container">
        <Icon name="x-circle" size="massive" />
        <h2>Payment Error</h2>
        <h3>Please contact support at support@greymass.com.</h3>
    </div>
</div>
