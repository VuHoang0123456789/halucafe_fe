import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface Props {
    content: string;
}

function Tab({ content }: Props) {
    const [index, setIndex] = useState(0);
    const [tabContents, setTabContents] = useState(['']);
    const tabTitles = ['Thông tin sản phẩm', 'Chính sách', 'Đánh giá sản phẩm'];

    useEffect(() => {
        if (index === 1) {
            setTabContents(['Chính sách']);
        } else if (index === 2) {
            setTabContents(['Đánh giá sản phẩm']);
        } else {
            setTabContents([content]);
        }
    }, [index, content]);

    return (
        <section>
            <div className={cx('wrap__product-tab')}>
                <div>
                    <ul className="flex__center">
                        {tabTitles.map((item, indexTab) => (
                            <li
                                className={cx(index === indexTab ? 'active' : '')}
                                key={indexTab}
                                onClick={() => {
                                    setIndex(indexTab);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={cx('wrap__content')}>
                    {tabContents.map((item, indexTab) => (
                        <p className="space-b15 font-weight500" key={indexTab} style={{ lineHeight: '1.5' }}>
                            {item}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Tab;
