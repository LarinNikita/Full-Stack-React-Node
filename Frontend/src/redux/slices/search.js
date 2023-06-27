import { createSlice } from '@reduxjs/toolkit';

const searchValueSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
    setSearchValue: (state, action) => {
      return action.payload;
    },
  },
});

export const selectSearchValue = (state) => state.search;

export const searchReducer = searchValueSlice.reducer;

export const { setSearchValue } = searchValueSlice.actions;