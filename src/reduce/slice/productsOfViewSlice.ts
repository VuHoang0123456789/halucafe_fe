import { createSlice } from '@reduxjs/toolkit';
import { ProductStateSlice } from '@/type';

const initialState: ProductStateSlice[] = [] as ProductStateSlice[];

export const ProductSlice = createSlice({
    name: 'productsOfView',
    initialState,
    reducers: {
        changeProductState: (state: ProductStateSlice[], actions) => {
            return [...actions.payload];
        },
    },
});

export const { changeProductState } = ProductSlice.actions;

export default ProductSlice.reducer;
