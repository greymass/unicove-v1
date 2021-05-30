
<script lang="ts">
    export let src: string = ''
    export let alt: string = ''
    export let fallbackSrc: string = '/images/placeholder.png'
    export let fallbackAlt: string = 'placeholder image'
    export let width: string | undefined = undefined
    export let height: string | undefined = undefined

    let srcToUse : string = src;
    let altToUse : string = alt;

    console.log({srcToUse})

    function useImageFallback() {
        srcToUse = fallbackSrc
        altToUse = fallbackAlt
    }
</script>

<img src={srcToUse} alt={alt} on:error={useImageFallback} width={width} height={height} />
