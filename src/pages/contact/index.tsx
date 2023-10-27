import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import LoadedComp from '@/components/loaded';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import MessageComp from '@/components/message';

const cx = classNames.bind(styles);

type dataType = {
    full_name: string;
    email: string;
    phone: string;
    content: string;
};

interface messages {
    id?: number;
    content: string;
    type: string;
}

function ContactPages() {
    const breadcrumb = {
        title: 'Liên hệ',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/lien-he', name: 'Liên hệ' },
        ],
    };
    const [isLoaded, setIsLoaded] = useState(false);
    const [data_body, setDataBody] = useState<dataType>({ full_name: '', email: '', phone: '', content: '' });
    const [message, setMessage] = useState<messages>({} as messages);
    const [isDisabledButton, setIsDisabledButton] = useState(true);

    useEffect(() => {
        document.title = 'Liên hệ halucafe';
        setTimeout(() => {
            setIsLoaded(true);
        }, 1500);
    }, []);

    useEffect(() => {
        if (
            data_body.phone.replace(' ', '').length >= 10 &&
            data_body.email.replace(' ', '').length > 0 &&
            validateEmail(data_body.email) &&
            data_body.full_name.replace(' ', '').length > 0 &&
            data_body.content.replace(' ', '').length > 0
        )
            setIsDisabledButton(false);
        else setIsDisabledButton(true);
    }, [data_body]);

    function SendContact() {
        if (isDisabledButton) return;

        setMessage({ content: 'Đã gửi thư thành công cho cửa hàng', type: 'success' });
    }

    function KeyPressEnter(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const element = e.target as HTMLElement;

        if (element.getAttribute('name') === 'phone') ValidatePhone(e);

        if (e.key !== 'Enter') return;

        if (element.nodeName === 'TEXTAREA') e.preventDefault();

        SendContact();
    }

    function ValidatePhone(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (isNaN(parseInt(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'Enter') e.preventDefault();
    }

    function validateEmail(email: string) {
        const regexp =
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

        return regexp.test(email);
    }

    function ChangeValue(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const inputElement = e.target;

        setDataBody({ ...data_body, [inputElement.name]: inputElement.value });
    }

    return (
        <div className={cx('contact__page')}>
            {isLoaded ? <></> : <LoadedComp />}
            {message.type ? <MessageComp message={message} /> : <></>}
            <div className="container">
                <section className={cx('breadcrumb')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>
                <section className={cx('map')}>
                    <div className="row">
                        <div className={cx('wrap__map')}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29848.32069352149!2d106.48575754288314!3d20.749169255600535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31358a236932559b%3A0xde740fe0cd7f9bcf!2zR2lhbmcgQmnDqm4sIFbEqW5oIELhuqNvLCBI4bqjaSBQaMOybmcsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1697206136264!5m2!1svi!2s"
                                width="600"
                                height="450"
                                style={{ border: '0' }}
                                allowFullScreen
                                loading="lazy"
                                title="google map"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="row">
                        <div className="flex">
                            <div className={cx('store__infomation')}>
                                <h3 className={cx('title')}>Liên hệ</h3>
                                <div className={cx('info')}>
                                    <p className={cx('info__text')}>
                                        Địa chỉ: Ladeco Building, 266 Doi Can Street, Ba Dinh District, Ha Noi
                                    </p>
                                    <p className={cx('info__text')}>
                                        Điện thoại: <Link to={'tel:19006750'}>0929132671</Link>
                                    </p>
                                    <p className={cx('info__text')}>
                                        Email:{' '}
                                        <Link to={'mailto:vuhuyhoang1206@gmail.com'}>vuhuyhoang1206@gmail.com</Link>
                                    </p>
                                </div>
                            </div>
                            <div className={cx('form__contact')}>
                                <div className="flex space-b8 ">
                                    <input
                                        placeholder="Họ tên *"
                                        name="full_name"
                                        className="width-50 space-r15 min__height"
                                        value={data_body.full_name}
                                        onChange={(e) => ChangeValue(e)}
                                        onKeyDown={KeyPressEnter}
                                        maxLength={200}
                                    />
                                    <input
                                        placeholder="Email * "
                                        type="email"
                                        name="email"
                                        className="width-50 space-l5 min__height"
                                        value={data_body.email}
                                        onChange={(e) => ChangeValue(e)}
                                        onKeyDown={KeyPressEnter}
                                        maxLength={100}
                                    />
                                </div>
                                <div className="space-b8 ">
                                    <input
                                        placeholder="Số điện thoại *"
                                        className="width-100 min__height"
                                        name="phone"
                                        value={data_body.phone}
                                        onChange={(e) => ChangeValue(e)}
                                        onKeyDown={KeyPressEnter}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="space-b8" style={{ lineHeight: '0' }}>
                                    <textarea
                                        placeholder="Nhập nội dung *"
                                        name="content"
                                        value={data_body.content}
                                        onChange={(e) => ChangeValue(e)}
                                        maxLength={2000}
                                        onKeyDown={KeyPressEnter}
                                    />
                                </div>

                                <button
                                    className="default"
                                    style={{
                                        padding: '0 40px',
                                        fontSize: '14px',
                                        textTransform: 'none',
                                    }}
                                    onClick={SendContact}
                                    disabled={isDisabledButton}
                                >
                                    Gửi liên hệ
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ContactPages;
