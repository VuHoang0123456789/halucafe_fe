import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { FormatPrice } from '@/method/until';
import { ProductType } from '@/type';

const cx = classNames.bind(styles);

interface props {
    products: ProductType[];
}

function Section_3({ products }: props) {
    return (
        <section className={cx('section__3')}>
            <div className={cx('section__3-bg')}>
                <div className={cx('container')}>
                    <div className={cx('container__item-top')}>
                        <h1>Khám phá menu</h1>
                        <p>Có gì đặc biệt ở đây</p>
                    </div>
                    <div className={cx('container__item-bottom')}>
                        <ul>
                            {products.map((item, index) => {
                                return (
                                    <li className={cx('product')} key={index}>
                                        <div className={cx('product__thumbnail')}>
                                            <Link to={`/${item.slug}`}>
                                                <picture>
                                                    <source
                                                        media={'max-width: 480px'}
                                                        srcSet={item.url_images_small[0]}
                                                    />
                                                    <img src={item.url_images_small[0]} alt="section 3" />
                                                </picture>
                                            </Link>
                                        </div>
                                        <div className={cx('product__info')}>
                                            <div className={cx('product__info-wrap')}>
                                                <h3 className={cx('name')}>
                                                    <Link to={`/${item.slug}`}>{item.product_name}</Link>
                                                </h3>

                                                <span className={cx('price')}>{FormatPrice(item.price)}₫</span>
                                            </div>
                                            <div className={cx('product__info-description')}>
                                                <p>{item.description}</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Link to={'/collections/all'}>
                            <button className="button__global"> Xem thêm menu</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Section_3;
