import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Carousel from '@/components/carousel';
import ProductCard from '@/components/product_card';
import home__section4_styles from '../../../home/components/section_4/styles.module.scss';
import { CallApi } from '@/method/until';
import { ProductType } from '@/type';

const stylesHomeSection4 = classNames.bind(home__section4_styles);

interface Props {
    category_id: number;
    limit: number;
}

function RelatedProduct({ category_id, limit }: Props) {
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [products, setProducts] = useState<ProductType[]>([] as ProductType[]);

    useEffect(() => {
        if (!category_id) return;

        const url = `${domain_url}/product/get-related-product?category_id=${category_id}&limit=${limit}`;
        const method = 'GET';
        const headers = {
            'Content-type': 'Application/json',
        };

        CallApi(url, method, headers)
            .then((result: ProductType[]) => {
                if (result) setProducts(result);
            })
            .catch((error: Error) => console.log(error));
    }, [domain_url, category_id, limit]);

    return (
        <section className={stylesHomeSection4('section__4')}>
            <hr
                style={{
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    margin: '0 auto 20px auto',
                    maxWidth: 1140,
                }}
            />
            <div className="container">
                <div className={stylesHomeSection4('container__title')}>
                    <div>
                        <Link to={'san-pham-moi'}>
                            <h1>Sản phẩm liên quan</h1>
                        </Link>
                        <p>Bạn có thể tham khảo thêm 1 số sản phẩm tương tự ở bên dưới</p>
                    </div>
                </div>
                <Carousel extraWidth={14.25}>
                    <ul id="ul" className={stylesHomeSection4('content')}>
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

export default RelatedProduct;
