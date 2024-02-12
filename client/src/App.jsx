import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
// https://www.youtube.com/watch?v=VAaUy_Moivw&list=PL3Fnrm_wFNB_v38hyEakflHgWOIz8kC37&index=79&t=1208s
// https://github.com/ranjit20m/thane-housing 
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route element={< PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>        
      </Routes>
    </BrowserRouter>
  )
}

export default App;