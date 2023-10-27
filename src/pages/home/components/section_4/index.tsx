import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import Carousel from '@/components/carousel';
import ProductCard from '@/components/product_card';
import { ProductType } from '@/type';

const cx = classNames.bind(styles);

interface props {
    products: ProductType[];
}

function Section_4({ products }: props) {
    return (
        <section className={cx('section__4')}>
            <div className="container">
                <div className={cx('container__title')}>
                    <div>
                        <Link to={'/coffee'}>
                            <h1>Cooffee là hương vị của bạn</h1>
                        </Link>
                        <p>Có gì bất ngờ tại đây</p>
                    </div>
                </div>

                <Carousel extraWidth={14.25}>
                    <ul id="ul" className={cx('content')}>
                        {products.map((item, index) => {
                            return (
                                <li key={index}>
                                    <ProductCard item={item} />
                                </li>
                            );
                        })}
                    </ul>
                </Carousel>
            </div>
        </section>
    );
}

export default Section_4;
