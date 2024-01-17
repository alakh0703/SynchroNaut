import './App.css';

import Home from './Routes/Home'
import AuthProvider from './Context/AuthProvider';


function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Home/>
      </AuthProvider>
    </div>
  );
}

export default App;
