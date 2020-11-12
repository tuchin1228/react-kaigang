import { combineReducers } from 'redux';

const todoreducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_TODOITEM':
      return { data: action.data };
    case 'REMOVE_DATA':
      return { data: action.data };
    case 'UPDATE_DATA':
      return { data: action.data };
    default:
      return { ...state };
  }
};

const drawerreducer = (DRAWER_STATUS = false, action) => {
  switch (action.type) {
    case 'DRAWER_TOGGLE':
      return !DRAWER_STATUS;
    default:
      return DRAWER_STATUS;
  }
};

const boardReducer = (board = [], action) => {
  switch (action.type) {
    case 'GET_BOARDNAME':
      return { board: action };
    default:
      return board;
  }
};

const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case 'IS_ONLINE_TRUE':
      return action.res;
    case 'SIGN_UP_SUCCESS':
      return action.res;
    case 'SIGN_IN_SUCCESS':
      return action.res;
    case 'SIGN_OUT_SUCCESS':
      return '';
    default:
      return state;
  }
};

const postReducer = (state = false, action) => {
  switch (action.type) {
    case 'POST_SUCCESS':
      return action.res;
    case 'EDITS_STATUS':
      return true;
    case 'NOT_EDITS_STATUS':
      return false;
    default:
      return state;
  }
};

const listReducer = (list = [], action) => {
  switch (action.type) {
    case 'GET_ARTICLE_LIST':
      return { list: action.data };
    case 'FAIL_ARTICLE_LIST':
      return { list: action.data };
    default:
      return list;
  }
};

const articleReducer = (contents = {}, action) => {
  switch (action.type) {
    case 'GET_ARTICLE_CONTENT':
      console.log('====================================');
      console.log('get到', action.data);
      console.log('====================================');
      return { contents: action.data };
    case 'FAIL_ARTICLE_CONTENT':
      console.log('====================================');
      console.log('沒get到', action.data);
      console.log('====================================');
      return { contents: action.data };
    case 'GET_ARTICLE_BOARD':
      return { board: action.data };
    case 'FAIL_ARTICLE_BOARD':
      return { board: action.data };
    case 'GET_ARTICLE_CATEGORY':
      return { category: action.data };
    default:
      return contents;
  }
};

// const categoryReducer = (category = [], action) => {
//   switch (action.type) {
//     case 'GET_ARTICLE_CATEGORY':
//       return { category: action.data };
//     default:
//       return category;
//   }
// };

const alertReducer = (status = {}, action) => {
  switch (action.type) {
    case 'SHOW_ALERT':
      return { status: action.status };
    default:
      return status;
  }
};

const apidatas = combineReducers({
  todoreducer,
  drawerreducer,
  boardReducer,
  loginReducer,
  postReducer,
  listReducer,
  articleReducer,
  alertReducer,
  // categoryReducer,
});

export default apidatas;
