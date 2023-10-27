import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPhone, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import DatePicker from 'react-datepicker';
import { subDays, addDays } from 'date-fns';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { CallApi, FormatDateDb } from '@/method/until';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

interface bookType {
    full_name: string;
    phone: string;
    date: string;
    time: string;
    note: string;
}

interface notifyType {
    msg: string;
    type: string;
}

function BookPages() {
    const breadcrumb = {
        title: 'Đặt bàn',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/dat-ban', name: 'Đặt bàn' },
        ],
    };

    const [isShowNotify, setIsShowNotify] = useState(false);
    const [notify, setNotify] = useState<notifyType>({} as notifyType);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [isValidate, setIsValidate] = useState(false);
    const [book, setBook] = useState<bookType>({
        full_name: '',
        phone: '',
        date: '',
        time: '',
        note: '',
    } as bookType);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Đặt bàn halucafe';
        setTimeout(() => {
            setIsLoaded(true);
        }, 500);
    }, []);

    useEffect(() => {
        if (startDate)
            setBook((prev: bookType) => {
                return { ...prev, date: FormatDateDb(startDate.toString()) };
            });
    }, [startDate]);

    useEffect(() => {
        if (
            book.date.replace(/\s/g, '').length > 0 &&
            book.full_name.replace(/\s/g, '').length > 0 &&
            book.note.replace(/\s/g, '').length > 0 &&
            book.phone.replace(/\s/g, '').length >= 10 &&
            book.time.replace(/\s/g, '').length > 0
        ) {
            setIsValidate(true);
        } else {
            setIsValidate(false);
        }
    }, [book]);

    function KeyEnterPress(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        BookTable();
    }

    function KeyEnterPhone(e: React.KeyboardEvent<HTMLInputElement>) {
        if (isNaN(parseInt(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab') e.preventDefault();

        if (e.key !== 'Enter') return;
        BookTable();
    }

    function ChangeValue(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setBook({ ...book, [e.target.name]: e.target.value });
    }

    async function BookTable() {
        if (!isValidate) return;

        try {
            const header = {
                'Content-Type': 'application/json',
            };

            const body = book;

            const res = await CallApi(`${process.env.REACT_APP_DOMAIN_URL_BE}/table/book-table`, 'post', header, body);

            if (res) {
                setNotify({ msg: 'Bạn đã gửi liên hệ thành công', type: 'success' });
                setBook({ full_name: '', phone: '', date: '', time: '', note: '' });
                setStartDate(null);
            } else {
                setNotify({ msg: 'Bạn đã gửi liên hệ không thành công', type: 'error' });
            }

            setIsShowNotify(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={cx('contact__page')}>
            {isLoaded ? <></> : <LoadedComp />}
            <div className="container space-b40">
                <section className={cx('breadcrumb')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>
                <section>
                    <div className="row">
                        <div className={cx('wrap')}>
                            <div className={cx('left')}>
                                <div className={cx('box__left')}>
                                    <div className={cx('box__left-top')}>
                                        <h1 className="font-size24 space-b10">Giờ mở cửa</h1>
                                        <div className="space-b15">
                                            <h2>Thứ 2 - Thứ 6 hàng tuần</h2>
                                            <p>7h sáng - 11h sáng</p>
                                            <p>11h sáng - 10h tối</p>
                                        </div>
                                        <div className="space-b15">
                                            <h2>Thứ 7, Chủ nhật hàng tuần</h2>
                                            <p>8h sáng - 1h chiều</p>
                                            <p>1h chiều - 9h tối</p>
                                        </div>
                                    </div>

                                    <div className="space-t12">
                                        <h1 className={cx('font-size24', 'space-b10')}>Số điện thoại</h1>
                                        <Link to={'tel:0902068068'} className={cx('phone')}>
                                            <p className={cx('font-size24', 'font-weight700')}>0929132671</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('box__right')}>
                                    <h1 className="font-size24 text-center space-b20" style={{ color: '#d1d1d1' }}>
                                        Gọi ngay cho chúng tôi để đặt bàn
                                    </h1>

                                    <div className="flex__wrap">
                                        {isShowNotify && (
                                            <div className={cx('notify_item_wrap', 'width-100', 'space-b20')}>
                                                <p
                                                    className={cx(
                                                        'notify_item',
                                                        notify.type !== 'error' ? 'notify_sucess' : 'notify_error',
                                                    )}
                                                >
                                                    {notify.msg}
                                                </p>
                                                <div className={cx('icon')} onClick={() => setIsShowNotify(false)}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </div>
                                            </div>
                                        )}

                                        <div className={cx('box__right-item')}>
                                            <div className={cx('icon')}>
                                                <FontAwesomeIcon icon={faUser} />
                                            </div>
                                            <input
                                                placeholder="Họ tên*"
                                                name="full_name"
                                                value={book.full_name}
                                                onChange={(e) => ChangeValue(e)}
                                                onKeyDown={KeyEnterPress}
                                            />
                                        </div>
                                        <div className={cx('box__right-item')}>
                                            <div className={cx('icon')}>
                                                <FontAwesomeIcon icon={faPhone} />
                                            </div>
                                            <input
                                                placeholder="Điện thoại*"
                                                name="phone"
                                                value={book.phone}
                                                maxLength={10}
                                                onChange={(e) => ChangeValue(e)}
                                                onKeyDown={KeyEnterPhone}
                                            />
                                        </div>
                                        <div className={cx('box__right-item')}>
                                            <div className={cx('icon')}>
                                                <FontAwesomeIcon icon={faCalendarDays} />
                                            </div>
                                            <DatePicker
                                                placeholderText="Ngày*"
                                                selected={startDate}
                                                dateFormat="dd/MM/yyyy"
                                                todayButton="Today"
                                                showYearDropdown
                                                showMonthDropdown
                                                scrollableYearDropdown
                                                scrollableMonthYearDropdown
                                                includeDateIntervals={[
                                                    { start: subDays(new Date(), 1), end: addDays(new Date(), 5) },
                                                ]}
                                                onChange={(date) => {
                                                    if (date) {
                                                        setStartDate(date);
                                                    }
                                                }}
                                                name="date"
                                            />
                                        </div>
                                        <div className={cx('box__right-item')}>
                                            <div className={cx('icon')}>
                                                <FontAwesomeIcon icon={faClock} />
                                            </div>
                                            <select
                                                name="time"
                                                onChange={(e) => ChangeValue(e)}
                                                value={book.time === '' ? 'Giờ' : book.time}
                                            >
                                                <option>Giờ</option>
                                                <option value="00:00:00">0 AM</option>
                                                <option value="01:00:00">1.00 AM</option>
                                                <option value="02:00:00">2.00 AM</option>
                                                <option value="03:00:00">3.00 AM</option>
                                                <option value="04:00:00">4.00 AM</option>
                                                <option value="05:00:00">5.00 AM</option>
                                                <option value="06:00:00">6.00 AM</option>
                                                <option value="07:00:00">7.00 AM</option>
                                                <option value="08:00:00">8.00 AM</option>
                                                <option value="09:00:00">9.00 AM</option>
                                                <option value="10:00:00">10.00 AM</option>
                                                <option value="11:00:00">11.00 AM</option>
                                                <option value="12:00:00">12.00 AM</option>
                                                <option value="13:00:00">1.00 PM</option>
                                                <option value="14:00:00">2.00 PM</option>
                                                <option value="15:00:00">3.00 PM</option>
                                                <option value="16:00:00">4.00 PM</option>
                                                <option value="17:00:00">5.00 PM</option>
                                                <option value="18:00:00">6.00 PM</option>
                                                <option value="19:00:00">7.00 PM</option>
                                                <option value="20:00:00">8.00 PM</option>
                                                <option value="21:00:00">9.00 PM</option>
                                                <option value="22:00:00">10.00 PM</option>
                                                <option value="23:00:00">11.00 PM</option>
                                            </select>
                                        </div>
                                        <div className={cx('box__right-item', 'width-100')}>
                                            <textarea
                                                placeholder="Nhập nội dung"
                                                rows={6}
                                                name="note"
                                                value={book.note}
                                                onChange={(e) => ChangeValue(e)}
                                                onKeyDown={KeyEnterPress}
                                            />
                                        </div>
                                    </div>
                                    <div className="width-100 text-center">
                                        <button
                                            className={cx('default', 'btn')}
                                            disabled={!isValidate}
                                            onClick={BookTable}
                                        >
                                            Đặt bàn ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default BookPages;
