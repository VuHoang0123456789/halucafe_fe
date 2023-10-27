import { ProductType } from '@/type';
import { decreaseCartItem, increaseCartItem } from '@/reduce/slice/cartSlice';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '../styles.module.scss';

const cx = classNames.bind(styles);

interface CartType extends ProductType {
    count: number;
}

function WrapCount({ params }: any) {
    const row = params.row as CartType;
    const dispath = useDispatch();

    return (
        <div className={cx('count')}>
            <div className={cx('wrap__item')}>
                <button onClick={() => dispath(decreaseCartItem(row))} disabled={row.count - 1 === 0}>
                    -
                </button>
                <input value={row.count} disabled />
                <button
                    onClick={() => dispath(increaseCartItem(row))}
                    disabled={row.count + 1 >= row.original_number - row.quantity_sold}
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default WrapCount;
