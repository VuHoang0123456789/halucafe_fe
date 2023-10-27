import classNames from 'classnames/bind';
import styles from '../styles.module.scss';
import { RootState } from '@/reduce/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { CallApi, GetCookie } from '@/method/until';
import { AddressType } from '@/type';

const cx = classNames.bind(styles);

function Infomation() {
    const user = useSelector((state: RootState) => state.user);
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [address, setAddress] = useState<AddressType | undefined>();

    useEffect(() => {
        const method = 'get';
        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(`${domain_url}/address/get-address-default`, method, header)
            .then((response: AddressType) => {
                if (response) setAddress(response);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [user, domain_url]);

    useEffect(() => {
        document.title = 'Trang khách hàng halucafe';
    }, []);

    return (
        <section className={cx('wrap__content')}>
            <h1 className={cx('title')} onClick={() => {}}>
                Thông tin tài khoản
            </h1>
            <ul>
                <li className="flex__center font-size14 space-b15">
                    <h2 className="font-size14 space-r5">Họ tên: </h2>
                    <p className="font-weight500">{user.show_name}</p>
                </li>
                <li className="flex__center font-size14 space-b15">
                    <h2 className="font-size14 space-r5">Email: </h2>
                    <p className="font-weight500">{user.email}</p>
                </li>
                {address && (
                    <div>
                        <li className="flex__center font-size14 space-b15">
                            <h2 className="font-size14 space-r5">Số điện thoại: </h2>
                            <p className="font-weight500">{address.phone}</p>
                        </li>
                        <li className="flex__center font-size14 space-b15">
                            <h2 className="font-size14 space-r5">Địa chỉ: </h2>
                            <p className="font-weight500">{`${address.address_info}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`}</p>
                        </li>
                    </div>
                )}
            </ul>
        </section>
    );
}

export default Infomation;
