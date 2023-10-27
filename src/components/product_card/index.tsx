import { FormatPrice } from '@/method/until';
import { Link } from 'react-router-dom';
import TooltipCustomed from '../tooltip';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faEye, faLink } from '@fortawesome/free-solid-svg-icons';
import { ProductType } from '@/type';
import { useDispatch } from 'react-redux';
import { createNewCartItem } from '@/reduce/slice/newCartItemSlice';

const cx = classNames.bind(styles);

interface Props {
    item: ProductType;
    large?: boolean;
}

function ProductCard({ item, large }: Props) {
    const dispath = useDispatch();

    function Order() {
        const product = {
            ...item,
            count: 1,
            price: item.sale_status ? (item.price * (100 - item.sale_percent)) / 100 : item.price,
        };

        if (item.original_number - item?.quantity_sold > 0) {
            dispath(createNewCartItem(product));
        }
    }

    return (
        <>
            {large ? (
                <div className={cx('card', 'card__large')}>
                    <div className={cx('card__large-left')}>
                        <div className={cx('card__thumbnail')}>
                            <Link to={`/${item.slug}`}>
                                <img src={item?.url_images_large[0]} alt={item?.product_name} />
                            </Link>
                        </div>
                    </div>
                    <div className={cx('card__large-right')}>
                        <h1 className={cx('produdt__name')}>
                            <Link to={`/${item?.slug}`}>{item?.product_name}</Link>
                        </h1>

                        <div className={cx('product__price')}>
                            {item?.sale_percent ? (
                                <div>
                                    <span>{FormatPrice(item?.price - (item?.price * item?.sale_percent) / 100)}₫</span>
                                    <span className={cx('old__price')}>{FormatPrice(item?.price)}₫</span>
                                </div>
                            ) : (
                                <span>{FormatPrice(item?.price)}₫</span>
                            )}
                        </div>
                        <p className={cx('product__description')}>{item?.description}</p>

                        <TooltipCustomed title="Xem nhanh">
                            <button className={cx('card__icon')}>
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                        </TooltipCustomed>

                        <TooltipCustomed
                            title={item.original_number - item?.quantity_sold > 0 ? 'Đặt hàng' : 'Chọn sản phẩm'}
                        >
                            <button className={cx('card__icon', 'left')}>
                                <FontAwesomeIcon
                                    icon={item.original_number - item?.quantity_sold <= 0 ? faLink : faCartPlus}
                                />
                            </button>
                        </TooltipCustomed>
                    </div>
                </div>
            ) : (
                <div className={cx('card')}>
                    <div className={cx('card__thumbnail')}>
                        <div className={cx('card__price')}>
                            {item?.sale_percent ? (
                                <div>
                                    <span>{FormatPrice(item?.price - (item?.price * item?.sale_percent) / 100)}₫</span>
                                    <span className={cx('old__price')}>{FormatPrice(item?.price)}₫</span>
                                </div>
                            ) : (
                                <span>{FormatPrice(item?.price)}₫</span>
                            )}
                        </div>

                        {item?.sale_percent ? <div className={cx('sale__percent')}>-{item?.sale_percent}%</div> : <></>}

                        <Link to={`/${item?.slug}`}>
                            <img src={item?.url_images_large[0]} alt={item?.product_name} />
                        </Link>

                        <TooltipCustomed title="Xem nhanh">
                            <button className={cx('card__icon', 'left')}>
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                        </TooltipCustomed>

                        <TooltipCustomed
                            title={item.original_number - item?.quantity_sold > 0 ? 'Đặt hàng' : 'Chọn sản phẩm'}
                        >
                            <button className={cx('card__icon', 'right')} onClick={() => Order()}>
                                <FontAwesomeIcon
                                    icon={item.original_number - item?.quantity_sold <= 0 ? faLink : faCartPlus}
                                />
                            </button>
                        </TooltipCustomed>
                    </div>

                    <Link to={`${item.slug}`}>
                        <h3 className={cx('card__name-food')}>{item?.product_name}</h3>
                    </Link>
                </div>
            )}
        </>
    );
}

export default ProductCard;
