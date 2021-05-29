
<script lang="ts">
    export let src: string = ''
    export let alt: string = ''
    export let fallbackSrc: string = ''
    export let fallbackAlt: string = ''

    let srcToUse : string = src;
    let altToUse : string = alt;

    function useImageFallback() {
        srcToUse = fallbackSrc
        altToUse = fallbackAlt
    }
</script>

<img src={srcToUse} alt={alt} on:error={useImageFallback} />
