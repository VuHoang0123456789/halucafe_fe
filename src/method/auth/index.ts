import { CallApi, GetCookie, deleteCookie } from '../until';

const doumain_url = process.env.REACT_APP_DOMAIN_URL_BE;

function LogOut() {
    if (GetCookie('_typeLogin')) {
        deleteCookie('_typeLogin', '/account');
        deleteCookie('_user', '/');
        deleteCookie('_token', '/');
    } else {
        deleteCookie('_user', '/');
        deleteCookie('_token', '/');
    }
    window.location.replace('/account/login');
}

async function Login(email: string, passWord: string) {
    try {
        const res = await fetch(`${doumain_url}/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                passWord: passWord,
            }),
        });

        if (res.status === 200) window.location.replace('/account');

        if (res.status === 400 || res.status === 500) {
            const data = await res.json();
            alert(data.msg);
        }
    } catch (error) {
        console.log(`Error in authmethod/Login: ${error}`);
    }
}

async function GetPassWord(email: string) {
    try {
        const res = await fetch(`${doumain_url}/account/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                access_token: GetCookie('_user') || '',
            },
            body: JSON.stringify({ email: email }),
        });

        if (res.status === 400 || res.status === 500) {
            const data = await res.json();

            return {
                type: 'cancel',
                content: data.msg,
            };
        }

        return {
            type: 'success',
            content: (await res.json()).msg,
        };
    } catch (error) {
        console.log(`Error in authmethod/GetPassWord: ${error}`);
    }
}

async function RegisterFunc(email: string, password: string, firstName: string, lastName: string) {
    try {
        const url = `${doumain_url}/account/register`;
        const method = 'POST';
        const headers = {
            'Content-type': 'Application/json',
        };
        const body = {
            email: email,
            passWord: password,
            showName: `${firstName} ${lastName}`,
        };
        const result = await CallApi(url, method, headers, body);
        if (result) {
            Login(email, password);
        }
    } catch (error) {
        console.log(`Error in authmethod/Register: ${error}`);
    }
}

async function RefreshToken(url: string, method: string, headers?: any, body?: any): Promise<any> {
    try {
        const refreshToken = GetCookie('_token') || '';
        const doumain_url = process.env.REACT_APP_DOMAIN_URL_BE;

        const res = await fetch(`${doumain_url}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: GetCookie('_user') || '',
                refresh_token: refreshToken,
            }),
        });
        const data = await res.json();

        if (res.status === 400 || res.status === 500) {
            console.log(data.msg);
            return null;
        }

        if (res.status === 200) {
            console.log('Làm mới token thành công');
            const access_token = GetCookie('_user') || '';

            headers = {
                ...headers,
                access_token,
            };
            return await CallApi(url, method, headers, body);
        }

        return null;
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

export { LogOut, Login, GetPassWord, RefreshToken, RegisterFunc };
