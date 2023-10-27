import { createSlice } from '@reduxjs/toolkit';
import { colectionCategoryType } from '@/type';

const initialState: colectionCategoryType = {
    title: 'Danh mục',
    list: [],
};

export const colectionSlice = createSlice({
    name: 'colection',
    initialState,
    reducers: {
        changeColectionState: (state: colectionCategoryType, actions) => {
            return { ...state, ...actions.payload };
        },
    },
});

export const { changeColectionState } = colectionSlice.actions;

export default colectionSlice.reducer;
