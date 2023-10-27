import classNames from 'classnames/bind';
import styles from './style.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Section_2() {
    const url = process.env.REACT_APP_DOMAIN__URL;

    function Text({ title }: any) {
        return (
            <div className={cx('text')}>
                <h3>{title}</h3>
                <button className="button__global">Tìm hiểu</button>
            </div>
        );
    }

    return (
        <section className={cx('section__2')}>
            <div className={cx('container')}>
                <div className={cx('row')}>
                    <div className={cx('container__left')}>
                        <div className={cx('container__item')}>
                            <Link to={'/collections/all'}>
                                <picture>
                                    <source
                                        media={'max-width: 480px'}
                                        srcSet={`${url}/pages/home/section_2/module_banner1_480.webp`}
                                    />
                                    <img src={`${url}/pages/home/section_2/module_banner1.webp`} alt="section 2" />
                                </picture>
                                <Text title={'Coffee hương vị mới'} />
                            </Link>
                        </div>
                    </div>
                    <div className={cx('container__right')}>
                        <div className={cx('container__item', 'top')}>
                            <Link to={'/collections/all'}>
                                <picture>
                                    <source
                                        media={'max-width: 480px'}
                                        srcSet={`${url}/pages/home/section_2/module_banner2_480.webp`}
                                    />
                                    <img src={`${url}/pages/home/section_2/module_banner2.webp`} alt="section 2" />
                                </picture>
                                <Text title={'Thứ 6 này 25% ưu đãi'} />
                            </Link>
                        </div>
                        <div className={cx('container__item')}>
                            <Link to={'/collections/all'}>
                                <picture>
                                    <source
                                        media={'max-width: 480px'}
                                        srcSet={`${url}/pages/home/section_2/module_banner3_480.webp`}
                                    />
                                    <img src={`${url}/pages/home/section_2/module_banner3.webp`} alt="section 2" />
                                </picture>
                                <Text title={'Tuyệt vời món mới'} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Section_2;
