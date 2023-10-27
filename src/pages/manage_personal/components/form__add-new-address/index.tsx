import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChangeDistricts, ChangeWraps } from '@/method/until';
import { ProvinceType, districtType, AddressType } from '@/type';

const cx = classNames.bind(styles);

interface Props {
    title: string;
    AddressIndex: AddressType;
    funCloseForm: () => void;
    setSelectedAddress: any;
    AddNewAddress: (ob: AddressType) => void;
    UpdateAddress: (ob: AddressType) => void;
}

function FormAddNewAddress({
    funCloseForm,
    title,
    AddNewAddress,
    AddressIndex,
    setSelectedAddress,
    UpdateAddress,
}: Props) {
    const [provinces, setProvinces] = useState<ProvinceType>([] as ProvinceType);
    const [districts, setDistricts] = useState<districtType>([] as districtType);
    const [wards, setWards] = useState<ProvinceType>([] as ProvinceType);

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/')
            .then(async (res) => {
                const data = await res.json();
                setProvinces(data);
            })
            .catch((error) => console.log(error));
    }, []);

    async function ChangeDistrictsClick(code: number) {
        try {
            const data = await ChangeDistricts(code);
            setDistricts(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function ChangeWrapsClick(code: number) {
        try {
            const data = await ChangeWraps(code);
            setWards(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={cx('wrap')} onClick={funCloseForm}>
            <div
                className={cx('form__add-new-address')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={cx('header')}>
                    <h2>{title}</h2>
                    <div className={cx('icon')} onClick={funCloseForm}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>

                <div className={cx('content')}>
                    <div className={cx('wrap__input')}>
                        <TextField
                            className={cx('wrap__input-item')}
                            label="Họ tên"
                            variant="outlined"
                            size="small"
                            value={AddressIndex.full_name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedAddress({ ...AddressIndex, full_name: value });
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: '12px',
                                },
                            }}
                            inputProps={{
                                style: {
                                    fontSize: '14px',
                                    padding: '10.94px 14px',
                                },
                            }}
                        />
                        <TextField
                            className={cx('wrap__input-item')}
                            label="Số điện thoại"
                            variant="outlined"
                            size="small"
                            value={AddressIndex.phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedAddress({ ...AddressIndex, phone: value });
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: '12px',
                                },
                            }}
                            inputProps={{
                                style: {
                                    fontSize: '14px',
                                    padding: '10.94px 14px',
                                },
                            }}
                        />

                        <TextField
                            className={cx('wrap__input-item')}
                            label="Địa chỉ"
                            variant="outlined"
                            size="small"
                            value={AddressIndex.address_info}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedAddress({ ...AddressIndex, address_info: value });
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: '12px',
                                },
                            }}
                            inputProps={{
                                style: {
                                    fontSize: '14px',
                                    padding: '10.94px 14px',
                                },
                            }}
                        />

                        <div
                            className={cx('flex__center', 'wrap__input-item')}
                            style={{ justifyContent: 'space-between' }}
                        >
                            <Autocomplete
                                size="small"
                                disablePortal
                                options={provinces || []}
                                sx={{ width: '32.5%' }}
                                value={
                                    provinces.filter((province) => province.name === AddressIndex.province_name)[0] ||
                                    null
                                }
                                isOptionEqualToValue={(option, value) => option.code === value.code}
                                renderOption={(props, option) => (
                                    <Typography {...props} sx={{ fontSize: '14px' }}>
                                        {option.name}
                                    </Typography>
                                )}
                                getOptionLabel={(options) => options.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tỉnh thành"
                                        InputLabelProps={{
                                            style: {
                                                fontSize: '12px',
                                            },
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            style: {
                                                fontSize: '14px',
                                                padding: '4.94px 14px',
                                            },
                                        }}
                                    />
                                )}
                                onChange={(e, option) => {
                                    if (option) {
                                        const value = option.name;
                                        setSelectedAddress({ ...AddressIndex, province_name: value });
                                        ChangeDistrictsClick(option.code);
                                    }
                                }}
                                onInputChange={() => {
                                    const province = provinces.filter(
                                        (province) => province.name === AddressIndex.province_name,
                                    )[0];

                                    if (!province) return;
                                    ChangeDistrictsClick(province.code);
                                }}
                            />

                            <Autocomplete
                                size="small"
                                disablePortal
                                options={districts || []}
                                sx={{ width: '32.5%' }}
                                value={
                                    districts.filter((district) => district.name === AddressIndex.district_name)[0] ||
                                    null
                                }
                                isOptionEqualToValue={(option, value) => option.code === value.code}
                                getOptionLabel={(options) => options.name}
                                renderOption={(props, option) => (
                                    <Typography {...props} sx={{ fontSize: '14px' }}>
                                        {option.name}
                                    </Typography>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Quận huyện"
                                        InputLabelProps={{
                                            style: {
                                                fontSize: '12px',
                                            },
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            style: {
                                                fontSize: '14px',
                                                padding: '4.94px 14px',
                                            },
                                        }}
                                    />
                                )}
                                onChange={(e, option) => {
                                    if (option) {
                                        const value = option.name;
                                        setSelectedAddress({ ...AddressIndex, district_name: value });
                                        ChangeWrapsClick(option.code);
                                    }
                                }}
                                onInputChange={() => {
                                    const district = districts.filter(
                                        (district) => district.name === AddressIndex.district_name,
                                    )[0];

                                    if (!district) return;
                                    ChangeWrapsClick(district.code);
                                }}
                            />

                            <Autocomplete
                                size="small"
                                disablePortal
                                options={wards || []}
                                sx={{ width: '32.5%' }}
                                value={wards.filter((ward) => ward.name === AddressIndex.ward_name)[0] || null}
                                isOptionEqualToValue={(option, value) => option.code === value.code}
                                getOptionLabel={(options) => options.name}
                                renderOption={(props, option) => (
                                    <Typography {...props} sx={{ fontSize: '14px' }}>
                                        {option.name}
                                    </Typography>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Phường xã"
                                        InputLabelProps={{
                                            style: {
                                                fontSize: '12px',
                                            },
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            style: {
                                                fontSize: '14px',
                                                padding: '4.94px 14px',
                                            },
                                        }}
                                    />
                                )}
                                onChange={(e, option) => {
                                    if (option) {
                                        const value = option.name;
                                        setSelectedAddress({ ...AddressIndex, ward_name: value });
                                    }
                                }}
                            />
                        </div>

                        <TextField
                            className={cx('wrap__input-item')}
                            label="Mã zip"
                            variant="outlined"
                            size="small"
                            value={AddressIndex.zip_id}
                            InputLabelProps={{
                                style: {
                                    fontSize: '12px',
                                },
                            }}
                            inputProps={{
                                style: {
                                    fontSize: '14px',
                                    padding: '10.94px 14px',
                                },
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedAddress({ ...AddressIndex, zip_id: value });
                            }}
                        />
                    </div>
                    <div className={cx('wrap__btn')}>
                        <div className="flex__center font-size14 font-weight500">
                            <input
                                type="checkbox"
                                className="space-r5"
                                style={{ cursor: 'pointer' }}
                                checked={AddressIndex.is_default}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedAddress({ ...AddressIndex, is_default: isChecked });
                                }}
                            />
                            Đặt là địa chỉ mặc định?
                        </div>

                        <div className="flex__center" style={{ justifyContent: 'flex-end' }}>
                            <button className={cx('default', 'outline', 'btn', 'btn__close')} onClick={funCloseForm}>
                                Hủy
                            </button>
                            <button
                                className={cx('default', 'space-l15', 'btn')}
                                onClick={() => {
                                    if (title === 'Thêm địa chỉ mới') {
                                        AddNewAddress(AddressIndex);
                                    } else {
                                        UpdateAddress(AddressIndex);
                                    }

                                    funCloseForm();
                                }}
                            >
                                {title === 'Thêm địa chỉ mới' ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormAddNewAddress;
