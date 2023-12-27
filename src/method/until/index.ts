import { Buffer } from 'buffer';
import { RefreshToken } from '../auth';

function CreateFillterOb(ob: any, types: any, tradeMark: any) {
    const obFillter = { ...ob };
    const arr = [...obFillter.listItem];

    arr[1] = {
        title: 'Loại',
        item__selection: [...types],
    };
    arr[2] = {
        title: 'Thương hiệu',
        item__selection: [...tradeMark],
    };

    obFillter.listItem = [...arr];

    return obFillter;
}

function FormatPrice(price: number) {
    let str = '';

    while (price > 1000) {
        const du = price % 1000;

        if (du > 100) str = `.${du}` + str;
        else if (du > 10 && du < 100) str = `.${du}0` + str;
        else if (du > 0 && du < 10) str += `.0${du}` + str;
        else str = `.000` + str;

        price = Math.floor(price / 1000);
    }

    str = price + str;
    return str;
}

function FormmatDate(dateStr: string) {
    const date = new Date(dateStr);

    return [
        date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        date.getFullYear(),
    ].join('/');
}

function FormatDateDb(dateStr: string) {
    const date = new Date(dateStr);

    return [
        date.getFullYear(),
        date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
    ].join('/');
}

function FormatTime(dateStr: string) {
    const date = new Date(dateStr);

    return [
        date.getHours() < 9 ? '0' + date.getHours() : date.getHours(),
        date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes(),
        date.getSeconds() < 9 ? '0' + date.getSeconds() : date.getSeconds(),
    ].join(':');
}

function GetCookie(cookieName: string) {
    try {
        const cookies = document.cookie.split(';');
        const cookie = cookies.filter((item) => item.includes(`${cookieName}=`));
        return cookie[0].split('=')[1];
    } catch (error) {
        return null;
    }
}

function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';';
}

function deleteCookie(cookieName: string, path?: string) {
    if (path) {
        document.cookie = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    } else {
        document.cookie = `${cookieName}=; Path='/'; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
}

function encodedString(encodeString: string) {
    return Buffer.from(encodeString).toString('base64');
}

function decodeString(decodeString: string) {
    return Buffer.from(decodeString, 'base64').toString('binary');
}

async function CallApi(url: string, method: string, headers?: any, body?: any): Promise<any> {
    try {
        const res = await fetch(url, {
            method: `${method}`,
            headers: headers,
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.status === 400 || res.status === 500 || res.status === 204 || res.status === 401) {
            console.log(data.msg);
            return null;
        }

        if (res.status === 403) {
            return await RefreshToken(url, method, headers, body);
        }

        if (res.status === 201 || res.status === 200) return data;

        return null;
    } catch (e: any) {
        console.log(e);
        return null;
    }
}

function createRandomStr(limit: number) {
    var text = '';
    var char_list = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < limit; i++) {
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
}

async function ChangeDistricts(code: number) {
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
        const data = await res.json();

        return data.districts;
    } catch (error) {
        console.log(error);
    }
}

async function ChangeWraps(code: number) {
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
        const data = await res.json();

        return data.wards;
    } catch (error) {
        console.log(error);
    }
}

function validateEmail(email: string) {
    const regexp =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    return regexp.test(email);
}

export {
    FormatPrice,
    GetCookie,
    encodedString,
    decodeString,
    deleteCookie,
    FormmatDate,
    CallApi,
    CreateFillterOb,
    createRandomStr,
    setCookie,
    ChangeDistricts,
    ChangeWraps,
    FormatTime,
    FormatDateDb,
    validateEmail,
};
