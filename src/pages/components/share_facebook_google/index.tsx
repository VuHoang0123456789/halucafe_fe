import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { useGoogleLogin } from '@react-oauth/google';
import { setCookie } from '@/method/until';
import { encodedString, deleteCookie } from '@/method/until';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const cx = classNames.bind(styles);

function WrapShareFacebookAnfGoogle() {
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;

    async function CallApi(url: string, token: string) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    access_token: token,
                },
                credentials: 'include',
            });

            if (res.status === 400 || res.status === 500) {
                deleteCookie('_typeLogin', '/');
                deleteCookie('_user', '/');
                return;
            }

            if (res.status === 201) {
                window.location.replace('/account');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const responseFacebook = async (response: any) => {
        try {
            setCookie('_typeLogin', encodedString('facebook'), 10);
            const url = `${domain_url}/account/register-external-account?type_login=facebook`;

            CallApi(url, response.accessToken);
        } catch (error) {
            console.log(error);
        }
    };

    const login_google = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                setCookie('_typeLogin', encodedString('google'), 10);
                const url = `${domain_url}/account/register-external-account?type_login=google`;

                CallApi(url, codeResponse.access_token);
            } catch (error) {
                console.log(error);
            }
        },
        onError: (error) => console.log('Login Failed', error),
    });

    return (
        <div className={cx('content__bottom')}>
            <h1>Đăng nhập bằng Facebook hoặc Google</h1>
            <div className="flex">
                <FacebookLogin
                    appId={`${process.env.REACT_APP_FACEBOOK_ID}`}
                    autoLoad={false}
                    scope="public_profile,user_friends,email"
                    callback={responseFacebook}
                    icon="fa-facebook"
                    render={(renderProps) => (
                        <div className={cx('btn')} onClick={renderProps.onClick}>
                            <img
                                src={`${process.env.REACT_APP_DOMAIN__URL}/pages/register/fb-btn.svg`}
                                alt="facebook"
                            />
                        </div>
                    )}
                />

                <div
                    className={cx('btn')}
                    onClick={() => {
                        login_google();
                    }}
                >
                    <img src={`${process.env.REACT_APP_DOMAIN__URL}/pages/register/gp-btn.svg`} alt="google" />
                </div>
            </div>
        </div>
    );
}

export default WrapShareFacebookAnfGoogle;
