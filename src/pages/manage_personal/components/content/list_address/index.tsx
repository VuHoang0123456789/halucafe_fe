import classNames from 'classnames/bind';
import styles from '../styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import FormAddNewAddress from '../../form__add-new-address';
import { useEffect, useState } from 'react';
import { GetCookie } from '@/method/until';
import { CallApi } from '@/method/until';
import { AddressType } from '@/type';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

function Address() {
    const [isShow, setIsshow] = useState(false);
    const [title, setTitle] = useState('Thêm địa chỉ mới');
    const [selectedAddress, setSelectedAddress] = useState<AddressType>({} as AddressType);
    const [address, setAddress] = useState<AddressType[]>([] as AddressType[]);
    const [isReLoad, setIsReload] = useState(true);
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Sổ địa chỉ halucafe';
    }, []);

    useEffect(() => {
        const url = `${domain_url}/address/get-address`;
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(url, method, headers)
            .then((result: AddressType[]) => {
                if (result) setAddress(result);

                setTimeout(() => {
                    setIsLoaded(true);
                }, 600);
            })
            .catch((error: Error) => console.log(error));
    }, [domain_url, isReLoad]);

    async function AddNewAddress(ob: AddressType) {
        try {
            const url = `${domain_url}/address/add-new-address`;
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json',
                access_token: GetCookie('_user') || '',
            };
            const body = ob;

            const data = await CallApi(url, method, headers, body);
            if (data) setIsReload(!isReLoad);

            alert(data.msg);
        } catch (error) {
            console.log(error);
        }
    }

    async function UpdateAddress(ob: AddressType) {
        const url = `${domain_url}/address/update-address`;
        const method = 'PUT';
        const headers = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };
        const body = ob;

        const data = await CallApi(url, method, headers, body);
        if (data) setIsReload(!isReLoad);

        alert(data.msg);
    }

    return (
        <section className={cx('wrap__content')}>
            {isLoaded ? <></> : <LoadedComp />}
            {isShow ? (
                <FormAddNewAddress
                    title={title}
                    AddressIndex={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    AddNewAddress={AddNewAddress}
                    UpdateAddress={UpdateAddress}
                    funCloseForm={() => {
                        setIsshow(false);
                    }}
                />
            ) : (
                <></>
            )}

            <h1 className={cx('title')}>Địa chỉ của bạn</h1>

            <div>
                <button
                    className={cx('default', 'font-size14', 'space-l15')}
                    style={{ borderRadius: '4px' }}
                    onClick={() => {
                        setSelectedAddress({
                            address_id: -1,
                            address_info: '',
                            country_name: '',
                            customer_id: -1,
                            district_name: '',
                            full_name: '',
                            is_default: false,
                            phone: '',
                            province_name: '',
                            ward_name: '',
                            zip_id: '',
                        });
                        setTitle('Thêm địa chỉ mới');
                        setIsshow(true);
                    }}
                >
                    Thêm địa chỉ
                </button>
            </div>

            <div className={cx('space-t20', 'wrap__address')}>
                <ul>
                    {address.map((item, index) => (
                        <li className="flex__center  font-size14" key={index}>
                            <div className={cx('width-75', 'wrap__address-left')}>
                                <div className="flex__center space-b15">
                                    <h4 className="space-r5">Họ tên: </h4>
                                    <p>{item.full_name}</p>

                                    {item.is_default ? (
                                        <div className="green-color font-size10 font-weight600 flex__center space-l10">
                                            <div className="font-size12 space-r5">
                                                <FontAwesomeIcon icon={faCircleCheck} />
                                            </div>
                                            Địa chỉ mặc định
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div className="flex__center">
                                    <h4 className="space-r5">Địa chỉ: </h4>
                                    <p>
                                        {item.address_info}, {item.ward_name}, {item.district_name},{' '}
                                        {item.province_name}
                                    </p>
                                </div>
                            </div>
                            <div className="width-25">
                                <button
                                    className={cx('blue-color', 'btn__change-address')}
                                    onClick={() => {
                                        setSelectedAddress(item);
                                        setTitle('Chỉnh sửa địa chỉ');
                                        setIsshow(true);
                                    }}
                                >
                                    Chỉnh sửa địa chỉ
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default Address;
