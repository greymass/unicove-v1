<script lang="ts">
    import Button from '~/components/elements/button.svelte'
    import {Step, transferData} from '~/pages/send/transfer'
    import StatusContainer from '~/pages/send/status/template/container.svelte'
    import Icon from '~/components/elements/icon.svelte'

    function changeRecipient() {
        transferData.update((data) => ({
            ...data,
            step: Step.Token,
            backStep: data.step,
        }))
    }
</script>

<style type="scss">
    .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--main-grey);
        padding: 6px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 10px;
    }

    .avatar:before {
        content: '';
        float: left;
        width: auto;
    }

    .recipient .account {
        color: var(--main-black);
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 28px;
        letter-spacing: -0.26px;
        vertical-align: middle;
    }
    .control {
        margin-left: auto;
        :global(.button) {
            line-height: 24px;
        }
    }
</style>

<StatusContainer>
    <div class="avatar">
        <Icon name="user" size="huge" />
    </div>
    <div class="recipient">
        Send tokens to...
        <div class="account">
            {#if $transferData.toAddress}
                {$transferData.toAddress}
            {/if}
            {#if $transferData.toAccount}
                {$transferData.toAccount}
            {/if}
        </div>
    </div>
    <div class="control">
        <Button on:action={changeRecipient}>Change</Button>
    </div>
</StatusContainer>
