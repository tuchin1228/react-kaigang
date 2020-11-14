import React, { useEffect, useState, Fragment } from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import firebase from 'firebase';
import { connect } from 'react-redux';
import {
  Link,
} from 'react-router-dom';

import ButtonBase from '@material-ui/core/ButtonBase';
// import Article from "./article";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import Box from "@material-ui/core/Box";
import Skeleton from '@material-ui/lab/Skeleton';
import {
  convertFromRaw,
} from 'draft-js';
import { convertToHTML } from 'draft-convert';

import Button from '@material-ui/core/Button';
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";

import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import ForumIcon from '@material-ui/icons/Forum';
import { getArticleBoard } from '../action/article_action';
import getArticleList from '../action/list_action';
import ErrorImg from '../img/404.png';

const Buttonbase = styled(ButtonBase)`
  &:hover {
    background: #e4f1ff;
  }
`;
const useStyles = makeStyles(() => ({
  contain: {
    height: '100%',
    marginTop: '1vh',
    background: 'white',
    padding: '0',
    borderRadius: '5px',
    paddingBottom: '20vh',
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
  boardtitle: {
    margin: '0',
    fontSize: '2em',
    fontWeight: '600',
    padding: '1vh 1vw',
    background: '#89beff',
    color: '#ffffff',
  },
  buttonbaseStyle: {
    display: 'block',
    width: '100%',
    fontFamily: "'Noto Sans TC', sans-serif",
    padding: '0 1vw',
  },
}));
const ArticleBoxTitle = styled.article`
  position: sticky;
  top: 0;
  z-index: 99;
  cursor: pointer;
  padding: 1vh 0vw;
  border-bottom: 1px solid #ffdba4;
  transition: 0.3s;
  background: #ffe893;
  .text-content {
    padding: 0 1vw;
  }
  .titles {
    display: flex;
    align-items: center;
    text-align: center;
    span {
      display: block;
      font-size: 1.4em;
      color: #144c92;
      font-weight: 500;
      display: block;
      /* margin-right: 1vw; */
      flex: 1;
    }
    h2 {
      flex: 2;
      margin: 0;
      font-size: 1.4em;
      font-weight: 500;
      color: #144c92;
    }
    h3 {
      flex: 9;
      line-height: 1.2;
      color: #144c92;
      font-size: 1.4em;
      font-weight: 500;
      letter-spacing: 1.2px;
      margin: 0vh 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      display: block;
      /* padding: 0 1vw; */
    }
  }
  @media (max-width: 767px) {
    display: none;
  }
`;
const ArticleBox = styled.article`
  cursor: pointer;
  padding: 1vh 0vw;
  border-bottom: 1px solid #c4dbff;
  transition: 0.3s;

  .titles {
    display: flex;
    text-align: center;
    align-items: center;
    span {
      display: block;
      font-size: 1.4em;
      font-weight: 400;
      display: block;
      color: #144c92;
      /* margin-right: 1vw; */
      flex: 1;
    }
    h2 {
      flex: 2;
      color: #144c92;
      margin: 0;
      font-size: 1.3em;
      font-weight: 400;
    }
    .pushbox {
      /* display: flex;
      align-items: center; */
      flex: 9;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      h4 {
        padding: 0 1vw;
        font-size: 0.9em;
        /* text-align: center; */
        /* width: 31px;
        height: 31px; */
        font-weight: 400;
        margin: 0;
        /* border-radius: 100%; */
        /* color: #ff5c5c; */
        letter-spacing: 0.5px;
        /* border: 2px solid #ff5c5c; */
        margin: 0;
        color: #9dc0ff;
        svg {
          vertical-align: sub;
          width: 0.8em;
          height: 0.8em;
        }
      }
      h3 {
        flex: 9;
        line-height: 1.6;
        font-size: 1.4em;
        font-weight: 500;
        letter-spacing: 1.2px;
        color: #144c92;
        margin: 0vh 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        padding: 0 0.5vw;
        display: block;
        text-align: left;
        span {
          /* padding-right: 0 2vw; */
          font-weight: 300;
          letter-spacing: 2px;
          color: #a2a2a2;
          font-size: 0.8em;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 0 0.5vw;
        }
      }
      /* }  */
    }
    @media (max-width: 767px) {
      flex-wrap:wrap;
      .pushbox{
        width:100%;
        flex:auto;
        order:1;
      }
      h2{
        order:2;
        text-align:left;
      }
      >span{
        order:3;
        text-align:right;
      }
      span,
      h2,
      h3 {
        flex:auto;
        font-size: 1.2em !important;
      }
      h3 > span {
        font-size: 1em !important;
      }
    }
  }
  .infos {
    display: flex;
    justify-content: space-between;
  }
`;
// const TableStyle = styled.table`
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0;
//   background: white;
//   border-radius: 0px;
//   table-layout: fixed;
//   tbody {
//     tr:nth-of-type(n + 2):hover {
//       td {
//         background: #e1f3ff;
//         cursor: pointer;
//       }
//     }
//   }

//   tr {
//     td {
//       border-bottom: 1px solid #e2e2e2;
//       padding: 1vh 0vw;
//       font-size: 1.3em;
//       letter-spacing: 1.4px;
//       background: white;
//       &:nth-child(-n + 2) {
//         text-align: center;
//         width: 15%;
//       }
//       &:last-child {
//         p {
//           padding: 0 1vw;
//           margin: 0;
//           display: block;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }
//       }
//     }

//     &:first-child {
//       td {
//         position: sticky;
//         top: 0px;
//         font-weight: 500;
//         color: #006cdc;
//         font-size: 1.4em;
//         padding-top: 1vh;
//         background: #ffd439;
//         cursor: default;
//         text-align: center;
//         border-bottom: 2px solid #006cdc;
//       }
//     }
//   }
// `;
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

const pushcount = (res) => {
  let count = 0;
  res.forEach((item) => {
    if (item.res_type === 'push') {
      count += 1;
    }
  });
  return count;
};

const List = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const { match } = props;
  const { BoardName } = props;
  const { ArticleList } = props;
  // const [articleList, setArticleList] = useState([]);
  const [board, setBoard] = useState('');
  // const [params, setParams] = useState("");
  // const [open, setOpen] = useState(false);
  // const [pushCount, setPushCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const { dispatchgetArticleBoard, dispatchgetArticleList } = props;
  // const openStatus = () => {
  // if (open == true) {
  //   props.history.push(match.url);
  // }
  // setOpen(!open);
  // console.log('====================================');
  // console.log(open);
  // console.log('====================================');
  // };

  useEffect(() => {
    let newparams = '';

    if (location.pathname.split('').indexOf('/', 1) !== -1) {
      newparams = location.pathname
        .split('')
        .slice(0, location.pathname.split('').indexOf('/', 1))
        .join('');
    } else {
      newparams = location.pathname;
    }
    const boardref = firebase.database().ref(`${newparams}`);
    const getList = firebase.database().ref(`${newparams}/article_list`);
    // props.dispatch(getArticleBoard(boardref));
    dispatchgetArticleBoard(boardref);
    dispatchgetArticleList(getList);
    // props.dispatch(getArticleList(getList));
  }, [location.pathname]);

  useEffect(() => {
    if (ArticleList === 'Fail to get list') {
      setIsError(true);
    } else if (ArticleList) {
      setIsError(false);
    }
  }, [ArticleList]);

  useEffect(() => {
    if (BoardName) {
      setBoard(BoardName);
    }
  }, [BoardName]);

  // useEffect(() => {
  //   setParams(location.pathname);
  // }, [location.pathname]);

  return (
    <Container maxWidth="md" className={classes.contain}>
      {isError !== true ? (
        <>
          <p className={classes.boardtitle}>{board || <Skeleton />}</p>
          <ArticleBoxTitle>
            <div className="text-content">
              <div className="titles">
                <span>時 間</span>
                <h2>作 者</h2>
                <h3>標 題</h3>
              </div>
            </div>
          </ArticleBoxTitle>
          {ArticleList.length !== 0 && ArticleList !== 'Fail to get list' ? (
            <>
              {ArticleList.map((item) => (
                <Fragment key={item.timestamp}>
                  <Buttonbase
                    key={item.timestamp}
                    className={classes.buttonbaseStyle}
                  >
                    <Link
                      key={item.timestamp}
                      to={`${match.url}/${item.timestamp}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <ArticleBox key={item.timestamp}>
                        <div className="text-content">
                          <div className="titles">
                            <span>{TimestampToDate(item.timestamp)}</span>
                            <h2>{sliceMail(item.author)}</h2>
                            <div className="pushbox">
                              <h3>
                                【
                                {item.category}
                                】
                                {' '}
                                {item.title}
                                <br />
                                <span>
                                  {convertToHTML(
                                    convertFromRaw(JSON.parse(item.contents)),
                                  )
                                    .replace(/<p><\/p>/gi, '')
                                    .replace(/<p>/gi, '')
                                    .replace(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g,
                                      '')
                                    .replace(/.<\/p>/gi, '，')
                                    .replace(/<\/p>/gi, '')
                                    .replace(/<\/p/gi, '')}
                                </span>
                              </h3>
                              {item.res ? (
                                <h4>
                                  {pushcount(Object.values(item.res))
                                    !== 0 ? (
                                      <>
                                        <ThumbUpAltSharpIcon />
                                        {' '}
                                        {pushcount(Object.values(item.res))}
                                      </>
                                    ) : (
                                      ''
                                    )}
                                  <ForumIcon />
                                  {' '}
                                  {Object.values(item.res).length}
                                </h4>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        </div>
                      </ArticleBox>
                    </Link>
                  </Buttonbase>

                </Fragment>

              ))}

            </>
          ) : (
            <>
              {
                Array.from(Array(5).keys()).map(
                  (item) => <Skeleton height="100px" animation="wave" key={item} />,
                )
              }
            </>
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
    </Container>
  );
};

const mapStateToProps = (store) => ({
  ArticleList: store.listReducer.list,
  BoardName: store.articleReducer.board,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchgetArticleBoard: (boardref) => dispatch(getArticleBoard(boardref)),
    dispatchgetArticleList: (getList) => dispatch(getArticleList(getList)),
  };
}

List.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  BoardName: PropTypes.string,
  ArticleList: arrayOf(
    PropTypes.shape({
      author: PropTypes.string.isRequired,
      boardname: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    }),
  ),
  dispatchgetArticleBoard: PropTypes.func.isRequired,
  dispatchgetArticleList: PropTypes.func.isRequired,
};
List.defaultProps = {
  BoardName: '',
  ArticleList: [],
  match: {
    path: '',
    url: '',
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(List);

// function TestDialog(props) {
//   useEffect(() => {
//     console.log("====================================");
//     //  console.log();
//     console.log("====================================");
//   }, [props.openStatus]);

//   return (
//     <div>
//       <Dialog
//         open={props.isOpen}
//         onClose={props.openStatus}
//         // scroll={scroll}
//         aria-labelledby="scroll-dialog-title"
//         aria-describedby="scroll-dialog-description"
//       >
//         <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
//             {[...new Array(50)]
//               .map(
//                 () => `Cras mattis consectetur purus sit amet fermentum.
// Cras justo odio, dapibus ac facilisis in, egestas eget quam.
// Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
// Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
//               )
//               .join("\n")}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button color="primary">Cancel</Button>
//           <Button color="primary">Subscribe</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
