import './App.css';

import Homepage from './Components/Homepage';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Login from './Components/Loginpage';

import SignIn from './Components/SignInPage';

function App() {
  return (<div className="App">
    <Login />
    {/* <Navbar />
    <Homepage />
    <Footer /> */}
  </div>);
}

export default App;