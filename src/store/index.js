import { configureStore } from '@reduxjs/toolkit';
import rootSaga from './saga';
import placesReducer from './slice';

const createSagaMiddleware = require('redux-saga').default;

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: placesReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
