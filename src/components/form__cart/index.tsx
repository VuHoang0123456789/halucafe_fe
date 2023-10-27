import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretLeft,
    faCaretRight,
    faCartShopping,
    faCheck,
    faRightLong,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CountUpDown from '../button/count_up_down';
import { FormatPrice, GetCookie } from '@/method/until';
import { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { ProductType } from '@/type';
import { decreaseCartItem, deleteCartItem, increaseCartItem } from '@/reduce/slice/cartSlice';
import { removeNewCartItem } from '@/reduce/slice/newCartItemSlice';

const cx = classNames.bind(styles);

interface CartType extends ProductType {
    count: number;
}

function FormCart() {
    const dispath = useDispatch();
    const formCartRef = useRef<HTMLDivElement>(null);
    const cartItems = useSelector((state: RootState) => state.cart) as CartType[];
    const cartItemSelected = useSelector((state: RootState) => state.NewCarItem) as CartType;

    // tính tổng sô tiền phải thanh toán
    const Total = useMemo(
        () =>
            cartItems.reduce((total, value) => {
                return total + value.count * value.price;
            }, 0),
        [cartItems],
    );

    function CloseForm() {
        const formCartComp = formCartRef.current;
        if (!formCartComp) return;
        formCartComp.style.display = 'none';
    }

    return (
        <div className={cx('wrap')} onClick={CloseForm} id="form_cart_id" ref={formCartRef}>
            <div
                className={cx('form__cart')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={cx('close__form-icon')} onClick={CloseForm}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={cx('header')}>
                    <div className={cx('flex__center', 'font-size18', 'space-b10')}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <span className="flex__center">
                            <p className="space-r5">Bạn đã thêm</p>
                            <Link to={`/${cartItemSelected?.slug}`}>{cartItemSelected?.product_name}</Link>
                            <p className="space-l5">vào giỏ hàng</p>
                        </span>
                    </div>
                    <Link to={'/cart'} className={cx('flex__center', 'font-size17', 'space-b10')}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faCartShopping} />
                        </div>
                        <span>Giỏ hàng của bạn ({cartItems.length} sản phẩm)</span>
                        <div className={cx('icon', 'icon__caret-right')}>
                            <FontAwesomeIcon icon={faCaretRight} />
                        </div>
                    </Link>
                </div>
                <div className={cx('content')}>
                    <TableContainer
                        component={Paper}
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)', boxShadow: 'none', width: '100%' }}
                    >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow sx={{ background: '#f7f7f7' }}>
                                    <TableCell
                                        className={cx('colum')}
                                        sx={{
                                            width: '55%',
                                        }}
                                    >
                                        Sản phẩm
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '15%' }} className={cx('colum')}>
                                        Đơn giá
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '15%' }} className={cx('colum')}>
                                        Số lượng
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '15%' }} className={cx('colum')}>
                                        Thành tiền
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>

                        <TableContainer style={{ overflow: 'hidden auto', maxHeight: '280px' }}>
                            <Table>
                                <TableBody>
                                    {cartItems.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className={cx('row')}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                className={cx('row_column')}
                                                align="left"
                                                sx={{
                                                    width: '55%',
                                                }}
                                            >
                                                <div className={cx('flex')}>
                                                    <div className={cx('product__thumbnail')}>
                                                        <Link to={`/${row.slug}`}>
                                                            <img src={row.url_images_large[0]} alt={row.product_name} />
                                                        </Link>
                                                    </div>
                                                    <div className={cx('text__info')}>
                                                        <h3>
                                                            <Link
                                                                to={`/${row.slug}`}
                                                                className="font-weight700 font-size14"
                                                            >
                                                                <p style={{ lineHeight: '20px' }}>{row.product_name}</p>
                                                            </Link>
                                                        </h3>
                                                        <div
                                                            className={cx('flex__center', 'tex__info-item', 'space-b5')}
                                                            style={{ width: 'fit-content' }}
                                                            onClick={() => {
                                                                if (row.product_id === cartItemSelected.product_id)
                                                                    dispath(removeNewCartItem());

                                                                dispath(deleteCartItem(row));
                                                            }}
                                                        >
                                                            <div
                                                                className={cx('icon__close')}
                                                                style={{ width: '14px', lineHeight: '20px' }}
                                                            >
                                                                <FontAwesomeIcon icon={faXmark} />
                                                            </div>
                                                            Xóa sản phẩm
                                                        </div>
                                                        {cartItemSelected?.product_id === row?.product_id ? (
                                                            <div className={cx('flex__center font-weight500')}>
                                                                <div
                                                                    className={cx('icon')}
                                                                    style={{ color: '#3cb878', lineHeight: '20px' }}
                                                                >
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </div>
                                                                Sản phẩm vừa thêm
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className="font-weight700 yellow-color"
                                                sx={{
                                                    width: '15%',
                                                }}
                                            >
                                                {FormatPrice(row.price)}₫
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    width: '15%',
                                                }}
                                            >
                                                <CountUpDown
                                                    count={row.count}
                                                    DecreaseItemInCart={() => dispath(decreaseCartItem(row))}
                                                    IncreaseItemInCart={() => dispath(increaseCartItem(row))}
                                                />
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className="font-weight700 yellow-color"
                                                sx={{
                                                    width: '15%',
                                                }}
                                            >
                                                {FormatPrice(row.price * row.count)}₫
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableContainer>
                </div>
                <div className={cx('footer')}>
                    <div className={cx('flex__center')} style={{ justifyContent: 'space-between', padding: '10px 0' }}>
                        <span className="font-size13 space-b15 font-weight500">Giao hàng trên toàn quốc</span>
                        <p className="font-size15 space-b15 font-weight700">
                            Thành tiền: <span className="yellow-color">{FormatPrice(Total)}₫</span>
                        </p>
                    </div>
                    <div className={cx('flex__center', 'space-b10')} style={{ justifyContent: 'space-between' }}>
                        <Link
                            to={'/collections/all'}
                            className={cx('flex__center', 'font-size13', 'yellow-color', 'font-weight500')}
                        >
                            <div className={cx('icon')}>
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </div>
                            Tiếp tục mua hàng
                        </Link>
                        <Link to={`/checkout/${GetCookie('_order_slug')}`}>
                            <button className={cx('default', 'btn')}>
                                Tiến hành đặt hàng
                                <FontAwesomeIcon icon={faRightLong} className="space-l5" style={{ marginTop: '3px' }} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default FormCart;
