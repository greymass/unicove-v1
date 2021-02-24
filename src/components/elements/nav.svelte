<script lang="ts">
    import {Route, active, meta} from 'tinro'

    export let home: string | undefined = undefined
    export let routes: any[] = []

    const metadata = meta()
</script>

<style type="scss">
    nav {
        ul {
            display: inline-flex;
            flex-wrap: wrap;
            margin-left: -8px;
            margin-top: -8px;
        }
        a {
            margin-left: 8px;
            margin-top: 8px;
            font-size: 13px;
            font-weight: 500;
            color: var(--main-blue);
            border-radius: 8px;
            display: block;
            line-height: 32px;
            background: white;
            padding: 0 10px;
            text-decoration: none;
            border: 1px solid var(--main-grey);
            &:hover {
                border-color: var(--light-blue);
            }
            &:active {
                border-color: var(--main-blue);
            }
        }
        :global(a.active) {
            background: var(--main-blue);
            color: white;
        }
    }
</style>

<Route path="/*">
    <nav>
        <ul>
            {#if home}
                <li>
                    <a href={$metadata.pattern} class:active={$metadata.url === $metadata.pattern}
                        >{home}</a
                    >
                </li>
            {/if}
            {#each routes as route}
                <li>
                    <a href={`${$metadata.pattern}/${route.path || ''}`} use:active>{route.name}</a>
                </li>
            {/each}
        </ul>
    </nav>
</Route>
