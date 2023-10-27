import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FormatPrice, GetCookie } from '@/method/until';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { decreaseCartItem, deleteCartItem, increaseCartItem } from '@/reduce/slice/cartSlice';

const cx = classNames.bind(Styles);

function CartComponent() {
    const dispath = useDispatch();
    const carts = useSelector((state: RootState) => state.cart);
    const [toTalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let total = 0;
        let totalCount = 0;
        const totalCartItem = document.querySelector('#total-count-cart');
        carts.forEach((item) => {
            total += item.price * item.count;
        });

        totalCount = carts.length;

        if (totalCartItem) {
            totalCartItem.innerHTML = totalCount.toString();
        }

        setTotalPrice(total);
    }, [carts]);

    //Tăng số lượng của 1 mặt hàng trong giỏ hàng
    function increaseItemInCart(index: number) {
        dispath(increaseCartItem(carts[index]));
    }

    //Giảm số lượng của 1 mặt hàng trong giỏ hàng
    function decreaseItemInCart(index: number) {
        dispath(decreaseCartItem(carts[index]));
    }

    //Xóa 1 mặt hàng trong giỏ hàng
    function closeItemInCart(index: number) {
        dispath(deleteCartItem(carts[index]));
    }

    return (
        <div className={cx('cart__container')} id="cart__container-id">
            {carts.length > 0 ? (
                <>
                    <div className={cx('cart__items')}>
                        <ul>
                            {carts.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className={cx('cart__item')}>
                                            <div className={cx('image__wraper')}>
                                                <Link to={`/${item?.slug}`}>
                                                    <img src={item?.url_images_large[0]} alt={item?.product_name} />
                                                </Link>
                                            </div>

                                            <div className={cx('description__cart-item')}>
                                                <div className={cx('wrapper__title')}>
                                                    <h2>
                                                        <Link to={`${item?.slug}`}>{item?.product_name}</Link>
                                                    </h2>

                                                    <div
                                                        className={cx('icon__close')}
                                                        onClick={() => {
                                                            closeItemInCart(index);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </div>
                                                </div>

                                                <p className={cx('price')}>{FormatPrice(item?.price)}₫</p>
                                                <div className={cx('count')}>
                                                    <div className={cx('wrap__item')}>
                                                        <button
                                                            onClick={() => {
                                                                decreaseItemInCart(index);
                                                            }}
                                                            disabled={item.count - 1 === 0}
                                                        >
                                                            -
                                                        </button>
                                                        <input value={item.count} disabled />
                                                        <button
                                                            onClick={() => {
                                                                increaseItemInCart(index);
                                                            }}
                                                            disabled={
                                                                item.count + 1 ===
                                                                item?.original_number - item?.quantity_sold
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={cx('wrap__item-pay')}>
                        <div className={cx('wrap__total')}>
                            <h3 className={cx('title')}>Tổng tiền tạm tính: </h3>
                            <p className={cx('total__price')}>{FormatPrice(toTalPrice)}₫</p>
                        </div>
                        <Link to={`/checkout/${GetCookie('_order_slug')}`}>
                            <div className={cx('button')}>Tiến hành thanh toán</div>
                        </Link>
                    </div>
                </>
            ) : (
                <div style={{ padding: '10px 15px', fontSize: '14px' }}>Không có sản phẩm nào</div>
            )}
        </div>
    );
}

export default CartComponent;
