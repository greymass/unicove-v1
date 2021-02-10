<script lang="ts">
    import {Name} from '@greymass/eosio'

    import AutoComplete from 'simple-svelte-autocomplete'

    import Input from '~/components/elements/input.svelte'

    export let fieldAccountName: string = ''
    export let value: string = ''
    export let errorMessage: string | null
    let searchedString
    let relevantAccountNames

    const handleInput = (value: string) => {
      searchedString = value;

      // do eosio account lookup here..s

      relevantAccountNames = ['teamgreymass', 'dafugatester']
    }

    const selectResult(accountName) {
        fieldAccountName = accountName
    }

    const validate = (value: string) => {
        try {
            validatePresence(value)
            validateLength(value)
            validateIsString(value)
        } catch (errorObject) {
            errorMessage = errorObject.message

            return false
        }

        return true
    }

    function validatePresence(value: string) {
        if (value.length === 0) {
            throw {
                valid: false,
                message: null,
            }
        }
    }

    function validateLength(value: string) {
        if (value.length > 13) {
            throw {
                valid: false,
                message: 'An account name should be 13 characters or less.',
            }
        }
    }

    function validateIsString(value: string) {
        if (Name.from(value).toString() !== value) {
            throw {
                valid: false,
                message: 'Is not a valid account name.',
            }
        }
    }
</script>

<style type="scss">
  .autocomplete {
    position: relative;
  }

  .hide-results {
    display: none;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #dbdbdb;
    height: 6rem;
    overflow: auto;
    width: 100%;

    background-color: white;
    box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 100;
  }

  .autocomplete-result {
    color: #7a7a7a;
    list-style: none;
    text-align: left;
    height: 2rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }
</style>

<Input on:changed on:change={handleInput} {fieldAccountName} bind:value isValid={validate} {errorMessage} />

<ul class="autocomplete-results {relevantAccountNames.length === 0 ? ' hide-results' : ''}" ref:list>
  {#each relevantAccountNames as accountName}
    <li on:click="selectResult(accountName)" class="autocomplete-result">
      {accountName}
    </li>
  {/each}
</ul>
