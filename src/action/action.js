export const getTodoItem = (ref) => (dispatch) => {
  ref.once('value').then((snapshot) => {
    dispatch({
      type: 'GET_TODOITEM',
      data: [...Object.values(snapshot.val())],
    });
  });
};

export const removeTodoItem = (ref, id) => (dispatch) => {
  ref.child(id).remove();
  ref.once('value').then((snapshot) => {
    dispatch({
      type: 'REMOVE_DATA',
      data: [...Object.values(snapshot.val())],
    });
  });
};

export const updateTodoItem = (ref, id, updatatodo) => (dispatch) => {
  ref.child(id).set({
    id,
    content: updatatodo,
  });
  ref.once('value').then((snapshot) => {
    dispatch({
      type: 'UPDATE_DATA',
      data: [...Object.values(snapshot.val())],
    });
  });
};

export const getBoardName = (ref) => (dispatch) => {
  ref.once('value').then((snapshot) => {
    dispatch({
      type: 'GET_BOARDNAME',
      data: [...Object.entries(snapshot.val())],
    });
  });
};
