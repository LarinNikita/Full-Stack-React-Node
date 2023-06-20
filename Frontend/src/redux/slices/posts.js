import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchPopularPosts = createAsyncThunk('posts/fetchPopularPosts', async () => {
    const { data } = await axios.get('/posts/popular');
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
    popularPosts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
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
        
        //#region Получение популярных статей
        [fetchPopularPosts.pending]: (state) => {
            state.popularPosts.items = [];
            state.popularPosts.status = 'loading';
        },
        [fetchPopularPosts.fulfilled]: (state, action) => {
            state.popularPosts.items = action.payload;
            state.popularPosts.status = 'loaded';
        },
        [fetchPopularPosts.rejected]: (state) => {
            state.popularPosts.items = [];
            state.popularPosts.status = 'error';
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
    },
});

export const postsReducer = postsSlice.reducer;