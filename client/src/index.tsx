import React, { createContext, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Store from './store/store'

interface IStore {
 store: Store,
}

export const store = new Store()

export const Context = createContext<IStore>({ store })

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Context.Provider value={{ store }}>
      <App />
    </Context.Provider>
  </StrictMode>
);
