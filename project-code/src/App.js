import './App.css';

import Homepage from './Components/Homepage';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';

import SignIn from './Components/SignInPage';

function App() {
  return (<div className="App">
    <SignIn />
    {/* <Navbar />
    <Homepage />
    <Footer /> */}
  </div>);
}

export default App;