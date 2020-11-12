import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  convertFromRaw,
} from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { getArticleContent, getArticleBoard } from '../action/article_action';

const convertLinks = (input) => {
  let text = input;
  const linksFound = text.match(
    /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g,
  );
  const aLink = [];

  if (linksFound != null) {
    for (let i = 0; i < linksFound.length; i += 1) {
      let replace = linksFound[i];
      if (!linksFound[i].match(/(http(s?)):\/\//)) {
        replace = `http://${linksFound[i]}`;
      }
      let linkText = replace.split('/')[2];
      if (linkText.substring(0, 3) === 'www') {
        linkText = linkText.replace('www.', '');
      }
      if (linkText.match(/youtu/)) {
        const youtubeID = replace.split('/watch?v=').slice(-1)[0];

        aLink.push(
          `<div class="video-wrapper"><iframe width="560" height="315" src="https://www.youtube.com/embed/${
            youtubeID
          }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
        );
      }
      // else if ( linkText.match( /vimeo/ ) ) {
      //   let vimeoID = replace.split( '/' ).slice(-1)[0];
      //   console.log('vimeoID',vimeoID)
      //   aLink.push( '<div class="video-wrapper"><iframe src="https://player.vimeo.com/video/' + vimeoID + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>' )
      // }
      // else {
      //   aLink.push( '<a href="' + replace + '" target="_blank">' + linkText + '</a>' );
      // }
      text = text
        .split(linksFound[i])
        .map((item) => (aLink[i].includes('iframe') ? item.trim() : item))
        .join(aLink[i]);
    }
    return text;
  }
  return input;
};
const TimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 100);
  //   let dataValues = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  //   return `${date.getMonth() + 1}/${date.getDate() }`;
  const time = new Date(date).toLocaleTimeString('it-IT');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${year} ${month} ${day} ${time}`;
};

// const sliceMail = (username) => {
//   return username.split("").slice(0, username.indexOf("@")).join("");
// };
const ContainerBox = styled.div`
  padding: 0 20px;
  @media (max-width:767px){
    padding:0 10px;
  }
`;
const ContentStyle = styled.div`
  min-height: 250px;
  /* border-bottom: 1px solid #d4d4d4; */
  p {
    font-size: 1.3em;
    padding: 0 1vw;
    color: #7b7b7b;
    margin: 0.5vh 0;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.75);
    letter-spacing: 1.5px;
    text-align: justify;
    text-justify: inter-ideograph;
    line-height: 1.8;
    min-height: 30px;
  }
  @media (max-width:767px){
    iframe{
      width:100%;
    }
    
  }
`;
const ArticleTable = styled.table`
  width: 100%;
  table-layout: fixed;
  margin: 0 0 2vh 0;
  tr {
    td {
      padding: 0.5vh 0.5vw;
      letter-spacing: 1.8px;
      font-size: 1.5em;
      font-weight: 400;
      &:first-child {
        background: #ffef80;
        color: #8e3206;
        width: 15%;
        text-align: center;
      }
      &:last-child {
        width: 100%;
        display: block;
        background: #def3ff;
        color: #205fbd;
      }
    }
  }
  @media (max-width:767px){
    tr{
      td{
        font-size:1.2em;
      }
    }
  }
`;

function ArticleContent(props) {
  const location = useLocation();
  const { ARTICLE_DATA } = props;
  const { BoardName } = props;
  const [ARTICLE_CONTENT, setArticleContent] = useState({});
  const [CONTENT_HTML, SETCONTENT_HTML] = useState('');
  // const [board, setBoard] = useState("Loading");
  const { dispatchgetArticleContent, dispatchgetArticleBoards } = props;
  const boardname = location.pathname
    .split('')
    .slice(0, location.pathname.split('').indexOf('/', 1))
    .join(''); // /chat

  const id = location.pathname
    .split('')
    .slice(location.pathname.split('').indexOf('/', 1))
    .join(''); // timestamp

  useEffect(() => {
    const ref = firebase.database().ref(`${boardname}/article_list${id}`);
    const boardref = firebase.database().ref(`${boardname}`);

    // props.dispatch(getArticleContent(ref));
    dispatchgetArticleContent(ref);
    // props.dispatch(getArticleBoard(boardref));
    dispatchgetArticleBoards(boardref);
  }, []);

  useEffect(() => {
    if (ARTICLE_DATA.author.length !== 0) {
      setArticleContent(ARTICLE_DATA);
      const last = convertLinks(
        convertToHTML(convertFromRaw(JSON.parse(ARTICLE_DATA.contents))),
      );
      // last.replace(/^https?:\/\/(\w+\.)?imgur.com\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$/)
      SETCONTENT_HTML(last);
    }

    const boardref = firebase.database().ref(`${boardname}`);
    // props.dispatch(getArticleBoard(boardref));
    dispatchgetArticleBoards(boardref);
  }, [ARTICLE_DATA]);

  return (
    <ContainerBox>
      <ArticleTable>
        <tbody>
          <tr>
            <td>看板</td>
            <td>{BoardName}</td>
          </tr>
          <tr>
            <td>作者</td>
            <td>{ARTICLE_CONTENT.author}</td>
          </tr>
          <tr>
            <td>標題</td>
            <td>
              【
              {ARTICLE_CONTENT.category}
              】
              {ARTICLE_CONTENT.title}
            </td>
          </tr>
          <tr>
            <td>時間</td>
            <td>{TimestampToDate(ARTICLE_CONTENT.timestamp)}</td>
          </tr>
        </tbody>
      </ArticleTable>
      <ContentStyle
        dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}
      />
    </ContainerBox>
  );
}
const mapStateToProps = (store) => ({
  ARTICLE_DATA: store.articleReducer.contents,
  BoardName: store.articleReducer.board,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatchgetArticleContent: (ref) => dispatch(getArticleContent(ref)),
    dispatchgetArticleBoards: (boardref) => dispatch(getArticleBoard(boardref)),
  };
}

ArticleContent.propTypes = {
  ARTICLE_DATA: PropTypes.shape({
    author: PropTypes.string,
    boardname: PropTypes.string,
    category: PropTypes.string,
    contents: PropTypes.string,
  }),
  BoardName: PropTypes.string,
  dispatchgetArticleContent: PropTypes.func.isRequired,
  dispatchgetArticleBoards: PropTypes.func.isRequired,
};

ArticleContent.defaultProps = {
  ARTICLE_DATA: {
    author: '',
    boardname: '',
    category: '',
    contents: '',
  },
  BoardName: '',
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticleContent);
