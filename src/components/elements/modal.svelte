<script lang="ts">
    import Icon from './icon.svelte'
    import Button from './button.svelte'

    export let opened: boolean = false
    export let header: string | null
    export let size: string | null
    export let hideCloseButton: boolean = false

    const handleClose = function() {
      opened = false
    }

    const preventClose = function(event) {
      event.stopPropagation();
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
      z-index: 999;

      .modal {
        background-color: white;
        position: relative;
        margin: 15% auto; /* 15% from the top and centered */
        border: 1px solid #888;
        width: 80%; /* Could be more or less, depending on screen size */
        max-width: 300px;
        border-radius: 20px;

         &.large {
            max-width: 500px;
         }

         .modal-header {
           padding: 20px 40px;
         }

         hr {
           margin: 0;
         }

          .modal-content {
            padding: 20px;
          }

         .button-container {
            display: flex;
            flex-direction: column;
            padding: 20px;
         }
      }
  }
</style>

{#if opened}
<div on:click={handleClose} class="container">
  <div on:click={preventClose} class={`modal ${size}`}>
    {#if header}
        <div class="modal-header">
            <h1>
                {header}
            </h1>
        </div>
        <hr />
    {/if}
    <div class="modal-content">
        <slot />
    </div>
    {#if !hideCloseButton}
        <div class="button-container">
            <Button size="large" on:action={handleClose}>
               Close
            </Button>
        </div>
    {/if}
  </div>
</div>
{/if}
