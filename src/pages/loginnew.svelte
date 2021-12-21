<script lang="ts">
    import {version, isRelease, releaseVersion} from '~/config'

    import Logo from '~/components/elements/logo.svelte'
    import Unicove from '~/components/elements/unicove.svelte'
    import Button from '~/components/elements/button.svelte'
    import ButtonLogin from '~/components/elements/button/login.svelte'
    import ThemeButton from '~/components/elements/button/mode.svelte'
    import Icon from '~/components/elements/icon.svelte'
    import Text from '~/components/elements/text.svelte'
</script>

<style lang="scss">
    .container {
        background-image: url('/images/noise-light.png');
        min-height: 100vh;
        :global(.darkmode) & {
            background-image: url('/images/noise-dark.png');
        }
        > * {
            margin: 0 auto;
            max-width: 1200px;
        }
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
        }
    }
    .tagline {
        display: flex;
        justify-content: center;
        position: relative;
        height: 500px;
        background: #eeeeee;
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
            background: #eeeeee;
            filter: blur(100px);
        }
        .circle {
            width: 100%;
            padding-top: 100%;
            border-radius: 50%;
            background: linear-gradient(
                180deg,
                #669bbc 0%,
                #f5f1cc 34.9%,
                #ffa253 67.19%,
                #f9c5b8 99.48%
            );
        }
        .cloud {
            position: absolute;
            width: 70%;
            height: 70%;
            // left: 0;
            top: 45%;

            background: linear-gradient(0deg, #f9c5b8, #f9c5b8);
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

            background: linear-gradient(0deg, #eeeeee, #eeeeee);
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

            background: linear-gradient(0deg, #eeeeee, #eeeeee);
            background-blend-mode: overlay;
            mix-blend-mode: normal;
            filter: blur(100px);
        }
        .unicove {
            flex: 1;
            margin-top: 12%;
            max-width: 535px;
            z-index: 10;
        }
    }
</style>

<div class="container">
    <header>
        <div class="logo">
            <Logo width={40} dark />
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
            <Button style="secondary" size="regular"
                ><Icon name="plus" /><Text>New Account</Text></Button
            >
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
    </div>
</div>
