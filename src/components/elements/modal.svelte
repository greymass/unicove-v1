<script lang="ts">
    import Icon from './icon.svelte'
    import Button from './button.svelte'

    export let opened: boolean = false
    export let header: string | null
    export let size: string | null

    const handleClose = function() {
      opened = false
    }
</script>

<style type="scss">
  .container {
      position: fixed; /* Stay in place */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */

      .modal {
        background-color: white;
        position: relative;
        margin: 15% auto; /* 15% from the top and centered */
        padding: 20px;
        border: 1px solid #888;
        width: 80%; /* Could be more or less, depending on screen size */
        max-width: 300px;
        border-radius: 20px;

         &.large {
            max-width: 500px;
         }

         .modal-header {
           padding: 10px;
         }

          .modal-content {
            padding: 20px 10px;
          }

         .button-container {
            display: flex;
            flex-direction: column;
         }
      }
  }
</style>

{#if opened}
<div class="container">
  <div class={`modal ${size}`}>
    {#if header}
        <div class="modal-header">
            <h2>
                {header}
            </h2>
        </div>
        <hr />
    {/if}
    <div class="modal-content">
        <slot />
    </div>
    <div class="button-container">
        <Button size="large" on:action={handleClose}>
           Close
        </Button>
    </div>
  </div>
</div>
{/if}
