<script lang="ts">
    export let src: string = ''
    export let alt: string = ''
    export let fallbackSrc: string = '/images/placeholder.png'
    export let fallbackAlt: string = 'placeholder image'
    export let width: string | undefined = undefined
    export let height: string | undefined = undefined

    let srcToUse: string = src
    let altToUse: string = alt

    function useImageFallback() {
        srcToUse = fallbackSrc
        altToUse = fallbackAlt
    }
</script>

<img src={srcToUse} alt={altToUse} on:error={useImageFallback} {width} {height} />
