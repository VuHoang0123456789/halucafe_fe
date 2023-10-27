import { FormatPrice } from '@/method/until';
import classNames from 'classnames/bind';
import styles from '../styles.module.scss';

const cx = classNames.bind(styles);

function RowItem({ value }: any) {
    return <div className={cx('row__item')}>{`${FormatPrice(value)}₫`}</div>;
}

export default RowItem;
