/// <reference types="svelte2tsx/svelte-jsx" />

/* eslint-disable @typescript-eslint/no-unused-vars */

// adds "exact" prop <a> tags for tinro router use
declare namespace svelte.JSX {
    interface HTMLProps<T> extends HTMLAttributes<T> {
        exact?: boolean
    }
}
