import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function CategoryNav() {
    const url = 'http://localhost:3000/images/header_nav/';
    const urlLocation = window.location.href;
    const arr = [
        {
            link: '/collections/coffee',
            url_image: `${url}header_category1.webp`,
            title: 'Coffee',
        },
        {
            link: '/collections/nuoc-ep',
            url_image: `${url}header_category2.png`,
            title: 'Nước ép',
        },
        {
            link: '/collections/cake',
            url_image: `${url}header_category3.png`,
            title: 'cake',
        },
        {
            link: '/collections/cocktail',
            url_image: `${url}header_category4.png`,
            title: 'cocktail',
        },
        {
            link: '/collections/sua',
            url_image: `${url}header_category5.png`,
            title: 'Sữa',
        },
        {
            link: '/collections/tra-sua',
            url_image: `${url}header_category6.png`,
            title: 'Trà',
        },
    ];

    useEffect(() => {
        const CategoryNav = document.getElementById('header__category');

        //home page
        if (CategoryNav) {
            if (window.location.href.includes('trang-chu')) {
                CategoryNav.classList.add('home__page');
            } else {
                CategoryNav.classList.remove('home__page');
            }
        }
    }, [urlLocation]);

    return (
        <div className={cx('container')} id="header__category">
            <nav className={cx('nav__category')}>
                <ul>
                    {arr.map((item, index) => {
                        return (
                            <li className={cx('nav__item')} key={index}>
                                <Link to={item.link}>
                                    <div className={cx('wrap__image')}>
                                        <img src={item.url_image} alt={item.title} />
                                        <span>{item.title}</span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

export default CategoryNav;
