<script>
    import Icon from '~/components/elements/icon.svelte'
    import Image from '~/components/elements/image.svelte'
</script>

<style lang="scss">
    h2 {
        margin-top: 40px;
    }
</style>

<div>
    <p>tiny</p>
    <Icon name="anchor" size="tiny" />
    <p>small</p>
    <Icon name="anchor" size="small" />
    <p>default</p>
    <Icon name="anchor" />
    <p>medium</p>
    <Icon name="anchor" size="medium" />
    <p>large</p>
    <Icon name="anchor" size="large" />
    <p>huge</p>
    <Icon name="anchor" size="huge" />
    <p>massive</p>
    <Icon name="anchor" size="massive" />

    <h2>Image Component with fallback</h2>
    <Image
        fallbackSrc="https://www.bloks.io/img/chains/eos.png"
        src="http://random.com/test.image"
        width="30"
    />
</div>
