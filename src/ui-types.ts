export interface Form {
    setInput: (name: string, valid: boolean) => void
    onChange: (response: InputResponse) => void
}

export interface FormTransaction {
    awaitAccountUpdate: (account: any) => void
    setTransaction: (id: string) => void
    clear: () => void
}

export interface InputResponse {
    name: string
    valid: boolean
    value: string
}

export interface NavigationItem {
    exactPath?: boolean
    icon: string
    name: string
    path: string
}
