<script lang="ts">
    import {icons} from 'feather-icons'

    export let name = 'help-circle'
    export let dimensions = '1em'
    export let size = 'default'

    if (!icons[name]) {
        name = 'help-circle'
    }

    switch (size) {
        case 'tiny': {
            dimensions = '0.5em'
            break
        }
        case 'small': {
            dimensions = '0.75em'
            break
        }
        case 'default': {
            dimensions = '1em'
            break
        }
        case 'medium': {
            dimensions = '1.25em'
            break
        }
        case 'large': {
            dimensions = '1.5em'
            break
        }
        case 'huge': {
            dimensions = '2.5em'
            break
        }
        case 'massive': {
            dimensions = '4em'
            break
        }
    }
</script>

<style type="scss">
</style>

{@html icons[name].toSvg({
    height: dimensions,
    width: dimensions,
})}
