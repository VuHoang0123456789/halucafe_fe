import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductType } from '@/type';
import { GetCookie } from '@/method/until';
import { dataCartBody } from '@/type';

interface CartType extends ProductType {
    count: number;
}

export const fetchCartAddNewItem = createAsyncThunk(
    'cart/fetchCartAddNewItem',
    async (data: dataCartBody, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_DOMAIN_URL_BE}/cart/add-new-item`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    access_token: GetCookie('_user') || '',
                },
                body: JSON.stringify(data),
            });

            return await response.json();
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);

export const fetchCart = createAsyncThunk('cart/fetchCart', async (customer_id: number, { rejectWithValue }) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_URL_BE}/cart/get-cart/${customer_id}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                access_token: GetCookie('_user') || '',
            },
        });

        if (response.status === 204 || response.status === 500) return [] as CartType[];

        return await response.json();
    } catch (err) {
        return rejectWithValue(err);
    }
});

const initialState: CartType[] = JSON.parse(localStorage.getItem('_cart') || '[]') as CartType[];

export const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addNewCartItem: (state: CartType[], actions) => {
            let payLoad = actions.payload as CartType;
            let arr = [...state];

            const index = arr.findIndex((item) => item.product_id === payLoad.product_id);

            if (index !== -1) {
                let count = arr[index].count + payLoad.count;
                payLoad = { ...payLoad, count };

                arr.splice(index, 1, payLoad);
            } else arr.push(payLoad);

            const formCartComp = document.getElementById('form_cart_id');
            if (!formCartComp) return;

            formCartComp.style.display = 'block';

            return [...arr];
        },
        increaseCartItem: (state: CartType[], actions) => {
            let payLoad = actions.payload as CartType;
            let arr = [...state];

            const index = arr.findIndex((item) => item.product_id === payLoad.product_id);

            if (index === -1) return;

            let count = arr[index].count;
            payLoad = { ...payLoad, count: (count += 1) };
            arr.splice(index, 1, payLoad);

            return [...arr];
        },
        decreaseCartItem: (state: CartType[], actions) => {
            let payLoad = actions.payload as CartType;
            let arr = [...state];

            const index = arr.findIndex((item) => item.product_id === payLoad.product_id);

            if (index === -1) return;

            let count = arr[index].count;
            payLoad = { ...payLoad, count: (count -= 1) };
            arr.splice(index, 1, payLoad);

            return [...arr];
        },
        deleteCartItem: (state: CartType[], actions) => {
            const payLoad = actions.payload as CartType;
            let arr = [...state];

            const removeIndex = arr.findIndex((item) => item.product_id === payLoad.product_id);

            arr.splice(removeIndex, 1);

            return [...arr];
        },
        clearCart: (state, actions) => {
            let arr = [...actions.payload] as CartType[];

            return [...arr];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, actions) => {
            return [...actions.payload];
        });
    },
});

export const { addNewCartItem, deleteCartItem, increaseCartItem, decreaseCartItem, clearCart } = CartSlice.actions;

export default CartSlice.reducer;
