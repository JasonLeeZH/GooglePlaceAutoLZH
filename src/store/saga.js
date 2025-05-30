import {all, takeLatest} from 'redux-saga/effects';
import {addPlaces} from './slice';

function* handleAddPlaces(action) {
  console.log('sdsdsd-saga', action);
}

function* placeSaga() {
  yield takeLatest(addPlaces.type, handleAddPlaces);
}

function* rootSaga() {
  yield all([placeSaga()]);
}

export default rootSaga;
