<script lang="ts">
    import type {LinkSession} from 'anchor-link'

    import Input from '~/components/elements/input.svelte'

    import Account from '../account.svelte'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | undefined = undefined
    export let activeSession: LinkSession | undefined = undefined
    export let valid: boolean = false
    export let focus: boolean = false
    export let fullWidth: boolean = false
    export let placeholder: string | undefined = undefined

    const validate = async (value: string) => {
        try {
            await validateExistence(value)
        } catch (errorObject) {
            errorMessage = errorObject.message
            valid = false
            return false
        }

        errorMessage = undefined
        valid = true
        return true
    }

    async function validateExistence(value: string) {
        if (!activeSession) {
            return
        }
        return activeSession.client.v1.chain.get_account(value).catch((error) => {
            const isUnkownAccountError = error.toString().includes('exception: unknown key')

            if (isUnkownAccountError) {
                throw {
                    valid: false,
                    message: 'Is not a valid account name.',
                }
            }
        })
    }
</script>

<style type="scss">
</style>

<div>
    <Account
      {name}
      {fullWidth}
      {focus}
      {placeholder}
      {errorMessage}
      {valid}
      bind:value
      isValid={validate}
    />
</div>
