import Breadcrumb from '@/components/breadcrumb';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { FormatPrice } from '@/method/until';
import CountUpDown from '@/components/button/count_up_down';
import { useEffect, useState } from 'react';
import Tab from './component/tab';
import RelatedProduct from './component/related_prodcuts';
import ListShare from '@/components/button/list__share';
import ToppingComp from './component/topping';
import { CallApi } from '@/method/until';
import { useLocation, useNavigate } from 'react-router-dom';
import FormCart from '@/components/form__cart';
import { useDispatch } from 'react-redux';
import { createNewCartItem } from '@/reduce/slice/newCartItemSlice';
import { toppingType, productInfoType } from '@/type';
import LoadedComp from '@/components/loaded';

const cx = classNames.bind(styles);

function Product_Info() {
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [productInfo, setProductInfo] = useState<productInfoType>({} as productInfoType);
    const [toppingSelected, setToppingSelected] = useState<toppingType>({} as toppingType);
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(1);
    const dispath = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const [breadcrumb, setBreadcrumb] = useState({
        title: '',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '', name: '' },
            { link: '', name: '' },
        ],
    });

    const slug = useLocation().pathname.replace('/', '');

    useEffect(() => {
        document.title = `${productInfo.product?.product_name} halucafe`;
    }, [productInfo]);

    useEffect(() => {
        const url = `${domain_url}/product/get-product/${slug}`;
        const method = 'GET';

        CallApi(url, method)
            .then((result: any) => {
                if (result) {
                    setBreadcrumb((prev) => {
                        const ob = { ...prev };

                        ob.listItem.pop();
                        ob.listItem.pop();

                        ob.listItem.push({
                            link: `/collections/${result.product?.category_slug}`,
                            name: `${result.product?.category_name}`,
                        });

                        ob.listItem.push({
                            link: `/${result.product?.slug}`,
                            name: `${result.product?.product_name}`,
                        });

                        return ob;
                    });
                    setProductInfo(result);
                    setIsLoaded(true);
                } else {
                    return navigate('/404');
                }
            })
            .catch((error: Error) => console.log(error));

        document.documentElement.scrollTop = 0;
    }, [domain_url, slug, navigate]);

    function calculatePrice(newPrice?: boolean) {
        let price = productInfo.product?.price;

        if (productInfo.product?.sale_status && newPrice)
            price = ((price * (100 - productInfo.product?.sale_percent)) / 100) * count;

        if (toppingSelected.price) price = price * count + toppingSelected?.price * 1;

        return price;
    }

    function Order() {
        const product = { ...productInfo.product };
        product.price = calculatePrice(true);

        dispath(createNewCartItem({ ...product, count }));
    }

    return (
        <div className={cx('product__info-page')}>
            {isLoaded ? <></> : <LoadedComp />}
            <FormCart />
            <div className="container space-b50">
                <section className={cx('breadcrumb')}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>

                <div className="row">
                    <section>
                        <div className="flex">
                            <div className={cx('product__box')}>
                                <div className={cx('product__thumbnail')}>
                                    <img src={productInfo.product?.url_images_large[index]} alt={`ảnh ${index}`} />
                                </div>

                                <div className={cx('list__image')}>
                                    <ul className="flex__wrap">
                                        {productInfo.product?.url_images_small.map((item, index) => (
                                            <li
                                                key={index}
                                                className={cx('list__image-item')}
                                                onClick={() => {
                                                    setIndex(index);
                                                }}
                                            >
                                                <img src={item} alt={`ảnh ${index}`} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className={cx('product__info')}>
                                <h1 className={cx('product__info-title')}>{productInfo.product?.product_name}</h1>
                                <span className="flex__center font-size14 font-weight500">
                                    Thương hiệu:{' '}
                                    <p className="space-l5 space-r5 yellow-color">{productInfo.product?.trademark}</p>{' '}
                                    Tình trạng:
                                    <p className="space-l5 space-r5 yellow-color">
                                        {productInfo.product?.original_number - productInfo.product?.quantity_sold > 0
                                            ? 'Còn hàng'
                                            : 'Hết hàng'}
                                    </p>
                                </span>

                                {productInfo.product?.sale_status ? (
                                    <div className="flex__center space-t10 space-b15">
                                        <h1 className="font-size30 yellow-color space-r10" style={{ lineHeight: 1.7 }}>
                                            {FormatPrice(calculatePrice(true))}₫
                                        </h1>
                                        <h1 className={cx('old-price')}>{FormatPrice(calculatePrice())}₫</h1>
                                    </div>
                                ) : (
                                    <h1
                                        className="font-size30 yellow-color space-t10 space-b15"
                                        style={{ lineHeight: 1.7 }}
                                    >
                                        {FormatPrice(calculatePrice())}₫
                                    </h1>
                                )}

                                {productInfo.toppings ? (
                                    <ToppingComp
                                        toppings={productInfo.toppings}
                                        onSelectedItem={(topping: toppingType) => {
                                            setToppingSelected(topping);
                                        }}
                                    />
                                ) : (
                                    <></>
                                )}

                                <div className="flex__center" style={{ paddingBottom: '16px' }}>
                                    <CountUpDown
                                        count={count}
                                        elipse={true}
                                        size="medium"
                                        IncreaseItemInCart={() => {
                                            setCount(count + 1);
                                        }}
                                        DecreaseItemInCart={() => {
                                            setCount(count - 1);
                                        }}
                                    />

                                    <button className={cx('default', 'space-l10', 'btn')} onClick={() => Order()}>
                                        Đặt hàng
                                    </button>
                                </div>

                                <p className="font-size14 space-b15" style={{ lineHeight: '1.7' }}>
                                    {productInfo.product?.description}
                                </p>
                                <ListShare url_image={productInfo?.product?.url_images_large[0]} />
                            </div>
                        </div>
                    </section>

                    <Tab content={productInfo.product?.description} />

                    <RelatedProduct category_id={productInfo.product?.category_id} limit={5} />
                </div>
            </div>
        </div>
    );
}

export default Product_Info;
