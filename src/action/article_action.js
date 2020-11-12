export const getArticleContent = (ref) => (dispatch) => {
  ref.once('value').then((snapshot) => {
    if (snapshot.val() == null) {
      dispatch({
        type: 'FAIL_ARTICLE_CONTENT',
        data: 'Fail to get article content',
      });
    } else {
      dispatch({
        type: 'GET_ARTICLE_CONTENT',
        data: snapshot.val(),
      });
    }
  });
};

export const getArticleBoard = (ref) => (dispatch) => {
  ref.once('value').then((snapshot) => {
    if (snapshot.val() == null) {
      dispatch({
        type: 'FAIL_ARTICLE_BOARD',
        data: 'Fail to get',
      });
    } else {
      dispatch({
        type: 'GET_ARTICLE_BOARD',
        data: snapshot.val().board_name,
      });
    }
  });
};

export const deleteArticle = (ref, timestamp) => () => {
  ref.child(timestamp).remove();
};
