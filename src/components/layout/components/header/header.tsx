import { Link, useNavigate } from 'react-router-dom';
import Styles from './styles.module.scss';
import classNames from 'classnames/bind';
import Category from './components/catagory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCartShopping, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import CartComponent from './components/cart';
import CustomTooltip from '@/components/tooltip';
import { useEffect, useState } from 'react';
import BtnUpDown from '../../../button/button__up_down';
import { LogOut } from '@/method/auth';
import { RootState } from '@/reduce/store';
import { useSelector } from 'react-redux';

const cx = classNames.bind(Styles);

function Header() {
    const user = useSelector((state: RootState) => state.user);
    const url = window.location.href;
    const arr = [
        {
            name__food: 'Coffe',
            list__food: [
                {
                    name: 'Espresso',
                    link: '/espresso',
                },
                {
                    name: 'Cappuccino',
                    link: '/cappuccino',
                },
                {
                    name: 'Vanilla Latte',
                    link: '/vanilla-latte',
                },
                {
                    name: 'Caramel Machiato',
                    link: '/caramel-machiato',
                },
            ],
            link__food: '/coffe',
        },
        {
            name__food: 'Nước ép',
            list__food: [
                {
                    name: 'Cam',
                    link: '/cam',
                },
                {
                    name: 'Táo',
                    link: '/táo',
                },
                {
                    name: 'Dứa',
                    link: '/dua',
                },
                {
                    name: 'Dưa hấu',
                    link: '/dua-hau',
                },
            ],
            link__food: '/nuoc-ep',
        },
        {
            name__food: 'Trà sữa',
            list__food: [
                {
                    name: 'Kiwi',
                    link: '/kiwi',
                },
                {
                    name: 'Bạc hà',
                    link: '/bac-ha',
                },
                {
                    name: 'Khoai môn',
                    link: '/khoai-mon',
                },
                {
                    name: 'Khoai tây',
                    link: '/khoai-tay',
                },
            ],
            link__food: '/tra-sua',
        },
        {
            name__food: 'Cocktail',
            list__food: [
                {
                    name: 'Cocktail Bloody Mary',
                    link: '/cocktail-bloody-mary',
                },
                {
                    name: 'Cocktail Mojito',
                    link: '/cocktail-mojito',
                },
                {
                    name: 'Cocktail B-52',
                    link: '/cocktail b-52',
                },
                {
                    name: 'Cocktail Bacardi',
                    link: '/cocktail-bacardi',
                },
            ],
            link__food: '/cocktail',
        },
    ];
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const headerNav = document.getElementsByClassName(cx('nav__header-js'))[0];

        if (window.innerWidth >= 1024) {
            headerNav.classList.remove('is-hidden');
        }
        if (window.innerWidth < 1024) {
            headerNav.classList.add('is-hidden');
        }

        // scroll
        const header = document.getElementById('header');

        window.addEventListener('scroll', scrollFunction);

        function scrollFunction() {
            if (!header) {
                return;
            }

            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                if (url.includes('trang-chu')) {
                    header.classList.remove('home__page');
                }

                header.classList.add(cx('stick'));
            } else {
                if (url.includes('trang-chu')) {
                    header.classList.add('home__page');
                }

                header.classList.remove(cx('stick'));
            }
        }

        //home page
        if (header) {
            if (url.includes('trang-chu')) {
                header.classList.add('home__page');
            } else {
                header.classList.remove('home__page');
            }
        }

        return () => {
            window.removeEventListener('scroll', scrollFunction);
        };
    }, [url]);

    function isActive(str: string) {
        if (url.includes(str)) {
            return true;
        } else {
            return false;
        }
    }

    function ShowListItem(e: any) {
        if (window.innerWidth > 1023) {
            return;
        }

        let li = e.target;

        while (li.nodeName !== 'LI') {
            li = li.parentElement;
        }

        const elementShow = li.nextElementSibling;

        if (!elementShow) {
            return;
        }

        if (elementShow.className.includes('is-hidden')) {
            elementShow.classList.remove('is-hidden');
        } else {
            elementShow.classList.add('is-hidden');
        }
    }

    function Search() {
        setSearchValue('');
        return navigate(`/search?query=${searchValue}`);
    }

    return (
        <header className={cx('header')} id="header">
            <div className={cx('container')}>
                <div className={cx('header__left')}>
                    <div className={cx('logo')}>
                        <CustomTooltip title="halucafe">
                            <Link to="/trang-chu">
                                <img className={cx('image')} src="/logo192.png" alt="halu cafe" />
                            </Link>
                        </CustomTooltip>
                    </div>

                    <div className={cx('main-nav')}>
                        <div
                            className={cx('menu__icon')}
                            onClick={() => {
                                const headerNav = document.getElementsByClassName(cx('nav__header-js'))[0];

                                if (headerNav) {
                                    if (headerNav.className.includes('is-hidden')) {
                                        headerNav.classList.remove('is-hidden');
                                    } else {
                                        headerNav.classList.add('is-hidden');
                                    }
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                        <nav className={cx('nav__header-js')}>
                            <ul>
                                <li className={cx('nav__item', isActive('/trang-chu') ? 'active' : '')}>
                                    <CustomTooltip title={'Trang chủ'}>
                                        <Link to={'/trang-chu'}>Trang chủ</Link>
                                    </CustomTooltip>
                                </li>

                                <li className={cx('nav__item', isActive('/gioi-thieu') ? 'active' : '')}>
                                    <CustomTooltip title={'Giới thiệu'}>
                                        <Link to={'/gioi-thieu'}>Giới thiệu</Link>
                                    </CustomTooltip>
                                </li>

                                <li
                                    id="category__nav"
                                    className={cx('nav__item', isActive('/collections/all') ? 'active' : '')}
                                >
                                    <Link to={'/collections/all'}>Sản phẩm </Link>
                                    <div className={cx('icon')} onClick={ShowListItem}>
                                        <BtnUpDown Disabled />
                                    </div>

                                    <Category />
                                </li>
                                <li
                                    className={cx('nav__item', 'list-category', 'is-hidden')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <ul>
                                        {arr.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <li>
                                                        <Link to={item.link__food}>{item.name__food}</Link>
                                                        <div className={cx('icon')} onClick={ShowListItem}>
                                                            <BtnUpDown />
                                                        </div>
                                                    </li>
                                                    <li className={cx('list-category__item', 'is-hidden')}>
                                                        <ul>
                                                            {item.list__food.map((food, index) => {
                                                                return (
                                                                    <li key={index}>
                                                                        <Link to={food.link}>{food.name}</Link>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </li>
                                                </div>
                                            );
                                        })}
                                    </ul>
                                </li>
                                <li className={cx('nav__item', isActive('/tin-tuc') ? 'active' : '')}>
                                    <CustomTooltip title="Tin tức">
                                        <Link to={'/tin-tuc'}>Tin tức</Link>
                                    </CustomTooltip>
                                </li>

                                <li className={cx('nav__item', isActive('/lien-he') ? 'active' : '')}>
                                    <CustomTooltip title="Liên Hệ">
                                        <Link to={'/lien-he'}>Liên hệ</Link>
                                    </CustomTooltip>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className={cx('header__right')}>
                    <div className={cx('box-right')}>
                        <div className={cx('icon', 'form__search')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <div className={cx('search')}>
                                <div className={cx('search__icon')} onClick={Search}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </div>
                                <input
                                    placeholder="Tìm kiếm..."
                                    style={{ fontSize: '14px' }}
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            Search();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx('icon', 'cart')} id="cart">
                            <Link to={'/cart'}>
                                <FontAwesomeIcon icon={faCartShopping} />
                                <div className={cx('cart__count-item')} id="total-count-cart">
                                    0
                                </div>
                            </Link>
                            <CartComponent />
                        </div>

                        <div className={cx('icon', 'personal')}>
                            <FontAwesomeIcon icon={faUser} />

                            <div className={cx('personal__form')}>
                                {user?.show_name === '' ? (
                                    <ul>
                                        <Link to={'/account/login'}>
                                            <li>Đăng nhập</li>
                                        </Link>
                                        <Link to={'/account/register'}>
                                            <li>Đăng ký</li>
                                        </Link>
                                    </ul>
                                ) : (
                                    <ul>
                                        <Link to={'/account'}>
                                            <li>{user.show_name}</li>
                                        </Link>

                                        <li onClick={LogOut}>Đăng xuất</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
