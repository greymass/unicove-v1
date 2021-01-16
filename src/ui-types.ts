export interface Form {
    setInput: (name: string, valid: boolean) => void
    onChange: (response: inputResponse) => void
}

export interface inputResponse {
    name: string
    valid: boolean
    value: string
}
