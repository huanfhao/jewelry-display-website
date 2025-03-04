import * as React from "react"
import { ToastActionElement, type ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface State {
  toasts: ToasterToast[]
}

export function useToast() {
  const [state, setState] = React.useState<State>({
    toasts: [],
  })

  return {
    toasts: state.toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      setState((state) => ({
        toasts: [...state.toasts, { ...props, id }],
      }))
    },
    dismiss: (toastId?: string) => {
      setState((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== toastId),
      }))
    },
  }
} 