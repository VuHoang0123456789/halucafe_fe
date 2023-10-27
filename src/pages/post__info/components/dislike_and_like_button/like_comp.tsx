import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface props {
    isLike?: string;
    count?: number;
    likeComment: (isLike?: string) => void;
}

function LikeComp({ isLike, count, likeComment }: props) {
    function handleClick() {
        likeComment(isLike);
    }

    return (
        <div className={cx('wrap_share')}>
            <div className={cx('wrap_icon')} onClick={handleClick}>
                {!isLike ? (
                    <FontAwesomeIcon icon={faThumbsUp} />
                ) : (
                    <FontAwesomeIcon icon={isLike !== 'like' ? faThumbsUp : faThumbsUpSolid} />
                )}
            </div>
            <p className={cx('count')}>{count}</p>
        </div>
    );
}

export default LikeComp;
