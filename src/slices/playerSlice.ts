import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface PlayerState {
  selectedItem: any,
}

const initialState: PlayerState = {
  selectedItem: -1,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<number>) => {
      state.selectedItem = action.payload;
    },
    unselectItem: (state) => {
      state.selectedItem = -1;
    }
  },
});

export const { setSelectedItem, unselectItem } = playerSlice.actions;
export const getSelectedItem = (state: RootState) => state.player.selectedItem;
export default playerSlice.reducer;