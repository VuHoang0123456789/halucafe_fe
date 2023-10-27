import { createSlice } from '@reduxjs/toolkit';
import { fillterStateSlice, itemSelectionType } from '@/type';

const initialState: fillterStateSlice = {
    title: 'Bộ lọc',
    listItem: [
        {
            title: 'Giá sản phẩm',
            item__selection: [
                { key: '0-100000', value: 'Giá dưới 100.000đ' },
                { key: '100000-200000', value: '100.000đ - 200.000đ' },
                { key: '200000-300000', value: '200.000đ - 300.000đ' },
                { key: '300000-500000', value: '300.000đ - 500.000đ' },
                { key: '500000-1000000', value: '500.000đ - 1.000.000đ' },
                { key: '1000000', value: 'Giá trên 1.000.000đ' },
            ],
        },
        {
            title: 'Loại',
            item__selection: [] as itemSelectionType[],
        },
        {
            title: 'Thương hiệu',
            item__selection: [] as itemSelectionType[],
        },
    ],
};

export const fillterSlice = createSlice({
    name: 'fillter',
    initialState,
    reducers: {
        changeFillterState: (state: fillterStateSlice, actions) => {
            return { ...state, ...actions.payload };
        },
    },
});

export const { changeFillterState } = fillterSlice.actions;

export default fillterSlice.reducer;
