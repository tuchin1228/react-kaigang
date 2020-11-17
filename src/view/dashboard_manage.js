import React, { useState, useEffect } from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import styled from 'styled-components';
import firebase from 'firebase';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import getArticleList from '../action/list_action';
import { deleteArticle } from '../action/article_action';
import { getBoardName } from '../action/action';

import ShowAlert from '../action/alert_action';
// import { makeStyles } from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
const TimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 100);
  // let dataValues = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  return `${date.getMonth() + 1}/${date.getDate()}`;
};
const sliceMail = (username) => {
  const newuser = username
    .split('')
    .slice(0, username.indexOf('@'))
    .join('');
  return newuser;
};
// const useStyles = makeStyles((theme) => ({
//   contain: {
//     // height: "calc(98vh - 64px)",
//     marginTop: "1vh",
//     background: "white",
//     padding: "1vh 1vw",
//     borderRadius: "5px",
//     // paddingBottom: "20vh",
//     // overflow: "scroll",
//     "&::-webkit-scrollbar": {
//       display: "none",
//     },
//   },
// }));
const FilterBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  select {
    border: 1px solid #0067bf;
    padding: 1vh 0.5vw;
    width: 25%;
    font-size: 1.2em;
  }
  input {
    border: 1px solid #0067bf;
    padding: 1vh 0.5vw;
    width: 25%;
    font-size: 1.2em;
  }
