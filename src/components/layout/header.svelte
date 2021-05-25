<script>
    export let title: string = ''
    export let subtitle: string = ''
</script>

<style>
    h1 {
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        letter-spacing: -0.47px;
        color: var(--main-black);
    }

    h3 {
        font-family: Inter;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: -0.18px;
        color: var(--dark-grey);
    }
</style>

<h1>
    {title}
</h1>
<h3>
    {subtitle}
</h3>
