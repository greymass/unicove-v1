<script lang="ts">
    import {version, isRelease, releaseVersion, chains} from '~/config'
    import {preferences} from '~/store'

    import Logo from '~/components/elements/logo.svelte'
    import Unicove from '~/components/elements/unicove.svelte'
    import Button from '~/components/elements/button.svelte'
    import ButtonLogin from '~/components/elements/button/login.svelte'
    import ThemeButton from '~/components/elements/button/mode.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import MediaQuery from '~/components/utils/media-query.svelte'

    $: darkmode = $preferences.darkmode
</script>

<style lang="scss">
    .container {
        background-image: url('/images/noise-light.png');
        min-height: 100vh;
        overflow: hidden;
        :global(.darkmode) & {
            background-image: url('/images/noise-dark.png');
        }
        > * {
            margin: 0 auto;
            max-width: 1200px;
        }
        @media (max-width: 1200px) {
            padding: 0 15px;
        }
    }
    h2,
    h3 {
        font-size: 24px;
        line-height: 29px;
        text-align: center;
        color: var(--rich-black-FOGRA);
        font-weight: normal;
    }
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 36px 0 20px 0;
        .logo {
            display: flex;
            .title {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: 12px;
                .unicove {
                    margin-bottom: 4px;
                }
                .version {
                    color: var(--middle-green-eagle);
                    font-size: 10px;
                    line-height: 12px;
                }
            }
        }
        .account {
            display: grid;
            align-items: center;
            justify-content: space-between;
            grid-template-columns: repeat(3, auto);
            gap: 10px;
            @media (max-width: 535px) {
                grid-template-columns: repeat(2, auto);
            }
        }
    }
    .tagline {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        background: var(--cultured);
        .sun-container {
            z-index: 0;
            position: absolute;
            max-width: 480px;
            width: 100%;
        }
        .noise {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            background: url('/images/logo-noise.png');
            mix-blend-mode: overlay;
        }
        .fadeout-border {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 75%;
            left: 0;
            background: var(--cultured);
            filter: blur(100px);
            @media (max-width: 629px) {
                top: 35%;
            }
        }
        .circle {
            width: 100%;
            padding-top: 100%;
            border-radius: 50%;
            background: linear-gradient(
                180deg,
                var(--air-superiority-blue) 0%,
                var(--light-goldenrod-yellow) 34.9%,
                var(--sandy-brown) 67.19%,
                var(--melon) 99.48%
            );
        }
        .cloud {
            position: absolute;
            width: 70%;
            height: 70%;
            top: 45%;

            background: linear-gradient(0deg, var(--melon), var(--melon));
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
            @media (max-width: 629px) {
                top: 35%;
            }
        }
        .union {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 25%;
            top: 60%;

            background: linear-gradient(0deg, var(--cultured), var(--cultured));
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
            @media (max-width: 629px) {
                top: 35%;
            }
        }
        .cut {
            position: absolute;
            width: 70%;
            height: 70%;
            left: 30%;
            top: 37%;

            background: linear-gradient(0deg, var(--cultured), var(--cultured));
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
            @media (max-width: 629px) {
                top: 35%;
            }
        }
        .unicove {
            width: 100%;
            padding-top: 160px;
            max-width: 535px;
            z-index: 10;
            @media (max-width: 535px) {
                padding-top: 30%;
            }
        }
        .description {
            margin-top: 20px;
            max-width: 535px;
            z-index: 10;
        }
        .actions {
            z-index: 10;
            display: flex;
            justify-content: space-evenly;
            flex-wrap: wrap;
            width: 100%;
        }
        .action {
            width: 300px;
            padding: 70px 10px;
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: center;
            p {
                flex: 1;
                margin: 20px 0;
                text-align: center;
            }
        }
    }
    .section-1 {
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: space-evenly;
        .image,
        .content {
            flex: 0 1 400px;
        }
        .image {
            display: flex;
            align-items: center;
            justify-content: center;
            max-height: 250px;
        }
        .content {
            h3 {
                text-align: left;
            }
            h4 {
                color: var(--light-grey);
            }
            p {
                line-height: 15px;
            }
            & > * {
                margin-bottom: 20px;
            }
        }
        .blockchains {
            display: flex;
        }

        .blockchain {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 15px;
            p {
                color: var(--light-grey);
                margin-top: 8px;
            }
        }
    }
    .usage {
        margin-top: 150px;
        max-width: 900px;
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;

        h3 {
            text-align: left;
        }
        p {
            margin-top: 20px;
        }
        .features {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 50px;
        }
    }
