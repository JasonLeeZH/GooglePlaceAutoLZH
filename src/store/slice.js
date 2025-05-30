import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  places: [],
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    addPlaces(state, action) {
      state.places = [action?.payload, ...state.places];
    },
  },
});

export const {addPlaces} = placesSlice.actions;

export default placesSlice.reducer;
