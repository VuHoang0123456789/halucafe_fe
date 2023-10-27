import { ProductType } from '@/type';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../styles.module.scss';

const cx = classNames.bind(styles);

interface CartType extends ProductType {
    count: number;
}

function ProductNameComp({ params }: any) {
    const row = params.row as CartType;

    return (
        <Link to={`/${row.slug}`}>
            <div className={cx('row__item')} style={{ color: 'var(--text-color)' }}>
                {row.product_name}
            </div>
        </Link>
    );
}

export default ProductNameComp;
