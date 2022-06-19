//import './style.css';
import Swal from 'sweetalert2';
import React, { useContext, createContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import ShowTheLocationWithRouter from './ShowTheLocationWithRouter';
import Scroll from './Scroll';

export default function AuthExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/public">
            <PublicPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/showmethemoney">
            <ShowTheLocationWithRouter />
          </Route>
          <Route path="/scroll">
            <Scroll />
          </Route>
          <PrivateRoute path="/protected">
            <ProtectedPage />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 200); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 200);
  },
};

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return fakeAuth.isAuthenticated === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

function PublicPage() {
  Swal.fire({
    title: 'Oops...',
    text: 'Something went wrong!',
  });
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function LoginPage() {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const { state } = useLocation();

  console.log(state?.from.pathname, redirectToReferrer);

  const login = () => {
    fakeAuth.authenticate(() => {
      setRedirectToReferrer(true);
    });
  };

  if (redirectToReferrer === true) {
    return <Redirect to={state?.from || '/'} />;
  }

  return (
    <div>
      <p>You must log in to view the page.</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}
