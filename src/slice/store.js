import { configureStore } from "@reduxjs/toolkit";
import  shipperReducer  from './shipperSlice';
import  registerReducer  from './registerSlice';

// import { loadState, saveState } from './localStorage';

// const persistState = loadState();

const rootReducer = {
  shipper: shipperReducer,
  register: registerReducer,
}

const store = configureStore({
    reducer: rootReducer,
    // preloadedState: persistState
});

// store.subscribe(() => {
//   saveState(store.getState());
// })

export default store;