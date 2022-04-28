<script lang="ts">
    import {AccountCreator} from '@greymass/account-creation'
    import type {AccountCreationResponse} from '@greymass/account-creation'

    import {version, isRelease, releaseVersion, chains} from '~/config'
    import {darkMode} from '~/store'
    import {addToast} from '~/stores/toast'

    import Logo from '~/components/elements/logo.svelte'
    import Unicove from '~/components/elements/unicove.svelte'
    import Button from '~/components/elements/button.svelte'
    import ButtonLogin from '~/components/elements/button/login.svelte'
    import ThemeButton from '~/components/elements/button/mode.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
    import MediaQuery from '~/components/utils/media-query.svelte'
    import Features from '~/components/elements/features.svelte'
    import UnicoveAnimated from '~/components/elements/unicove-animated.svelte'

    const whalesplainerUrl = import.meta.env.SNOWPACK_PUBLIC_WHALESPLAINER_URL

    let creatingAccount = false

    async function createAccount(event: Event) {
        event.preventDefault()

        if (creatingAccount) return

        creatingAccount = true

        const accountCreator = new AccountCreator({
            scope: 'unicove',
            whalesplainerUrl,
        })

        const accountCreationResponse: AccountCreationResponse =
            await accountCreator.createAccount()

        creatingAccount = false

        if (accountCreationResponse.error) {
            addToast({
                title: 'Account not created!',
                message: accountCreationResponse.error,
                timeout: 10000,
            })
        } else {
            addToast({
                title: 'Account created!',
                message: `Successfully created the "${
                    (accountCreationResponse as any).sa
                }" account. Please login to use Unicove.`,
                timeout: 10000,
            })
        }
    }
</script>

