<script>
    import List from './list.svelte'
    
    import xBlueIcon from '../../../../public/images/x-blue.svg'
    
    export let open = false
</script>

<aside class:open>
    <div class="header">
        <a on:click={() => open = false }>
            <img src={xBlueIcon} />
        </a>
        <h2>
            Accounts
        </h2>
        <br />
        <hr />
    </div>
    
    <List />
</aside>

<style>
    aside {
        height: 100%;
        max-width: 300px;
        position: absolute;
        right: -100%;
        transition: left 0.3s ease-in-out;
        width: 50%;
        top: 0;
        background-color: var(--main-grey);
        border-color: darkgray;
        border-right-width: 2px;
        display: none;
    }
    
    .header {
        margin: 18px;
    }
    
    .header a {
        cursor: pointer;
        margin-right: 5px;
        margin-bottom: -10px;
    }
    
    .header h2 {
        color: var(--dark-grey);
        font-size: 14px;
        font-weight: normal;
        display: inline-block;
    }
    
    .open {
        display: block;
        right: 0;
    }
</style>