`;
const TableStyle = styled.table`
  margin-top: 2vh;
  /* border-collapse: separate; */
  /* border-spacing: 0; */
  width: 100%;
  table-layout: fixed;
  tr {
    td {
      text-align: center;
      /* border-bottom: 1px solid black; */
      font-size: 1.2em;
      padding: 1vh 5px;
      letter-spacing: 1.2px;
      background: #f1f8ff;
      color: #00318c;
      /* border-right: 1px solid black; */
      &:first-child {
        /* border-left: 1px solid black; */
      }
      &:nth-of-type(4) {
        width: 50%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &:last-of-type {
        width: 20%;
        button {
          margin: 0 5px;
          font-size: 0.9em;
          &:first-child {
            background: #5fb14a;
          }
        }
      }
    }
  
  }
  thead tr td {
      /* border-top: 1px solid black; */
      font-weight: 500;
      font-size: 1.4em;
      background: #65a3ff;
      color: white;
    }
`;

function DashboardManage(props) {
  // const classes = useStyles();
  const { boardname } = props;
  const { OnlineUser } = props;
  const { ArticleList } = props;
  const {
    dispatchShowAlert,
    dispatchdeleteArticle,
    dispatchgetArticleList,
    dispatchgetBoardName,
  } = props;
  const [board, setboard] = useState([]);
  const [BoardValue, setBoardValue] = useState('all');
  const [articleList, setArticleList] = useState([]);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterResult, setFilterResult] = useState([]);

  const { nowIndex, defaultIndex } = props;
  const handleBoardSelect = (e) => {
    setBoardValue(e.target.value);
  };
  const handleAuthor = (e) => {
    setFilterAuthor(e.target.value);
  };
  const handleDate = (e) => {
    setFilterDate(e.target.value);
  };

  const getData = () => {
    const articleArray = [];
    const ref = firebase.database().ref('/');
    articleArray.length = 0;
    return new Promise((resolve) => {
      ref.orderByChild('timestamp').once('value', (snapshot) => {
        const templist = Object.values(snapshot.val());
        templist.forEach((item) => {
          Object.values(item.article_list).forEach((items) => {
            articleArray.push(items);
          });
        });
        setArticleList(articleArray);
        setFilterResult(articleArray);
      });
      resolve(articleArray);
    });
  };
  const DELETE_ARTICLE = (deleteBoard, deleteTimestamp) => {
    if (OnlineUser.username !== 'test@mail.com') {
      // alert('非管理員無法傳送!')
      // props.dispatch(ShowAlert('error', '非管理員無法刪除!'));
      dispatchShowAlert('error', '非管理員無法刪除!');
      return;
    }

    const deleteRef = firebase.database().ref(`/${deleteBoard}/article_list`);
    // props.dispatch(deleteArticle(deleteRef, deleteTimestamp));
    dispatchdeleteArticle(deleteRef, deleteTimestamp);
    // props.dispatch(ShowAlert('success', '成功刪除!'));
    dispatchShowAlert('success', '成功刪除!');
    if (BoardValue !== '' && BoardValue !== 'all') {
      const getList = firebase.database().ref(`${BoardValue}/article_list`);
      // props.dispatch(getArticleList(getList));
      dispatchgetArticleList(getList);
    } else if (BoardValue === 'all') {
      getData();
    }
  };
  useEffect(() => {
    let res = [];
    if (articleList) {
      res = articleList
        .filter((item) => {
          const fulldate = new Date(item.timestamp * 100);
          const year = fulldate.getFullYear();
          const month = (fulldate.getMonth() + 1 < 10 ? '0' : '')
            + (fulldate.getMonth() + 1);
          const date = fulldate.getDate();
          const checkdate = `${year}-${month}-${date}`;
          if (checkdate === filterDate) {
            return item;
          }
          return articleList;
        })
        .filter((item) => {
          if (
            item.author
              .split('')
              .slice(0, item.author.indexOf('@'))
              .join('')
              .toLowerCase()
              .indexOf(filterAuthor.toLowerCase()) !== -1
          ) {
            return item;
          }
          return null;
        });

      setFilterResult(res);
    }
  }, [filterAuthor, filterDate, articleList]);

  useEffect(() => {
    if (ArticleList.list && BoardValue !== 'all') {
      setArticleList(ArticleList.list);
      setFilterResult(ArticleList.list);
    }
  }, [ArticleList, BoardValue]);
  useEffect(() => {
    if (BoardValue !== '' && BoardValue !== 'all') {
      const getList = firebase.database().ref(`${BoardValue}/article_list`);
      // props.dispatch(getArticleList(getList));
      dispatchgetArticleList(getList);
    } else if (BoardValue === 'all') {
      getData();
    }
  }, [BoardValue]);

  useEffect(() => {
    const ref = firebase.database().ref('/');
    // props.dispatch(getBoardName(ref));
    dispatchgetBoardName(ref);
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

  return (
    <div
      hidden={nowIndex !== defaultIndex}
      id={`vertical-tabpanel-${defaultIndex}`}
    >
      <FilterBox>
        <select value={BoardValue} onChange={handleBoardSelect}>
          <option value="all">全部看板</option>
          {board.map((item) => (
            <option key={item.boardkey} value={item.boardkey}>
              {item.boardname}
              (
              {item.boardkey}
              )
            </option>
          ))}
        </select>
        <input type="text" placeholder="輸入作者" onChange={handleAuthor} />
        <input type="date" onChange={handleDate} />
      </FilterBox>

      <TableStyle>
        <thead>
          <tr>
            <td>日期</td>
            <td>作者</td>
            <td>看板</td>
            <td>標題</td>
            <td>指令</td>
          </tr>
        </thead>
        <tbody>
          {filterResult.map((item) => (
            <tr key={item.timestamp}>
              <td>{TimestampToDate(item.timestamp)}</td>
              <td>{sliceMail(item.author)}</td>
              <td>{item.boardname}</td>
              <td style={{ textAlign: 'left' }}>
                【
                {item.category}
                】
                {item.title}
              </td>
              <td>
                <Button
                  onClick={() => props.history.push(`/${item.boardname}/${item.timestamp}`)}
                  variant="contained"
                  disableElevation
                  size="small"
                  color="primary"
                >
                  查看
                </Button>
                <Button
                  onClick={() => DELETE_ARTICLE(item.boardname, item.timestamp)}
                  variant="contained"
                  disableElevation
                  size="small"
                  color="secondary"
                >
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableStyle>
    </div>
  );
}

const mapStateToProps = (store) => ({
  ArticleList: store.listReducer,
  boardname: store.boardReducer.board,
  OnlineUser: store.loginReducer,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchdeleteArticle: (deleteRef, id) => dispatch(deleteArticle(deleteRef, id)),
    dispatchShowAlert: (alertType, Msg) => dispatch(ShowAlert(alertType, Msg)),
    dispatchgetArticleList: (ref) => dispatch(getArticleList(ref)),
    dispatchgetBoardName: (ref) => dispatch(getBoardName(ref)),
  };
}
DashboardManage.propTypes = {
  boardname: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.isRequired,
  }),
  OnlineUser: PropTypes.shape({
    uid: '',
    username: '',
  }),
  ArticleList: arrayOf(
    PropTypes.shape({
      author: PropTypes.string.isRequired,
      boardname: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    }),
  ),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  defaultIndex: PropTypes.number.isRequired,
  nowIndex: PropTypes.number.isRequired,
  dispatchShowAlert: PropTypes.func.isRequired,
  dispatchdeleteArticle: PropTypes.func.isRequired,
  dispatchgetArticleList: PropTypes.func.isRequired,
  dispatchgetBoardName: PropTypes.func.isRequired,
};
DashboardManage.defaultProps = {
  boardname: {
    data: [],
  },
  OnlineUser: {},
  ArticleList: [],
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardManage));
