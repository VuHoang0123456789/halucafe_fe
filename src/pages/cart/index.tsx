import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { FormatPrice } from '@/method/until';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { ProductType } from '@/type';
import ProductImage from './component/productImage';
import ProductNameComp from './component/productNameComp';
import RowItem from './component/rowItem';
import WrapCount from './component/wrapCount';
import DeleteIcon from './component/deleteIcon';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

interface CartType extends ProductType {
    count: number;
}

function CartPage() {
    const carts = useSelector((state: RootState) => state.cart) as CartType[];
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Giỏ hàng halucafe';
        setTimeout(() => {
            setIsLoaded(true);
        }, 500);
    }, []);

    const breadcrumb = {
        title: 'Giỏ hàng',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/cart', name: 'Giỏ hàng' },
        ],
    };

    // custom gridview
    const columns: GridColDef[] = [
        {
            field: 'product__image',
            headerName: 'Ảnh sản phẩm',
            flex: 1.8,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => {
                const row = params.row as CartType;

                return [
                    <ProductImage
                        url_image={row.url_images_large[0]}
                        product__name={row.product_name}
                        product__link={`${row.slug}`}
                    />,
                ];
            },
        },
        {
            field: 'product__name',
            headerName: 'Tên sản phẩm',
            flex: 3.2,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => [<ProductNameComp params={params} />],
        },
        {
            field: 'price',
            headerName: 'Đơn giá',
            flex: 1.7,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => [<RowItem value={params.row.price} />],
        },
        {
            field: 'count',
            headerName: 'Số lượng',
            flex: 1.4,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => [<WrapCount params={params} />],
        },
        {
            field: 'total',
            headerName: 'Thành tiền',
            flex: 1.4,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => [<RowItem value={params.row.price * params.row.count} />],
        },
        {
            field: 'delete',
            headerName: 'Xóa',
            flex: 0.5,
            type: 'actions',
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            getActions: (params: any) => {
                return [<DeleteIcon params={params} />];
            },
        },
    ];

    //method
    // tính tổng sô tiền phải thanh toán
    const Total = useMemo(
        () =>
            carts.reduce((total, value) => {
                return total + value.count * value.price;
            }, 0),
        [carts],
    );

    return (
        <div className={cx('cart__page')}>
            {isLoaded ? <></> : <LoadedComp />}
            <div className="container">
                <section className={cx('breadcrumb')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>

                {carts?.length > 0 ? (
                    <section className={cx('cart__content')}>
                        <div style={{ width: '100%' }}>
                            <DataGrid
                                getRowId={(row: CartType) => row.product_id}
                                rows={carts}
                                columns={columns}
                                getRowHeight={() => 'auto'}
                                sx={{
                                    '.MuiDataGrid-columnHeaderTitle': {
                                        color: 'var(--yellow-color)',
                                        fontFamily: "'Quicksand', sans-serif",
                                        fontSize: 14,
                                        fontWeight: 500,
                                        lineHeight: 1.7,
                                    },
                                    '.MuiDataGrid-columnSeparator': {
                                        display: 'none',
                                    },

                                    '.MuiDataGrid-columnHeader:last-child, .MuiDataGrid-cell:nth-last-child(2)': {
                                        borderRight: 'none',
                                    },

                                    '.MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                                        outline: 'none !important',
                                        borderRight: '1px solid rgba(224, 224, 224, 1);',
                                    },

                                    '.MuiDataGrid-row:hover': {
                                        backgroundColor: 'inherit',
                                    },
                                }}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 3 },
                                    },
                                }}
                                pageSizeOptions={[3, 5]}
                            />
                        </div>
                        <div className="flex" style={{ justifyContent: 'space-between', margin: '20px 0 40px 0' }}>
                            <div className={cx('cart__content-left')}>
                                <Link to={'/collections/all'}>
                                    <button className={cx('default', 'btn')}>Tiếp tục mua hàng</button>
                                </Link>
                            </div>
                            <div className={cx('cart__content-right')}>
                                <div className={cx('wrap__total-price')}>
                                    <p
                                        className="width-70 text-left font-weight500"
                                        style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        Tổng tiền thanh toán
                                    </p>
                                    <p className="width-30 text-right font-weight700 yellow-color">
                                        {FormatPrice(Total)}₫
                                    </p>
                                </div>
                                <div>
                                    <Link to={'/checkout/dfdsfds'}>
                                        <p>
                                            <button className={cx('default', 'btn')}>Tiến hành thanh toán</button>
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="font-size14">Không có sản phẩm nào. Quay lại cửa hàng để tiếp tục mua sắm.</div>
                )}
            </div>
        </div>
    );
}

export default CartPage;
