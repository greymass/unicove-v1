import {writable} from 'svelte/store'

type Toast = {
    id: number
    dismissible: boolean
    timeout: number
    title?: string
    message: string
}

let counter = 0
export const toasts = writable<Toast[]>([])

export const dismissToast = (id: number) => {
    toasts.update((all) => all.filter((t) => t.id !== id))
}

export const addToast = ({
    title,
    message,
    timeout = 3000,
    dismissible = true,
}: {
    title?: string
    message: string
    timeout?: number
    dismissible?: boolean
}) => {
    const id = counter++

    toasts.update((all) => [{id, title, message, timeout, dismissible}, ...all])

    setTimeout(() => dismissToast(id), timeout)
}
