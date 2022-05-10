import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface PlayerState {
  audioName: string,
  selectedItem: number,
  src: string,
}

const initialState: PlayerState = {
  audioName: '',
  selectedItem: -1,
  src: ''
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setAudioName: (state, action: PayloadAction<string>) => {
      state.audioName = action.payload;
    },
    setAudioSrc: (state, action: PayloadAction<string>) => {
      state.src = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<number>) => {
      state.selectedItem = action.payload;
    },
    unselectItem: (state) => {
      state.selectedItem = -1;
    }
  },
});

export const { setAudioName, setAudioSrc, setSelectedItem, unselectItem } = playerSlice.actions;
export const getAudioName = (state: RootState) => state.player.audioName;
export const getAudioSrc = (state: RootState) => state.player.src;
export const getSelectedItem = (state: RootState) => state.player.selectedItem;
export default playerSlice.reducer;