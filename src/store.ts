import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import searchPhraseReducer from './slices/searchPhraseSlice';
import searchResultsReducer from './slices/searchResultsSlice'
export const store = configureStore({
  reducer: {
    player: playerReducer,
    searchPhrase: searchPhraseReducer,
    searchResults: searchResultsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;