<script lang="ts">
    import type {LayoutData} from './$types'

    export let data: LayoutData
</script>

<main>
    <noscript>
        <p>
            Unicove requires JavaScript to run, please add an exception for this domain if you wish
            to use it.
        </p>
    </noscript>
    <slot />
</main>
