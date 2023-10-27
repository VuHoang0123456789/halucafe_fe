import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRouters, privateRouters, authRouters } from './routers';
import { Fragment, useEffect } from 'react';
import { CallApi, GetCookie, createRandomStr, decodeString, setCookie } from './method/until';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reduce/store';
import { addNewCartItem, fetchCart, fetchCartAddNewItem } from './reduce/slice/cartSlice';
import { changeState } from './reduce/slice/userSlice';
import FormChat from './components/form_chat';

interface dataBody {
    customer_id: number;

    products: {
        count: number;
        product_id: string;
        price: number;
    }[];
}

function App() {
    const dispath = useDispatch<any>();
    const cartItems = useSelector((state: RootState) => state.cart);
    const newCartItem = useSelector((state: RootState) => state.NewCarItem);
    const user = useSelector((state: RootState) => state.user);
    const domain_url = process.env.REACT_APP_DOMAIN_URL_BE;
    const cookie = GetCookie('_user');
    const typeLogin = GetCookie('_typeLogin');

    useEffect(() => {
        const method = 'GET';
        const url = `${domain_url}/account/get-account?type_login=${decodeString(typeLogin || '')}`;
        const headers = {
            'Content-Type': 'application/json',
            access_token: cookie || '',
        };

        CallApi(url, method, headers)
            .then((result: any) => {
                if (result) dispath(changeState({ ...result, show_name: result.name || result.show_name }));
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [cookie, domain_url, typeLogin, dispath]);

    useEffect(() => {
        if (GetCookie('_user') && user.customer_id !== -1) dispath(fetchCart(user.customer_id));
    }, [dispath, user]);

    useEffect(() => {
        const formCartComp = document.getElementById('form_cart_id');

        if (formCartComp) {
            if (cartItems.length === 0) {
                formCartComp.style.display = 'none';
            }
        }

        if (GetCookie('_user') && user.customer_id !== -1) {
            const arr = [] as {
                count: number;
                product_id: string;
                price: number;
            }[];

            cartItems.forEach((item) => {
                arr.push({
                    count: item.count,
                    product_id: item.product_id,
                    price: item.price,
                });
            });

            const ob = {
                customer_id: user.customer_id,

                products: arr,
            } as dataBody;

            dispath(fetchCartAddNewItem(ob));
        }

        localStorage.setItem('_cart', JSON.stringify(cartItems));
    }, [cartItems, dispath, user]);

    useEffect(() => {
        if (!GetCookie('_order_slug')) setCookie('__order_slug', createRandomStr(30), 30);
    });

    useEffect(() => {
        if (newCartItem?.product_id) dispath(addNewCartItem(newCartItem));
    }, [newCartItem, dispath]);

    return (
        <Router>
            <div className="App">
                <FormChat />
                <Routes>
                    {publicRouters.map((item, index) => {
                        let Layout = item.layout ? item.layout : Fragment;
                        const Page = item.element;

                        return (
                            <Route
                                key={index}
                                path={item.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {privateRouters.map((item, index) => {
                        let Layout = item.layout ? item.layout : Fragment;
                        const Page = item.element;

                        return (
                            <Route
                                key={index}
                                path={item.path}
                                element={
                                    !GetCookie('_user') ? (
                                        <Navigate to={`/account/login`} replace />
                                    ) : (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    )
                                }
                            />
                        );
                    })}
                    {authRouters.map((item, index) => {
                        let Layout = item.layout ? item.layout : Fragment;
                        const Page = item.element;

                        return (
                            <Route
                                key={index}
                                path={item.path}
                                element={
                                    GetCookie('_user') ? (
                                        <Navigate to={`/account`} replace />
                                    ) : (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    )
                                }
                            />
                        );
                    })}
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
