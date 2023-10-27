import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TooltipCustomed from '@/components/tooltip';
import { faTwitter, faFacebookF, faPinterest, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('site-footer')}>
                <div className={cx('container')}>
                    <div className={cx('footer__logo')}>
                        <Link to={'/home'}>
                            <img src={`${process.env.REACT_APP_DOMAIN__URL_FE}/logo192.png`} alt="logo" />
                        </Link>
                    </div>
                    <div className={cx('footer__inner')}>
                        <div className={cx('footer__inner-wrap')}>
                            <div className={cx('footer__inner-column', 'footer__inner-col-1')}>
                                <h1>Kết nối với chúng tôi</h1>
                                <div style={{ marginBottom: '15px' }}>
                                    <p>
                                        Chúng tôi mong muốn tạo nên hương vị thức uống tuyệt vời nhất. Là điểm đến đầu
                                        tiên dành cho bạn khi muốn thưởng thức trọn vẹn của tách Coffee
                                    </p>
                                </div>
                                <div className={cx('list_share')}>
                                    <ul>
                                        <li>
                                            <TooltipCustomed title="Twitter">
                                                <Link to={'/home'}>
                                                    <FontAwesomeIcon icon={faTwitter} />
                                                </Link>
                                            </TooltipCustomed>
                                        </li>
                                        <li>
                                            <TooltipCustomed title="Facebook">
                                                <Link to={'/home'}>
                                                    <FontAwesomeIcon icon={faFacebookF} />
                                                </Link>
                                            </TooltipCustomed>
                                        </li>
                                        <li>
                                            <TooltipCustomed title="Pinterest">
                                                <Link to={'/home'}>
                                                    <FontAwesomeIcon icon={faPinterest} />
                                                </Link>
                                            </TooltipCustomed>
                                        </li>
                                        <li>
                                            <TooltipCustomed title="Instagram">
                                                <Link to={'/home'}>
                                                    <FontAwesomeIcon icon={faInstagram} />
                                                </Link>
                                            </TooltipCustomed>
                                        </li>
                                        <li>
                                            <TooltipCustomed title="youtube">
                                                <Link to={'/home'}>
                                                    <FontAwesomeIcon icon={faYoutube} />
                                                </Link>
                                            </TooltipCustomed>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={cx('footer__inner-column', 'footer__inner-col-2')}>
                                <h1>Hệ thống cửa hàng</h1>
                                <div>
                                    <div style={{ marginBottom: '5px', display: 'flex' }}>
                                        <div className={cx('icon__location')}>
                                            <FontAwesomeIcon icon={faLocationDot} />
                                        </div>
                                        <p>Coffe Halu</p>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <p>
                                            Địa chỉ: Ladeco Building, 36 Giang Bien Street, Vinh Bao District, Hai Phong
                                        </p>
                                    </div>
                                    <div style={{ marginBottom: '5px', display: 'flex' }}>
                                        <p style={{ marginRight: '5px' }}>Hotline:</p>
                                        <Link to={'tel:0929132671'} title="0929132671">
                                            <p className={cx('hostline')}>0929132671</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('footer__inner-column', 'footer__inner-col-3')}>
                                <h1>Chính sách</h1>
                                <nav className={cx('nav__footer')}>
                                    <ul>
                                        <li>
                                            <Link to={'/trang-chu'}>Trang chủ</Link>
                                        </li>
                                        <li>
                                            <Link to={'/gioi-thieu'}>Giới thiệu</Link>
                                        </li>
                                        <li>
                                            <Link to={'/collections/all'}>Sản phẩm</Link>
                                        </li>
                                        <li>
                                            <Link to={'/tin-tuc'}>Tin tức</Link>
                                        </li>
                                        <li>
                                            <Link to={'/lien-he'}>Liên hệ</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className={cx('footer__inner-column', 'footer__inner-col-2')}>
                                <h1>Liên hệ</h1>
                                <div>
                                    <p>
                                        Thứ 2 - Thứ 6: 6am - 9pm <br />
                                        Thứ Bảy - Chủ Nhật: 6am - 10pm <br />
                                        Mở cửa toàn bộ các ngày trong năm( Chỉ đóng cửa vào ngày lễ).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('row__bottom')}>
                        <span>© Bản quyền thuộc về halucafe</span>
                        <span style={{ padding: '0 5px' }}>|</span>
                        <span>Cung cấp bởi </span>
                        <Link to={'/sapo'}>Sapo</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
