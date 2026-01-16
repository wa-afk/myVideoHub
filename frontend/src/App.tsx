import React from 'react'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from './reducers/store';
import { Toaster } from 'sonner';

// For notification we use Toaster
const App : React.FC = () => {
  return (
  <>
    <Provider store= {store}>
      <Toaster position='top-right' richColors closeButton/> 
      <RouterProvider router= {router}/>
    </Provider>
  </>
  );
}

export default App