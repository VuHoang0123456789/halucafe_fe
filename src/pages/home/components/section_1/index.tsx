import classNames from 'classnames/bind';
import Styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';

const cx = classNames.bind(Styles);

function Section_1() {
    const url = process.env.REACT_APP_DOMAIN__URL;
    const [heightCarousel, setHeightCarousel] = useState(0);

    const [arr, setArr] = useState([
        {
            url__image_480: '',
            url__image: '',
        },
    ]);

    useEffect(() => {
        window.addEventListener('resize', Resize);

        function Resize() {
            setHeightCarousel(window.innerWidth * 0.41667);
        }

        Resize();
        return () => {
            window.removeEventListener('resize', Resize);
        };
    }, []);

    useEffect(() => {
        const arr = [
            {
                url__image_480: `${url}/pages/home/section_1/slider_1_480.webp`,
                url__image: `${url}/pages/home/section_1/slider_1.webp`,
            },
            {
                url__image_480: `${url}/pages/home/section_1/slider_2_480.webp`,
                url__image: `${url}/pages/home/section_1/slider_2.webp`,
            },
        ];

        setArr(arr);
    }, [url]);

    return (
        <section className={cx('section__1', 'sec__1')}>
            <Carousel
                animation="slide"
                autoPlay={false}
                swipe={true}
                duration={500}
                height={heightCarousel}
                navButtonsProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: 2,
                        height: '38px',
                        width: '26px',
                        color: 'var(--white-color)',
                        opacity: 1,
                        padding: 0,
                        margin: 0,
                    },
                }}
                indicatorIconButtonProps={{
                    style: {
                        color: 'var(--white-color)', // 3
                    },
                }}
                activeIndicatorIconButtonProps={{
                    style: {
                        color: 'var(--yellow-color)', // 2
                    },
                }}
                indicatorContainerProps={{
                    style: {
                        position: 'absolute',
                        zIndex: 1,
                        bottom: 20,
                    },
                }}
                NextIcon={<FontAwesomeIcon icon={faAngleRight} style={{ height: '18px' }} />}
                PrevIcon={<FontAwesomeIcon icon={faAngleLeft} style={{ height: '18px' }} />}
            >
                {arr.map((item, index) => {
                    return (
                        <picture key={index}>
                            <source media="(max-width: 480px)" srcSet={item.url__image_480} />
                            <img src={item.url__image} alt="section_1" id="imgjs" />
                        </picture>
                    );
                })}
            </Carousel>
        </section>
    );
}

export default Section_1;
