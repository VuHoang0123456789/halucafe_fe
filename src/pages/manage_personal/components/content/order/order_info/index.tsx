import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { CallApi, FormatPrice, FormmatDate, GetCookie } from '@/method/until';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

type orderType = {
    order: {
        create_at: string;
        delivery_date: string;
        full_address: string;
        order_id: number;
        pay_status: boolean;
        pay_type_name: string;
        transport_status: boolean;
        delivery_cost: number;
    };

    orderInfo: {
        count: number;
        price: number;
        slug: string;
        product_name: string;
        url_images_small: string[];
        url_images_large: string[];
    }[];
};

interface props {
    order_id?: string;
}

function OrderInfo({ order_id }: props) {
    const doumain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const customer_id = useSelector((state: RootState) => state.user.customer_id);
    const [data, setData] = useState<orderType | undefined>();

    useEffect(() => {
        document.title = 'Trang chi tiết đơn hàng halucafe';
    }, []);

    useEffect(() => {
        const url = `${doumain_url}/order/get-order-info?order_id=${order_id}&customer_id=${customer_id}`;
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(url, method, headers)
            .then((result: orderType) => {
                if (result) setData(result);
            })
            .catch((error: Error) => console.log(error));
    }, [customer_id, doumain_url, order_id]);

    const discount__cost = 25000;

    const Total = useMemo(() => {
        if (!data) return;
        const total = data.orderInfo?.reduce((total, item) => (total += item.count * item.price), 0);

        return total + data.order?.delivery_cost * 1 - discount__cost > 0
            ? total + data.order?.delivery_cost * 1 - discount__cost
            : 0;
    }, [data]);

    return order_id && data ? (
        <section className={cx('wrap__order-info')}>
            <div>
                <p className="text-right font-size14 font-weight500 space-t5">
                    Ngày tạo: {FormmatDate(data.order?.create_at)}
                </p>
                <h2 className="font-size19 space-b17 space-t4" style={{ paddingTop: '12px', lineHeight: '22px' }}>
                    Chi tiết đơn hàng #{order_id.split('#')[1]}
                </h2>
            </div>

            <div className="flex__center font-size14 font-weight500">
                <p className="flex__center space-r35">
                    Trạng thái thanh toán:{' '}
                    <span className="font-weight700 red-color italic space-l5">
                        {!data.order?.pay_status ? 'Chưa thanh toán' : 'Đã thanh toán'}
                    </span>
                </p>

                <p className="flex__center">
                    Trạng thái vận chuyển:{' '}
                    <span className="font-weight700 red-color italic space-l5">
                        {!data.order?.transport_status ? 'Chưa giao hàng' : 'Đã giao hàng'}
                    </span>
                </p>
            </div>

            <div className="space-t30 flex">
                <div className={cx('width-50', 'body__order')}>
                    <h3 className={cx('font-size16', 'text-uppercase', 'font-weight600', 'title-head')}>
                        ĐỊA CHỈ GIAO HÀNG
                    </h3>
                    <div className={cx('box-des')}>
                        <h4>Hoang Vu</h4>
                        <p> Địa chỉ: {data.order?.full_address}</p>
                    </div>
                </div>
                <div className={cx('width-25', 'body__order')}>
                    <h3 className={cx('font-size16', 'text-uppercase', 'font-weight600', 'title-head')}>THANH TOÁN</h3>
                    <div className={cx('box-des')}>
                        <p> {data.order?.pay_type_name}</p>
                    </div>
                </div>
                <div className={cx('width-25', 'body__order')}>
                    <h3 className={cx('font-size16', 'text-uppercase', 'font-weight600', 'title-head')}>GHI CHÚ</h3>
                    <div className={cx('box-des')}>
                        <p>Không có ghi chú</p>
                    </div>
                </div>
            </div>

            <TableContainer
                component={Paper}
                sx={{ marginTop: '24px', border: '1px solid rgba(224, 224, 224, 1)', boxShadow: 'none' }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={cx('heading__column')} sx={{ width: '55%' }}>
                                Sản phẩm
                            </TableCell>
                            <TableCell className={cx('heading__column')} sx={{ width: '15%' }} align="center">
                                Đơn giá
                            </TableCell>
                            <TableCell className={cx('heading__column')} sx={{ width: '15%' }} align="center">
                                Số lượng
                            </TableCell>
                            <TableCell className={cx('heading__column')} sx={{ width: '15%' }} align="center">
                                Tổng
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.orderInfo?.map((item, index) => (
                            <TableRow
                                className={cx('row')}
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell
                                    className={cx('content__column')}
                                    sx={{ width: '55%' }}
                                    component="th"
                                    scope="row"
                                >
                                    <div className="flex__center">
                                        <div className={cx('box__thumbnail')}>
                                            <Link to={`/${item.slug}`}>
                                                <img src={item.url_images_large[0]} alt="#" />
                                            </Link>
                                        </div>

                                        <p className="space-l15 font-size14" style={{ flex: 1 }}>
                                            <Link to={`/${item.slug}`}>{item.product_name}</Link>
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className={cx('content__column')} sx={{ width: '15%' }} align="center">
                                    {FormatPrice(item.price)}₫
                                </TableCell>
                                <TableCell className={cx('content__column')} sx={{ width: '15%' }} align="center">
                                    {item.count}
                                </TableCell>
                                <TableCell className={cx('content__column')} sx={{ width: '15%' }} align="center">
                                    {FormatPrice(item.count * item.price)}₫
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Table>
                    <TableBody>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className={cx('wrap__total')}>
                                <div className={cx('flex__center', 'wrap__total-item')}>
                                    <h1 className="font-size16 space-r15">Khuyến mại: </h1>
                                    <p>{FormatPrice(discount__cost)}₫</p>
                                </div>

                                <div className={cx('flex__center', 'wrap__total-item')}>
                                    <h1 className="font-size16 space-r15">Phí vận chuyển: </h1>
                                    <p>{FormatPrice(data.order?.delivery_cost)}₫</p>
                                </div>

                                <div className={cx('flex__center', 'wrap__total-item')}>
                                    <h1 className="font-size16 space-r15">Tổng tiền: </h1>
                                    <p className="red-color font-weight600 font-size19">
                                        {FormatPrice(Total ? Total : 0)}₫
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    ) : (
        <LoadedComp />
    );
}

export default OrderInfo;
