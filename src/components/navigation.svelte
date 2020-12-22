<script lang="ts">
    import {active} from 'tinro'
    import {_} from '../i18n'
</script>

<style>
    nav :global(a.active)::after {
        content: ' ⬅ you are here';
        font-size: 0.65em;
    }
</style>

<nav>
    Navigation
    <ul>
        <li><a href="/" use:active exact>{$_('navigation.dashboard')}</a></li>
        <li><a href="/transfer" use:active>{$_('navigation.transfer')}</a></li>
    </ul>
</nav>
