import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

type NewsType = {
    url__image: string;
    title: string;
    time__post: string;
    slug: string;
    description: string;
};

function Section_6() {
    const url = process.env.REACT_APP_DOMAIN__URL;
    const [coutItem, setCoutItem] = useState(3);
    const [news, setNews] = useState([] as NewsType[][]);

    useEffect(() => {
        window.addEventListener('resize', Resize);

        function Resize() {
            if (window.innerWidth >= 1024) {
                setCoutItem(3);
            } else if (window.innerWidth < 740) {
                setCoutItem(1);
            } else {
                setCoutItem(2);
            }
        }

        Resize();

        return () => {
            window.removeEventListener('resize', Resize);
        };
    }, []);

    useEffect(() => {
        const listCard = [
            {
                url__image: `${url}/pages/home/section_6/blog1.png`,
                title: 'Chế biến cà phê',
                time__post: '04/04/2023',
                slug: 'che-bien-ca-phe',
                description:
                    'Cà phê sạch hiểu đơn giản là 100% cà phê, không pha trộn thêm bất cứ thứ gì khác. Vậy quy trình s...',
            },
            {
                url__image: `${url}/pages/home/section_6/blog2.png`,
                title: 'Tình yêu và cà phê',
                slug: 'tinh-yeu-va-ca-phe',
                time__post: '04/04/2023',
                description:
                    'TÌNH YÊU VÀ CÀ PHÊ Yêu một người cũng giống yêu một hương vị cà phê. Có thể mất rất ít thời gian ...',
            },
            {
                url__image: `${url}/pages/home/section_6/blog3.png`,
                title: 'lắng nghe cà phê và kể chuyện',
                slug: 'lang-nghe-va-ke-chuyen',
                time__post: '04/04/2023',
                description:
                    'Cuộc đời cafe, cũng như cuộc đời của con người, cũng phải 9 tháng 10 ngày thai nghén mới được t...',
            },
            {
                url__image: `${url}/pages/home/section_6/blog1.png`,
                title: 'Chế biến cà phê',
                time__post: '04/04/2023',
                slug: 'che-bien-ca-phe',
                description:
                    'Cà phê sạch hiểu đơn giản là 100% cà phê, không pha trộn thêm bất cứ thứ gì khác. Vậy quy trình s...',
            },
            {
                url__image: `${url}/pages/home/section_6/blog2.png`,
                title: 'Tình yêu và cà phê',
                slug: 'tinh-yeu-va-ca-phe',
                time__post: '04/04/2023',
                description:
                    'TÌNH YÊU VÀ CÀ PHÊ Yêu một người cũng giống yêu một hương vị cà phê. Có thể mất rất ít thời gian ...',
            },
            {
                url__image: `${url}/pages/home/section_6/blog3.png`,
                title: 'lắng nghe cà phê và kể chuyện',
                slug: 'lang-nghe-va-ke-chuyen',
                time__post: '04/04/2023',
                description:
                    'Cuộc đời cafe, cũng như cuộc đời của con người, cũng phải 9 tháng 10 ngày thai nghén mới được t...',
            },
        ];

        let arr = [];
        for (let i = 0; i < listCard.length; i += coutItem) {
            let object = [];

            for (let j = i; j < i + coutItem; j++) {
                if (listCard[j]) {
                    object.push(listCard[j]);
                }
            }
            arr.push(object);
        }

        setNews(arr);
    }, [coutItem, url]);

    return (
        <section className={cx('section__6')}>
            <div className={cx('container')}>
                <div className={cx('section__6-title')}>
                    <Link to={'/tin-tuc'}>
                        <h1>Tin tức</h1>
                    </Link>
                    <p>
                        Mỗi tuần là mỗi một câu chuyện ấm áp, mỗi tuần là một câu chuyện tình. Nào cùng thưởng thức cà
                        phê và đọc nhé!
                    </p>
                </div>
                <div className={cx('section__6-content')}>
                    <Carousel
                        swipe={true}
                        animation="slide"
                        duration={600}
                        interval={5000}
                        navButtonsAlwaysInvisible={news.length === 1}
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
                        indicatorContainerProps={{
                            style: {
                                display: 'none',
                            },
                        }}
                        NextIcon={<FontAwesomeIcon icon={faAngleRight} style={{ height: '18px' }} />}
                        PrevIcon={<FontAwesomeIcon icon={faAngleLeft} style={{ height: '18px' }} />}
                    >
                        {news.map((newsItem, index) => {
                            return (
                                <div className={cx('content__item')} key={index}>
                                    {newsItem.map((item, index) => {
                                        return (
                                            <Card
                                                key={index}
                                                className={cx('card')}
                                                sx={{
                                                    position: 'relative',
                                                    borderRadius: '15px',
                                                    background: 'var(--white-color)',
                                                    marginRight: '15px',
                                                    boxShadow: 'none',
                                                }}
                                            >
                                                <CardActionArea>
                                                    <Link to={`/tin-tuc/${item.slug}`}>
                                                        <CardMedia
                                                            className={cx('card__thumbnail')}
                                                            component="img"
                                                            image={item.url__image}
                                                            alt={item.title}
                                                        />
                                                    </Link>
                                                    <CardContent sx={{ padding: '5px 15px 10px' }}>
                                                        <Link to={`/tin-tuc/${item.slug}`}>
                                                            <Typography
                                                                gutterBottom
                                                                variant="h5"
                                                                component="div"
                                                                sx={{
                                                                    height: '22px',
                                                                    margin: '10px 0',
                                                                    fontSize: '18px',
                                                                    textTransform: 'uppercase',
                                                                    fontWeight: '700',
                                                                    fontFamily: 'Quicksand, sans-serif',
                                                                    WebkitLineClamp: 1,
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    overflow: 'hidden',
                                                                    WebkitBoxOrient: 'vertical' as const,
                                                                }}
                                                            >
                                                                {item.title}
                                                            </Typography>
                                                        </Link>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '10px',
                                                                right: '10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                fontSize: '12px',
                                                                background: '#e4b95b',
                                                                color: 'var(--white-color)',
                                                                padding: '3px 10px',
                                                                borderRadius: '4px',
                                                                fontWeight: '500',
                                                                lineHeight: '1.7',
                                                                fontFamily: 'Quicksand, sans-serif',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    marginRight: '4.27px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faClock} />
                                                            </div>
                                                            {item.time__post}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '14px',
                                                                margin: '10px 0 15px 0',
                                                                lineHeight: '1.7',
                                                                color: 'var(--text-color)',
                                                                fontWeight: '500',
                                                                fontFamily: 'Quicksand, sans-serif',
                                                                letterSpacing: '0.25px',
                                                                WebkitLineClamp: 2,
                                                                display: '-webkit-box',
                                                                overflow: 'hidden',
                                                                WebkitBoxOrient: 'vertical' as const,
                                                            }}
                                                        >
                                                            {item.description}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default Section_6;
