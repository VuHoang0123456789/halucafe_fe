import Infomation from './infomation';
import Address from './list_address';
import Order from './order';
import PassWord from './reset_pass';
import { ConTextIndex } from '../..';
import { useContext } from 'react';

function Content() {
    const ob = useContext(ConTextIndex);

    switch (ob.index.sitebar_idex) {
        case 0:
            return <Infomation />;
        case 1:
            return <Order />;
        case 2:
            return <PassWord />;
        case 3:
            return <Address />;
        default:
            return <Infomation />;
    }
}

export default Content;
