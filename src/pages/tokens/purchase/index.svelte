<script lang="ts">
    import Page from '~/components/layout/page.svelte'
    import BanxaButton from '~/components/elements/banxa/button.svelte'
</script>

<style type="scss">
    .container {
        padding: 0 10%;

        h1,
        h2,
        h3,
        p {
            margin: 20px 0;
            text-align: center;
        }

        hr {
            margin: 40px 0;
        }

        .button-container {
            max-width: fit-content;
            margin: 0 auto;
        }
    }
</style>

<Page>
    <div class="container">
        <h1>Get Tokens</h1>
        <h3>Available token and payment providers:</h3>
        <div class="button-container">
            <BanxaButton />
        </div>
        <hr />
        <h2>These services are not provided by Greymass</h2>
        <p>
            For support and assistance with your token purchase please contact the service you used.
        </p>
    </div>
</Page>
