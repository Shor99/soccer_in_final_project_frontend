import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeContextWrapper } from './context/DarkModeContext';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SoccerinContextProvider } from './context/SoccerinContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new QueryClient();
root.render(
  <QueryClientProvider client={client}>
    <BrowserRouter>
      <SoccerinContextProvider>
        <AuthContextProvider>
          <DarkModeContextWrapper>
              <App/>
          </DarkModeContextWrapper>
        </AuthContextProvider>
      </SoccerinContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
