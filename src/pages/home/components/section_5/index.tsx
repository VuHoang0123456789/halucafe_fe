import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';

const cx = classNames.bind(styles);

function Section_5() {
    const url = process.env.REACT_APP_DOMAIN__URL;

    const listImage = [
        { url: `${url}/pages/home/section_5/sec_quy_trinh_images1.jpg` },
        { url: `${url}/pages/home/section_5/sec_quy_trinh_images2.jpg` },
        { url: `${url}/pages/home/section_5/sec_quy_trinh_images3.jpg` },
    ];

    return (
        <section className={cx('section__5')}>
            <div className={cx('container', 'section5__container')}>
                <div className="row">
                    <div className={cx('flex', 'wrap')}>
                        <div className={cx('section5__item', 'left')}>
                            <div className={cx('left__wrap')}>
                                <h1>
                                    Quy trình làm <br /> COFFEE
                                </h1>
                                <p>
                                    Chúng tôi muốn bạn tự hào cho chính bản thân mình hương vị cà phê theo ý thích. Đó
                                    là bản chất cơ bản nhất để có những tách cà phê thơm ngon nhất
                                </p>
                                <Link to={'/home'}>
                                    <button className="button__global">Khám phá quy trình</button>
                                </Link>
                                <div className={cx('section5__thumbnail')}>
                                    <img src={`${url}/pages/home/section_5/icon-cf.png`} alt="Quy trình làm coffee" />
                                </div>
                            </div>
                        </div>
                        <div className={cx('section5__item', 'right')}>
                            <div className={cx('section5__carousel')}>
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
                                            transition: '0',
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
                                    indicatorContainerProps={{
                                        style: {
                                            marginLeft: '35px',
                                            textAlign: 'left',
                                        },
                                    }}
                                >
                                    {listImage.map((item, index) => {
                                        return (
                                            <div className={cx('card')} key={index}>
                                                <img src={item.url} alt="Quy trình làm coffee" />
                                            </div>
                                        );
                                    })}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Section_5;
