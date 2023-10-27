import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import { CallApi } from '@/method/until';
import { useDispatch } from 'react-redux';
import { ProductType, ProductsType } from '@/type';
import { changeColectionState } from '@/reduce/slice/colectionCategorySlice';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

function Introduce() {
    const dispath = useDispatch();
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [isLoaded, setIsLoaded] = useState(false);
    const [Products, setProducts] = useState<ProductsType>({} as ProductsType);

    const Banners = [`${process.env.REACT_APP_DOMAIN__URL}/pages/introduce/sitebar/aside_banner.png`];
    const breadcrumb = {
        title: 'Giới thiệu',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/gioi-thieu', name: 'Giới thiệu' },
        ],
    };

    useEffect(() => {
        document.title = 'Giới thiệu halucafe';
    }, []);

    useEffect(() => {
        let method = 'GET';
        let url = `${domain_url}/product/get-hot-products?limit=5`;
        let headers = {
            'Content-type': 'Application/json',
        };

        CallApi(url, method, headers)
            .then((result: ProductType[]) => {
                if (result) {
                    setProducts({ title: 'Sản phẩm hot', list: result });
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });

        method = 'GET';
        url = `${domain_url}/product/get-colection-category`;
        headers = {
            'Content-type': 'Application/json',
        };

        CallApi(url, method, headers)
            .then((result: any) => {
                if (result) {
                    result.forEach((item: any) => {
                        item.slug = 'collections/' + item.slug;
                    });

                    dispath(changeColectionState({ title: 'Danh mục', list: result }));
                    setIsLoaded(true);
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [domain_url, dispath]);

    return (
        <div className={cx('introduce__container')}>
            {isLoaded ? <></> : <LoadedComp />}
            <Layout Banners={Banners} breadcrumb={breadcrumb} Products={Products}>
                <h3 className={cx('content__title')}>Giới thiệu</h3>
                <p style={{ fontWeight: '500', lineHeight: 1.7 }}>Nội dung trang giới thiệu</p>
            </Layout>
        </div>
    );
}

export default Introduce;
