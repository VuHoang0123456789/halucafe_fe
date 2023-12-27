import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import WrapShareFacebookAnfGoogle from '../components/share_facebook_google';
import React, { useEffect, useState } from 'react';
import { RegisterFunc } from '@/method/auth';
import { validateEmail } from '@/method/until';

const cx = classNames.bind(styles);

function Register() {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassWord] = useState<string>('');
    const [disabledBTn, setDisabled] = useState<boolean>(true);

    const breadcrumb = {
        title: 'Đăng ký tài khoản',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/account/register', name: 'Đăng ký tài khoản' },
        ],
    };

    useEffect(() => {
        document.title = 'Đăng ký tài khoản halucafe';
    }, []);

    useEffect(() => {
        if (
            validateEmail(email) &&
            firstName.replace(/\s/g, '').length > 0 &&
            lastName.replace(/\s/g, '').length > 0 &&
            password.length >= 8
        )
            setDisabled(false);
        else setDisabled(true);
    }, [firstName, lastName, email, password]);

    function KeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabledBTn) return;

        if (e.key === 'Enter') RegisterFunc(email, password, firstName, lastName);
    }

    function KeyDownPass(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === ' ') e.preventDefault();
    }

    return (
        <div className={cx('register__page')}>
            <div className="container">
                <section className={cx('breadcrumb')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>

                <section className={cx('register__content')}>
                    <div className={cx('content__top')}>
                        <h1>Đăng ký tài khoản</h1>
                        <span style={{ fontSize: '14px', color: 'red', fontWeight: '500' }}>
                            Nếu chưa có tài khoản vui lòng đăng ký tại đây
                        </span>
                        <div className="row">
                            <div className={cx('form__login')}>
                                <div className={cx('flex__wrap')}>
                                    <div className={cx('wrap__input')}>
                                        <h2 className={cx('wrap__inpu-title')}>Họ: </h2>
                                        <input
                                            name=""
                                            required
                                            placeholder=""
                                            className="min__height"
                                            onChange={(e) => setFirstName(e.target.value)}
                                            onKeyDown={KeyDown}
                                        />
                                    </div>
                                    <div className={cx('wrap__input')}>
                                        <h2 className={cx('wrap__inpu-title')}>Tên: </h2>
                                        <input
                                            className="min__height"
                                            required
                                            placeholder=""
                                            onChange={(e) => setLastName(e.target.value)}
                                            onKeyDown={KeyDown}
                                        />
                                    </div>
                                    <div className={cx('wrap__input')}>
                                        <h2 className={cx('wrap__inpu-title')}>Email: </h2>
                                        <input
                                            className="min__height"
                                            required
                                            placeholder=""
                                            type="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyDown={KeyDown}
                                        />
                                    </div>
                                    <div className={cx('wrap__input')}>
                                        <h2 className={cx('wrap__inpu-title')}>Mật khẩu: </h2>
                                        <input
                                            className="min__height"
                                            required
                                            placeholder=""
                                            type="password"
                                            onChange={(e) => setPassWord(e.target.value)}
                                            onKeyDown={(e) => {
                                                KeyDownPass(e);
                                                KeyDown(e);
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className={cx('btn', 'default')}
                                    onClick={() => RegisterFunc(email, password, firstName, lastName)}
                                    disabled={disabledBTn}
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                    <WrapShareFacebookAnfGoogle />
                </section>
            </div>
        </div>
    );
}

export default Register;
