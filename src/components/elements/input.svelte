<script lang="ts">
    export interface returnType {
        name: string
        valid: boolean
        value: string
    }

    export let disabled: boolean = false
    export let focus: boolean = false
    export let name: string = ''
    export let placeholder: string = ''
    export let value: string = ''

    export let onChange: any = () => {}
    export let isValid: any = () => true

    let timer: number | undefined
    let delay: number = 100

    const debounce = (v: returnType) => {
        clearTimeout(timer)
        timer = setTimeout(() => onChange(v), delay)
    }

    const handleKeyup = (e: Event): void => {
        if (onChange) {
            value = (<HTMLInputElement>e.target).value
            debounce({
                name,
                valid: isValid ? isValid(value) : true,
                value,
            })
        }
    }
</script>

<style type="scss">
    input {
        background: #f5f6f8;
        border: 1px solid #e4e6ea;
        border-radius: 12px;
        color: #9898b5;
        font-size: 14px;
        padding: 10px 12px;
        &:focus {
            border: 1px solid #2d8eff;
            color: #585d6e;
            outline: none;
        }
    }
</style>

<input
    on:keyup={handleKeyup}
    type="text"
    {name}
    {disabled}
    {placeholder}
    bind:value
    autofocus={focus}
/>
