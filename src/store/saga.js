import { all, call, put, takeEvery } from 'redux-saga/effects';
import { placeAutoCompleteMock, placeDetailsMock } from '../mock';
import { setPlaceAutoComplete, setPlaceDetails } from './slice';

const addPlaceSaved = async _payload => {
  try {
    const response = placeDetailsMock;
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'An error occurred');
  }
};

function* handlePlaceAutoCompletee(_action) {
  try {
    const result = placeAutoCompleteMock;

    if (result.status === 'OK') {
      yield put(setPlaceAutoComplete(result?.predictions));
    } else {
      yield put(setPlaceAutoComplete([]));
    }
  } catch (error) {
    yield put(setPlaceAutoComplete(error.message));
  }
}

function* handlePlaceDetails(_action) {
  try {
    const result = placeDetailsMock;

    if (result.status === 'OK') {
      yield put(setPlaceDetails(result.result));
    } else {
      yield put(setPlaceDetails(null));
    }
  } catch (error) {
    yield put(setPlaceDetails(error.message));
  }
}

function* placeSaga() {
  yield takeEvery('handlePlaceAutoComplete', handlePlaceAutoCompletee);
  yield takeEvery('handlePlaceDetails', handlePlaceDetails);
}

function* rootSaga() {
  yield all([placeSaga()]);
}

export default rootSaga;
