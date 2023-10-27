import { Section1, Section2, Section3, Section4, Section5, Section6, Section7, Section8 } from './components';
import classNames from 'classnames/bind';
import Styles from './styles.module.scss';
import FormProduct from '@/components/form__product';
import FormCart from '@/components/form__cart';
import LoadedComp from '@/components/loaded';
import { useEffect, useState } from 'react';
import { ProductType } from '@/type';
import { CallApi } from '@/method/until';

const cx = classNames.bind(Styles);

function HomePage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [products, setProducts] = useState<ProductType[]>([] as ProductType[]);
    const [productList, setProductList] = useState<ProductType[]>([] as ProductType[]);

    useEffect(() => {
        document.title = 'halucafe';
    }, []);

    useEffect(() => {
        let method = 'POST';
        let headers = {
            'Content-type': 'Application/json',
        };
        let url = `${domain_url}/product/get-load-home/Coffee?limit=5`;
        let body = {
            productNames: ['Vietnamese coffee', 'Hazelnut ice blended', 'Americano', 'Chai latte', 'Americano'],
        };

        //Lấy dữ liệu cho section 4
        CallApi(url, method, headers, body)
            .then((result: ProductType[]) => {
                if (result) setProducts(result);
            })
            .catch((error: Error) => console.log(error));

        //Lấy dữ liệu cho section 3
        method = 'POST';
        headers = {
            'Content-type': 'Application/json',
        };
        body = {
            productNames: [
                'Cafe ice latte',
                'Cafe expresso',
                'Cafe americano',
                'Cafe mocha',
                'Cafe capuchino',
                'Cafe latte',
            ],
        };
        url = `${domain_url}/product/get-load-home/Coffee?limit=6`;

        CallApi(url, method, headers, body)
            .then((result: ProductType[]) => {
                if (result) setProductList(result);
            })
            .catch((error: Error) => console.log(error));

        setTimeout(() => {
            setIsLoaded(true);
        }, 1800);
    }, [domain_url, setIsLoaded]);

    return (
        <div className={cx('home__container')}>
            {!isLoaded ? <LoadedComp /> : <></>}
            <FormCart />
            <FormProduct />
            <Section1 />
            <Section2 />
            <Section3 products={productList} />
            <Section4 products={products} />
            <Section5 />
            <Section6 />
            <Section7 />
            <Section8 />
        </div>
    );
}
export default HomePage;
