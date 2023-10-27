import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import Breadcrumb from '@/components/breadcrumb';
import Sitebar from '@/components/sitebar';
import { ReactNode } from 'react';
import { ProductsType, fillterType } from '@/type';

const cx = classNames.bind(styles);

export type breadcrumbType = {
    title: string;
    listItem: { link: string; name: string }[];
};

interface Props {
    children: ReactNode;
    fillters?: fillterType;
    Products?: ProductsType;
    Banners: string[];
    breadcrumb: breadcrumbType;
}

function Layout({ children, fillters, Products, Banners, breadcrumb }: Props) {
    return (
        <div className={cx('container', 'layout__container-wrap')}>
            <section className={cx('breadcrumb')}>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section>
            <section className={cx('page')}>
                <div className="row">
                    <div className={cx('wrap')}>
                        <Sitebar fillters={fillters} products={Products} banner={Banners} />
                        <div className={cx('content')}>{children}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Layout;
