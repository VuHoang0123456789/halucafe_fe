import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface props {
    isDisLike?: string;
    count?: number;
    disLikeComment: (isDislike?: string) => void;
}

function DisLikeComp({ isDisLike, count, disLikeComment }: props) {
    function handleClick() {
        disLikeComment(isDisLike);
    }

    return (
        <div className={cx('wrap_share')}>
            <div className={cx('wrap_icon')} onClick={handleClick}>
                {!isDisLike ? (
                    <FontAwesomeIcon icon={faThumbsDown} />
                ) : (
                    <FontAwesomeIcon icon={isDisLike !== 'dislike' ? faThumbsDown : faThumbsDownSolid} />
                )}
            </div>
            <p className={cx('count')}>{count}</p>
        </div>
    );
}

export default DisLikeComp;
