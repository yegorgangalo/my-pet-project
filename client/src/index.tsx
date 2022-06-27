import { StrictMode } from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
// import { StoreProvider } from './store/Context'
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux'
import store  from './redux/store'
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        {/* <StoreProvider> */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        {/* </StoreProvider> */}
      </Provider>
    </SnackbarProvider>
  </StrictMode>
);
