import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { connect } from 'react-redux';
import firebase from 'firebase';
import styled from 'styled-components';
// import { IsOnline } from "../action/login_action";

import {
  EditorState,
  Editor as DraftEditor,
  convertToRaw,
} from 'draft-js';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ShowAlert from '../action/alert_action';
import { getArticleContent } from '../action/article_action';
import submitRes from '../action/res_action';

const useStyles = makeStyles(() => ({
  btnStyle: {
    background: 'linear-gradient(#4c94ec,#0072ff)',
    color: 'white',
    margin: '0.5vh 1vw',
  },

}));
const LimitHeight = styled.div`
  height: ${(props) => `${props.heightValue}px`};
  & .public-DraftEditor-content {
    height: 180px;
  }
`;
const ResboxStyle = styled.section`
  position: fixed;
  bottom: 0px;
  padding: 1vh 1vw;
  width: 960px;
  margin: 0 auto;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
`;
const BtnGroupStyle = styled(ButtonGroup)`
  &.MuiButtonGroup-root {
    margin: 1vh 0;
  }
  .active_btn {
    background: #5bcaff;
    color: #ffffff;
  }
`;

function ArticleResbox(props) {
  const location = useLocation();
  const classes = useStyles();
  const [resStatus, setresStatus] = useState('res');
  const [editorState, seteditorState] = useState(EditorState.createEmpty());
  const [isInput, setIsinput] = useState(false);
  const { OnlineUser } = props;
  const [onlineUser, setonlineUser] = useState({});
  const [editorValid, setEditorValid] = useState(false);
  const { dispatchShowAlert, dispatchsubmitRes, dispatchgetArticleContent } = props;
  const handleEditorState = (editorstate) => {
    if (
      editorstate
        .getCurrentContent()
        .getPlainText()
        .trim() !== ''
    ) {
      setEditorValid(false);
    }
    seteditorState(editorstate);
  };
  const ToggleResBox = () => {
    setIsinput(true);
  };
  useEffect(() => {
    if (OnlineUser) {
      setonlineUser(OnlineUser);
    }
  }, [OnlineUser]);
  const boardname = location.pathname
    .split('')
    .slice(0, location.pathname.split('').indexOf('/', 1))
    .join('');

  const id = location.pathname
    .split('')
    .slice(location.pathname.split('').indexOf('/', 1))
    .join(''); // timestamp

  const SubmitRes = () => {
    if (
      editorState
        .getCurrentContent()
        .getPlainText()
        .trim() === ''
    ) {
      // alert("內文不得為空");
      // props.dispatch(ShowAlert('error', '內文不得為空!'));
      dispatchShowAlert('error', '內文不得為空!');
      setEditorValid(true);
    } else {
      const raw = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      const temptimestamp = Math.floor(Date.now() / 100);
      const resRef = firebase
        .database()
        .ref(`/${boardname}/article_list/${id}/res`);
      dispatchsubmitRes(resRef, temptimestamp, {
        res_author: onlineUser.username,
        res_content: raw,
        res_type: resStatus,
        timestamp: temptimestamp,
      });
      // props.dispatch(
      //   submitRes(resRef, temptimestamp, {
      //     res_author: onlineUser.username,
      //     res_content: raw,
      //     res_type: resStatus,
      //     timestamp: temptimestamp,
      //   }),
      // );
      const GetRef = firebase.database().ref(`/${boardname}/article_list/${id}`);
      // props.dispatch(getArticleContent(GetRef));
      dispatchgetArticleContent(GetRef);
      seteditorState(EditorState.createEmpty());
      setIsinput(false);
      // props.dispatch(ShowAlert('success', '完成回應!'));
      dispatchShowAlert('success', '完成回應!');
    }
  };
  const cancelRes = () => {
    setIsinput(false);
    setEditorValid(false);
    // props.dispatch(ShowAlert('warning', '取消回應!'));
    dispatchShowAlert('warning', '取消回應!');
  };

  return (
    <>
      <ResboxStyle>
        <BtnGroupStyle
          color="primary"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => {
              setresStatus('res');
              setEditorValid(false);
            }}
            className={resStatus === 'res' ? 'active_btn' : ''}
          >
            回應
          </Button>
          <Button
            onClick={() => {
              setresStatus('push');
              setEditorValid(false);
            }}
            className={resStatus === 'push' ? 'active_btn' : ''}
          >
            推文
          </Button>
          <Button
            onClick={() => {
              setresStatus('hate');
              setEditorValid(false);
            }}
            className={resStatus === 'hate' ? 'active_btn' : ''}
          >
            噓文
          </Button>
        </BtnGroupStyle>
        <LimitHeight heightValue={isInput === true ? 200 : 35}>
          <DraftEditor
            editorState={editorState}
            onChange={handleEditorState}
            onFocus={ToggleResBox}

          />
        </LimitHeight>
        {editorValid === true ? (
          <p style={{ color: 'red' }}>內文不得為空</p>
        ) : (
          ''
        )}
        {isInput === true ? (
          <div className="btnbox" style={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              className={classes.btnStyle}
              disableElevation
              onClick={SubmitRes}
            >
              送 出
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              onClick={cancelRes}
            >
              取 消
            </Button>
          </div>
        ) : (
          ''
        )}
      </ResboxStyle>
    </>
  );
}

const mapStateToProps = (store) => ({
  OnlineUser: store.loginReducer,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchgetArticleContent: (GetRef) => dispatch(getArticleContent(GetRef)),
    // dispatchgetArticleBoards: (boardref) => dispatch(getArticleBoard(boardref)),
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
    dispatchsubmitRes:
     (resRef, timestamp, rescontent) => dispatch(submitRes(resRef, timestamp, rescontent)),

  };
}

ArticleResbox.propTypes = {
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),
  dispatchShowAlert: PropTypes.func.isRequired,
  dispatchsubmitRes: PropTypes.func.isRequired,
  dispatchgetArticleContent: PropTypes.func.isRequired,
};
ArticleResbox.defaultProps = {
  OnlineUser: {},
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticleResbox);
