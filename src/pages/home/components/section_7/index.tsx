import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Title from '../title';
import Carousel from 'react-material-ui-carousel';

const cx = classNames.bind(styles);

function Section_7() {
    const url = process.env.REACT_APP_DOMAIN__URL;

    const listImage = [
        {
            url: `${url}/pages/home/section_7/avatar-testimonial1.jpg`,
            name: 'Ngô Thanh Vân',
            descripton:
                'Cà phê đúng gu, thức uống ngon và khá đặc biệt hơn nữa dessert ở đây luôn là loại vừa ý với mình nhất. IziCoffee luôn làm cho mọi giác quan của mình kích thích tối đa.',
        },
        {
            url: `${url}/pages/home/section_7/avatar-testimonial2.jpg`,
            name: 'Hà duy khương',
            descripton:
                'Mình rất thích đưa khách hàng của mình đến đây bởi vì phong cách rất chuyên nghiệp. Hơn nữa thức uống ở đây rất ngon, có hương vị rất khác biệt, các vị khách của mình vô cùng thích.',
        },
        {
            url: `${url}/pages/home/section_7/avatar-testimonial3.jpg`,
            name: 'Hà minh tuyết',
            descripton:
                'Phong cách coffee tại IziCoffee vô cùng khác biệt nhưng lại hợp ý mình. Mình và các bạn của mình mỗi khi gặp mặt thì đều đến đây cả. Mong IziCoffee luôn cho nhiều thức uống mới nhé.',
        },
    ];

    return (
        <section className={cx('section_7')}>
            <div className={cx('wrap')}>
                <div className={cx('container')} style={{ marginBottom: '0' }}>
                    <Title
                        heading={'Khách hàng nói gì'}
                        descripton={'1500+ Khách hàng hài lòng'}
                        whiteColor={'color'}
                    />
                    <div className={cx('content')}>
                        <div className={cx('carousel')}>
                            <Carousel
                                swipe={true}
                                animation="slide"
                                duration={600}
                                interval={5000}
                                IndicatorIcon={<div></div>}
                                navButtonsWrapperProps={{
                                    style: {
                                        display: 'none',
                                    },
                                }}
                                indicatorIconButtonProps={{
                                    style: {
                                        width: 10,
                                        height: 10,
                                        marginRight: 5,
                                        backgroundColor: '#eae7de',
                                    },
                                }}
                                activeIndicatorIconButtonProps={{
                                    style: {
                                        width: 36,
                                        height: 10,
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        backgroundColor: 'var(--yellow-color)',
                                    },
                                }}
                            >
                                {listImage.map((item, index) => {
                                    return (
                                        <div className={cx('card')} key={index}>
                                            <div className={cx('avatar')}>
                                                <img src={item.url} alt={item.name} />
                                            </div>
                                            <h3>{item.name}</h3>
                                            <p className={cx('review__content')}>{item.descripton}</p>
                                        </div>
                                    );
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Section_7;
