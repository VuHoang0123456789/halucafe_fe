import classNames from 'classnames/bind';
import style from './styles.module.scss';

const cx = classNames.bind(style);

function LoadedComp() {
    return (
        <div className={cx('loaded_comp')}>
            <div className={cx('loaded_backgroud')}></div>
        </div>
    );
}

export default LoadedComp;
