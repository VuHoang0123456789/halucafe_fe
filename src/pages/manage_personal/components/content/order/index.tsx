import classNames from 'classnames/bind';
import styles from '../styles.module.scss';
import { FormatPrice, FormmatDate, GetCookie } from '@/method/until';
import { Link, useLocation } from 'react-router-dom';
import OrderInfo from './order_info';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { CallApi } from '@/method/until';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { orderType } from '@/type';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

function Order() {
    const user = useSelector((state: RootState) => state.user);
    const [orders, setOrders] = useState<orderType[]>([] as orderType[]);
    const doumain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const order_id = useLocation().hash.replace('#', '') || undefined;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Trang đơn hàng halucafe';
    }, []);

    useEffect(() => {
        const url = `${doumain_url}/order/get-orders/${user.customer_id}`;
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(url, method, headers)
            .then((result: orderType[]) => {
                if (result) setOrders(result);

                setTimeout(() => {
                    setIsLoaded(true);
                }, 600);
            })
            .catch((error: Error) => console.log(error));
    }, [doumain_url, user.customer_id]);

    // custom gridview
    const columns: GridColDef[] = [
        {
            field: 'order_id',
            headerName: 'Đơn hàng',
            flex: 1.1,
            align: 'center',
            headerAlign: 'center',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => {
                const row = params.row as orderType;
                return [
                    <Link to={`/account/orders/#${row.order_id}`}>
                        <p className={cx('content__row', 'content__item')} style={{ color: '#2f80ed' }}>
                            #{row.order_id}
                        </p>
                    </Link>,
                ];
            },
        },
        {
            field: 'create_at',
            headerName: 'Ngày',
            flex: 1.5,
            align: 'left',
            headerAlign: 'left',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => {
                const row = params.row as orderType;
                return [<p className={cx('content__row', 'content__item')}>{FormmatDate(row.create_at)}</p>];
            },
        },
        {
            field: 'price',
            headerName: 'Địa chỉ',
            flex: 2.9,
            align: 'left',
            headerAlign: 'left',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => {
                const row = params.row as orderType;
                return [<p className={cx('content__row', 'content__item')}>{row.full_address}</p>];
            },
        },
        {
            field: 'order_price',
            headerName: 'Giá trị đơn hàng',
            flex: 1.5,
            align: 'left',
            headerAlign: 'left',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => {
                const row = params.row as orderType;
                return [<p className={cx('content__row', 'content__item')}>{FormatPrice(row.total)}₫</p>];
            },
        },
        {
            field: 'pay',
            headerName: 'TT thanh toán',
            flex: 1.5,
            align: 'left',
            headerAlign: 'left',
            disableColumnMenu: true,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => {
                const row = params.row as orderType;
                return [
                    <p className={cx('content__row', 'content__item')}>
                        {row.pay_status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </p>,
                ];
            },
        },
        {
            field: 'transport',
            headerName: 'TT Vận chuyển',
            flex: 1.5,
            type: 'actions',
            align: 'left',
            headerAlign: 'left',
            disableColumnMenu: true,
            sortable: false,
            getActions: (params: any) => {
                const row = params.row as orderType;
                return [
                    <p className={cx('content__row', 'content__item')}>
                        {row.transport_status ? 'Đã vận chuyển' : 'Chưa vận chuyển'}
                    </p>,
                ];
            },
        },
    ];

    return !order_id ? (
        <section className={cx('wrap__content')}>
            {isLoaded ? <></> : <LoadedComp />}
            <h1 className={cx('title')}>Đơn hàng của bạn</h1>

            <div style={{ width: '100%' }}>
                {orders.length === 0 ? (
                    <div>Bạn chưa có đơn hàng nào</div>
                ) : (
                    <DataGrid
                        autoHeight={true}
                        getRowId={(row: orderType) => row.order_id}
                        rows={orders || []}
                        columns={columns}
                        getRowHeight={() => 'auto'}
                        sx={{
                            '.MuiDataGrid-columnHeaderTitle': {
                                color: 'var(--white-color)',
                                fontFamily: "'Quicksand', sans-serif",
                                fontSize: 14,
                                fontWeight: 700,
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
                            '.MuiDataGrid-columnHeader': {
                                padding: '5px',
                                backgroundColor: 'var(--yellow-color)',
                            },
                            '.MuiDataGrid-cell': {
                                padding: '0',
                            },
                            '.MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' },
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 15]}
                    />
                )}
            </div>
        </section>
    ) : (
        <OrderInfo order_id={order_id} />
    );
}

export default Order;
