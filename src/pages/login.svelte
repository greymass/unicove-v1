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
    import Anchor from '~/components/elements/anchor.svelte'

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
    .noise {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(rgba(255, 255, 255, 0), rgba(150, 150, 150, 0.5)),
            url('/images/logo-noise.png');
        mix-blend-mode: overlay;
    }
    .tagline {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        .background {
            position: absolute;
            top: 0;
            width: 100%;
            height: 500px;
            display: flex;
            justify-content: center;
        }
        .sun-container {
            z-index: 0;
            position: absolute;
            max-width: 480px;
            width: 100%;
        }
        .fadeout-border {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 75%;
            left: 0;
            background: var(--cultured);
            filter: blur(100px);
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

            background: var(--melon);
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
        }
        .union {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 25%;
            top: 60%;

            background: var(--cultured);
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
        }
        .cut {
            position: absolute;
            width: 70%;
            height: 70%;
            left: 30%;
            top: 37%;

            background: var(--cultured);
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
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
        max-width: 950px;
        position: relative;
        z-index: 10;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        .image {
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            max-height: 250px;
        }
        .background {
            z-index: -1;
            position: absolute;
            width: 50%;
            height: 100%;
            background: var(--cultured);
            .color {
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    var(--air-superiority-blue) 0%,
                    var(--melon) 20%,
                    var(--melon) 60%,
                    var(--light-goldenrod-yellow) 100%
                );
                mix-blend-mode: normal;
                filter: blur(50px);
            }
        }
        .content {
            margin-top: 30px;
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
            font-size: 20px;
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

    .anchor,
    .greymass {
        margin-top: 120px;
        max-width: 900px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        h3 {
            font-size: 20px;
            text-align: left;
        }
        p,
        .link {
            margin-top: 20px;
        }
        .image-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .image {
            width: 100px;
        }
    }
    .greymass {
        margin-bottom: 50px;
        .image {
            width: 150px;
        }
    }
    footer {
        padding: 70px 0;
        background: var(--white);
        .content {
            display: grid;
            grid-template-areas: 'logo links support' 'bottom bottom bottom';
            grid-template-columns: repeat(3, 1fr);
            max-width: 850px;
            margin: 0 auto;
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
                margin-top: 40px;
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
                    <Button style="secondary" size="regular"
                        ><Icon name="plus" /><Text>New Account</Text></Button
                    >
                {/if}
            </MediaQuery>
            <ButtonLogin>Login</ButtonLogin>
        </div>
    </header>
    <div class="tagline">
        <div class="background">
            <div class="sun-container">
                <div class="circle" />
            </div>
            <div class="cut" />
            <div class="cloud" />
            <div class="union" />
            <div class="fadeout-border" />
            <div class="noise" />
        </div>
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
    <section class="transactions">
        <div class="image">
            <div class="background">
                <div class="color" />
                <div class="noise" />
            </div>
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
            <div class="link">
                <Button href="https://greymass.com/anchor/" style="secondary"
                    >Learn more about Anchor -></Button
                >
            </div>
        </div>
        <div class="image-container">
            <div class="image">
                <Anchor />
            </div>
        </div>
    </section>
    <section class="greymass">
        <div class="image-container">
            <div class="image">
                <svg viewBox="0 0 147 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M146.336 51.1241L146.34 51.143L146.336 51.1241C146.264 50.5765 146.184 50.0713 146.089 49.5757C146.042 49.3207 145.985 49.0564 145.928 48.7967L145.767 48.1075C145.35 46.2522 144.833 44.3733 144.24 42.5227C143.615 40.5541 142.956 38.7743 142.235 37.0795C139.225 29.8661 134.726 23.2333 129.227 17.8987C123.832 12.6585 117.101 8.34366 109.758 5.42145C102.922 2.70224 95.4035 0.988566 87.411 0.332366C80.3145 -0.262462 72.6728 -0.0594634 64.6945 0.94608C57.4699 1.88081 50.0368 3.43397 42.5895 5.5678C38.7828 6.64416 35.1564 7.96128 31.8001 9.49084C28.2874 11.0865 24.9026 12.9795 21.7407 15.1228C14.8812 19.7587 9.43434 25.334 5.54238 31.6978C3.30485 35.3989 1.79263 39.1473 1.05311 42.839C0.621723 45.02 0.474765 47.1397 0.61698 49.1366C0.792379 51.4687 1.36124 53.6309 2.30934 55.5664C2.81658 56.6097 3.44233 57.5964 4.16288 58.4886C4.33354 58.7011 4.52316 58.9371 4.74123 59.159C4.97825 59.4234 5.22476 59.6594 5.41438 59.8388C5.84103 60.2354 6.32456 60.6177 6.88868 61.0048C7.81308 61.6233 8.87495 62.1567 10.0411 62.5958C10.956 62.931 11.9231 63.2189 13.094 63.5022C14.0848 63.7382 15.0518 63.9318 15.9288 64.1112C16.8343 64.2953 17.6923 64.47 18.5124 64.673C20.0436 65.0506 21.2667 65.4897 22.2432 66.0184C23.7365 67.6329 25.4051 69.2097 27.1923 70.6968C29.0126 72.2169 31.0131 73.6662 33.1416 75.0069C35.1374 76.2579 37.2991 77.4382 39.5698 78.5098C41.7172 79.5106 43.9927 80.417 46.3392 81.2101C50.8996 82.7255 55.6496 83.7736 60.4612 84.3306C65.2586 84.8877 70.0939 84.9963 74.825 84.6611C79.7266 84.3023 84.4814 83.4997 88.9564 82.2676C93.8439 80.9033 98.3142 79.0716 102.244 76.8245C104.439 75.5687 106.449 74.1902 108.217 72.7268C110.128 71.1594 111.844 69.3938 113.304 67.4724C114.863 65.4141 116.063 63.252 116.864 61.0426C117.712 58.7672 118.148 56.3359 118.163 53.8197L118.167 52.9888L115.608 52.8803L115.536 53.7064C115.356 55.8214 114.816 57.8891 113.929 59.8577C113.105 61.7035 111.938 63.4975 110.464 65.1781C109.142 66.6888 107.577 68.0956 105.681 69.4882C104.022 70.7015 102.145 71.8298 100.101 72.8495C96.399 74.6859 92.2132 76.1163 87.6575 77.1077C83.4527 78.033 79.0345 78.557 74.531 78.6562C65.6947 78.8733 56.7589 77.4287 48.7047 74.4876C40.3472 71.4427 32.8619 66.6982 27.0501 60.7594L26.6424 60.3581L26.2442 60.1315C23.9924 58.9041 21.717 58.3565 19.9867 58.0213C18.9675 57.8183 17.9767 57.6625 16.9955 57.5067C16.1232 57.3698 15.2983 57.2376 14.5067 57.0818C13.6012 56.9024 12.8522 56.7183 12.217 56.5059C11.5202 56.2746 10.9039 55.996 10.3919 55.6797C10.0933 55.4909 9.86098 55.3209 9.65714 55.1463C9.5481 55.0518 9.44382 54.9622 9.34901 54.863L9.31108 54.8252C9.22575 54.7497 9.13094 54.6364 9.00769 54.4948C8.56208 53.9802 8.16862 53.4043 7.84152 52.7906C7.20155 51.5867 6.79387 50.1799 6.62795 48.6173C6.48099 47.1539 6.54736 45.5676 6.82705 43.9012C7.33429 40.9082 8.53364 37.7593 10.3824 34.535C12.0416 31.6458 14.1606 28.8605 16.6731 26.2593C19.0671 23.7762 21.7739 21.4724 24.7177 19.4235C30.359 15.5099 36.844 12.4791 43.9974 10.4161C51.5206 8.24924 58.5034 6.77634 65.3344 5.91242C69.0178 5.4545 72.6633 5.17125 76.1618 5.06739C80.0395 4.98241 83.5759 5.09099 86.9749 5.40257C88.5298 5.53475 90.2269 5.74247 92.308 6.05877C94.2089 6.37034 95.9344 6.71025 97.5747 7.09264C99.4898 7.55056 101.177 8.01321 102.732 8.50889C104.472 9.07068 106.155 9.68911 107.738 10.3406C114.479 13.1401 120.372 17.03 125.255 21.902C130.118 26.7739 134.067 32.8072 136.674 39.355C137.3 40.894 137.869 42.518 138.414 44.3213C138.926 46.0161 139.367 47.7345 139.723 49.434L139.86 50.0713C139.898 50.2743 139.936 50.4632 139.969 50.6662C140.031 51.0344 140.083 51.4215 140.13 51.8511C140.211 52.6159 140.254 53.4279 140.249 54.2635C140.239 55.8591 140.05 57.4831 139.689 59.0929C138.969 62.3361 137.58 65.3292 135.674 67.7462C134.688 68.9973 133.579 70.0689 132.384 70.9281C131.171 71.8015 129.843 72.4765 128.445 72.925C128.07 73.043 127.724 73.1422 127.359 73.2272C127.193 73.2649 127.023 73.3074 126.838 73.3405L125.989 73.5246C124.51 73.907 123.192 74.582 122.059 75.5309C120.808 76.5742 119.846 77.9811 119.348 79.4917L119.139 80.1149C119.082 80.2848 119.016 80.4501 118.95 80.6153C118.822 80.9363 118.675 81.2621 118.514 81.5831C117.305 84.0049 115.262 86.1057 112.431 87.8146C111.17 88.5841 109.753 89.2734 108.099 89.9248C106.653 90.5008 105.088 91.0012 103.32 91.4686C101.756 91.884 100.106 92.2333 98.281 92.5402C96.6218 92.8234 94.8773 93.0548 93.0996 93.2247C91.3504 93.3994 89.5869 93.5174 87.8471 93.5788C86.9607 93.6118 86.0979 93.6307 85.2825 93.6354C84.8606 93.4608 84.4624 93.305 84.0642 93.1633C81.5517 92.2805 79.3474 91.8982 77.1051 91.969C76.4984 91.9831 75.8489 92.0492 75.1236 92.172C74.7918 92.2286 74.4647 92.3042 74.1234 92.3891L73.3886 92.6063C73.308 92.6299 73.1895 92.6724 73.0994 92.7054C72.9667 92.7573 72.796 92.8282 72.5448 92.9556C72.3409 93.0689 72.0328 93.2342 71.5919 93.6213C71.2127 93.98 70.3309 94.8204 70.165 96.5624C70.0987 97.752 70.4542 98.8142 71.2269 99.7253C71.6061 100.155 71.8669 100.339 72.0565 100.476L72.1276 100.528C72.5021 100.778 72.7391 100.887 72.9145 100.967L72.9714 100.995C73.18 101.085 73.3364 101.146 73.4549 101.184C73.9385 101.349 74.2608 101.43 74.6164 101.51C75.2563 101.656 75.811 101.746 76.3135 101.821C78.1528 102.086 80.0585 102.251 82.3102 102.331C83.2062 102.364 84.1258 102.383 85.036 102.388C85.3299 102.525 85.6238 102.666 85.9083 102.813C88.6673 104.205 91.5258 106.023 94.6498 108.374C97.4751 110.498 100.215 112.83 102.789 115.304C104.164 116.621 105.378 117.886 106.501 119.161C107.193 119.954 107.724 120.606 108.184 121.215C108.762 121.979 109.227 122.678 109.601 123.363L109.952 124L112.01 123.306L111.877 122.57C111.716 121.682 111.431 120.752 110.986 119.638C110.616 118.732 110.194 117.835 109.729 116.966C108.886 115.375 107.881 113.76 106.657 112.023C104.496 108.969 101.96 106.009 99.1153 103.223C98.5133 102.643 97.9018 102.072 97.2997 101.529C98.1578 101.401 99.011 101.264 99.8406 101.109C101.832 100.74 103.785 100.282 105.648 99.7489C110.075 98.4649 113.759 96.8267 116.911 94.7401C118.822 93.4749 120.5 92.0539 121.898 90.5102C123.453 88.7965 124.705 86.8893 125.605 84.8405C125.838 84.3117 126.046 83.7783 126.226 83.2543C126.316 82.9852 126.406 82.7161 126.492 82.4328L126.691 81.72C126.738 81.5312 126.862 81.3376 127.042 81.1629C127.279 80.9363 127.615 80.7475 127.952 80.6342L128.469 80.502C128.744 80.4359 129.014 80.3651 129.284 80.2848C129.801 80.1385 130.322 79.9638 130.877 79.7608C132.958 78.9819 134.901 77.8819 136.655 76.4893C138.334 75.1627 139.836 73.5859 141.126 71.8109C143.52 68.511 145.16 64.6682 146.004 60.3864C146.397 58.3659 146.582 56.2982 146.563 54.2304C146.535 53.1588 146.464 52.1155 146.336 51.1241Z"
                        fill="white"
                    />
                </svg>
            </div>
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
                <li><ButtonLogin>Sign In</ButtonLogin></li>
                <li>Create new account</li>
                <li>
                    <a href="https://forums.eoscommunity.org/c/greymass/anchor-wallet/5">Feedback</a
                    >
                </li>
                <li>
                    <a href="https://forums.eoscommunity.org/c/greymass/anchor-wallet/5">Support</a>
                </li>
                <li>Press</li>
                <li><a href="https://greymass.com/anchor/download">Get Anchor</a></li>
            </ul>
        </div>
        <div class="support">
            <h4>Vote and support our endavours</h4>
            <p>
                Like our commitment to making the boring blockchain stuff less tedious? Vote for us
                so we can make fun stuff that simplifies and enhances your blockchain experience!
            </p>
            <div class="button">
                <Button>
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
