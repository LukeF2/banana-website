// Adapted from shadcn-ui toast component
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

type ToastActionElement = React.ReactElement

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ToastProps = {
  title?: string
  description?: string
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let memoryState: {
  toasts: ToasterToast[]
} = {
  toasts: [],
}

type ActionType =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast> & { id: string }
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: string
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: string
    }

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action)
}

function reducer(state: typeof memoryState, action: ActionType): typeof memoryState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast?.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t } : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

interface ToastReturn {
  id: string
  dismiss: () => void
  update: (props: ToastProps) => void
}

interface UseToastReturn {
  toast: (props: ToastProps) => ToastReturn
  toasts: ToasterToast[]
  dismiss: (toastId?: string) => void
}

function useToast(): UseToastReturn {
  const [state, setState] = useState<ToasterToast[]>([])

  useEffect(() => {
    setState(memoryState.toasts)
  }, [])

  const toast = useCallback(function ({ ...props }: ToastProps): ToastReturn {
    const id = genId()

    const update = (props: ToastProps) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        onDismiss: dismiss,
        onUpdate: update,
      } as ToasterToast,
    })

    setState(memoryState.toasts)

    return {
      id,
      dismiss,
      update,
    }
  }, [])

  return {
    toast,
    toasts: state,
    dismiss: (toastId?: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId })
      setState(memoryState.toasts)
    },
  }
}

export { useToast }
