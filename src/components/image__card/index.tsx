import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);
interface Props {
    children: ReactNode;
}

function ImageCard({ children }: Props) {
    return <div className={cx('wrapper__thumbnail')}>{children}</div>;
}

export default ImageCard;
