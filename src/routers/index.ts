import DefaultLayout from '@/components/layout/defaultLayout';
import HomePage from '@/pages/home';
import IntroducePage from '@/pages/introduce';
import AllProduct from '@/pages/alll__product';
import NewsPage from '@/pages/news';
import ContactPages from '@/pages/contact';
import RegisterPage from '@/pages/register';
import LoginPage from '@/pages/login';
import CartPage from '@/pages/cart';
import CheckOutPage from '@/pages/check_out';
import Product_Info from '@/pages/product__info';
import ManagerPersonal from '@/pages/manage_personal';
import CheckOutThanksYou from '@/pages/check_out_thank_you';
import BookPages from '@/pages/book';
import PostInfo from '@/pages/post__info';
import ResultSearch from '@/pages/result_search';
import Pages404 from '@/pages/404';

const publicRouters = [
    { path: '/trang-chu', element: HomePage, layout: DefaultLayout },
    { path: '/gioi-thieu', element: IntroducePage, layout: DefaultLayout },

    { path: '/collections/:slug/', element: AllProduct, layout: DefaultLayout },
    { path: '/tin-tuc', element: NewsPage, layout: DefaultLayout },
    { path: '/lien-he', element: ContactPages, layout: DefaultLayout },
    { path: '/:slug', element: Product_Info, layout: DefaultLayout },
    { path: '/dat-ban', element: BookPages, layout: DefaultLayout },
    { path: '/tin-tuc/:slug', element: PostInfo, layout: DefaultLayout },
    { path: '/search/', element: ResultSearch, layout: DefaultLayout },
    { path: '/404', element: Pages404, layout: DefaultLayout },
];
const privateRouters = [
    { path: '/cart', element: CartPage, layout: DefaultLayout },
    { path: '/checkout/:slug', element: CheckOutPage },
    { path: '/account', element: ManagerPersonal, layout: DefaultLayout },
    { path: '/account/orders', element: ManagerPersonal, layout: DefaultLayout },
    { path: '/account/orders/:slug', element: ManagerPersonal, layout: DefaultLayout },
    { path: '/account/change-password', element: ManagerPersonal, layout: DefaultLayout },
    { path: '/account/address', element: ManagerPersonal, layout: DefaultLayout },
    { path: '/checkout/thankyou/:slug', element: CheckOutThanksYou },
];
const authRouters = [
    { path: '/account/register', element: RegisterPage, layout: DefaultLayout },
    { path: '/account/login', element: LoginPage, layout: DefaultLayout },
];
export { publicRouters, privateRouters, authRouters };
