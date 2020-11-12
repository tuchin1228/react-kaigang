import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Login from './view/login';
import Post from './view/post';
import List from './view/list';
import Article from './view/article';
import Search from './view/search';
import Dashboard from './view/dashboard';

const font = "'Noto Sans TC', sans-serif";
const theme = createMuiTheme({
  typography: {
    fontFamily: font,
    button: {
      textTransform: 'none',
    },
  },
});

function App(props) {
  const [openAlert, setOpenAlert] = useState(false);
  const { status } = props;

  useEffect(() => {
    setOpenAlert(true);
  }, [status]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <MuiThemeProvider theme={theme}>
      {status.type ? (
        <Snackbar
          open={openAlert}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiAlert
            severity={status.type}
            variant="filled"
            onClose={handleClose}
          >
            {status.msg}
          </MuiAlert>
        </Snackbar>
      ) : (
        ''
      )}

      <div
        style={{ background: '#144c92', height: '100vh', overflowY: 'hidden' }}
      >
        <Router>
          <Navbar />
          <Sidebar />
          <Switch>

            <Route path="/login">
              <Login />
            </Route>
            <Route path="/post">
              <Post />
            </Route>

            <Route path="/search" component={Search} />
            <Route path="/dashboard" component={Dashboard} />
            <Route exact path="/:board" component={List} />
            <Route path="/:board/:id" component={Article} />

            <Redirect from="/" to="/chat" />

          </Switch>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

const mapStateToProps = (store) => ({
  status: store.alertReducer.status,
});

App.propTypes = {
  status: PropTypes.shape({
    type: PropTypes.string,
    msg: PropTypes.string,
  }),
};
App.defaultProps = {
  status: {},
};

export default connect(mapStateToProps)(App);
