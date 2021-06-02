<script lang="ts">
    import ButtonLogin from '~/components/elements/button/login.svelte'
    import Page from '~/components/layout/page.svelte'
    import {chains} from '~/config'
    import {preferences} from '~/store'

    import Icon from '~/components/elements/icon.svelte'
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'

    $: darkmode = $preferences.darkmode
</script>

<style lang="scss">
    .login {
        header {
            margin-top: 52px;
            text-align: center;
            h1 {
                color: var(--main-black);
                font-family: Inter;
                font-style: normal;
                font-weight: bold;
                font-size: 24px;
                line-height: 29px;
                letter-spacing: -0.47px;
            }
            p {
                color: var(--light-grey);
                font-family: Inter;
                font-style: normal;
                font-weight: 300;
                font-size: 16px;
                line-height: 19px;
                letter-spacing: -0.18px;
                margin: 7px 0 41px;
            }
        }
    }
    .blockchains {
        margin-top: 52px;
        text-align: center;
        h3 {
            color: var(--main-black);
            font-family: Inter;
            font-style: normal;
            font-weight: 600;
            font-size: 12px;
            line-height: 15px;
            letter-spacing: -0.09px;
            margin-bottom: 9px;
        }
        .blockchain {
            display: inline-block;
            margin: 13px 10px;
            text-align: center;
            p {
                font-family: Inter;
                font-style: normal;
                font-weight: 500;
                font-size: 10px;
                line-height: 14px;
                letter-spacing: 0.01px;
                margin-top: 4px;
            }
            img {
                width: 40px;
                height: 40px;
            }
        }
    }
    .info {
        margin-top: 74px;
        :global(.segment-group) {
            justify-content: center;
        }
        :global(.segment) {
            max-width: 316px;
            text-align: center;
        }
        .box {
            .icon {
                background: var(--main-grey);
                border-radius: 50%;
                display: inline-block;
                padding: 12px;
            }
            h4 {
                font-family: Inter;
                font-style: normal;
                font-weight: 600;
                font-size: 12px;
                line-height: 26px;
                text-align: center;
                letter-spacing: -0.09px;
                margin-top: 6px;
            }
            p {
                font-family: Inter;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 15px;
                text-align: center;
                letter-spacing: 0.01px;
                margin-bottom: 20px;
            }
            a {
                font-family: Inter;
                font-style: normal;
                font-weight: 600;
                font-size: 12px;
                line-height: 15px;
                /* identical to box height */

                text-align: center;
                letter-spacing: 0.01px;
                color: var(--main-blue);
                text-decoration: none;
            }
        }
    }
</style>

<Page>
    <div class="login">
        <header>
            <h1>Greymass Web Wallet</h1>
            <p>The easiest way to manage your EOSIO account.</p>
        </header>
        <ButtonLogin>Login with Anchor</ButtonLogin>
    </div>
    <div class="blockchains">
        <h3>Supported blockchains</h3>
        {#each chains.filter((chain) => !chain.testnet) as chain}
            <div class="blockchain">
                <img
                    alt={chain.name}
                    src={`/images/chains/${chain.id}-${darkmode ? 'dark' : 'light'}.svg`}
                />
                <p>{chain.name}</p>
            </div>
        {/each}
    </div>
    <div class="info">
        <SegmentGroup>
            <Segment color="white">
                <div class="box">
                    <div class="icon">
                        <Icon name="download" size="large" />
                    </div>
                    <h4>Don't have Anchor yet?</h4>
                    <p>Anchor is an easy way to secure your blockchain account and keys.</p>
                    <a href="https://greymass.com/anchor/download">Download Anchor</a>
                </div>
            </Segment>
            <Segment color="white">
                <div class="box">
                    <div class="icon">
                        <Icon name="message-circle" size="large" />
                    </div>
                    <h4>Need help or have feedback?</h4>
                    <p>Help us get better by talking with us. We love connecting with our users.</p>
                    <a href="https://forums.eoscommunity.org/c/greymass/anchor-wallet/5"
                        >Join the Forums</a
                    >
                </div>
            </Segment>
        </SegmentGroup>
    </div>
</Page>
