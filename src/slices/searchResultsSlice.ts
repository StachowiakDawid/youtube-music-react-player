import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SearchResultsState {
  data: any
}

const initialState: SearchResultsState = {
  data: {}
};

export const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { setSearchResults } = searchResultsSlice.actions;
export const getSearchResults = (state: RootState) => state.searchResults.data;
export default searchResultsSlice.reducer;