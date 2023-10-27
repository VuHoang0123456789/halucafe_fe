import classNames from 'classnames/bind';
import styles from '../styles.module.scss';
import { useEffect, useState } from 'react';
import { CallApi, GetCookie } from '@/method/until';

const cx = classNames.bind(styles);

function PassWord() {
    const [passWord, setPassWord] = useState('');
    const [newPassword, setNewPassWord] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;

    useEffect(() => {
        document.title = 'Thay đổi mật khẩu halucafe';
    }, []);

    async function CheckPassWord() {
        if (passWord === newPassword) return true;

        return newPassword !== confirmPassword;
    }

    async function ResetPassWord() {
        try {
            if (await CheckPassWord()) {
                alert('Vui lòng kiểm tra lại mật khẩu!');
                return;
            }

            const url = `${domain_url}/account/change-password`;
            const method = 'PUT';
            const headers = {
                'Content-Type': 'application/json',
                access_token: GetCookie('_user') || '',
            };
            const body = {
                passWord,
                newPassword,
            };

            const data = await CallApi(url, method, headers, body);

            alert(data.msg);
        } catch (error) {
            console.log(error);
        }
    }

    function KeyDownEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (passWord.length < 8 || newPassword.length < 8 || confirmPassword.length < 8) return;
        if (e.key === 'Enter') ResetPassWord();
    }

    return (
        <section className={cx('wrap__content')}>
            <h1 className={cx('title')}>Đổi mật khẩu</h1>
            <div className={cx('wrap_password')}>
                <p className="space-b15 font-size14">
                    Để đảm bảo tính bảo mật vui lòng đặt mật khẩu với ít nhất 8 kí tự
                </p>
                <ul>
                    <li>
                        <h3 className="font-size14 space-b2">Mật khẩu cũ *</h3>
                        <input
                            type="password"
                            placeholder="Mật khẩu cũ"
                            value={passWord}
                            onChange={(e) => {
                                setPassWord(e.target.value);
                            }}
                            onKeyDown={(e) => KeyDownEnter(e)}
                        />
                    </li>
                    <li>
                        <h3 className="font-size14 space-b2">Mật khẩu mới *</h3>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassWord(e.target.value);
                            }}
                            onKeyDown={(e) => KeyDownEnter(e)}
                        />
                    </li>
                    <li>
                        <h3 className="font-size14 space-b2">Xác nhận lại mật khẩu *</h3>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            onKeyDown={(e) => KeyDownEnter(e)}
                        />
                    </li>
                    <li>
                        <button
                            className={cx('default', 'font-size14')}
                            onClick={ResetPassWord}
                            disabled={passWord.length < 8 || newPassword.length < 8 || confirmPassword.length < 8}
                        >
                            Đặt lại mật khẩu
                        </button>
                    </li>
                </ul>
            </div>
        </section>
    );
}

export default PassWord;
