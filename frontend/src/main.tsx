import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Courses from './components/Courses.tsx';
import AuthWrapper from './components/AuthWrapper.tsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/courses', element: <Courses /> },
  { path: '*', element: <div>404 Not Found</div> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>,
)
