import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SearchPhraseState {
  value: string,
}

const initialState: SearchPhraseState = {
  value: ""
};

export const searchPhraseSlice = createSlice({
  name: 'searchPhrase',
  initialState,
  reducers: {
    setSearchPhrase: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchPhrase } = searchPhraseSlice.actions;
export const getSearchPhrase = (state: RootState) => state.searchPhrase.value;
export default searchPhraseSlice.reducer;