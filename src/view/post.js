import React, { useState, useEffect } from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { withRouter, useLocation } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import '../style/main.scss';
import Button from '@material-ui/core/Button';

import {
  EditorState,
  Editor as DraftEditor,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import ShowAlert from '../action/alert_action';

import { getArticleContent } from '../action/article_action';
import {
  submitArticle,
  UpdateArticle,
  notEdits,
  getArticleCategory,
} from '../action/post_action';
import { getBoardName } from '../action/action';

// import { convertToHTML, convertFromHTML } from "draft-convert";

const LimitHeight = styled.div`
  height: 40vh;
  & .public-DraftEditor-content {
    height: 400px;
  }
`;
const useStyles = makeStyles(() => ({
  contain: {
    height: '100%',
    marginTop: '1vh',
    background: 'white',
    padding: '1vh 1vw',
    borderRadius: '5px',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '@media (max-width:767px)': {
      width: '95%',
    },
    '@media (max-width:1024px) and (min-width:768px)': {
      width: '700px',
    },
  },
  btnStyle: {
    background: 'linear-gradient(#4c94ec,#0072ff)',
    color: 'white',
    margin: '0.5vh 1vw',
  },
}));
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
  select {
    padding: 0.5vh 0.5vw;
  }
  input {
    padding: 3px 5px;
    width: 70%;
    font-size: 1.2em;
  }
  button {
    padding: 3px 1px;
    font-size: 1.1em;
  }
`;

const Post = (props) => {
  const location = useLocation();
  const classes = useStyles();
  const { boardname } = props;
  const { Category } = props;
  const { ArticleData } = props;
  const [board, setboard] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  const [editorState, seteditorState] = useState(EditorState.createEmpty());
  const { isEdits } = props;
  const { OnlineUser } = props;
  const {
    dispatchgetBoardName,
    dispatchgetArticleContent,
    dispatchgetArticleCategory,
    dispatchShowAlert,
    dispatchsubmitArticle,
    dispatchUpdateArticle,
    dispatchnotEdits,
  } = props;
  // const [online_user, setOnline_user] = useState({});
  const [editorValid, setEditorValid] = useState(false);
  const [articleContent, setarticleContent] = useState({
    category: '',
    author: '',
    boardname: 'chat',
    timestamp: '',
    title: '',
    contents: [],
  });
  const ref = firebase.database().ref('/');

  // 取得所有看板
  useEffect(() => {
    // props.dispatch(getBoardName(ref));
    dispatchgetBoardName(ref);

    if (isEdits === true) {
      const tempboardname = location.pathname
        .split('')
        .slice(0, location.pathname.split('').indexOf('/', 1))
        .join(''); // /chat
      const id = location.pathname.split('/')[2];
      const tempref = firebase.database().ref(`${tempboardname}/article_list/${id}`);
      // props.dispatch(getArticleContent(tempref));

      dispatchgetArticleContent(tempref);
    }

    const categoryref = firebase.database().ref('chat/category');
    // props.dispatch(getArticleCategory(categoryref));
    dispatchgetArticleCategory(categoryref);
  }, []);

  useEffect(() => {
    const temparr = [];
    if (boardname) {
      boardname.data.forEach((item) => {
        const boardobj = {
          boardkey: item[0],
          boardname: item[1].board_name,
        };
        temparr.push(boardobj);
      });
      setboard(temparr);
    }
  }, [boardname]);

  useEffect(() => {
    console.log('====================================');
    console.log('Category', Category);
    console.log('====================================');
    if (Category.length !== 0) {
      const temparr = [];
      Category.forEach((item) => {
        temparr.push(item.Category);
        // setCategory(item.Category)
        // console.log(item.Category);
      });
      setCategory(temparr);
      setarticleContent({ ...articleContent, category: temparr[0] });
      // console.log(Category);
      // setarticleContent({ ...articleContent, category: Category[1] });
    }
  }, [Category]);

  // 取得會員帳號
  useEffect(() => {
    // setOnline_user(OnlineUser);
    if (OnlineUser.username === undefined) {
      dispatchShowAlert('error', '登入才能Po文!');
      props.history.push('/');
    } else {
      setarticleContent({ ...articleContent, author: OnlineUser.username });
    }
  }, [OnlineUser]);

  useEffect(() => {
    console.log('ArticleData', ArticleData);
    if (ArticleData.author !== '') {
      setarticleContent(ArticleData);
      seteditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(ArticleData.contents)),
        ),
      );
      const categoryref = firebase.database().ref(`${ArticleData.boardname}/category`);
      dispatchgetArticleCategory(categoryref);
    }
    if (ArticleData.author !== '' && OnlineUser) {
      if (OnlineUser.username !== ArticleData.author) {
        props.history.push(
          `/${ArticleData.boardname}/${ArticleData.timestamp}`,
        );
      }
    }
  }, [ArticleData, OnlineUser]);

  const handleSelectBoard = (e) => {
    setarticleContent({ ...articleContent, boardname: e.target.value });
    const categoryref = firebase.database().ref(`${e.target.value}/category`);
    // props.dispatch(getArticleCategory(categoryref));
    dispatchgetArticleCategory(categoryref);
  };
  const handleTitle = (e) => {
    setarticleContent({ ...articleContent, title: e.target.value });
  };

  const handleSelectCategory = (e) => {
    setarticleContent({ ...articleContent, category: e.target.value });
    setSelectCategory(e.target.value);
  };

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

  const sumit = () => {
    if (
      editorState
        .getCurrentContent()
        .getPlainText()
        .trim() === ''
    ) {
      // alert("內文不得為空");
      // props.dispatch(ShowAlert('error', '內文不得為空!'));
      dispatchShowAlert('error', '內文不得為空!');
    } else if (articleContent.title === '') {
      // alert("標題不得為空");
      // props.dispatch(ShowAlert('error', '標題不得為空!'));
      dispatchShowAlert('error', '標題不得為空!');
    } else {
      const raw = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      articleContent.contents = raw;

      if (isEdits === false) {
        const submitRef = firebase
          .database()
          .ref(`/${articleContent.boardname}/article_list`);
        const timecode = Math.floor(Date.now() / 100);
        // props.dispatch(submitArticle(submitRef, timecode, articleContent));
        dispatchsubmitArticle(submitRef, timecode, articleContent);
        props.history.push(`/${articleContent.boardname}/${timecode}`);
        // props.dispatch(ShowAlert('success', '完成發文!'));
        dispatchShowAlert('success', '完成發文!');
      } else {
        const updateRef = firebase
          .database()
          .ref(`/${articleContent.boardname}/article_list`);
        // props.dispatch(
        //   UpdateArticle(updateRef, articleContent.timestamp, articleContent),
        // );
        dispatchUpdateArticle(updateRef, articleContent.timestamp, articleContent);
        // props.dispatch(notEdits());
        dispatchnotEdits();
        props.history.push(
          `/${articleContent.boardname}/${articleContent.timestamp}`,
        );
        // props.dispatch(ShowAlert('success', '完成編輯!'));
        dispatchShowAlert('success', '完成編輯!');
      }
    }
  };
  const cancelSubmit = () => {
    // props.dispatch(notEdits());
    dispatchnotEdits();
    const tempboard = location.pathname.split('/')[1];
    const id = location.pathname.split('/')[2];
    if (id) {
      props.history.push(`/${tempboard}/${id}`);
      // props.dispatch(ShowAlert('warning', '取消編輯!'));
      dispatchShowAlert('warning', '取消編輯!');
    } else {
      props.history.push('/');
      // props.dispatch(ShowAlert('warning', '取消發文!'));
      dispatchShowAlert('warning', '取消發文!');
    }
  };
  // const converts = ()=>{
  //   console.log('====================================');
  //   console.log('raw',raw);
  //   console.log('parseraw',JSON.parse(raw));
  //   console.log('====================================');
  //   console.log(convertToHTML(convertFromRaw(JSON.parse(raw))))

  // }
  useEffect(() => {
    // 修改
    // let ref = firebase.database().ref("/chat/article_list/16025165323/contents");
    // ref.once("value").then(function (snapshot) {
    //   var val = snapshot.val();
    //   console.log(val);
    //   seteditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(val))))
    // });
  }, []);

  return (
    <Container maxWidth="md" className={classes.contain}>
      <PostStyle>
        {isEdits === false ? (
          <section>
            <span>看板</span>
            <select
              value={articleContent.boardname}
              onChange={handleSelectBoard}
            >
              {board.map((item) => (
                <option value={item.boardkey} key={item.boardkey}>
                  {item.boardname}
                  (
                  {item.boardkey}
                  )
                </option>
              ))}
            </select>
          </section>
        ) : (
          ''
        )}
        <section>
          <span>分類</span>
          <select value={selectCategory} onChange={handleSelectCategory}>
            {category.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </section>
        <section>
          <span>作者</span>
          <span style={{ margin: '0' }}>{OnlineUser.username}</span>
        </section>
        <section>
          <span>標題</span>
          <input
            maxLength="45"
            type="text"
            value={articleContent.title}
            onChange={handleTitle}
          />
        </section>
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
            <p style={{ color: 'red' }}>內文不得為空</p>
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
    </Container>
  );
};

const mapStateToProps = (store) => ({
  boardname: store.boardReducer.board,
  ArticleData: store.articleReducer.contents,
  OnlineUser: store.loginReducer,
  isEdits: store.postReducer,
  Category: store.articleReducer.category,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
    dispatchgetBoardName: (ref) => dispatch(getBoardName(ref)),
    dispatchgetArticleContent: (ref) => dispatch(getArticleContent(ref)),
    dispatchgetArticleCategory: (ref) => dispatch(getArticleCategory(ref)),
    dispatchsubmitArticle:
    (ref, timecode, Content) => dispatch(submitArticle(ref, timecode, Content)),
    dispatchUpdateArticle:
    (ref, timestamp, Content) => dispatch(UpdateArticle(ref, timestamp, Content)),
    dispatchnotEdits: () => dispatch(notEdits()),
  };
}
Post.propTypes = {
  boardname: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.isRequired,
  }),
  Category: arrayOf(PropTypes.shape({
    id: PropTypes.number,
    Category: PropTypes.string,
  })),
  ArticleData: PropTypes.shape({
    author: PropTypes.string,
    contents: PropTypes.string,
    boardname: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isEdits: PropTypes.bool.isRequired,
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),

  dispatchgetBoardName: PropTypes.func.isRequired,
  dispatchgetArticleContent: PropTypes.func.isRequired,
  dispatchgetArticleCategory: PropTypes.func.isRequired,
  dispatchShowAlert: PropTypes.func.isRequired,
  dispatchsubmitArticle: PropTypes.func.isRequired,
  dispatchUpdateArticle: PropTypes.func.isRequired,
  dispatchnotEdits: PropTypes.func.isRequired,
};
Post.defaultProps = {
  boardname: {
    type: '',
    data: [],
  },
  Category: [],
  OnlineUser: {},
  ArticleData: {
    author: '',
    contents: '',
    boardname: '',
    timestamp: 0,
  },
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post));
