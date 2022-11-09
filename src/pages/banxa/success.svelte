<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'

    setTimeout(function () {
        window.parent.postMessage({command: 'close', banxaStatus: 'success'}, '*')
    }, 3000)
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
        }
    }
</style>

<div class="container">
    <div class="text-container">
        <Icon name="check-circle" size="massive" />
        <h2>Payment successful</h2>
    </div>
</div>
