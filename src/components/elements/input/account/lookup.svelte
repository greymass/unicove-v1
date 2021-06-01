<script lang="ts">
    import type {LinkSession} from 'anchor-link'
    import type {Writable} from 'svelte/store'

    import {writable} from 'svelte/store'

    import InputLabelled from '../labelled.svelte'

    export let name: string = ''
    export let value: string = ''
    export let errorMessage: string | undefined = undefined
    export let activeSession: LinkSession | undefined = undefined
    export let focus: boolean = false
    export let fluid: boolean = false
    export let loading = false
    export let placeholder: string | undefined = undefined

    const isValid = async (value: string): Promise<boolean> => {
        try {
            if (value) {
                loading = true
                await validateExistence(value)
                loading = false
            } else {
                errorMessage = undefined
                return false
            }
        } catch (errorObject) {
            errorMessage = errorObject.message
            return false
        }
        errorMessage = undefined
        return true
    }

    async function validateExistence(value: string) {
        if (!activeSession) {
            return
        }
        return activeSession.client.v1.chain.get_account(value).catch((error) => {
            const isUnkownAccountError = error.toString().includes('exception: unknown key')

            if (loading) {
                loading = false
            }

            if (isUnkownAccountError) {
                throw {
                    valid: false,
                    message: 'Account name not found.',
                }
            }
        })
    }
</script>

<style type="scss">
</style>

<InputLabelled {name} {fluid} {focus} {placeholder} {errorMessage} bind:value {isValid} />
