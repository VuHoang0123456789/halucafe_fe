import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

function Title({ heading, descripton, whiteColor }: any) {
    return (
        <div className={cx('title')}>
            <h1>{heading}</h1>
            <p className={cx(whiteColor ? 'white-color' : '')}>{descripton}</p>
        </div>
    );
}

export default Title;
