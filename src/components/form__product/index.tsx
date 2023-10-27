import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { FormatPrice } from '@/method/until';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import CountUpDown from '../button/count_up_down';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function FormProduct() {
    const [product, setProduct] = useState({
        procut__name: 'VIETNAMESE COFFEE',
        rodcut__link: '/viet-name-coffee',
        price: 50000,
        count: 1,
    });
    const [prodcutImages, setProductImages] = useState(['']);
    const [Index, setIndex] = useState(0);
    const [isShow, setIshow] = useState(false);

    useEffect(() => {
        const productImages = [
            'https://bizweb.dktcdn.net/100/351/580/products/product1-8ed5cdf2-9430-402c-be6e-a529af32a714.jpg?v=1555054845430',
            'https://bizweb.dktcdn.net/thumb/large/100/351/580/products/product5.jpg',
        ];

        setProductImages(productImages);
    }, []);

    //Tăng số lượng của 1 mặt hàng trong giỏ hàng
    function increaseItemInCart() {
        const cart = { ...product };

        cart.count += 1;
        setProduct(cart);
    }

    //Giảm số lượng của 1 mặt hàng trong giỏ hàng
    function decreaseItemInCart() {
        const cart = { ...product };
        cart.count -= 1;
        setProduct(cart);
    }

    //tat form
    function CloseForm() {
        setIshow(false);
    }

    return isShow ? (
        <div className={cx('wrap')} onClick={CloseForm}>
            <div className={cx('form__product')}>
                <div className={cx('close__form-icon')} onClick={CloseForm}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={cx('form__product-item-left')}>
                    <div className={cx('product__thumbnail')}>
                        <Link to={'/'}>
                            <img src={prodcutImages[Index]} alt={`ảnh ${Index}`} />
                        </Link>
                    </div>
                    <div className={cx('wrap__product-image')}>
                        {prodcutImages.map((item, index) => (
                            <div
                                className={cx('box__image')}
                                key={index}
                                onClick={() => {
                                    setIndex(index);
                                }}
                            >
                                <img
                                    className={cx(index === Index ? 'box__image-active' : '')}
                                    src={item}
                                    alt={`ảnh ${index}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={cx('form__info')}>
                    <div className={cx('item__top')}>
                        <h1>
                            <Link to={product.rodcut__link}>{product.procut__name}</Link>
                        </h1>

                        <span className="flex__center">
                            Thương hiệu:{' '}
                            <Link to={'/'} className="space-l5">
                                Trung Nguyên
                            </Link>{' '}
                            <hr />
                            Tình trạng: <p className="space-l5 yellow-color">Còn hàng</p>
                        </span>

                        <p className={cx('price')}>{FormatPrice(40000)}₫</p>
                    </div>

                    <div className={cx('item__middle')}>
                        <span className="font-size14 gray-color">
                            Theo lời khuyên của các chuyên gia y tế cho rằng: mùa hè, bạn nên uống ít nhất 2 ly nước ép
                            dưa hấu mỗi ngày. Bởi vì, khi đó các hàm lượng có sẵn chứa trong quả dưa hấu sẽ tự động làm
                            giảm lượng calo bên cạnh việc duy trì sức khỏe của thận. Đồng thời, nó sẽ tự động loại bỏ
                            các độc tố ra khỏi bàng quang, giúp cho cơ thể
                        </span>
                        <br />
                        <Link to={'/'} className="font-size14 flex__center" style={{ width: 'fit-content' }}>
                            Chi tiết
                            <FontAwesomeIcon
                                icon={faAngleRight}
                                className="space-l5 font-size12"
                                style={{ marginTop: '1px' }}
                            />
                        </Link>
                    </div>

                    <div className="flex__center space-t15">
                        {/* <button className={cx('default', 'space-l10', 'font-size16', 'font-weight500')} disabled>
                            Hết hàng
                        </button> */}
                        <CountUpDown
                            count={product.count}
                            IncreaseItemInCart={increaseItemInCart}
                            DecreaseItemInCart={decreaseItemInCart}
                        />
                        <Link to={'/cart'}>
                            <button className={cx('default', 'space-l10', 'font-size16', 'font-weight500')}>
                                Mua hàng
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}

export default FormProduct;
