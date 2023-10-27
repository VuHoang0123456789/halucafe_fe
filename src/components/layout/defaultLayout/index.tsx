import { ReactNode } from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Styles from './styles.module.scss';
import classNames from 'classnames/bind';
import CategoryNav from '../components/header/components/category_nav';
import BtnTop from '@/components/button/top';
import BtnBookTable from '@/components/button/book_table';

const cx = classNames.bind(Styles);

interface Props {
    children?: ReactNode;
}
function DefaultLayout({ children }: Props) {
    return (
        <div className={cx('main')}>
            <BtnTop />
            <BtnBookTable />
            <Header />
            <CategoryNav />
            <main className={cx('content')}>{children}</main>
            <Footer />
        </div>
    );
}
export default DefaultLayout;
