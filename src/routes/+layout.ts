import type { LayoutLoad } from './$types';

    export const prerender = false
    export const ssr = false

export const load: LayoutLoad = async () => {
    return {};
};