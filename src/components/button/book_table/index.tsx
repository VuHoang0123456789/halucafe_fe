import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function BtnBookTable() {
    return (
        <Link to={'/dat-ban'}>
            <div className={cx(cx('container'))}>
                <div className={cx('wrap')}>
                    <span>Đặt bàn</span>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BtnBookTable;
