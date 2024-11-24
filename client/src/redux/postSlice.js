import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  editp: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      // const newPost = action.payload;
      // console.log(typeof action.payload);
      let item = [...state.posts];
      const list = action.payload;
      item = item.concat(list);
      // item.push(list[0]);
      console.log(list[0]);
      console.log(item);

      state.posts = item;
      // state.posts = action.payload;
    },
    updatePosts(state, action) {
      console.log(action.payload);

      state.posts = action.payload;
    },
    updateEditp(state, action) {
      state.editp = action.payload;
    },
  },
});

export default postSlice.reducer;

export function SetPosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.getPosts(post));
  };
}

export function UpdatePosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.updatePosts(post));
  };
}

export function UpdateEditp(val) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.updateEditp(val));
  };
}
