import { createContext, FC, ReactNode } from "react"
import { Store, store } from "./store"

interface IStore {
  store: Store
}

interface StoreProviderProps {
  children: ReactNode
}

export const Context = createContext<IStore>({ store })

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
  return <Context.Provider value={{ store }}>{children}</Context.Provider>
}
