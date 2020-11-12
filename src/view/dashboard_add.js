import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from 'firebase';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
// import Container from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  EditorState,
  Editor as DraftEditor,
  convertToRaw,
} from 'draft-js';
import { submitArticle } from '../action/post_action';
import ShowAlert from '../action/alert_action';

// import Container from "@material-ui/core/Container";
const useStyles = makeStyles(() => ({
  contain: {
    // height: "calc(98vh - 64px)",
    marginTop: '1vh',
    background: 'white',
    padding: '1vh 1vw',
    borderRadius: '5px',
    // paddingBottom: "20vh",
    // overflow: "scroll",
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  titlefield: {
    width: '80%',
  },
  btnStyle: {
    background: 'linear-gradient(#4c94ec,#0072ff)',
    color: 'white',
    margin: '0.5vh 1vw',
  },
}));
const TextFieldStyle = styled(TextField)`
  margin: 0.5vh 0;
`;
const Boardname = styled.div`
  .textfieldmg {
    margin-right: 1vw;
  }
`;
const CategoryBox = styled.div`
  border: 1px solid #d0d0d0;
  border-radius: 5px;
  margin: 2vh 0;
  padding: 1vh 1vw;
  .textfield {
    width: 25%;
    margin-right: 1vw;
  }
  button {
    margin: 0 5px;
    &:first-child {
      background: #5fb14a;
      color: white;
    }
    &:last-of-type {
      background: #ff4242;
      color: white;
    }
  }
`;
const PostStyle = styled.div`
  section {
    padding: 1vh 0;
    &:nth-of-type(-n + 3) {
      border-bottom: 1px solid #e2e2e2;
    }
  }
  section > span {
    font-weight: 300;
    font-size: 1.5em;
    margin: 1vh 1vw 1vh 0vw;
  }
`;
const LimitHeight = styled.div`
  height: 40vh;
  & .public-DraftEditor-content {
    height: 400px;
  }
`;

function DashboardAdd(props) {
  const classes = useStyles();
  const { OnlineUser, dispatchShowAlert, dispatchsubmitArticle } = props;
  const [editorState, seteditorState] = useState(EditorState.createEmpty());
  const [editorValid, setEditorValid] = useState(false);
  const [EnBoard, setEnBoard] = useState('');
  const [ChBoard, setChBoard] = useState('');
  const [FirstTitle, setFirstTitle] = useState('');
  const { defaultIndex, nowIndex } = props;
  const [category, setCategory] = useState([
    { id: 1, Category: '' },
    { id: 2, Category: '' },
  ]);

  const [selectCategory, setSelectCategory] = useState('');

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
  const valid = () => {
    if (
      editorState
        .getCurrentContent()
        .getPlainText()
        .trim() === ''
    ) {
      setEditorValid(true);
    } else {
      setEditorValid(false);
    }
  };

  const addcategory = () => {
    if (category.length < 6) {
      setCategory([...category, { id: category.length + 1, Category: '' }]);
    }
  };
  const removecategory = () => {
    const temparr = [...category];
    if (category.length > 2) {
      temparr.pop();
      setCategory(temparr);
    }
  };

  const handleEnBoard = (e) => {
    setEnBoard(e.target.value);
  };
  const handleChBoard = (e) => {
    setChBoard(e.target.value);
  };
  const handleFirstTitle = (e) => {
    setFirstTitle(e.target.value);
  };
  const handleCategory = (e, id) => {
    // if(selectCategory ==''){
    //   setSelectCategory(e.target.value)
    // }
    const temparr = [...category];
    temparr.forEach((item, index) => {
      if (item.id === id) {
        temparr[index].Category = e.target.value;
      }
    });

    setCategory(temparr);
    setSelectCategory(temparr[0].Category);
  };
  const handleSelectCategory = (e) => {
    setSelectCategory(e.target.value);
  };

  const sumit = () => {
    if (OnlineUser.username !== 'test@mail.com') {
      // alert("非管理員無法傳送!");
      // props.dispatch(ShowAlert('error', '非管理員無法傳送!'));
      dispatchShowAlert('error', '非管理員無法傳送!');
      return;
    }
    let check = false;
    category.forEach((item) => {
      if (item.Category.trim() === '') {
        check = true;
      }
    });

    if (
      editorState
        .getCurrentContent()
        .getPlainText()
        .trim() === ''
    ) {
      // alert("內文不得為空");
      // props.dispatch(ShowAlert('error', '內文不得為空!'));
      dispatchShowAlert('error', '內文不得為空!');
    } else if (FirstTitle === '') {
      // alert("標題不得為空");
      // props.dispatch(ShowAlert('error', '標題不得為空!'));
      dispatchShowAlert('error', '標題不得為空!');
    } else if (EnBoard === '') {
      // alert("英文看板名稱不得為空");
      // props.dispatch(ShowAlert('error', '英文看板名稱不得為空!'));
      dispatchShowAlert('error', '英文看板名稱不得為空!');
    } else if (ChBoard === '') {
      // alert("中文看板名稱不得為空");
      // props.dispatch(ShowAlert('error', '中文看板名稱不得為空!'));
      dispatchShowAlert('error', '中文看板名稱不得為空!');
    } else if (check) {
      // alert("分類名稱不得為空");
      // props.dispatch(ShowAlert('error', '分類名稱不得為空!'));
      dispatchShowAlert('error', '分類名稱不得為空!');
    } else {
      const newboardRef = firebase.database().ref(`/${EnBoard}`);
      const categoryRef = firebase.database().ref(`/${EnBoard}/category`);
      const firstArticleRef = firebase.database().ref(`/${EnBoard}/article_list`);

      newboardRef.child('board_name').set(`${ChBoard}`);
      categoryRef.set(category);
      const raw = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      const timecode = Math.floor(Date.now() / 100);
      const ARTICLE_CONTENT = {
        category: selectCategory,
        author: OnlineUser.username,
        boardname: EnBoard,
        timestamp: timecode,
        title: FirstTitle,
        contents: raw,
      };
      // props.dispatch(submitArticle(firstArticleRef, timecode, ARTICLE_CONTENT));
      dispatchsubmitArticle(firstArticleRef, timecode, ARTICLE_CONTENT);
      props.history.push(`/${EnBoard}/${timecode}`);
    }
  };
  const cancelSubmit = () => {
    props.history.push('/');
    // props.dispatch(ShowAlert('warning', '取消新增看板!'));
    dispatchShowAlert('warning', '取消新增看板!');
  };
  return (
    <div
      hidden={defaultIndex !== nowIndex}
      id={`vertical-tabpanel-${nowIndex}`}
    >
      <PostStyle>
        <section>
          <span>使用者</span>
          <span style={{ margin: '0' }}>{OnlineUser.username}</span>
        </section>
      </PostStyle>
      <Boardname>
        <TextFieldStyle
          required
          id="standard-required"
          label="看板英文名稱"
          className="textfieldmg"
          defaultValue=""
          onChange={handleEnBoard}
          size="small"
        />
        <TextFieldStyle
          required
          id="standard-required"
          label="看板中文名稱"
          className="textfieldmg"
          defaultValue=""
          onChange={handleChBoard}
          size="small"
        />
      </Boardname>
      <CategoryBox className="categoryBox">
        <Button variant="contained" disableElevation onClick={addcategory}>
          新增分類
        </Button>
        <Button variant="contained" disableElevation onClick={removecategory}>
          刪除分類
        </Button>
        <br />
        {category.map((item) => (
          <TextFieldStyle
            key={item.id}
            size="small"
            required
            id="standard-required"
            label={`分類${item.id}`}
            defaultValue=""
            onChange={(e) => handleCategory(e, item.id)}
            className={(classes.titlefield, 'textfield')}
          />
        ))}
      </CategoryBox>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <PostStyle>
          <section
            style={{
              border: 'none',
            }}
          >
            <span>分類</span>
            <select value={selectCategory} onChange={handleSelectCategory}>
              {category.map((item) => (
                <option value={item.Category} key={item.id}>
                  {item.Category}
                </option>
              ))}
            </select>
          </section>
        </PostStyle>
        <TextFieldStyle
          required
          id="standard-required"
          label="看板首篇標題"
          defaultValue=""
          variant="outlined"
          onChange={handleFirstTitle}
          size="small"
          className={classes.titlefield}
        />
      </div>

      <PostStyle>
        <section>
          <span>內文</span>
          <kbd>外嵌影片目前僅支援Youtube，且不支援歌單。</kbd>
          <LimitHeight>
            <DraftEditor
              placeholder="輸入文章內容"
              editorState={editorState}
              onChange={handleEditorState}
              onBlur={valid}
            />
          </LimitHeight>
          {editorValid === true ? (
            <p style={{ margin: '0.5vh 0', color: 'red' }}>內文不得為空</p>
          ) : (
            ''
          )}
        </section>

        <div className="btnbox" style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            className={classes.btnStyle}
            disableElevation
            // disabled={editorValid}
            onClick={sumit}
          >
            送 出
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={cancelSubmit}
            disableElevation
          >
            取 消
          </Button>
        </div>
      </PostStyle>
    </div>
  );
}

const mapStateToProps = (store) => ({
  OnlineUser: store.loginReducer,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
    dispatchsubmitArticle:
    (Ref, timecode, CONTENT) => dispatch(submitArticle(Ref, timecode, CONTENT)),
  };
}
DashboardAdd.propTypes = {
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  defaultIndex: PropTypes.number.isRequired,
  nowIndex: PropTypes.number.isRequired,
  dispatchShowAlert: PropTypes.func.isRequired,
  dispatchsubmitArticle: PropTypes.func.isRequired,
};
DashboardAdd.defaultProps = {

  OnlineUser: {},
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardAdd));
