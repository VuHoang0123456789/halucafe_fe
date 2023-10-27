import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function BtnTop() {
    useEffect(() => {
        const btnToTop = document.getElementsByClassName(cx('back-to-top'))[0];
        window.addEventListener('scroll', () => {
            scrollFunction();
        });

        function scrollFunction() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                btnToTop.classList.add(cx('show'));
            } else {
                btnToTop.classList.remove(cx('show'));
            }
        }

        return () => {
            window.addEventListener('scroll', () => {
                scrollFunction();
            });
        };
    }, []);

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    return <div className={cx('back-to-top')} onClick={topFunction}></div>;
}

export default BtnTop;
