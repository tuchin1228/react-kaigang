import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import firebase from "firebase";
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SignUpWithSignIn, SignIn, IsOnline } from '../action/login_action';

import ShowAlert from '../action/alert_action';
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  contain: {
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '15px',
    boxShadow: '6px 6px 11px #002579d1',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  btnStyle: {
    margin: '0.5vh 0',
  },
}));

const Login = (props) => {
  const [signup, setSignup] = useState(false);
  const [inputMail, setInputMail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const {
    OnlineUser,
    dispatchSignUpWithSignIn,
    dispatchSignIn,
    dispatchIsOnline,
    dispatchShowAlert,
  } = props;
  // const [online_user, setOnline_user] = useState({});
  const classes = useStyles();

  const handleMail = (e) => {
    setInputMail(e.target.value);
  };
  const handlePassword = (e) => {
    setInputPassword(e.target.value);
  };

  const SignupSignin = () => {
    // props.dispatch(SignUpWithSignIn(inputMail, inputPassword));
    dispatchSignUpWithSignIn(inputMail, inputPassword);
  };

  const OnlySignin = () => {
    // props.dispatch(SignIn(inputMail, inputPassword));
    dispatchSignIn(inputMail, inputPassword);
  };

  useEffect(() => {
    // props.dispatch(IsOnline());
    dispatchIsOnline();
  }, []);

  useEffect(() => {
    if (OnlineUser.username) {
      // props.dispatch(ShowAlert('success', '已登入!'));
      dispatchShowAlert('success', '已登入!');
      props.history.push('/');
    }
  }, [OnlineUser]);

  return (
    <Container
      className={classes.contain}
      component="main"
      maxWidth="xs"
      style={{ background: 'white', padding: '2vh 2vw' }}
    >

      <CssBaseline />
      <div className={classes.paper}>
        {signup === false ? (
          <Typography component="h1" variant="h5">
            會員登入
          </Typography>
        ) : (
          <Typography component="h1" variant="h5">
            會員註冊
          </Typography>
        )}

        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={inputMail}
            onChange={handleMail}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={inputPassword}
            onChange={handlePassword}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
        </form>

        {signup === false ? (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              onClick={OnlySignin}
            >
              登入
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              onClick={() => {
                setSignup(true);
              }}
            >
              立即註冊
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              onClick={SignupSignin}
            >
              註冊並登入
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              onClick={() => {
                setSignup(false);
              }}
            >
              已有帳號，登入去
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (store) => ({
  OnlineUser: store.loginReducer,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchSignUpWithSignIn:
    (inputMail, inputPassword) => dispatch(SignUpWithSignIn(inputMail, inputPassword)),
    dispatchSignIn:
    (inputMail, inputPassword) => dispatch(SignIn(inputMail, inputPassword)),
    dispatchIsOnline: () => dispatch(IsOnline()),
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
  };
}
Login.propTypes = {
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatchSignUpWithSignIn: PropTypes.func.isRequired,
  dispatchSignIn: PropTypes.func.isRequired,
  dispatchIsOnline: PropTypes.func.isRequired,
  dispatchShowAlert: PropTypes.func.isRequired,
};
Login.defaultProps = {
  OnlineUser: {},
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
