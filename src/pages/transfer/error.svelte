<script lang="ts">
    import Button from '~/components/elements/button.svelte'

    export let error: string
    export let handleBack: () => void
</script>

<style type="scss">
    .container {
        width: 100%;
        margin: 0 auto;
        padding: 1em;
        text-align: center;

        .top-section {
            padding: 10px;

            h1 {
                margin-bottom: 10px;
                color: var(--main-red);
            }
        }

        .middle-section {
            border: 2px solid var(--main-grey);
            border-radius: 10px;
            padding: 20px;
            margin-top: 2em;

            p {
                width: 100%;
                padding: 5px;
                text-align: left;
            }
        }

        .bottom-section {
            padding: 30px;
            max-width: 300px;
            margin: auto;
        }
    }
</style>

<div class="container">
    <div class="top-section">
        <h1>Transfer Failed</h1>
    </div>

    <div class="middle-section">
        <p>
            {error}
        </p>
    </div>

    <div class="bottom-section">
        <Button fluid style="primary" on:action={handleBack}>Retry</Button>
    </div>
</div>
