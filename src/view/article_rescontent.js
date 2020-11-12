import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import ThumbDownAltSharpIcon from '@material-ui/icons/ThumbDownAltSharp';
import MessageRoundedIcon from '@material-ui/icons/MessageRounded';
import {
  convertFromRaw,
} from 'draft-js';

import { convertToHTML } from 'draft-convert';
import Box from '@material-ui/core/Box';

const TimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 100);
  //   let dataValues = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  //   return `${date.getMonth() + 1}/${date.getDate() }`;
  const time = new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  // var year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month}月${day}日 ${time}`;
};

const resIcon = (resType) => {
  switch (resType) {
    case 'push':
      return <ThumbUpAltSharpIcon className="pushicon" />;
    case 'hate':
      return <ThumbDownAltSharpIcon className="hateicon" />;
    case 'res':
      return <MessageRoundedIcon className="resicon" />;
    default:
      return false;
  }
};

const sliceMail = (username) => username
  .split('')
  .slice(0, username.indexOf('@'))
  .join('');
const convertLinks = (input) => {
  let text = input;
  const linksFound = text.match(
    /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g,
  );
  const aLink = [];

  if (linksFound != null) {
    for (let i = 0; i < linksFound.length; i++) {
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
const ResPtag = styled.p`
    font-size: 1.8em;
    letter-spacing: 1.5px;
    font-weight: 300;
    text-align: center;
    color: #98765e;
  
`;
const PersonRes = styled.div`
  padding: 1vh 0.5vw;
  border-bottom: 1px solid #b76a0a36;
`;
const ResContentBox = styled.div`
  p {
    font-size: 1.4em;
    margin: 0px;
    font-weight: 300;
    letter-spacing: 1.5px;
    line-height: 1.8;
  }
  @media (max-width:767px){
    p{
      font-size:1.2em;
    }
  }
`;
const ResContainer = styled.section`
  min-height: 500px;
  background: #fff8f3;

  padding: 1.5vh 2vw;
  padding-bottom: 180px;

  svg {
    width: 1.8em;
    height: 1.8em;
    margin-right: 10px;
    padding: 6px;
    border-radius: 100%;
    &.pushicon {
      color: #ff9292;
      border: 2px solid #ff9292;
    }
    &.hateicon {
      color: #61ad91;
      border: 2px solid #61ad91;
    }
    &.resicon {
      color: #9fd3ff;
      border: 2px solid #9fd3ff;
    }
  }

  h2 {
    margin: 0;
    font-weight: 400;
    font-size: 1.3em;
    letter-spacing: 1.4px;
    color: #636363;
  }
  h3 {
    margin: 0;
    font-size: 1.1em;
    font-weight: 300;
    letter-spacing: 1.4px;
    color: #636363;
  }
  > h4 {
    font-size: 1.6em;
    font-weight: 300;
    letter-spacing: 1.2px;
    color: #4a2a01;
    margin: 1vh 0;
  }

  /* .boxContainer {
    padding: 1.5vh 0vw;
  } */
`;
const ResCount = styled.div`
  display: flex;
  align-items: center;
  margin: 1vh 0;
  justify-content: center;
  svg {
    width: 40px;
    padding: 8px;
    height: 40px;
    border-radius: 100%;
    margin: 0 10px;
    &.pushicon {
      color: #ff9292;
      border: 2px solid #ff9292;
    }
    &.hateicon {
      color: #61ad91;
      border: 2px solid #61ad91;
    }
    &.resicon {
      color: #9fd3ff;
    }
  }
  .area {
    display: flex;
    align-items: center;
    margin: 1vh 0.5vw;
  }
`;

function ArticleRescontent(props) {
  const [resContents, setResContent] = useState([]);
  const [resCount, setResCount] = useState({
    push: 0,
    hate: 0,
    res: 0,
  });
  const { resContent } = props;
  useEffect(() => {
    if (Object.values(resContent).length !== 0) {
      setResContent(Object.values(resContent));
    }
  }, [resContent]);

  useEffect(() => {
    if (resContents !== {}) {
      let pushCount = 0;
      let hateCount = 0;
      let tempresCount = 0;
      resContents.forEach((item) => {
        switch (item.res_type) {
          case 'push':
            pushCount += 1;
            break;
          case 'hate':
            hateCount += 1;
            break;
          case 'res':
            tempresCount += 1;
            break;
          default:
            break;
        }
      });
      setResCount({
        push: pushCount,
        hate: hateCount,
        res: tempresCount,
      });
    }
  }, [resContents]);
  return (
    <>
      <ResCount>
        <div className="area">
          <ThumbUpAltSharpIcon className="pushicon" />
          <span>
            {resCount.push}
            {' '}
          </span>
        </div>
        <div className="area">
          <ThumbDownAltSharpIcon className="hateicon" />
          <span>{resCount.hate}</span>
        </div>
      </ResCount>
      <ResContainer>
        <h4>
          共
          {' '}
          {resContents.length}
          {' '}
          則回應
        </h4>
        {/* <button onClick={()=>{console.log(resContent)}}>log</button> */}
        {resContents.length !== 0 ? (
          <>
            {resContents.map((item, index) => (
              <PersonRes key={item.timestamp}>
                <Box
                  display="flex"
                  alignItems="center"
                  key={item.timestamp}
                  className="boxContainer"
                  style={{ marginBottom: '1vh' }}
                >
                  {resIcon(item.res_type)}
                  <div className="title">
                    <h2>{sliceMail(item.res_author)}</h2>
                    <h3>
                      B
                      {index + 1}
                      {' '}
                      |
                      {' '}
                      {TimestampToDate(item.timestamp)}
                    </h3>
                  </div>
                </Box>
                <ResContentBox
                  dangerouslySetInnerHTML={{
                    __html: convertLinks(
                      convertToHTML(
                        convertFromRaw(JSON.parse(item.res_content)),
                      ),
                    ),
                  }}
                />
              </PersonRes>
            ))}
          </>
        ) : (
          <>
            <ResPtag>立即回覆搶頭香!</ResPtag>
          </>
        )}
      </ResContainer>
    </>
  );
}

ArticleRescontent.propTypes = {
  resContent: PropTypes.shape({
  }),
};

ArticleRescontent.defaultProps = {
  resContent: {
  },
};
export default ArticleRescontent;
