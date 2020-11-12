import firebase from 'firebase';

export const SignUpWithSignIn = (inputMail, inputPassword) => (dispatch) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(inputMail, inputPassword)
    .then(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(inputMail, inputPassword)
        .then((res2) => {
          const USER_INFO = {
            uid: res2.user.uid,
            username: res2.user.email,
          };
          dispatch({
            type: 'SIGN_UP_SUCCESS',
            res: USER_INFO,
          });
        });
    });
};

export const SignIn = (inputMail, inputPassword) => (dispatch) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(inputMail, inputPassword)
    .then((res) => {
      const USER_INFO = {
        uid: res.user.uid,
        username: res.user.email,
      };
        //   console.log('acion',res)
      dispatch({
        type: 'SIGN_IN_SUCCESS',
        res: USER_INFO,
      });
    });
};

export const SignOut = () => (dispatch) => {
  firebase
    .auth()
    .signOut()
    .then((res) => {
      dispatch({
        type: 'SIGN_OUT_SUCCESS',
        res,
      });
    });
};

export const IsOnline = () => (dispatch) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const USER_INFO = {
        uid: user.uid,
        username: user.email,
      };
      dispatch({
        type: 'IS_ONLINE_TRUE',
        res: USER_INFO,
      });
    } else {
      const USER_INFO = {};
      dispatch({
        type: 'IS_ONLINE_FALSE',
        res: USER_INFO,
      });
    }
  });
};
