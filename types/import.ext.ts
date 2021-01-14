/* eslint-disable @typescript-eslint/no-unused-vars */

// extend import meta for hot module loading
interface ImportMeta {
    hot: any
    env: Record<string, string>
}

// svelte svg imports
declare module '*.svg' {
    const content: string
    export default content
}
