export const submitArticle = (ref, timestamp, article) => () => {
  // eslint-disable-next-line no-param-reassign
  article.timestamp = timestamp;
  ref.child(timestamp).set(article);
};

export const isEdits = () => ({
  type: 'EDITS_STATUS',
});

export const notEdits = () => ({
  type: 'NOT_EDITS_STATUS',
});

export const UpdateArticle = (ref, id, article) => () => {
  ref.child(id).update(article);
};

export const getArticleCategory = (ref) => (dispatch) => {
  ref.once('value').then((snapshot) => {
    dispatch({
      type: 'GET_ARTICLE_CATEGORY',
      data: snapshot.val(),
    });
  });
};
