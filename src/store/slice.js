import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  placeAutoComplete: [],
  placesSaved: [],
  placeDetails: null,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setPlaceAutoComplete(state, action) {
      state.placeAutoComplete = action.payload;
    },
    setPlaceSaved(state, action) {
      state.placesSaved = [action.payload, ...state.placesSaved];
    },
    setPlaceDetails(state, action) {
      state.placeDetails = action.payload;
    },
  },
});

export const {setPlaceAutoComplete, setPlaceSaved, setPlaceDetails} =
  placesSlice.actions;

export default placesSlice.reducer;
