import { all, put, takeEvery } from 'redux-saga/effects';
import { placeAutoCompleteMock, placeDetailsMock } from '../mock';
import { setPlaceAutoComplete, setPlaceDetails } from './slice';

function* handlePlaceAutoCompletee(_action) {
  try {
    const result = placeAutoCompleteMock;

    if (result.status === 'OK') {
      yield put(setPlaceAutoComplete(result?.predictions));
    } else {
      yield put(setPlaceAutoComplete([]));
    }
  } catch (error) {
    console.log('err', error);
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
    console.log('err', error);
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
