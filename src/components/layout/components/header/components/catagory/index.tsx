import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import ImageCard from '@/components/image__card';
import { useEffect, useState } from 'react';
import { CallApi } from '@/method/until';
import { ProductType } from '@/type';

type CategoryType = {
    category_id: 1;
    category_name: string;
    slug: string;
};

type TypicalProductsType = {
    categorys: CategoryType;
    product: ProductType[];
};

const cx = classNames.bind(styles);

function Category() {
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [TypicalProducts, setTypicalProducts] = useState([] as TypicalProductsType[]);

    useEffect(() => {
        const str = `'Coffee', 'Nước ép', 'Trà Sữa', 'Cocktail'`;
        const method = 'GET';
        const url = `${domain_url}/product/load-typical-products?category_names=${str}`;

        CallApi(url, method)
            .then((result: TypicalProductsType[]) => {
                if (result) setTypicalProducts(result);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [domain_url]);

    return (
        <div className={cx('wrapper')} id="category">
            <div className={cx('category')}>
                <ul>
                    {TypicalProducts.map((item, index) => (
                        <li className={cx('flex_one', 'category__item')} key={index}>
                            <Link to={`/collections/${item.categorys.slug}`}>
                                <h2>{item.categorys.category_name}</h2>
                            </Link>
                            <ul>
                                {item.product.map((value, itemIndex) => (
                                    <Link to={`/${value.slug}`} key={itemIndex}>
                                        <li>{value.product_name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={cx('images')}>
                <div className={cx('flex_one', 'image')}>
                    <ImageCard>
                        <img
                            src="https://bizweb.dktcdn.net/100/351/580/themes/714586/assets/mega-menu-images1.png?1676704948776"
                            alt="anh 1"
                        />
                    </ImageCard>
                </div>
                <div className={cx('flex_one', 'image')}>
                    <ImageCard>
                        <img
                            src="https://bizweb.dktcdn.net/100/351/580/themes/714586/assets/mega-menu-images2.png?1676704948776"
                            alt="anh 2"
                        />
                    </ImageCard>
                </div>
            </div>
        </div>
    );
}
export default Category;
