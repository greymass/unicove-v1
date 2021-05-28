<script>
    import Input from '~/components/elements/input.svelte'
    import TokenSelector from '~/components/elements/input/token/selector.svelte'

    let examples: any = {
        'example-on-changed': {
            valid: true,
            value: '',
        },
        'example-is-valid': {
            valid: false,
            value: '0',
        },
    }

    const numberValidityCheck = (v: string): boolean => parseInt(v, 10) > 0

    const handleChange = ({detail}: {detail: any}) => {
        examples[detail.name] = detail
    }

    const selectableTokens = [
      {
        name: 'EOS',
        logo: 'https://www.bloks.io/img/chains/eos.png',
        balance: 5.2233,
        precision: 4,
      },
      {
        name: 'Telos',
        logo: 'https://www.bloks.io/img/chains/telos.png',
        balance: 10,
        precision: 4,
      },
    ];

    let selectedToken = selectableTokens[0];

    const handleTokenSelect = (token) => {
      console.log({selectedToken})
        selectedToken = token
    }
</script>

<style lang="scss">
    div {
        margin: 16px 0;

        &.fullWidthContainer {
            width: 500px;
        }
    }
</style>

<div>
    <p>Default</p>
    <Input />
</div>
<div class="fullWidthContainer">
    <p>Full Width</p>
    <Input fluid />
</div>
<div>
    <p>Disabled</p>
    <Input disabled />
</div>
<div>
    <p>Placeholder</p>
    <Input placeholder="Testing" />
</div>
<div>
    <p>Default Value</p>
    <Input value="Default Value" />
</div>
<div>
    <p>onChange Callback</p>
    <Input name="example-on-changed" on:changed={handleChange} />
    <p>Value: {examples['example-on-changed'].value}</p>
    <p>Is Valid: {examples['example-on-changed'].valid}</p>
</div>
<div>
    <p>Custom isValid Call (number &gt; 0)</p>
    <Input name="example-is-valid" isValid={numberValidityCheck} on:changed={handleChange} />
    <p>Value: {examples['example-is-valid'].value}</p>
    <p>Is Valid: {examples['example-is-valid'].valid}</p>
</div>
<div>
    <p>Token Selector</p>
    <TokenSelector
       defaultToken={selectedToken}
       tokens={selectableTokens}
       onTokenSelect={handleTokenSelect}
    />

    <p>Selected Token: {selectedToken.name}</p>
</div>
