<script>
    import MediaQuery from '../../utils/media-query.svelte'

    import { preferences } from '../../../store';

	import LargeNavbar from './navbar/desktop/large.svelte';
	import SmallNavbar from './navbar/desktop/small.svelte';
	import MobileNavbar from './navbar/mobile.svelte';

	export let sidebar = false;

	let expand = false;

	preferences.subscribe(preferencesValue => {
        expand = preferencesValue.expandNavbar;
    });
</script>

<MediaQuery query="(max-width: 999px)" let:matches>
    {#if matches}
        <div class="mobile">
           <MobileNavbar bind:sidebar={sidebar} />
        </div>
    {:else if expand}
       <div class="large">
          <LargeNavbar
            expand={expand}
            onClose={() => preferences.set({ expandNavbar: false }) }
          />
       </div>
    {:else}
        <div class="small">
          <SmallNavbar
            bind:sidebar={sidebar}
            expand={expand}
            onExpand={() => preferences.set({ expandNavbar: true }) }
          />
        </div>
    {/if}
 </MediaQuery>

<style>
  .mobile {
    width: 0;
    z-index: 100;
  }

  .small {
    width: 15%;
  }

  .large {
    width: 22%;
  }
</style>
