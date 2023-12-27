import { createSlice } from '@reduxjs/toolkit';
import { userStateSlice } from '@/type';

const initialState: userStateSlice = {
    email: '',
    show_name: '',
    address_full: '',
    avatar: '',
    customer_id: -1,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeState: (state: userStateSlice, actions) => {
            return { ...state, ...actions.payload };
        },
    },
});

export const { changeState } = userSlice.actions;

export default userSlice.reducer;
