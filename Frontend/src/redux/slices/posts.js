import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (sortParam) => {
    const { data } = await axios.get(`/posts?sortBy=${sortParam}`);
    return data;
});

export const fetchPostsById = createAsyncThunk('posts/fetchPostsById', async (id) => {
    const { data } = await axios.get(`/posts/${id}`);
    return data;
});

export const fetchPostComments = createAsyncThunk('posts/fetchPostComments', async (id) => {
    const { data } = await axios.get(`/comments/${id}`);
    return data;
});

export const createComment = createAsyncThunk('comments/createComment', async ({ id, comment }) => {
    const { data } = await axios.post(`/comments/${id}`, { comment });
    return data;
});

export const fetchRemoveComments = createAsyncThunk('posts/fetchRemoveComments', async (id) => {
    const { data } = await axios.delete(`/comments/${id}`);
    return data;
});

export const fetchLastComments = createAsyncThunk('comments/fetchLastComments', async () => {
    const { data } = await axios.get('/comments/last');
    return data;
});

export const fetchTags = createAsyncThunk('posts/fetchingTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) =>
    axios.delete(`/posts/${id}`),
);

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
    comments: {
        items: [],
        status: 'loading',
    },
    currentPost: {
        data: {},
        status: 'loading',
        comments: {
            items: [],
            status: 'loading',
        },
        comment: {
            text: "",
            status: 'loaded',
        },
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setCommentTextInput(state, action) {
            state.currentPost.comment.text = action.payload;
        },
    },
    extraReducers: {
        //#region Получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        //#endregion

        //#region Получение тегов
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
        //#endregion

        //#region Удаление статьи
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(object => object._id !== action.meta.arg);
        },
        //#endregion

        //#region Получение статьи
        [fetchPostsById.pending]: (state) => {
            state.currentPost.data = {};
            state.currentPost.status = 'loading';
        },
        [fetchPostsById.fulfilled]: (state, action) => {
            state.currentPost.data = action.payload;
            state.currentPost.status = 'loaded';
        },
        [fetchPostsById.rejected]: (state) => {
            state.currentPost.data = {};
            state.currentPost.status = 'error';
        },
        //#endregion

        //#region Получение комменатриев
        [fetchPostComments.pending]: (state) => {
            state.currentPost.comments.items = [];
            state.currentPost.comments.status = 'loading';
        },
        [fetchPostComments.fulfilled]: (state, action) => {
            state.currentPost.comments.items = action.payload;
            state.currentPost.comments.status = 'loaded';
        },
        [fetchPostComments.rejected]: (state) => {
            state.currentPost.comments.items = [];
            state.currentPost.comments.status = 'error';
        },
        //#endregion

        //#region Создание комменатария
        [createComment.pending]: (state) => {
            state.currentPost.comment.status = 'loading';
        },
        [createComment.fulfilled]: (state, action) => {
            state.currentPost.comments.items = action.payload;
            state.currentPost.comment.text = '';
            state.currentPost.comment.status = 'loaded';
        },
        [createComment.rejected]: (state) => {
            state.currentPost.comment.status = 'error';
        },
        //#endregion

        //#region Удаление комментария
        [fetchRemoveComments.pending]: (state, action) => {
            state.currentPost.comments.items = state.currentPost.comments.items.filter(object => object._id !== action.meta.arg);
        },
        //#endregion

        //#region Получение последних комментариев
        [fetchLastComments.pending]: (state) => {
            state.comments.items = [];
            state.comments.status = 'loading';
        },
        [fetchLastComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded';
        },
        [fetchLastComments.rejected]: (state) => {
            state.comments.items = [];
            state.comments.status = 'error';
        },
        //#endregion
    },
});

export const postsReducer = postsSlice.reducer;

export const { setCommentTextInput } = postsSlice.actions;