<script>
  import Icon from '~/components/elements/icon.svelte'

  export let valid: boolean
</script>

<style type="scss">
  span.icon {
    &.success {
      color: var(--success-green);
    }

    &.error {
      color: var(--error-red);
    }
  }
</style>

{#if valid}
    <span class="success icon">
        <Icon name="check" size="large" />
    </span>
{:else}
  <span class="error icon">
      <Icon name="alert-circle" size="large" />
  </span>
{/if}
