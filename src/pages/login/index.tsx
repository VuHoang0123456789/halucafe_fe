import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import WrapShareFacebookAnfGoogle from '../components/share_facebook_google';
import React, { useEffect, useState } from 'react';
import { GetPassWord, Login } from '@/method/auth';

const cx = classNames.bind(styles);

function LoginPage() {
    const [email, setEmail] = useState('');
    const [email_forgot, setEmailForgot] = useState('');
    const [passWord, setPassWord] = useState('');

    const breadcrumb = {
        title: 'Đăng nhập tài khoản',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/account/login', name: 'Đăng nhập tài khoản' },
        ],
    };

    useEffect(() => {
        document.title = 'Đăng nhập tài khoản halucafe';
    }, []);

    function ChangeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (email.length < 8 || passWord.length < 8) return;
        if (e.key === 'Enter') Login(email, passWord);
    }

    function GetPassKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (email_forgot.length < 8) return;
        if (e.key === 'Enter') GetPassWord(email_forgot);
    }

    return (
        <div className={cx('login__page')}>
            <div className="container">
                <section className={cx('breadcrumb')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>

                <section className={cx('login__content')}>
                    <div className={cx('content__top')}>
                        <h1>Đăng nhập tài khoản</h1>
                        <div className="row">
                            <div className="flex">
                                <div className={cx('form__login')}>
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: 'red',
                                            fontWeight: '500',
                                            marginLeft: '15px',
                                        }}
                                    >
                                        Nếu bạn có tài khoản, vui lòng đăng nhập tại đây
                                    </span>
                                    <div className={cx('flex__wrap')}>
                                        <div className={cx('wrap__input')}>
                                            <h2 className={cx('wrap__inpu-title')}>Email: </h2>
                                            <input
                                                required
                                                placeholder=""
                                                type="email"
                                                className="min__height"
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                }}
                                                onKeyDown={(e) => ChangeKeyDown(e)}
                                            />
                                        </div>
                                        <div className={cx('wrap__input')}>
                                            <h2 className={cx('wrap__inpu-title')}>Mật khẩu: </h2>
                                            <input
                                                required
                                                placeholder=""
                                                type="password"
                                                className="min__height"
                                                onChange={(e) => {
                                                    setPassWord(e.target.value);
                                                }}
                                                onKeyDown={(e) => ChangeKeyDown(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className={cx('btn', 'default')}
                                            onClick={() => {
                                                Login(email, passWord);
                                            }}
                                            disabled={email.length < 8 || passWord.length < 8}
                                        >
                                            Đăng nhập
                                        </button>
                                        <Link to={'/account/register'}>
                                            <button className={cx('btn', 'default', 'outline')}>Đăng ký</button>
                                        </Link>
                                    </div>
                                </div>
                                <div className={cx('form__remember-pass')}>
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: 'red',
                                            fontWeight: '500',
                                            marginLeft: '15px',
                                        }}
                                    >
                                        Bạn quên mật khẩu? Nhập địa chỉ email để lấy lại mật khẩu qua email.
                                    </span>
                                    <div className={cx('flex__wrap')}>
                                        <div className={cx('wrap__input')}>
                                            <h2 className={cx('wrap__inpu-title')}>Email: </h2>
                                            <input
                                                required
                                                placeholder=""
                                                type="email"
                                                className="min__height"
                                                onChange={(e) => {
                                                    setEmailForgot(e.target.value);
                                                }}
                                                onKeyDown={(e) => GetPassKeyDown(e)}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className={cx('btn', 'default')}
                                        onClick={() => {
                                            GetPassWord(email_forgot);
                                        }}
                                        disabled={email_forgot.length < 8}
                                    >
                                        Lấy lại mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <WrapShareFacebookAnfGoogle />
                </section>
            </div>
        </div>
    );
}

export default LoginPage;
