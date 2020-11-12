const getArticleList = (ref) => (dispatch) => {
  const messages = [];
  ref.orderByChild('timestamp').on('value', (snapshot) => {
    if (snapshot.val() == null) {
      dispatch({
        type: 'FAIL_ARTICLE_LIST',
        data: 'Fail to get list',
      });
    } else if (
      messages.map((i) => i.timestamp).indexOf(snapshot.val().timestamp) === -1
    ) {
      const tempmessages = [];
      snapshot.forEach((item) => {
        tempmessages.unshift(item.val());
      });
      dispatch({
        type: 'GET_ARTICLE_LIST',
        data: tempmessages,
      });
    }
  });
};
export default getArticleList;
