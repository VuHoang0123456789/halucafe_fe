import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Sitebar from './components/site_bar';
import Content from './components/content';
import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import LoadedComp from '@/components/loaded';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

type IndexType = {
    sitebar_idex: number;
    order_index: number;
};

type ContextIndex = {
    index: IndexType;
    setIndex: React.Dispatch<React.SetStateAction<IndexType>>;
};

export const ConTextIndex = createContext<ContextIndex>(null as unknown as ContextIndex);

function ManagerPersonal() {
    const [index, setIndex] = useState(
        JSON.parse(localStorage.getItem('personalIndex') || JSON.stringify({ sitebar_idex: 0, order_index: -1 })),
    );
    const Value = { index, setIndex };
    const user = useSelector((state: RootState) => state.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (user.customer_id !== -1) setIsLoaded(true);
    }, [user]);

    useEffect(() => {
        localStorage.setItem('personalIndex', JSON.stringify(index));
    }, [index]);

    useEffect(() => {
        if (location.pathname.includes('/account/orders')) setIndex({ sitebar_idex: 1, order_index: -1 });
        else if (location.pathname.includes('/account/change-password')) setIndex({ sitebar_idex: 2, order_index: -1 });
        else if (location.pathname.includes('/account/address')) setIndex({ sitebar_idex: 3, order_index: -1 });
        else setIndex({ sitebar_idex: 0, order_index: -1 });
    }, [location]);

    return (
        <ConTextIndex.Provider value={Value}>
            <div className={cx('manager_personal-page')}>
                {isLoaded ? <></> : <LoadedComp />}
                <div className="container">
                    <div className="row flex">
                        <div className={cx('site__bar')}>
                            <Sitebar />
                        </div>

                        <div className={cx('content')}>
                            <Content />
                        </div>
                    </div>
                </div>
            </div>
        </ConTextIndex.Provider>
    );
}

export default ManagerPersonal;
