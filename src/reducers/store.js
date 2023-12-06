import {configureStore} from "@reduxjs/toolkit";

import currentUser from './currentUserReducer.js';
import searchReducer from "./searchReducer.js";
import currentBooksReducer from "./currentBooksReducer";

const store = configureStore({
    reducer: {
        currentUser,
        currentBooks: currentBooksReducer,
        search: searchReducer

    }
});

store.subscribe(() => {
    localStorage.setItem('currentBooks', JSON.stringify(store.getState().currentBooks));
    localStorage.setItem('currentUser', JSON.stringify(store.getState().currentUser));
});


export default store;
