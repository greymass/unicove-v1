<script lang="ts">
    import { AccountCreator } from '@greymass/account-creation'
    import Page from '~/components/layout/page.svelte'
    import Button from '~/components/elements/button.svelte'

    async function createAccount() {
        const supportedChains = {
            aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906: 'https://eos.greymass.com',
            '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840':
                'https://jungle3.greymass.com',
            '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11':
                'https://telos.greymass.com',
            '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4': 'https://wax.greymass.com',
        }

        const accountCreator = new AccountCreator({
            supportedChains,
            scope: 'testpage',
            loginOnCreate: true,
            returnUrl: 'http://localhost:3000/',
        })

        const { error, ...accountDetails } = await accountCreator.createAccount()

        if (error) {
            console.error(error)

            return alert(`An error occured during account creation: ${error}!`);
        }

        console.log({accountDetails})

        alert(`Created ${accountDetails.actor} on ${accountDetails.network}!`);
    }
</script>

<style>
    .button-container, h2 {
        padding: 20px;
        padding-bottom: 0;
    }
</style>

<Page>
    <h2>
        Click here to create your account:
    </h2>
    <div class="button-container">
        <Button on:action={createAccount}>
            Create Account
        </Button>
    </div>
</Page>