import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';

import adminReducer from '../modules/admin/redux/adminSlice';

const rootReducer = combineReducers({
  admin: adminReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const makeStore = () => {
  return store;
};

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store['dispatch'];
export type RootState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
