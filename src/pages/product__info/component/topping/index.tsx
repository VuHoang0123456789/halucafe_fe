import { useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { toppingType } from '@/type';

const cx = classNames.bind(styles);

interface Props {
    toppings: toppingType[];
    onSelectedItem?: (value: any) => void;
}

function ToppingComp({ toppings, onSelectedItem }: Props) {
    const [index, setIndex] = useState(0);
    const topingNone = [
        {
            topping_id: 0,
            topping_name: 'Không có',
            price: 0,
        },
    ] as toppingType[];

    const [listToppings] = useState([...topingNone, ...toppings] as toppingType[]);

    return listToppings.length > 1 ? (
        <div className={cx('wrap')}>
            <h1 className={cx('title')}>Topping</h1>
            <ul className={cx('toppings')}>
                {listToppings.map((topping, toppingIndex) => (
                    <li
                        key={toppingIndex}
                        className={cx('toppings_item', index === toppingIndex ? 'toppings_item-active' : '')}
                        onClick={() => {
                            setIndex(toppingIndex);
                            if (onSelectedItem) onSelectedItem(topping);
                        }}
                    >
                        {topping.topping_name}
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <></>
    );
}

export default ToppingComp;
