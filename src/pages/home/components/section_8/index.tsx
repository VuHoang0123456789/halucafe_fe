import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Title from '../title';

const cx = classNames.bind(styles);

function Section_8() {
    const url = process.env.REACT_APP_DOMAIN__URL;

    const list = [
        {
            url__img: `${url}/pages/home/section_8/image-feature1.png`,
            title: 'coffee nguyên chất',
            descripton:
                'Hạt cà phê được thu hoạch và rang xay theo quy trình khép kín đúng công thức đặc biệt đảm bảo tính nguyên chất.',
        },
        {
            url__img: `${url}/pages/home/section_8/image-feature2.png`,
            title: 'pha chế độc đáo',
            descripton:
                'Bí kíp tạo nên sự độc là trong từng thức uống đó chính là phương pháp pha chế độc đáo của Thanh Tùng Coffee.',
        },
        {
            url__img: `${url}/pages/home/section_8/image-feature3.png`,
            title: 'dessert đặc biệt',
            descripton:
                'Các món bánh tráng miệng và hoa quả tại Thanh Tùng Coffee được chế biến theo phong cách Châu Âu với nhiều hương vị khác.',
        },
    ];

    return (
        <section className={cx('section_8')}>
            <div className={cx('wrap')}>
                <div className={cx('container')} style={{ marginBottom: '0' }}>
                    <Title
                        heading={'Vì sao nên chọn HaluCafe'}
                        descripton={
                            'Không những mang đến sự tuyệt vời thông qua các thức uống bí mật mà hơn thế nữa là cảm giác bạn tận hưởng được chỉ khi đến với Halu Cafe.'
                        }
                    />
                    <div className={cx('content')}>
                        <ul>
                            {list.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className={cx('section8__content-item')}>
                                            <div className={cx('box__image')}>
                                                <img src={item.url__img} alt={item.title} />
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p>{item.descripton}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Section_8;
