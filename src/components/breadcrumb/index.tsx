import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

interface Props {
    breadcrumb: {
        title: string;
        listItem: { link: string; name: string }[];
    };
}

function Breadcrumb({ breadcrumb }: Props) {
    return (
        <div className={cx('breadcrumb__container')}>
            <ul className={cx('breadcrumb')}>
                {breadcrumb.listItem.map((item, index) => {
                    return (
                        <li className={cx('breadcrumb__item')} key={index}>
                            <Link to={item.link}>{item.name}</Link>

                            <div className={cx('breadcrumb__item-icon')}>
                                <FontAwesomeIcon icon={faSquareFull} />
                            </div>
                        </li>
                    );
                })}
            </ul>
            <h3 className={cx('breadcrumb__title')}>{breadcrumb.title}</h3>
        </div>
    );
}

export default Breadcrumb;
