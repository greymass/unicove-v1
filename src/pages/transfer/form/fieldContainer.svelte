<script lang="ts">
    import Icon from '~/components/elements/icon.svelte'

    export let label: string
    export let secondLabel: string | null = null

    let editing: string = false
</script>

<style type="scss">
  div {
      margin: 20px 0;
      display: flex;

      label {
         display: block;
         margin: 5px 0;
      }

      a {
        color: var(--main-blue)
      }
  }
</style>

<div>
    <div class="label-container">
        <label> {label} </label>
    </div>

    <div class="value-container">
        {#if editing}
            <slot />
            <a on:click={() => editing = false}>
                <Icon color={valid ? 'green' : 'grey'} name="check"/>
            </a>
        {#else}
            <a on:click={() => editing = true}>
                {value || placeholder}
            </a>
        {/if}
    </div>
    <hr />
</div>