<style lang="scss">
    .container {
        --padding: 30px;

        background-image: url('/images/noise-light.jpeg');
        overflow: hidden;
        isolation: isolate;
        :global(.darkmode) & {
            background-image: url('/images/noise-dark.jpeg');
        }
        > * {
            margin: 0 auto;
            max-width: 1200px;
        }
        header {
            max-width: 950px;
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
        padding: 36px 10px 20px 10px;
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
                    :global(.darkmode) & {
                        color: #ffffff;
                    }
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
        padding: 0 var(--padding);
        &::after {
            position: absolute;
            content: '';
            inset: 0;
            background-image: url('/images/unicove-bg-light.jpeg');
            background-repeat: no-repeat;
            background-size: contain;
            background-position: top center;
            :global(.darkmode) & {
                background-image: url('/images/unicove-bg-dark.jpeg');
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
    .transactions {
        margin-top: 30px;
        max-width: 950px;
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

        @media (max-width: 699px) {
            grid-template-columns: 1fr;
        }
        .image {
            position: relative;
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            max-height: 250px;
            img {
                max-width: 100%;
                @media (max-width: 699px) {
                    width: 100%;
                    height: 500px;
                    object-fit: cover;
                }
            }
            .logo {
                position: absolute;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .content {
            margin-top: 30px;
            padding: 0 var(--padding);
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
            display: grid;
            grid-auto-flow: column;
            column-gap: 15px;
        }

        .blockchain {
            display: flex;
            flex-direction: column;
            align-items: center;
            p {
                color: var(--light-grey);
                margin-top: 8px;
            }
        }
        @media (max-width: 355px) {
            .blockchains {
                justify-content: space-between;
            }

            .blockchain {
                margin-right: 0;
            }
        }
    }
    .usage {
        margin-top: 150px;
        max-width: 900px;
        padding: 0 var(--padding);
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        @media (max-width: 842px) {
            margin-top: 0;
        }

        h3 {
            font-size: 20px;
            text-align: left;
        }
        p {
            margin-top: 20px;
        }
        .big-image {
            display: flex;
            justify-content: center;
            visibility: hidden;
            height: 0;
            width: 100%;
            @media (min-width: 843px) {
                visibility: visible;
                height: auto;
            }
            & :global(svg) {
                width: 100%;
            }
        }
        .features {
            width: 100%;
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 50px;
            @media (max-width: 842px) {
                grid-template-columns: 1fr;
            }
        }
        .feature {
            display: flex;
            flex-direction: column;
            .image {
                display: none;
                width: 250px;
                height: 150px;
                align-self: center;
                @media (max-width: 842px) {
                    display: flex;
                }
                & :global(svg) {
                    width: 100%;
                }
            }
        }
    }

    .anchor,
    .greymass {
        margin-top: 120px;
        max-width: 900px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        @media (max-width: 899px) {
            grid-template-columns: 1fr;
        }
        h3 {
            font-size: 20px;
            text-align: left;
        }
        p {
            margin-top: 20px;
        }
        .text {
            padding: 0 var(--padding);
        }
        .image {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .anchor {
        grid-template-areas: 'text image';
        @media (max-width: 899px) {
            grid-template-areas: 'image' 'text';
        }
        .text {
            grid-area: text;
        }
        .image {
            grid-area: image;
            min-height: 300px;
            background-image: url('/images/anchor-bg-light.jpeg');
            background-size: auto;
            background-repeat: no-repeat;
            background-position: center;
            :global(.darkmode) & {
                background-image: url('/images/anchor-bg-dark.jpeg');
            }
        }
        .link {
            margin-top: 20px;
        }
    }
    .greymass {
        margin-top: 0;
        margin-bottom: 50px;
        .image {
            min-height: 500px;
            background-image: url('/images/greymass-bg-light.jpeg');
            background-size: auto;
            background-repeat: no-repeat;
            background-position: center;
            :global(.darkmode) & {
                background-image: url('/images/greymass-bg-dark.jpeg');
            }
        }
    }
    footer {
        padding: 70px 30px;
        background: var(--white);
        @media (max-width: 550px) {
            padding: 40px 30px;
        }
        .content {
            display: grid;
            grid-template-areas: 'logo links support' 'bottom bottom bottom';
            grid-template-columns: repeat(3, 1fr);
            row-gap: 50px;
            max-width: 850px;
            margin: 0 auto;
            @media (max-width: 550px) {
                grid-template-columns: 100px 1fr;
                grid-template-areas: 'logo links' 'support support' 'bottom bottom';
            }
            h4 {
                font-weight: bold;
                font-size: 10px;
                line-height: 12px;
                text-transform: uppercase;
                color: var(--rich-black-FOGRA);
            }
            p,
            li {
                margin-top: 10px;
                color: var(--main-black);
                font-style: normal;
                font-weight: normal;
                font-size: 13px;
                line-height: 16px;
            }
            .logo {
                grid-area: logo;
            }
            .links {
                grid-area: links;
                li,
                a {
                    color: var(--main-black);
                    text-decoration: none;
                }
            }
            .support {
                grid-area: support;
                .button {
                    margin-top: 20px;
                }
            }
            .bottom {
                grid-area: bottom;
                border-top: 1px solid var(--cultured);
                padding-top: 10px;
                color: var(--dark-grey);
                display: flex;
                justify-content: space-between;
                p {
                    color: var(--dark-grey);
                }
            }
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
                    <Button
                        style="tertiary"
                        size="regular"
                        on:action={createAccount}
                        disabled={creatingAccount}
                        ><Icon name="plus" /><Text>New Account</Text></Button
                    >
                {/if}
            </MediaQuery>
            <ButtonLogin style="tertiary">Login</ButtonLogin>
        </div>
    </header>
    <section class="tagline">
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
                <Button
                    style="effect"
                    size="regular"
                    on:action={createAccount}
                    disabled={creatingAccount}
                    ><Icon name="plus" /><Text>Create new account</Text></Button
                >
            </div>
            <div class="action">
                <h3>Login to wallet</h3>
                <p>Use Anchor to login and manage your account and tokens.</p>
                <ButtonLogin style="effect">Login</ButtonLogin>
            </div>
        </div>
    </section>
    <section class="transactions">
        <div class="image">
            <img
                src={$darkMode ? '/images/logo-bg-dark.jpeg' : '/images/logo-bg-light.jpeg'}
                alt="Unicove Logo"
            />
            <div class="logo">
                <MediaQuery query="(max-width: 699px)" let:matches>
                    {#if matches}
                        <UnicoveAnimated style="width: 70%;" />
                    {:else}
                        <UnicoveAnimated style="width: 42%;" />
                    {/if}
                </MediaQuery>
            </div>
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
                            src={`/images/chains/${chain.id}-${$darkMode ? 'dark' : 'light'}.svg`}
                        />
                        <p>{chain.name}</p>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
    <section class="usage">
        <div class="big-image">
            <Features />
        </div>
        <ul class="features">
            <li class="feature">
                <div class="image">
                    <Features portion="left" />
                </div>
                <h3>Robustly secure</h3>
                <p>
                    Unicove is built to work with Anchor, the secure wallet developed by Greymass.
                    With mobile, desktop, and hardware options, you get access to best-in-class key
                    management and security.
                </p>
            </li>
            <li class="feature">
                <div class="image">
                    <Features portion="center" />
                </div>
                <h3>Seamless and intuitive</h3>
                <p>
                    Unicove’s intutive interface makes it easy to take advantage of every feature
                    your favorite blockchain has to offer. With your keys safe in Anchor, you can
                    fully manage your account from any web browser.
                </p>
            </li>
            <li class="feature">
                <div class="image">
                    <Features portion="right" />
                </div>
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
            <div class="link">
                <Button href="https://greymass.com/anchor/" style="secondary"
                    >Learn more about Anchor -></Button
                >
            </div>
        </div>
        <div class="image">
            <img src="/images/anchor.svg" alt="Anchor Logo" />
        </div>
    </section>
    <section class="greymass">
        <div class="image">
            <img src="/images/greymass.svg" alt="Greymass Logo" />
        </div>
        <div class="text">
            <h3>
                Greymass is an organization dedicated to making blockchain technology more usable
                and accessible.
            </h3>
            <p>
                We fix the broken and complicated things in crypto so that you can realize the full
                potential of blockchain while having fun and staying safe. Our team consists of
                developers, designers, product experts, and more. Unicove is our newest project — a
                one-stop-shop interface for EOSIO blockchains.
            </p>
            <p>We’re always looking for feedback, so if you have some get in touch!</p>
        </div>
    </section>
</div>
<footer>
    <div class="content">
        <div class="logo"><Logo width={65} /></div>
        <div class="links">
            <h4>Unicove</h4>
            <ul>
                <li><ButtonLogin asLink>Sign In</ButtonLogin></li>
                <li>
                    <a href="https://create.anchor.link/" on:click={createAccount}>
                        Create new account</a
                    >
                </li>
                <li>
                    <a
                        href="https://forums.eoscommunity.org/c/greymass/anchor-wallet/5"
                        target="_blank">Feedback</a
                    >
                </li>
                <li>
                    <a
                        href="https://forums.eoscommunity.org/c/greymass/anchor-wallet/5"
                        target="_blank">Support</a
                    >
                </li>
                <li>Press</li>
                <li>
                    <a href="https://greymass.com/anchor/download" target="_blank">Get Anchor</a>
                </li>
            </ul>
        </div>
        <div class="support">
            <h4>Vote and support our endavours</h4>
            <p>
                Like our commitment to making the boring blockchain stuff less tedious? Vote for us
                so we can make fun stuff that simplifies and enhances your blockchain experience!
            </p>
            <div class="button">
                <Button href="https://greymass.com/support-us" target="_blank">
                    <Icon name="thumbs-up" /><Text>Vote for teamgreymass</Text>
                </Button>
            </div>
        </div>
        <div class="bottom">
            <p class="version">
                Unicove
                {#if isRelease}
                    {releaseVersion}
                {:else}
                    {version}
                {/if}
            </p>
            <p>©2021 Greymass. All rights reserved</p>
        </div>
    </div>
</footer>
