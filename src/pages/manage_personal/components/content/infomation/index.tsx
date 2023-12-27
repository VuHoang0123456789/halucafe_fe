import classNames from 'classnames/bind';
import styles from '../styles.module.scss';
import { RootState } from '@/reduce/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { CallApi, GetCookie } from '@/method/until';
import { AddressType } from '@/type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { changeState } from '@/reduce/slice/userSlice';

const cx = classNames.bind(styles);

function Infomation() {
    const user = useSelector((state: RootState) => state.user);
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [avatarPath, setAvatarPath] = useState<string | undefined>();
    const [address, setAddress] = useState<AddressType | undefined>();
    const inputChooseImgRef = useRef<HTMLInputElement | null>(null);
    const dispath = useDispatch();

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
        setAvatarPath(user.avatar);
    }, [user, domain_url]);

    useEffect(() => {
        document.title = 'Trang khách hàng halucafe';
    }, []);

    useEffect(() => {
        const method = 'put';
        const header = {
            access_token: GetCookie('_user') || '',
        };
        const body = new FormData();
        const input = inputChooseImgRef?.current as HTMLInputElement;
        if (input.files) body.append('avatar', input.files[0]);

        fetch(`${domain_url}/account/update/avatar/${user.customer_id}`, {
            headers: header,
            method: method,
            body: body,
        })
            .then(async (response) => {
                const data = await response.json();

                if (response.status === 200)
                    dispath(
                        changeState({
                            ...user,
                            avatar: data.url,
                        }),
                    );
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [avatarPath, domain_url, dispath]);

    function ChooseImage() {
        const chooseInput = inputChooseImgRef?.current as HTMLInputElement;
        chooseInput.click();
    }

    function ChangeImage() {
        const input = inputChooseImgRef?.current as HTMLInputElement;

        const reader = new FileReader();

        reader.onload = (event) => {
            if (event.target?.result) setAvatarPath(event.target.result.toString());
        };

        if (input.files) reader.readAsDataURL(input.files[0]);
    }

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

            <div className={cx('wrap_thumb')}>
                <div className={cx('opacity')}>
                    <div className={cx('icon_camera')} onClick={ChooseImage}>
                        <FontAwesomeIcon icon={faCamera} />
                    </div>
                    <input
                        ref={inputChooseImgRef}
                        id="js__avatar-choose"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={ChangeImage}
                        accept="image/*"
                    />
                </div>
                <img src={avatarPath} alt="avatar" />
            </div>
        </section>
    );
}

export default Infomation;
