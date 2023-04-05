// Pages
import Home from "./pages/Home";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
// styled components
import { StyledContainer } from "./components/Styles";
import {
  BrowserRouter as Router, Switch, Route
} from 'react-router-dom'

import AuthRoute from "./components/AuthRoute";
import BasicRoute from "./components/BasicRoute";
import { connect } from "react-redux";
import ForgottenPassword from "./pages/forgottenPassword";
import EmailSent from "./pages/EmailSent";
import PasswordReset from "./pages/passwordReset";

function App({checked}) {
  return (
    <Router basename="/allwellclient">
      {checked &&
        <StyledContainer>
          <Switch>
          <BasicRoute path='/passwordreset/:accessToken/'><PasswordReset/></BasicRoute>
            <BasicRoute path='/forgottenpassword'><ForgottenPassword/></BasicRoute>
            <BasicRoute path='/emailsent/:userEmail?/:reset?'><EmailSent/></BasicRoute>
            <BasicRoute path='/signup'><Signup/></BasicRoute>
       
            <BasicRoute path='/login'><Login/></BasicRoute>
            <AuthRoute path='/dashboard'><Dashboard/></AuthRoute>
            <Route path='/'><Home/></Route>

          </Switch>
        </StyledContainer>
      }
    </Router>

  );
}

const mapStateToProps = ({session}) => ({
  checked: session.checked,
})

export default connect(mapStateToProps)(App);
