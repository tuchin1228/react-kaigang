import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, withRouter } from 'react-router';
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from 'firebase';
import { Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ARTICLE_CONTENT from './article_content';
import ARTICLE_RESBOX from './article_resbox';
import ARTICLE_RESCONTENT from './article_rescontent';
import { deleteArticle } from '../action/article_action';
import { isEdits, notEdits } from '../action/post_action';
import post from './post';
// import { IsOnline } from "../action/login_action";

import ShowAlert from '../action/alert_action';
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import { makeStyles } from "@material-ui/core/styles";
import ErrorImg from '../img/404.png';

// const ArticleStyle = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background: red;
//   width: 200px;
//   height: 200px;
// `;
const TopbtnPosition = styled.div`
  padding: 1vh 1vw 0.5vh 1vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .editbtn {
    button {
      margin: 0 5px;
      font-size: 1.2em;
    }
  }
`;
const DialogStyle = styled(Dialog)`
  position: relative;
  & .MuiPaper-root {
    min-height: 100vh;
    .MuiDialogContent-root {
      padding: 0;
      padding-top: 5px;
      /* height:100vh;
      transform:rotate(0); */
    }
  }
  & .MuiDialog-paper {
    margin: 1vh 0 0 0;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 767px) {
    & .MuiPaper-root {
      width: 95% !important;
      max-width: 95% !important;
    }
  }
`;
const Imgbox = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  a {
    text-decoration: none;
  }
  button {
    background: #3b81ff;
    &:hover {
      background: #2265de;
    }
  }
`;

function Article(props) {
  const location = useLocation();
  // const [scroll, setScroll] = useState("body");
  const { match } = props;
  const { ARTICLE_DATA } = props;
  const { OnlineUser } = props;
  const [open, setOpen] = useState(false);
  const [boardname, setBoardname] = useState('/');
  const [id, setId] = useState('');
  const [EditsStatus, setEditsStatus] = useState(false);
  const [content, setContent] = useState({});
  const [user, setUser] = useState({});
  // const [openEdits, setOpenEdits] = useState(false);
  const {
    dispatchisEdits, dispatchnotEdits, dispatchdeleteArticle, dispatchShowAlert,
  } = props;
  const [isError, setIsError] = useState(false);

  const handleClose = () => {
    // props.dispatch(notEdits());
    dispatchnotEdits();

    // setEditsStatus(false);
    // props.openStatus();
    setOpen(false);
    props.history.push(`${boardname}`);
    // props.history.goBack();
  };
  const handleEdits = () => {
    // props.dispatch(isEdits());
    dispatchisEdits();
    // setEditsStatus(true);
    props.history.push(`${match.url}/edits`);
  };

  const DELETE_ARTICLE = () => {
    const deleteRef = firebase.database().ref(`${boardname}/article_list`);
    // props.dispatch(deleteArticle(deleteRef, id));
    dispatchdeleteArticle(deleteRef, id);
    props.history.push(`${boardname}`);
    // props.dispatch(ShowAlert('success', '完成刪除!'));
    dispatchShowAlert('success', '完成刪除!');
  };

  useEffect(() => {
    setOpen(true);
    // setEditsStatus(false);
    // console.log('boardname',boardname,'id',id);
    // let ArticleRef = firebase.database().ref(`${boardname}/article_list${id}`);
    // props.dispatch(IsOnline());
    // props.dispatch(getArticleContent(ArticleRef));
  }, []);

  useEffect(() => {
    // console.log('ARTICLE_DATA', ARTICLE_DATA);

    // console.log('ARTICLE_DATA',content,'OnlineUser',OnlineUser)
    if (ARTICLE_DATA.author !== '' && ARTICLE_DATA !== 'Fail to get article content') {
      setIsError(false);
      setContent(ARTICLE_DATA);
    } else if (ARTICLE_DATA === 'Fail to get article content') {
      setIsError(true);
    }
    if (OnlineUser) setUser(OnlineUser);
  }, [OnlineUser, ARTICLE_DATA]);

  useEffect(() => {
    const tempboardname = location.pathname
      .split('')
      .slice(0, location.pathname.split('').indexOf('/', 1))
      .join('');

    const tempid = location.pathname
      .split('')
      .slice(location.pathname.split('').indexOf('/', 1))
      .join(''); // timestamp
    setBoardname(tempboardname);
    setId(tempid);
    if (location.pathname.split('/')[3] === 'edits') {
      // props.dispatch(isEdits());
      dispatchisEdits();
      setEditsStatus(true);
    } else {
      setEditsStatus(false);
    }
  }, [location.pathname, props]);

  // useEffect(() => {
  //   if (
  //     props.isOpen == true &&
  //     location.pathname.split("").indexOf("/", 1) == -1
  //   ) {
  //     props.openStatus();
  //   }
  //   if(EditsStatus ==true){
  //     setEditsStatus(false)
  //   }
  // }, [location.pathname]);

  return (
    <>
      <DialogStyle
        open={open}
        scroll="body"
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {isError === false ? (
          <>
            {EditsStatus === false ? (
              <DialogContent>
                <TopbtnPosition>
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                  {content.author === user.username ? (
                    <div className="editbtn">
                      <Button
                        variant="contained"
                        disableElevation
                        style={{ background: '#5fb14a', color: 'white' }}
                        onClick={handleEdits}
                      >
                        編 輯
                      </Button>
                      <Button
                        variant="contained"
                        disableElevation
                        style={{ background: '#ff4242', color: 'white' }}
                        onClick={DELETE_ARTICLE}
                      >
                        刪 除
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
                </TopbtnPosition>

                <ARTICLE_CONTENT />
                <ARTICLE_RESBOX />
                <ARTICLE_RESCONTENT resContent={content.res} />
              </DialogContent>
            ) : (
              // <Post params={props.params} />
              <Route path={`${match.url}/edits`} component={post} />
            )}
          </>
        ) : (
          <Imgbox className="imgbox">
            <img src={ErrorImg} alt="" />
            <h2 style={{ fontWeight: '500' }}>沒有這個頁面</h2>
            <Link to="/">
              <Button variant="contained" color="primary" disableElevation>
                前往主頁
              </Button>
            </Link>
          </Imgbox>
        )}
      </DialogStyle>
    </>
  );
}

const mapStateToProps = (store) => ({
  ARTICLE_DATA: store.articleReducer.contents,
  OnlineUser: store.loginReducer,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchisEdits: () => dispatch(isEdits()),
    dispatchnotEdits: () => dispatch(notEdits()),
    dispatchdeleteArticle: (deleteRef, id) => dispatch(deleteArticle(deleteRef, id)),
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
  };
}
Article.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  ARTICLE_DATA: PropTypes.shape({
    author: PropTypes.string,
    boardname: PropTypes.string,
    category: PropTypes.string,
  }),
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatchisEdits: PropTypes.func.isRequired,
  dispatchnotEdits: PropTypes.func.isRequired,
  dispatchdeleteArticle: PropTypes.func.isRequired,
  dispatchShowAlert: PropTypes.func.isRequired,
};
Article.defaultProps = {
  OnlineUser: {},
  ARTICLE_DATA: {
    author: '',
    boardname: '',
    category: '',
  },
  match: {
    path: '',
    url: '',
  },
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Article));
