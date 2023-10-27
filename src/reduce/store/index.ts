import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice';
import fillterReducer from '../slice/fillterSlice';
import productsOfViewReducer from '../slice/productsOfViewSlice';
import colectionCategoryReducer from '../slice/colectionCategorySlice';
import cartSliceReducer from '../slice/cartSlice';
import newCartItemReducer from '../slice/newCartItemSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        fillter: fillterReducer,
        productsOfView: productsOfViewReducer,
        colection: colectionCategoryReducer,
        cart: cartSliceReducer,
        NewCarItem: newCartItemReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