</style>

<div class="container">
    <header>
        <div class="logo">
            <Logo width={40} variant="dark" />
            <div class="title">
                <div class="unicove">
                    <Unicove width={90} variant="dark" />
                </div>
                <div class="version">
                    {#if isRelease}
                        {releaseVersion}
                    {:else}
                        {version}
                    {/if}
                </div>
            </div>
        </div>
        <div class="account">
            <ThemeButton />
            <MediaQuery query="(min-width: 536px)" let:matches>
                {#if matches}
                    <Button style="secondary" size="regular"
                        ><Icon name="plus" /><Text>New Account</Text></Button
                    >
                {/if}
            </MediaQuery>
            <ButtonLogin>Login</ButtonLogin>
        </div>
    </header>
    <div class="tagline">
        <div class="sun-container">
            <div class="circle" />
        </div>
        <div class="cut" />
        <div class="cloud" />
        <div class="union" />
        <div class="fadeout-border" />
        <div class="noise" />
        <div class="unicove">
            <Unicove variant="white" />
        </div>
        <h2 class="description">
            Unicove is your portal to EOSIO blockchains, a secure & easy to use web wallet
        </h2>
        <div class="actions">
            <div class="action">
                <h3>New account</h3>
                <p>
                    An easy way to create a new account. Supported chains are EOS, WAX, TELOS,
                    Proton, and FIO.
                </p>
                <Button style="secondary" size="regular"
                    ><Icon name="plus" /><Text>Create new account</Text></Button
                >
            </div>
            <div class="action">
                <h3>Login to wallet</h3>
                <p>Use Anchor to login and manage your account and tokens.</p>
                <ButtonLogin>Login</ButtonLogin>
            </div>
        </div>
    </div>
    <section class="section-1">
        <div class="image">
            <Logo variant="white" />
        </div>
        <div class="content">
            <h3>The place where your blockchain transactions come to life</h3>
            <p>
                Unicove is built for token holders. It’s a comprehensive interface for all of your
                EOSIO account needs. Create transactions, manage your accounts, monitor your
                activity, and so much more.
            </p>
            <h4>Supported Blockchains</h4>
            <ul class="blockchains">
                {#each chains.filter((chain) => !chain.testnet) as chain}
                    <li class="blockchain">
                        <img
                            alt={chain.name}
                            src={`/images/chains/${chain.id}-${darkmode ? 'dark' : 'light'}.svg`}
                        />
                        <p>{chain.name}</p>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
    <section class="usage">
        <img src="/images/usage.png" alt="Unicove Usage" />
        <ul class="features">
            <li class="feature">
                <h3>Robustly secure</h3>
                <p>
                    Unicove is built to work with Anchor, the secure wallet developed by Greymass.
                    With mobile, desktop, and hardware options, you get access to best-in-class key
                    management and security.
                </p>
            </li>
            <li class="feature">
                <h3>Seamless and intuitive</h3>
                <p>
                    Unicove’s intutive interface makes it easy to take advantage of every feature
                    your favorite blockchain has to offer. With your keys safe in Anchor, you can
                    fully manage your account from any web browser.
                </p>
            </li>
            <li class="feature">
                <h3>Built for users</h3>
                <p>
                    Create transactions, make new accounts, and even earn rewards from your tokens.
                    All with an easy interface that is always up to date. Super easy to use just
                    sign in and get stuff done.
                </p>
            </li>
        </ul>
    </section>
    <section class="anchor">
        <div class="text">
            <h3>Your keys are always safely held by Anchor</h3>
            <p>
                Use Anchor to seamlessly and securely interact with any supported EOSIO-based
                blockchain. Anchor allows you to login to Unicove and manage your account.
            </p>
            <a href="https://greymass.com/anchor/">Learn more about Anchor -></a>
        </div>
        <div class="image" />
    </section>
</div>
