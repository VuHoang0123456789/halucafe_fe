import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Autocomplete, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
    CallApi,
    ChangeDistricts,
    ChangeWraps,
    FormatPrice,
    GetCookie,
    createRandomStr,
    deleteCookie,
} from '@/method/until';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { AddressType, ProductType, ProvinceType, districtType } from '@/type';
import { clearCart } from '@/reduce/slice/cartSlice';

const cx = classNames.bind(styles);

type PayType = {
    pay_type_id: number;
    pay_type_name: string;
    icon: string;
};

interface CartType extends ProductType {
    count: number;
}

interface OrderType {
    orderId?: string;
    createAt?: string;
    deliveryDate?: string;
    payStatus?: boolean;
    transportStatus?: boolean;
    customerId?: number;
    deliveryCost: number;
    payTypeId: number;
    email: string;
    note: string;
    slug: string;
    products: CartType[];
}

type voucherType = {
    voucher_id: string;
    voucher_value: number;
};

function CheckOutPage() {
    const user = useSelector((state: RootState) => state.user);
    const dispath = useDispatch();
    const navigate = useNavigate();
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [payTypes, setPayTypes] = useState([] as PayType[]);
    const [payTypesIndex, setPayTypesIndex] = useState(0);
    const [voucher, setVoucher] = useState<voucherType>({ voucher_id: '', voucher_value: 0 } as voucherType);
    const cartItems = useSelector((state: RootState) => state.cart) as CartType[];
    const addressInitital = {
        address_id: -1,
        address_info: '',
        country_name: '',
        customer_id: -1,
        district_name: '',
        full_name: '',
        is_default: true,
        phone: '',
        province_name: '',
        ward_name: '',
        zip_id: '',
    };
    const [address, setAddress] = useState<AddressType>(addressInitital as AddressType);

    const [provinces, setProvinces] = useState<ProvinceType>([
        {
            code: 0,
            codename: '',
            division_type: '',
            name: '',
            district_code: 0,
        },
    ] as ProvinceType);
    const [provincesCode, setProvincesCode] = useState(-1);

    const [districts, setDistricts] = useState<districtType>([
        {
            code: 0,
            codename: '',
            wards: [],
            division_type: '',
            name: 'Vui lòng chọn tỉnh thành trước',
            district_code: 0,
        },
    ] as districtType);
    const [districtsCode, setDistrictsCode] = useState(-1);

    const [wrads, setWrads] = useState<ProvinceType>([
        {
            code: 0,
            codename: '',
            division_type: '',
            name: 'Vui lòng chọn quận/ huyện trước',
            district_code: 0,
        },
    ] as ProvinceType);
    const [wradsCode, setWradsCode] = useState(-1);

    const [delivery_cost, setDelivery_cost] = useState(0);

    const [order, setOrder] = useState<OrderType>({} as OrderType);

    useEffect(() => {
        const listDelivery_cost = [
            { provinces_name: 'Hải Phòng', costs: 15000 },
            { provinces_name: 'Hà Nội', costs: 30000 },
            { provinces_name: 'Hồ Chí Minh', costs: 50000 },
            { provinces_name: 'Yên Bái', costs: 30000 },
            { provinces_name: 'Đà Nẵng', costs: 40000 },
            { provinces_name: 'Lạng Sơn', costs: 25000 },
        ];

        const cost = listDelivery_cost.find((item) =>
            provinces[provincesCode]?.name.includes(item.provinces_name),
        )?.costs;

        if (!cost) {
            setDelivery_cost(0);
            return;
        }

        setDelivery_cost(cost);
    }, [provincesCode]);

    useEffect(() => {
        document.title = 'halucafe - Thanh toán đơn hàng';
    }, []);

    useEffect(() => {
        if (cartItems.length === 0) return navigate('/trang-chu');
    }, [cartItems, navigate]);

    useEffect(() => {
        const ob = {
            customerId: user.customer_id,
            deliveryCost: delivery_cost,
            payTypeId: payTypes[payTypesIndex]?.pay_type_id,
            email: user.email,
            slug: GetCookie('_order_slug') || createRandomStr(30),
            note: '',
            products: cartItems,
        };

        setOrder(ob);
    }, [user, payTypes, payTypesIndex, cartItems]);

    useEffect(() => {
        const method = 'get';
        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(`${domain_url}/order/get-pay-types`, method, header)
            .then((response: PayType[]) => {
                if (response) setPayTypes(response);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [domain_url]);

    // tính tổng sô tiền hàng phải thanh toán
    const Total = useMemo(
        () =>
            cartItems.reduce((total, value) => {
                return total + value.count * value.price;
            }, 0),
        [cartItems],
    );
    // Tính số tiền thật phải trả
    const TotalPay = useMemo(
        () => (Total + delivery_cost - voucher.voucher_value > 0 ? Total + delivery_cost - voucher.voucher_value : 0),
        [Total, delivery_cost, voucher],
    );

    useEffect(() => {
        if (provincesCode !== -1) ChangeDistrictClick(provinces[provincesCode]?.code);
    }, [provincesCode, provinces]);

    useEffect(() => {
        if (districtsCode !== -1) ChangeWardsClick(districts[districtsCode]?.code);
    }, [districtsCode, districts]);

    useEffect(() => {
        CallApi('https://provinces.open-api.vn/api/', 'get')
            .then((result: ProvinceType) => {
                const code = result.findIndex((item) => item.name === address.province_name);
                setProvinces(result);
                setProvincesCode(code);
            })
            .catch((error: Error) => console.log(error));
    }, [address]);

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

    async function ChangeDistrictClick(index: number) {
        try {
            const data = (await ChangeDistricts(index)) as districtType;

            const code = data.findIndex((item) => item.name === address.district_name);

            setDistricts(data);
            setDistrictsCode(code);
        } catch (error) {
            console.log(error);
        }
    }

    async function ChangeWardsClick(index: number) {
        try {
            const data = (await ChangeWraps(index)) as ProvinceType;

            const code = data.findIndex((item) => item.name === address.ward_name);

            setWrads(data);
            setWradsCode(code);
        } catch (error) {
            console.log(error);
        }
    }

    async function OrderHandle() {
        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };
        try {
            let newAddress = {
                ...address,
                district_name: districts[districtsCode].name,
                province_name: provinces[provincesCode].name,
                ward_name: wrads[wradsCode].name,
            };

            if (address.address_id === -1) {
                newAddress = {
                    ...address,
                    country_name: 'Việt Nam',
                    customer_id: user.customer_id,
                    district_name: districts[districtsCode].name,
                    province_name: provinces[provincesCode].name,
                    ward_name: wrads[wradsCode].name,
                };
            }

            const result = await CallApi(`${domain_url}/address/change-address`, 'post', header, newAddress);

            if (result) {
                const isOrderSuccessful = await CallApi(`${domain_url}/order/add-order-info`, 'post', header, order);
                const slug = GetCookie('__order_slug') || '';

                if (isOrderSuccessful) {
                    deleteCookie('__order_slug');
                    dispath(clearCart([]));
                }

                return navigate(`/checkout/thankyou/${slug}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const styleInput = {
        height: 27,
        fontSize: '14px',
        color: 'var(--text-color)',
        fontWeight: 500,
        fontFamily: 'Helvetica Neue, sans-serif',
    };
    const styleLabel = {
        lineHeight: '27px',
        fontSize: '14px',
        fontFamily: 'Helvetica Neue, sans-serif',
    };

    return (
        <div className={cx('check_out-page')}>
            <div className={cx('wrap', 'flex')}>
                <main className={cx('main')}>
                    <header className={cx('main__header')}>
                        <Link to={'/trang-chu'}>
                            <h1 className={cx('main__header-title', 'space-l5')}>halucafe</h1>
                        </Link>
                    </header>

                    <div className={cx('main__content')}>
                        <div className={cx('column')}>
                            <div className="flex space-b12">
                                <h3 className={cx('column__title', 'space-l5')}>Thông tin nhận hàng</h3>

                                <Link to={'/account/login'}>
                                    <FontAwesomeIcon icon={faCircleUser} />
                                    <span className="font-size14 space-l5">Đăng nhập</span>
                                </Link>
                            </div>
                            <TextField
                                id="tf__email"
                                label="Email"
                                variant="outlined"
                                className={cx('column__item')}
                                size="small"
                                style={{ margin: '0 0 5.6px 0' }}
                                value={user.email}
                                inputProps={{
                                    style: {
                                        ...styleInput,
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        ...styleLabel,
                                    },
                                }}
                                disabled
                            />
                            <TextField
                                size="small"
                                id="tf__name"
                                label="Họ và tên"
                                variant="outlined"
                                className={cx('column__item')}
                                value={address.full_name}
                                inputProps={{
                                    style: {
                                        ...styleInput,
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        ...styleLabel,
                                    },
                                }}
                                onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                            />
                            <TextField
                                size="small"
                                id="tf__phone"
                                label="Số điện thoại (tùy chọn)"
                                variant="outlined"
                                className={cx('column__item')}
                                value={address.phone}
                                inputProps={{
                                    style: {
                                        ...styleInput,
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        ...styleLabel,
                                    },
                                }}
                                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            />
                            <TextField
                                size="small"
                                id="tf__address"
                                label="Địa chỉ tùy chọn"
                                variant="outlined"
                                className={cx('column__item')}
                                value={address.address_info}
                                inputProps={{
                                    style: {
                                        ...styleInput,
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        ...styleLabel,
                                    },
                                }}
                                onChange={(e) => setAddress({ ...address, address_info: e.target.value })}
                            />
                            <Autocomplete
                                disablePortal
                                id="cb__province"
                                options={provinces}
                                style={{ marginBottom: '11.2px' }}
                                className={cx('column__item')}
                                value={provinces[provincesCode] || null}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => {
                                    return option.code === value.code;
                                }}
                                getOptionDisabled={(option) => option.code === 0}
                                renderOption={(props, option) => {
                                    return (
                                        <Typography {...props} className={cx('fillter__item')} key={option.code}>
                                            {option.name}
                                        </Typography>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tỉnh thành"
                                        size="small"
                                        inputProps={{
                                            ...params.inputProps,
                                            style: {
                                                ...styleInput,
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                ...styleLabel,
                                            },
                                        }}
                                    />
                                )}
                                onInputChange={(e, options) => {
                                    if (options === '') {
                                        setDistricts([
                                            {
                                                code: 0,
                                                codename: '',
                                                wards: [],
                                                division_type: '',
                                                name: 'Vui lòng chọn tỉnh thành trước',
                                                district_code: 0,
                                            },
                                        ]);
                                        setProvincesCode(-1);
                                    } else {
                                        const code = provinces.findIndex((item) => item.name === options);
                                        setProvincesCode(code);
                                    }
                                }}
                            />
                            <Autocomplete
                                disablePortal
                                id="cb__district"
                                options={districts}
                                style={{ marginBottom: '11.2px' }}
                                className={cx('column__item')}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => {
                                    return option.code === value.code;
                                }}
                                value={districts[districtsCode] || null}
                                getOptionDisabled={(option) => option.code === 0}
                                renderOption={(props, option) => {
                                    return (
                                        <Typography {...props} className={cx('fillter__item')} key={option.name}>
                                            {option.name}
                                        </Typography>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Quận huyện (tùy chọn)"
                                        size="small"
                                        inputProps={{
                                            readOnly: true,
                                            ...params.inputProps,
                                            style: {
                                                ...styleInput,
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                ...styleLabel,
                                            },
                                        }}
                                    />
                                )}
                                onInputChange={(e, options) => {
                                    if (options === '') {
                                        setWrads([
                                            {
                                                code: 0,
                                                codename: '',
                                                division_type: '',
                                                name: 'Vui lòng chọn quận/ huyện trước',
                                                district_code: 0,
                                            },
                                        ]);
                                        setDistrictsCode(-1);
                                    } else {
                                        const index = districts.findIndex((item) => item.name === options);
                                        setDistrictsCode(index);
                                    }
                                }}
                            />
                            <Autocomplete
                                disablePortal
                                id="cb__wrads"
                                options={wrads}
                                className={cx('column__item')}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => {
                                    return option.code === value.code;
                                }}
                                value={wrads[wradsCode] || null}
                                getOptionDisabled={(option) => option.code === 0}
                                renderOption={(props, option) => {
                                    return (
                                        <Typography {...props} className={cx('fillter__item')} key={option.name}>
                                            {option.name}
                                        </Typography>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Phường xã (tùy chọn)"
                                        size="small"
                                        inputProps={{
                                            readOnly: true,
                                            ...params.inputProps,
                                            style: {
                                                ...styleInput,
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                ...styleLabel,
                                            },
                                        }}
                                    />
                                )}
                                onInputChange={(e, options) => {
                                    const index = wrads.findIndex((item) => item.name === options);
                                    setWradsCode(index);
                                }}
                            />
                            <TextField
                                size="small"
                                id="tf__note"
                                label="Ghi chú (tùy chọn)"
                                multiline
                                className={cx('column__item')}
                                value={order.note}
                                inputProps={{
                                    style: {
                                        fontSize: '14px',
                                        color: 'var(--text-color)',
                                        fontWeight: 500,
                                        fontFamily: 'Helvetica Neue, sans-serif',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        ...styleLabel,
                                    },
                                }}
                                onChange={(e) => setOrder({ ...order, note: e.target.value })}
                            />
                        </div>
                        <div className={cx('column')}>
                            <div>
                                <h3 className={cx('column__title', 'space-b12')}>Vận chuyển</h3>

                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="Thanh toán khi giao hàng (COD)"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel
                                        value="Thanh toán khi giao hàng (COD)"
                                        control={<Radio />}
                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.23)',
                                            borderRadius: '4px',
                                            padding: 3.2,
                                            margin: '0',
                                        }}
                                        sx={{
                                            '.MuiTypography-root': {
                                                width: '100%',
                                            },
                                        }}
                                        label={
                                            <div className={cx('wrap__payment-methods')}>
                                                <span>Giao hàng tận nơi</span>
                                                <p style={{ padding: '0 9px' }}>{FormatPrice(delivery_cost)}₫</p>
                                            </div>
                                        }
                                    />
                                </RadioGroup>
                            </div>
                            <div style={{ paddingTop: '28px' }}>
                                <h3 className={cx('column__title', 'space-b12')}>Thanh toán</h3>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="Thanh toán khi giao hàng (COD)"
                                    name="radio-buttons-group"
                                >
                                    {payTypes.map((item, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={item.pay_type_name}
                                            control={<Radio />}
                                            onClick={() => setPayTypesIndex(index)}
                                            style={{
                                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                                borderRadius: '4px',
                                                padding: 6.2,
                                                margin: '0 0 10px 0',
                                            }}
                                            sx={{
                                                '.MuiTypography-root': {
                                                    width: '100%',
                                                },
                                            }}
                                            label={
                                                <div className={cx('wrap__payment-methods')}>
                                                    <span>{item.pay_type_name}</span>
                                                    <img
                                                        className={cx('icon')}
                                                        src={`${process.env.REACT_APP_DOMAIN__URL_FE}${item.icon}`}
                                                        alt={item.pay_type_name}
                                                    />
                                                </div>
                                            }
                                        />
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </main>
                <aside className={cx('sitebar')}>
                    <div className={cx('wrap__title')}>
                        Đơn hàng <span>({cartItems.length} sản phẩm)</span>
                    </div>

                    <div className={cx('wrap__content')}>
                        <div className={cx('list__cart')}>
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li className="flex" key={index}>
                                        <div className={cx('product__image')}>
                                            <div className={cx('product__thumbnail')}>
                                                <img src={item.url_images_small[0]} alt={item.product_name} />
                                                <div className={cx('count')}>{item.count}</div>
                                            </div>
                                        </div>

                                        <span
                                            className="font-size14 space-t10 space-l10 font-weight500"
                                            style={{ flex: 1 }}
                                        >
                                            {item.product_name}
                                        </span>
                                        <span className="font-size14 font-weight500" style={{ lineHeight: '52px' }}>
                                            {FormatPrice(item.price * item.count)}₫
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={cx('code__sale')}>
                            <TextField
                                id="tf__email"
                                label="Nhập mã giảm giá"
                                variant="outlined"
                                className={cx('iwrap__input')}
                                size="small"
                                value={voucher.voucher_id}
                                inputProps={{
                                    style: {
                                        ...styleInput,
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        ...styleLabel,
                                    },
                                }}
                                onChange={(e) => {
                                    setVoucher({ voucher_id: e.target.value, voucher_value: 0 });
                                }}
                            />
                            <button className={cx('default', 'btn')} disabled={voucher.voucher_id === ''}>
                                Áp dụng
                            </button>
                        </div>

                        <div className={cx('summary')}>
                            <div className={cx('flex', 'field')}>
                                <span>Tạm tính</span>
                                <p>{FormatPrice(Total)}₫</p>
                            </div>
                            <div className={cx('flex', 'field')}>
                                <span>Phí vận chuyển</span>
                                <p>{FormatPrice(delivery_cost)}₫</p>
                            </div>
                            <hr />
                            <div className={cx('flex', 'field')}>
                                <span className="font-size16 ">Tổng cộng</span>
                                <p className="font-size21" style={{ color: 'var(--blue-color)' }}>
                                    {FormatPrice(TotalPay)}₫
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex"
                            style={{ alignItems: 'center', justifyContent: 'space-between', padding: '0 3px' }}
                        >
                            <Link to={'/cart'}>
                                <div className="flex" style={{ alignItems: 'center' }}>
                                    <div
                                        className="font-size14"
                                        style={{ color: 'var(--blue-color)', marginRight: '5px' }}
                                    >
                                        <FontAwesomeIcon icon={faAngleLeft} />
                                    </div>
                                    <span className="font-size14" style={{ color: 'var(--blue-color)' }}>
                                        Quay về giỏ hàng
                                    </span>
                                </div>
                            </Link>
                            <button className={cx('default', 'btn', 'text-uppercase')} onClick={OrderHandle}>
                                Đặt hàng
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default CheckOutPage;
