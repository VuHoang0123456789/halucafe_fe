import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { CallApi, FormatPrice, GetCookie } from '@/method/until';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';

const cx = classNames.bind(styles);

type orderType = {
    create_at: string;
    delivery_cost: number;
    delivery_date: string;
    full_address: string;
    order_id: number;
    pay_status: boolean;
    pay_type_name: string;
    transport_status: boolean;
};

type orderInfoType = {
    count: number;
    price: number;
    product_name: string;
    slug: string;
    url_images_large: string[];
    url_images_small: string[];
};

interface dataType {
    order: orderType;
    orderInfo: orderInfoType[];
}

function CheckOutThanksYou() {
    const [Order, setOrder] = useState<dataType>({} as dataType);
    const user = useSelector((state: RootState) => state.user);
    const doumain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const slug = useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 1];

    useEffect(() => {
        document.title = 'halucafe - Cảm ơn';
    }, []);

    useEffect(() => {
        if (user.customer_id === -1) return;

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(`${doumain_url}/order/get-order-info?slug=${slug}&customer_id=${user.customer_id}`, 'get', header)
            .then((result: dataType) => {
                if (result) setOrder(result);
            })
            .catch((error: Error) => console.log(error));
    }, [doumain_url, slug, user]);

    const Total = useMemo(() => {
        return Order.orderInfo?.reduce((total, item) => (total += item.price * item.count), 0);
    }, [Order]);

    return (
        <section className={cx('thank_you_page')}>
            <div className={cx('wrap__page')}>
                <main>
                    <header>
                        <Link to={'/trang-chu'}>
                            <h1>halucafe</h1>
                        </Link>
                    </header>

                    <div className={cx('content')}>
                        <div className={cx('content__left')}>
                            <div className="flex" style={{ maxWidth: '75%' }}>
                                <div className="font-size72 green-color space-r15" style={{ lineHeight: '1' }}>
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                </div>
                                <div>
                                    <h2 className="font-size18 font-weight600" style={{ lineHeight: '20px' }}>
                                        Cảm ơn bạn đã đặt hàng
                                    </h2>
                                    <p className="font-size14 space-t14 space-b14 font-weight400">
                                        Một email xác nhận đã được gửi tới {user.email} Xin vui lòng kiểm tra email của
                                        bạn
                                    </p>
                                </div>
                            </div>

                            <div className={cx('box_content')}>
                                <div className={cx('flex', 'row')}>
                                    <div className={cx('width-50', 'item')}>
                                        <h3>Thông tin mua hàng</h3>
                                        <p>{user.show_name}</p>
                                        <p>{user.email}</p>
                                        <h3>Phương thức thanh toán</h3>
                                        <p>{Order.order?.pay_type_name}</p>
                                    </div>
                                    <div className={cx('width-50', 'item')}>
                                        <h3>Địa chỉ nhận hàng</h3>
                                        <p>{Order.order?.full_address}</p>
                                        <h3>Phương thức vận chuyển</h3>
                                        <p>Giao hàng tận nơi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('content__right')}>
                            <div className={cx('box__summary')}>
                                <h4>
                                    Đơn hàng #{Order.order?.order_id} ({Order.orderInfo?.length})
                                </h4>
                                <ul>
                                    {Order.orderInfo?.map((item, index) => (
                                        <li className="flex__center" key={index}>
                                            <div className={cx('box__thumbnail')}>
                                                <div className={cx('box__image')}>
                                                    <img src={item.url_images_large[0]} alt={item.product_name} />
                                                </div>
                                                <div className={cx('price')}>1</div>
                                            </div>
                                            <h6>{item.product_name}</h6>
                                            <span className="font-size14">{FormatPrice(item.price)}₫</span>
                                        </li>
                                    ))}
                                </ul>
                                <div
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        padding: '7px 15px',
                                    }}
                                >
                                    <div className="flex__center">
                                        <h5>Tạm tính</h5>
                                        <p>{FormatPrice(Total)}₫</p>
                                    </div>
                                    <div className="flex__center">
                                        <h5>Phí vận chuyển</h5>
                                        <p>{FormatPrice(Order.order?.delivery_cost)}₫</p>
                                    </div>
                                </div>
                                <div className="flex__center" style={{ padding: '7px 15px 10px 15px' }}>
                                    <h5 className="font-size16">Tổng cộng</h5>
                                    <p className="font-size21 blue-color">
                                        {FormatPrice(Total * 1 + Order.order?.delivery_cost * 1)}₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex width-100" style={{ justifyContent: 'center' }}>
                        <Link to={'/collections/all'}>
                            <button className={cx('default', 'btn')}>Tiếp tục mua hàng</button>
                        </Link>
                    </div>
                </main>
            </div>
        </section>
    );
}

export default CheckOutThanksYou;
