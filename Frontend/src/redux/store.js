import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import { searchReducer } from "./slices/search";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        search: searchReducer,
    },
});

export default store;