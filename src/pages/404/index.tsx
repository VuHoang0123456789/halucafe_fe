import classNames from 'classnames/bind';
import style from './styles.module.scss';
import Breadcrumb from '@/components/breadcrumb';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

function Pages404() {
    const { t, i18n } = useTranslation('translation');
    const [language, setLanguage] = useState('vie');
    const breadcrumb = {
        title: '404 không tìm thấy trang',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/404', name: '404 không tìm thấy trang' },
        ],
    };

    useEffect(() => {
        document.title = '404 halucafe';
    }, []);

    const changeLanguage = () => {
        setLanguage((prev) => (prev === 'vie' ? 'eng' : 'vie'));
    };

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    return (
        <div className="container" style={{ marginBottom: '0' }}>
            <section className={cx('breadcrumb')}>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section>
            <div className="row">
                <section className={cx('page_404')}>
                    {/* <h1>Lỗi không tìm thấy trang</h1> */}
                    <h1>{t('title')}</h1>
                    <p>Xin lỗi, chúng tôi không tìm thấy kết quả nào phù hợp. Xin vui lòng quay lại trang chủ</p>
                    <div className={cx('btn_home')}>
                        <Link to={'/trang-chu'}>Về trang chủ</Link>
                    </div>

                    <button style={{ display: 'none' }} onClick={changeLanguage}>
                        Change language
                    </button>
                </section>
            </div>
        </div>
    );
}

export default Pages404;
