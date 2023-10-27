import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { Link, useSearchParams } from 'react-router-dom';
import BtnUpDown from '@/components/button/button__up_down';
import { CallApi, FormatPrice } from '@/method/until';
import ImageCard from '../image__card';
import { Checkbox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { changeFillterState } from '@/reduce/slice/fillterSlice';
import { CreateFillterOb } from '@/method/until';
import { RootState } from '@/reduce/store';
import { ProductsType, fillterListItemType, fillterType, itemSelectionType } from '@/type';

const cx = classNames.bind(styles);
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface Props {
    fillters?: fillterType;
    products?: ProductsType;
    banner: string[];
}

function Sitebar({ fillters, products, banner }: Props) {
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE; // biến miền khi gọi api
    const dispath = useDispatch(); // hàm thay đổi giá trị state toàn cục
    // const [priceFillter, setPriceFillter] = useState(''); //biến để lọc sản phẩm theo giá
    const [typeFillter, setTypeFillter] = useState([] as string[]); // biến lọc sản phẩm theo loại
    const [tradeMarksFillter, setTradeMarksFillter] = useState([] as string[]); //biến lọc sản phầm theo thương hiệu
    const [types, setTypes] = useState([] as itemSelectionType[]); //biến để chứa danh sách loại sản phầm
    const [tradeMarks, setTradeMarks] = useState([] as itemSelectionType[]); //biến chứa loại thương hiệu
    const colectionCategory = useSelector((state: RootState) => state.colection);
    const [searchParams, setSearchParams] = useSearchParams();

    //điều chỉnh item active
    useEffect(() => {
        const slug = window.location.href.split('/')[window.location.href.split('/').length - 1];
        const index = colectionCategory.list.findIndex((item) => slug === item.slug);

        localStorage.setItem('_colectionIndex', index.toString());
    }, [colectionCategory]);

    useEffect(() => {
        // Lấy danh sách loại sản phẩm
        const url = `${domain_url}/category/get-categorys`;
        const method = 'GET';

        CallApi(url, method)
            .then((result: itemSelectionType[]) => {
                if (result) setTypes(result);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [domain_url]);

    useEffect(() => {
        //lấy danh sách loại thương hiệu theo loại sản phẩm
        const url = `${domain_url}/product/get-trademarks/${typeFillter}`;
        const method = 'GET';

        CallApi(url, method)
            .then((result: any) => {
                if (result) setTradeMarks(result);
                else {
                    setTradeMarks([]);
                    setTradeMarksFillter([]);
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [typeFillter, domain_url]);

    useEffect(() => {
        //thay đổi giá trị đối tượng fillters
        if (fillters?.listItem[1]?.item__selection) {
            const ob = CreateFillterOb(fillters, types, tradeMarks);

            dispath(changeFillterState(ob));

            setTradeMarksFillter((prev) => {
                const arr = [...prev];

                tradeMarks.forEach((trademark) => {
                    const index = arr.findIndex((item) => item === trademark.value);

                    if (index) arr.splice(index, 1);
                });

                return arr;
            });
        }
    }, [types, tradeMarks, dispath]);

    //chức năng lọc sản phẩm theo các thuộc tính giá, thương hiệu, loại
    function ChangeValueInput(
        e: ChangeEvent<HTMLInputElement>,
        item: fillterListItemType,
        selection: itemSelectionType,
    ) {
        if (e.target.checked) {
            //xử lý khi checkbox bằng true
            if (item.title === 'Loại') {
                const arr = [...typeFillter, `${selection.key}`];

                searchParams.set('category_id', arr.join(','));
                setSearchParams(searchParams);

                setTypeFillter(arr); //lọc theo loại
            } else if (item.title === 'Giá sản phẩm') {
                const min_price = selection.key.split('-')[0];
                const max_price = selection.key.split('-')[1];

                searchParams.set('min_price', min_price || '');
                searchParams.set('max_price', max_price || '');

                setSearchParams(searchParams);
                // setPriceFillter(selection.key); //Lọc theo giá sản phẩm
            } else {
                const arr = [...tradeMarksFillter, selection.key];

                searchParams.set('trademark', arr.join(','));
                setSearchParams(searchParams);

                setTradeMarksFillter([...tradeMarksFillter, selection.key]); //Lọc theo thương hiệu
            }
        } else {
            let arr;

            if (item.title === 'Loại') {
                //xóa phần tử đã bỏ chọn lọc với thuộc tính loại
                arr = [...typeFillter];

                const newArr = DeleteItem(arr, selection.key);

                searchParams.set('category_id', newArr.join(','));
                setSearchParams(searchParams);

                setTypeFillter(newArr);
            } else if (item.title === 'Giá sản phẩm') {
                searchParams.set('min_price', '');
                searchParams.set('max_price', '');

                setSearchParams(searchParams);
                // setPriceFillter('');
            } else {
                //xóa phần tử đã bỏ chọn lọc với thuộc tính thương hiệu
                arr = [...tradeMarksFillter];

                const newArr = DeleteItem(arr, selection.key);

                searchParams.set('trademark', newArr.join(','));
                setSearchParams(searchParams);

                setTradeMarksFillter(newArr);
            }
        }
    }

    //xóa phần tử trong mảng
    function DeleteItem(arr: any[], valueRemove: any) {
        const removeIndex = arr.findIndex((item) => item === `${valueRemove}`); //vị trí phần tử cần xóa
        arr.splice(removeIndex, 1);

        return arr;
    }

    // hàm điều khiển hoạt động của các danh mục phần giao diện
    function handleClick(e: any) {
        let navItem = e.target as HTMLElement;

        while (navItem.nodeName !== 'LI') {
            if (navItem.parentElement) {
                navItem = navItem.parentElement;
            }
        }

        navItem = navItem.lastChild as HTMLElement;

        if (navItem.style.maxHeight === '200px') {
            navItem.style.maxHeight = '0';
        } else {
            navItem.style.maxHeight = '200px';
        }
    }

    useEffect(() => {
        setSearchParams((prev: URLSearchParams) => {
            const typeFillters = prev.get('category_id');
            const min_price = prev.get('min_price');
            const max_price = prev.get('max_price');
            const tradeMarksFillters = prev.get('trademark');
            const type = searchParams.get('sort_type');
            const key = searchParams.get('sort_key');

            if (!typeFillters && !min_price && !max_price && !tradeMarksFillters && !type && !key) {
                setTypeFillter([]);
                // setPriceFillter('');
                setTradeMarksFillter([]);

                return [];
            }

            if (!typeFillters && !min_price && !max_price && !tradeMarksFillters) {
                setTypeFillter([]);
                // setPriceFillter('');
                setTradeMarksFillter([]);

                searchParams.delete('category_id');
                searchParams.delete('trademark');
                searchParams.delete('min_price');
                searchParams.delete('max_price');
            }

            return searchParams;
        });
    }, [searchParams, setSearchParams]);

    function isChecked(item: fillterListItemType, selection: itemSelectionType) {
        if (item.title === 'Giá sản phẩm') {
            const min_price = searchParams.get('min_price');
            const max_price = searchParams.get('max_price');

            if (!min_price && !max_price) return false;

            if (min_price && !max_price) return selection.key === min_price;

            return selection.key === `${min_price}-${max_price}`;
        }

        if (item.title === 'Loại') {
            const typeFillters = searchParams.get('category_id');

            if (!typeFillters) return false;

            return typeFillters?.includes(selection.key);
        }

        if (item.title === 'Thương hiệu') {
            const tradeMarksFillters = searchParams.get('trademark');

            if (!tradeMarksFillters) return false;

            return tradeMarksFillters?.includes(selection.key);
        }
    }

    return (
        <aside className={cx('site-bar')}>
            <aside className={cx('aside__item')}>
                <div className={cx('title')}>
                    <h3>{colectionCategory.title}</h3>
                </div>
                <div className={cx('categories-box')}>
                    <ul className={cx('lv1')}>
                        {colectionCategory.list.map((item, index) => {
                            return (
                                <li
                                    className={cx('nav__item')}
                                    key={index}
                                    onClick={() => {
                                        localStorage.setItem('_colectionIndex', index.toString());
                                    }}
                                >
                                    <div className="flex" style={{ position: 'relative' }}>
                                        <Link
                                            to={`/${item.slug}`}
                                            className={cx(
                                                index === JSON.parse(localStorage.getItem('_colectionIndex') || '-1')
                                                    ? 'active'
                                                    : '',
                                            )}
                                        >
                                            {item.category_name}
                                        </Link>
                                        {item.lv2Item ? (
                                            <div className={cx('nav__item-icon')} onClick={handleClick}>
                                                <BtnUpDown />
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>

                                    {item.lv2Item ? (
                                        <ul className={cx('lv2')}>
                                            {item.lv2Item.map((value, index2) => {
                                                return (
                                                    <li className={cx('nav__item')} key={index2}>
                                                        <Link to={`/${value.slug}`}>{value.product_name}</Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <></>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>

            {fillters ? (
                <aside className={cx('aside__item')}>
                    <div className={cx('title')}>
                        <h3>{fillters.title}</h3>
                    </div>
                    <div className={cx('categories-box')}>
                        {fillters.listItem.map((item, index) => {
                            return (
                                <aside key={index} className={cx('space-b25')}>
                                    <h3 className="space-b10 font-size16 font-weight700">{item.title}</h3>
                                    <ul style={{ maxHeight: 140, overflow: 'hidden auto' }}>
                                        {item.item__selection.map((selection, selectionIndex) => {
                                            return (
                                                <li key={selectionIndex} className={cx('fillter__wrap')}>
                                                    <div className={cx('fillter__selection')}>
                                                        {item.title === 'Giá sản phẩm' ? (
                                                            <Checkbox
                                                                className={cx('check-box')}
                                                                {...label}
                                                                sx={{
                                                                    padding: 0,
                                                                    marginRight: '5px',
                                                                    '&.Mui-checked': {
                                                                        color: 'var(--yellow-color)',
                                                                    },
                                                                }}
                                                                checked={isChecked(item, selection)}
                                                                onChange={(e) => {
                                                                    ChangeValueInput(e, item, selection);
                                                                }}
                                                            />
                                                        ) : (
                                                            <Checkbox
                                                                className={cx('check-box')}
                                                                {...label}
                                                                checked={isChecked(item, selection)}
                                                                sx={{
                                                                    padding: 0,
                                                                    marginRight: '5px',
                                                                    '&.Mui-checked': {
                                                                        color: 'var(--yellow-color)',
                                                                    },
                                                                }}
                                                                onChange={(e) => {
                                                                    ChangeValueInput(e, item, selection);
                                                                }}
                                                            />
                                                        )}

                                                        <span
                                                            className="font-size14 space-l5"
                                                            style={{ width: '100%' }}
                                                        >
                                                            {selection.value}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </aside>
                            );
                        })}
                    </div>
                </aside>
            ) : (
                <></>
            )}

            {products?.title ? (
                <aside className={cx('aside__item')}>
                    <div className={cx('title')}>
                        <h3>{products.title}</h3>
                    </div>

                    <div className={cx('categories-box', 'space-t10')}>
                        <ul className={cx('lv1')}>
                            {products.list.map((item, index) => {
                                return (
                                    <li key={index} className={cx('products__item')}>
                                        <div className={cx('thumbnail')}>
                                            <Link to={`/${item.slug}`}>
                                                <img src={item.url_images_large[0]} alt="Cafe ice latte" />
                                            </Link>
                                        </div>
                                        <div className={cx('product__text')}>
                                            <h3 className={cx('product__name')}>
                                                <Link to={`/${item.slug}`}>{item.product_name}</Link>
                                            </h3>

                                            {item.sale_percent ? (
                                                <div className="flex">
                                                    <p className={cx('products__price')}>
                                                        {FormatPrice(
                                                            item.price - (item.price * item.sale_percent) / 100,
                                                        )}
                                                        ₫
                                                    </p>
                                                    <p className={cx('products__price', 'old__price')}>
                                                        {FormatPrice(item.price)}₫
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className={cx('products__price')}>{FormatPrice(item.price)}₫</p>
                                            )}
                                        </div>
                                        {item.sale_percent ? (
                                            <div className={cx('box__sale')}>-{item.sale_percent}%</div>
                                        ) : (
                                            <></>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </aside>
            ) : (
                <></>
            )}

            <aside className={cx('aside__item')}>
                {banner.map((item, index) => {
                    return (
                        <div className={cx('banner__thumbnail')} key={index}>
                            <Link to={'#'}>
                                <ImageCard>
                                    <img src={item} alt="Đang cập nhật" />
                                </ImageCard>
                            </Link>
                        </div>
                    );
                })}
            </aside>
        </aside>
    );
}

export default Sitebar;
