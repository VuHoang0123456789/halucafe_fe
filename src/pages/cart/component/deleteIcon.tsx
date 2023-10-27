import { deleteCartItem } from '@/reduce/slice/cartSlice';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '../styles.module.scss';

const cx = classNames.bind(styles);

function DeleteIcon({ params }: any) {
    const dispath = useDispatch();

    return (
        <div className={cx('delete__icon')} onClick={() => dispath(deleteCartItem(params.row))}>
            <FontAwesomeIcon icon={faTrashCan} />
        </div>
    );
}

export default DeleteIcon;
