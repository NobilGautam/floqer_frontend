import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainTable from './components/MainTable';
import Analytics from './components/Analytics';
import { ChakraProvider } from '@chakra-ui/react'

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <div className='bg-[#FFE6E6] h-[100vh]'>
          <Routes>
            <Route path="/" element={<MainTable />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;
