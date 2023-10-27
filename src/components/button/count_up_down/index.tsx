import Styles from './styles.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Styles);

interface Props {
    count: number;
    elipse?: boolean;
    size?: string;
    IncreaseItemInCart: any;
    DecreaseItemInCart: any;
}

function CountUpDown({ count, IncreaseItemInCart, DecreaseItemInCart, elipse = false, size = 'small' }: Props) {
    return (
        <div className={cx('count')}>
            <div className={cx('wrap__item', size === 'medium' ? 'medium' : '', elipse ? 'elipse' : '')}>
                <button className={cx('left__radius', 'is-40x40')} onClick={DecreaseItemInCart} disabled={count === 1}>
                    -
                </button>
                <input value={count} disabled className={cx('is-40x40')} />
                <button onClick={IncreaseItemInCart} className={cx('right__radius', 'is-40x40')}>
                    +
                </button>
            </div>
        </div>
    );
}

export default CountUpDown;
