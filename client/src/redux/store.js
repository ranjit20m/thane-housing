import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice'; //named as userReducer for userSlice.reducer
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

// Create combine reducers
const rootReducer = combineReducers({user: userReducer});

// Create persist config => setting the name of the key in the local storage
const persistConfig = { key:'root', storage, version: 1 }

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ 
    reducer: persistedReducer, // reducer: {user: userReducer},
    middleware: (getDefaultMiddleware) =>  getDefaultMiddleware({ 
        serializableCheck: false 
        // In this way, We will not get error for not serializing our variables
    }),
}) 

// export persistor to make the store persist
export const persistor = persistStore(store);

// By default, configureStore adds some middleware to the Redux store setup automatically.
// If you want to customize the list of middleware, you can supply an array of middleware functions to configureStore
// However, when you supply the middleware option, you are responsible for defining all the middleware you want added to the store. 
// configureStore will not add any extra middleware beyond what you listed.
// getDefaultMiddleware => Returns an array containing the default list of middleware.
