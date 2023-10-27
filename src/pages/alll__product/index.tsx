import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import Layout from '@/pages/components/layout';
import ProductCard from '@/components/product_card';
import { Autocomplete, Pagination, TextField, Typography } from '@mui/material';
import { faList, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { CallApi } from '@/method/until';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { changeProductState } from '@/reduce/slice/productsOfViewSlice';
import { changeColectionState } from '@/reduce/slice/colectionCategorySlice';
import { ProductsType } from '@/type';
import FormCart from '@/components/form__cart';
import { useParams, useSearchParams } from 'react-router-dom';
import LoadedComp from '@/components/loaded';

type sortItem = {
    title: string;
    id: string;
};

const cx = classNames.bind(styles);

function AllProduct() {
    const listItemOfFillter = [
        { title: 'Mặc định', id: 'default-asc' },
        { title: 'A → Z ', id: 'alpha-asc' },
        { title: 'Z → A', id: 'alpha-desc' },
        { title: 'Giá tăng dần', id: 'price-asc' },
        { title: 'Giá giảm dần', id: 'price-desc' },
    ];
    const [isLarge, setIsLage] = useState(JSON.parse(localStorage.getItem('isLarge') || 'false'));
    const [pageIndex, setPageIndex] = useState(0);
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const [maxPage, setMaxPage] = useState(0);
    const productsOfView = useSelector((state: RootState) => state.productsOfView);
    const dispath = useDispatch();
    const fillters = useSelector((state: RootState) => state.fillter);
    const [Products, setProducts] = useState<ProductsType | undefined>();
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [sort_type, setSortType] = useState<string | undefined>();
    const [sort_key, setSortKey] = useState<string | undefined>();
    const [sortSelected, setSortSelected] = useState<sortItem | undefined>();

    const Banners = [`${process.env.REACT_APP_DOMAIN__URL}/pages/introduce/sitebar/aside_banner.png`];

    const [breadcrumb, setBreadcrumb] = useState({
        title: 'Tất cả sản phẩm',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/collections/all', name: 'Tất cả sản phẩm' },
        ],
    });

    useEffect(() => {
        if (productsOfView.length === 0) return;

        const title = slug === 'all' ? 'Tất cả sản phẩm' : productsOfView[0]?.category_name;
        document.title = `${title} halucafe`;

        const breadcrumb = {
            title: title,
            listItem: [
                { link: '/trang-chu', name: 'Trang chủ' },
                { link: `/collections/${slug}`, name: title },
            ],
        };

        setBreadcrumb(breadcrumb);
    }, [productsOfView, slug]);

    useEffect(() => {
        if (productsOfView.length > 0 && Products) setIsLoaded(true);
    }, [productsOfView, Products]);

    useEffect(() => {
        localStorage.setItem('isLarge', JSON.stringify(isLarge));
    }, [isLarge]);

    useEffect(() => {
        const method = 'GET';
        const url = `${domain_url}/product/get-colection-category`;
        const headers = {
            'Content-type': 'Application/json',
        };

        CallApi(url, method, headers)
            .then((result: any) => {
                if (result) {
                    result.forEach((item: any) => {
                        item.slug = 'collections/' + item.slug;
                    });

                    dispath(changeColectionState({ title: 'Danh mục', list: result }));
                }
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [domain_url, dispath]);

    useEffect(() => {
        const method = 'GET';
        const url = `${domain_url}/product/get-hot-products?limit=5`;
        const headers = {
            'Content-type': 'Application/json',
        };

        CallApi(url, method, headers)
            .then((result: any) => {
                if (result) setProducts({ title: 'Sản phẩm hot', list: result });
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [domain_url]);

    useEffect(() => {
        function customerUrl(url_midlle: string, page: number, limit: number) {
            return `${domain_url}/product/fillter-product?${url_midlle}&page=${page}&limit=${limit}`;
        }

        const limit = isLarge ? 5 : 12;
        const method = 'GET';
        const headers = {
            'Content-type': 'Application/json',
        };

        let url = `${domain_url}/product/get-products${slug === 'all' ? '' : `/${slug}`}?page=${
            pageIndex * limit
        }&limit=${limit}`;

        const categoryId = searchParams.get('category_id') || undefined;
        const trademark = searchParams.get('trademark') || undefined;
        const min_price = searchParams.get('min_price') || undefined;
        const max_price = searchParams.get('max_price') || undefined;

        if (categoryId && trademark && min_price && max_price) {
            url = customerUrl(
                `category_id=${categoryId}&trademark=${trademark}&min_price=${min_price}&max_price=${max_price}`,
                pageIndex * limit,
                limit,
            );
        } else if (categoryId && trademark && min_price && !max_price) {
            url = customerUrl(
                `category_id=${categoryId}&trademark=${trademark}&min_price=${min_price}`,
                pageIndex * limit,
                limit,
            );
        } else if (categoryId && trademark) {
            url = customerUrl(`category_id=${categoryId}&trademark=${trademark}`, pageIndex * limit, limit);
        } else if (categoryId && min_price && max_price) {
            url = customerUrl(
                `category_id=${categoryId}&min_price=${min_price}&max_price=${max_price}`,
                pageIndex * limit,
                limit,
            );
        } else if (categoryId && min_price && !max_price) {
            url = customerUrl(`category_id=${categoryId}&min_price=${min_price}`, pageIndex * limit, limit);
        } else if (trademark && min_price && max_price) {
            url = customerUrl(
                `trademark=${trademark}&min_price=${min_price}&max_price=${max_price}`,
                pageIndex * limit,
                limit,
            );
        } else if (trademark && min_price && !max_price) {
            url = customerUrl(`trademark=${trademark}&min_price=${min_price}`, pageIndex * limit, limit);
        } else if (categoryId) {
            url = customerUrl(`category_id=${categoryId}`, pageIndex * limit, limit);
        } else if (trademark) {
            url = customerUrl(`trademark=${trademark}`, pageIndex * limit, limit);
        } else if (min_price && max_price) {
            url = customerUrl(`min_price=${min_price}&max_price=${max_price}`, pageIndex * limit, limit);
        } else if (min_price && !max_price) {
            url = customerUrl(`min_price=${min_price}`, pageIndex * limit, limit);
        }

        CallApi(url, method, headers)
            .then((result: any) => {
                if (result) {
                    dispath(changeProductState(result.products));
                    setMaxPage(result.max_page);
                } else dispath(changeProductState([]));
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [domain_url, pageIndex, isLarge, dispath, slug, searchParams]);

    useEffect(() => {
        const type = searchParams.get('sort_type') || undefined;
        const key = searchParams.get('sort_key') || undefined;

        setSortType(type);
        setSortKey(key);

        if (!type && !key) setSortSelected(listItemOfFillter[0]);
    }, [searchParams]);

    useEffect(() => {
        if (!sort_key || !sort_type) return;

        const limit = isLarge ? 5 : 12;
        const page = limit * pageIndex - limit > 0 ? limit * pageIndex - limit : 0;

        CallApi(
            `${domain_url}/product/sort?type=${sort_type}&key=${sort_key}&limit=${limit}&page=${page}&category_name=${slug}`,
            'GET',
        )
            .then((result) => {
                dispath(changeProductState(result));
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [pageIndex, isLarge, sort_type, sort_key, dispath, domain_url, slug]);

    async function Sort__item(order: string) {
        let key = '';
        let type = '';
        const arr = order.split('-');

        type = arr[1];
        if (arr[0] === 'alpha' || arr[0] === 'default') {
            key = 'product_name';
        } else if (arr[0] === 'price') {
            key = 'price';
        } else if (arr[0] === 'created') {
            key = 'create__at';
        }

        searchParams.set('sort_type', type);
        searchParams.set('sort_key', key);
        setSearchParams(searchParams);
    }

    return (
        <div className={cx('all-product__container')}>
            {isLoaded ? <></> : <LoadedComp />}
            <FormCart />
            <Layout Banners={Banners} fillters={fillters} breadcrumb={breadcrumb} Products={Products}>
                <div className={cx('sort__pagi-bar_box')}>
                    <div className="row">
                        <div className={cx('sort__pagi-bar')}>
                            <div className={cx('item__left')}>
                                <div
                                    className={cx('icon', isLarge ? '' : 'active')}
                                    onClick={() => {
                                        setIsLage(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTableCells} />
                                </div>
                                <div
                                    className={cx('icon', isLarge ? 'active' : '')}
                                    onClick={() => {
                                        setIsLage(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faList} />
                                </div>
                            </div>
                            <div className={cx('item__right')}>
                                <span className={cx('title')}>Sắp xếp: </span>
                                <Autocomplete
                                    disablePortal
                                    id="fillter"
                                    size="small"
                                    options={listItemOfFillter}
                                    value={sortSelected ? sortSelected : listItemOfFillter[0]}
                                    isOptionEqualToValue={(option, value) => {
                                        return option.title === value.title;
                                    }}
                                    renderOption={(props, option) => {
                                        return (
                                            <Typography {...props} className={cx('fillter__item')} key={option.id}>
                                                {option.title}
                                            </Typography>
                                        );
                                    }}
                                    getOptionLabel={(option) => option.title}
                                    sx={{
                                        width: 200,
                                        '&.MuiAutocomplete-root': {
                                            '&:hover': {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: ' var(--border-color-2) !important',
                                                },
                                            },
                                        },

                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            border: '1px solid var(--yellow-color) !important',
                                        },

                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: '1px solid var(--border-color)',
                                        },

                                        '&.Mui-focused label': {
                                            color: 'var(--yellow-color)',
                                            backgroundColor: 'var(--white-color)',
                                        },
                                    }}
                                    onChange={(e, options) => {
                                        if (!options?.id) {
                                            return;
                                        }

                                        setSortSelected(options);
                                        Sort__item(options.id);
                                    }}
                                    renderInput={(params) => {
                                        return (
                                            <TextField
                                                {...params}
                                                label="Sắp xếp"
                                                variant="outlined"
                                                className={cx('wrap_input_label')}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    style: {
                                                        fontSize: '14px',
                                                        color: 'var(--text-color)',
                                                        fontWeight: 500,
                                                        fontFamily: "'Quicksand', sans-serif",
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: '14px',
                                                        padding: '0 5px 0 0',
                                                        fontFamily: "'Quicksand', sans-serif",
                                                    },
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={cx('product__view')}>
                        {productsOfView.map((item, index) => {
                            return (
                                <div className={cx('product__view-item', isLarge ? 'large' : '')} key={index}>
                                    <ProductCard item={item} large={isLarge} />
                                </div>
                            );
                        })}
                    </div>
                    {maxPage > 1 ? (
                        <div className={cx('wrap__pagination')}>
                            <Pagination
                                className={cx('pagination')}
                                count={maxPage}
                                shape="rounded"
                                size="large"
                                onChange={(e: any, page: number) => {
                                    setPageIndex(page - 1);
                                }}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </Layout>
        </div>
    );
}

export default AllProduct;
