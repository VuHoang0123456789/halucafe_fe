import { ProductType } from '@/type';
import { createSlice } from '@reduxjs/toolkit';

interface CartItem extends ProductType {
    count: number;
}

const initialState: CartItem = {} as CartItem;

const NewCartItemSlice = createSlice({
    name: 'NewCarItem',
    initialState,
    reducers: {
        createNewCartItem: (state, actions) => {
            return actions.payload;
        },
        removeNewCartItem: () => {
            return {} as CartItem;
        },
    },
});

export const { createNewCartItem, removeNewCartItem } = NewCartItemSlice.actions;
export default NewCartItemSlice.reducer;
