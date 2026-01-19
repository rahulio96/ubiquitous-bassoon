import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EditorPage from './components/Editor.tsx';
import AuthWrapper from './components/AuthWrapper.tsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/editor', element: <EditorPage /> },
  { path: '*', element: <div>404 Not Found</div> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>,
)
