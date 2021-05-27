<script>
  import Icon from '~/components/elements/icon.svelte'

  export let token;
  export let onClick;
  export let isTableRow;
</script>

<style type="scss">
  .row {
    padding: 10px 12px;
    border-radius: 12px;
    width: 200px;
    border: 1px solid var(--divider-grey);
    position: relative;
    cursor: pointer;

    .logo-container {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px;
      margin-right: 5px;

      img {
        width: 18px;
      }
    }

    .name-text {
      font-family: Inter;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: -0.04px;
      color: var(--main-black);
      display: inline;
      margin-left: 25px;
    }

    .balance-container {
      display: inline;
      float: right;
      padding: 5px;
      width: 70px;
    }

    .arrow-container {
      position: absolute;
      right: 15px;
      top: 1px;
      width: 20px;
      padding: 10px;
    }
  }
</style>

<div class="row {isTableRow ? 'withBorder' : ''}" on:click={onClick}>
  <span class="logo-container">
    <img src={token.logo}>
  </span>
  <h2 class="name-text {isTableRow ? 'blueText' : ''}" >
    {token.name}
  </h2>
  <span class="balance-container">
     {token.balance}
  </span>
  <div class="arrow-container">
      <Icon name="chevron-right" size="large" />
  </div>
</div>
