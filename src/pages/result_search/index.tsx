import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CallApi } from '@/method/until';
import { ProductType } from '@/type';
import ProductCard from '@/components/product_card';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

function ResultSearch() {
    const [queryValue] = useSearchParams();
    const breadcrumb = {
        title: `${queryValue.get('query')} - tìm kiếm`,
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: `/seach/${queryValue.get('query')}`, name: `Trang tìm kiếm` },
        ],
    };
    const doumain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [products, setProducts] = useState<ProductType[]>([] as ProductType[]);

    useEffect(() => {
        document.title = `${queryValue.get('query')} - Tìm kiếm halucafe`;
    }, [queryValue]);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
        };

        CallApi(`${doumain_url}/product/search/${queryValue.get('query')}`, 'get', headers)
            .then((res: ProductType[]) => {
                if (res) setProducts(res);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [doumain_url, queryValue]);

    return products.length > 0 ? (
        <div className={cx('result_search-page')}>
            <div className="container">
                <section className={cx('breadcrumb', 'space-b30')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>
                <div className="row">
                    <section>
                        <p className={cx('pad-0-15', 'space-b10')}>Có {products.length} kết quả tìm kiếm phù hợp</p>
                        <ul className="flex__wrap">
                            {products.map((item, index) => (
                                <li key={index} className={cx('width-25', 'pad-0-15')}>
                                    <ProductCard item={item} />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    ) : (
        <LoadedComp />
    );
}

export default ResultSearch;
