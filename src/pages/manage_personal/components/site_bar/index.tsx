import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useContext, useEffect, useState } from 'react';
import { ConTextIndex } from '../..';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { GetCookie, decodeString } from '@/method/until';

const cx = classNames.bind(styles);

type ArrType = {
    title: string;
    link: string;
    type: string;
};

function Sitebar() {
    const { index } = useContext(ConTextIndex);
    const user = useSelector((state: RootState) => state.user);
    const [arr, setArr] = useState<ArrType[] | undefined>();
    const location = useLocation();

    useEffect(() => {
        let arr = [
            { title: 'Thông tin tài khoản', link: '/account', type: 'infomation' },
            { title: 'Đơn hàng của bạn', link: '/account/orders', type: 'orders' },
            { title: 'Đổi mật khẩu', link: '/account/change-password', type: 'change-password' },
            { title: 'Sổ địa chỉ', link: '/account/address', type: 'address' },
        ];

        if (
            decodeString(GetCookie('_typeLogin') || '') === 'facebook' ||
            decodeString(GetCookie('_typeLogin') || '') === 'google'
        ) {
            arr = [
                { title: 'Thông tin tài khoản', link: '/account', type: 'infomation' },
                { title: 'Đơn hàng của bạn', link: '/account/orders', type: 'orders' },
                { title: 'Sổ địa chỉ', link: '/account/address', type: 'address' },
            ];
        }

        setArr(arr);
    }, []);

    return (
        <aside className={cx('wrap__sitebar')}>
            <h1 className={cx('title')}>TRANG TÀI KHOẢN</h1>
            <p className="font-size14 font-weight700 space-b18" style={{ lineHeight: '16px' }}>
                Xin chào, {user.show_name}!
            </p>
            <ul>
                {arr?.map((item, indexSitebar) => (
                    <Link to={item.link} key={indexSitebar}>
                        <li
                            className={cx(
                                index.sitebar_idex === indexSitebar || location.pathname.includes(item.type)
                                    ? 'active'
                                    : '',
                            )}
                        >
                            {item.title}
                        </li>
                    </Link>
                ))}
            </ul>
        </aside>
    );
}

export default Sitebar;
