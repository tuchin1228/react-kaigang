import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import Box from "@material-ui/core/Box";
// import Skeleton from "@material-ui/lab/Skeleton";
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import ButtonBase from '@material-ui/core/ButtonBase';
import { convertToHTML } from 'draft-convert';

import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import ForumIcon from '@material-ui/icons/Forum';
import {
  convertFromRaw,
} from 'draft-js';

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
  cantfindp: {
    fontSize: '1.5em',
    fontWeight: '400',
    padding: '0 1vw',
    letterSpacing: ' 1.5px',
    color: '#0051b5',
  },
}));
const ArticleBox = styled.div`
  padding: 1vh 1vw;
  margin: 0 1vw;
  border-bottom: 1px solid #d3e5ff;
  h2 {
    font-weight: 600;
    margin: 0;
    color: #00398e;
    letter-spacing: 1.2px;
    font-size: 1.6em;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  h3 {
    font-weight: 400;
    margin: 0.5vh 0 0 0;

    svg {
      color: #9fb4ff;
    }
    span {
      color: #7b7b7b;
      vertical-align: super;
      font-weight: 300;
      letter-spacing: 1.5px;
    }
  }
  p {
    font-weight: 400;
    margin: 0;
    font-size: 1.1em;
    letter-spacing: 1.5px;
    color: #a5a5a5;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
const Buttonbase = styled(ButtonBase)`
  text-align: left;
  display: block;
  width: 100%;
  &:hover {
    background: #e4f1ff;
  }
`;
const SearchResP = styled.p`
  font-size: 1.6em;
  padding: 1vh 1vw;
  margin: 0 0 0 0;
  background: #ffe088;
  letter-spacing: 1.5px;
  color: #8e4800;
  font-weight: 500;
`;

function Search() {
  const location = useLocation();
  // let { match } = props;
  const classes = useStyles();
  // const [queryObj, setQuery] = useState({});
  const [articles, setArticles] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [keyword, setKeyword] = useState('');
  const getData = () => {
    const articleArray = [];
    const ref = firebase.database().ref('/');
    articleArray.length = 0;
    return new Promise((resolve) => {
      ref.orderByChild('timestamp').once('value', (snapshot) => {
        const templist = Object.values(snapshot.val());
        // console.log(templist);
        templist.forEach((item) => {
          Object.values(item.article_list).forEach((items) => {
            articleArray.push(items);
          });
        });
        setArticles(articleArray);
      });
      resolve(articleArray);
    });
  };
  useEffect(() => {
    getData();
  }, [location.search]);

  useEffect(() => {
    if (articles.length !== 0) {
      if (location.search) {
        // query為中文會呈現亂碼，所以要decodeURIComponent解碼
        const tempkeyword = decodeURIComponent(location.search)
          .split('')
          .slice(location.search.split('').indexOf('=') + 1)
          .join('');
        const result = [];
        articles.forEach((item) => {
          if (item.title.indexOf(tempkeyword) !== -1) {
            result.push(item);
          }
        });
        setKeyword(tempkeyword);
        setSearchResult(result);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  //   useEffect(() => {
  //     console.log('march',match.url);
  //   }, [])

  return (
    <Container maxWidth="md" className={classes.contain}>
      <SearchResP>
        以下為
        {keyword}
        搜尋結果
      </SearchResP>
      {searchResult
        ? searchResult.map((item) => (
          <Buttonbase className={classes.buttonbaseStyle} key={item.timestamp}>
            <Link
              key={item.timestamp}
              to={`${item.boardname}/${item.timestamp}`}
              style={{ textDecoration: 'none' }}
            >
              <ArticleBox key={item.timestamp}>
                <h2>
                  【
                  {item.category}
                  】
                  {item.title}
                </h2>
                <h3>
                  <DashboardIcon />
                  <span>{item.boardname}</span>
                  <PersonIcon />
                  <span>{sliceMail(item.author)}</span>
                  {item.res ? (
                    <>
                      {pushcount(Object.values(item.res)) !== 0 ? (
                        <>
                          <ThumbUpAltSharpIcon />
                          {' '}
                          <span>{pushcount(Object.values(item.res))}</span>
                        </>
                      ) : (
                        ''
                      )}
                      <ForumIcon />
                      {' '}
                      <span>{Object.values(item.res).length}</span>
                    </>
                  ) : (
                    ''
                  )}

                </h3>
                <p className="contentP">
                  {convertToHTML(convertFromRaw(JSON.parse(item.contents)))
                    .replace(/<p><\/p>/gi, '')
                    .replace(/<p>/gi, '')
                    .replace(
                      /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g,
                      '',
                    )
                    .replace(/.<\/p>/gi, '，')
                    .replace(/<\/p>/gi, '')
                    .replace(/<\/p/gi, '')}
                </p>

              </ArticleBox>
            </Link>
          </Buttonbase>
        ))
        : ''}
      {searchResult && searchResult.length === 0 ? (
        <p className={classes.cantfindp}>搜尋不到相關結果</p>
      ) : (
        ''
      )}
    </Container>
  );
}

export default Search;
