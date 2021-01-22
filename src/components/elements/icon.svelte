<script lang="ts">
    import feather from 'feather-icons'

    export let name = 'help-circle'
    export let color = 'black'
    export let pixels = 24
    export let size = 'default'

    switch (size) {
        case 'tiny': {
            pixels = 12
            break
        }
        case 'small': {
            pixels = 16
            break
        }
        case 'default': {
            pixels = 24
            break
        }
        case 'medium': {
            pixels = 32
            break
        }
        case 'large': {
            pixels = 48
            break
        }
        case 'huge': {
            pixels = 64
            break
        }
        case 'massive': {
            pixels = 96
            break
        }
    }
</script>

<style type="scss">
</style>

{@html feather.icons[name].toSvg({
    color,
    height: pixels,
    width: pixels,
})}
