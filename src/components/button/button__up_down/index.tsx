import { useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

interface Props {
    Disabled?: boolean;
}

function BtnUpDown({ Disabled }: Props) {
    const [isShow, setIsShow] = useState(false);

    return (
        <div
            className={cx('icon')}
            onClick={() => {
                if (Disabled) {
                    return;
                }
                setIsShow(!isShow);
            }}
        >
            {isShow ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
        </div>
    );
}

export default BtnUpDown;
