import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import Layout from '../components/layout';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { changeColectionState } from '@/reduce/slice/colectionCategorySlice';
import LoadedComp from '@/components/loaded';
import { Pagination } from '@mui/material';
import { CallApi, FormmatDate } from '@/method/until';
import { postType } from '@/type';

const cx = classNames.bind(styles);

function NewsPage() {
    const dispath = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [maxPage, setMaxPage] = useState(1);
    const [pageIndex, setPageIndex] = useState(1);
    const [limit] = useState(3);
    const [posts, setPosts] = useState<postType[]>([] as postType[]);
    const Banners = [`${process.env.REACT_APP_DOMAIN__URL}/pages/introduce/sitebar/aside_banner.png`];

    const breadcrumb = {
        title: 'Tin tức',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/tin-tuc', name: 'Tin tức' },
        ],
    };

    // useEffect(() => {
    //     const posts = [
    //         {
    //             post_link: '/tin-tuc/che-bien-ca-phe',
    //             post_count_comment: 0,
    //             post_name: 'Chế biến cà phê',
    //             post_author: 'Nguyễn Hữu Mạnh',
    //             post_date: '04/04/2019',
    //             post_content:
    //                 'Cà phê sạch hiểu đơn giản là 100% cà phê, không pha trộn thêm bất cứ thứ gì khác. Vậy quy trình sản xuất chế biến cà phê sạch như thế nào',
    //             url_thumbnail_480: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog3_480.png`,
    //             url_thumbnail_medium: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog3_medium.png`,
    //             url_thumbnail_max: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog3_medium.png`,
    //         },
    //         {
    //             post_link: '/tin-tuc/tinh-yeu-va-cafe',
    //             post_count_comment: 0,
    //             post_name: 'Tình yêu và cafe',
    //             post_author: 'Nguyễn Hữu Mạnh',
    //             post_date: '04/04/2019',
    //             post_content:
    //                 'TÌNH YÊU VÀ CÀ PHÊ Yêu một người cũng giống yêu một hương vị cà phê. Có thể mất rất ít thời gian để thích, để khám phá. Nhưng cả tình yêu...',
    //             url_thumbnail_480: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog2_480.png`,
    //             url_thumbnail_medium: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog2_medium.png`,
    //             url_thumbnail_max: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog2_medium.png`,
    //         },
    //         {
    //             post_link: '/tin-tuc/lang-nghe-cafe-ke-chuyen',
    //             post_count_comment: 0,
    //             post_name: 'Lắng nghe cà phê kể chuyện',
    //             post_author: 'Nguyễn Hữu Mạnh',
    //             post_date: '04/04/2019',
    //             post_content:
    //                 'Cuộc đời cafe, cũng như cuộc đời của con người, cũng phải 9 tháng 10 ngày thai nghén mới được thu hoạch. Cafe cũng có quãng thời gian t...',
    //             url_thumbnail_480: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog1_480.png`,
    //             url_thumbnail_medium: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog1_medium.png`,
    //             url_thumbnail_max: `${process.env.REACT_APP_DOMAIN__URL}/pages/news/blog1_medium.png`,
    //         },
    //     ];

    //     const maxPage = posts.length / 3;
    //     const postsPage = [] as post[];

    //     for (let i = pageIndex * 3 - 3; i < pageIndex * 3; i++) {
    //         postsPage.push(posts[i]);
    //     }

    //     setMaxPage(maxPage);
    //     setPosts(postsPage);
    // }, [pageIndex]);

    useEffect(() => {
        document.title = 'Tin tức halucafe';
    }, []);

    useEffect(() => {
        const ColectionCategory = {
            title: 'Danh mục bài viết',
            list: [
                {
                    slug: 'trang-chu',
                    category_name: 'Trang chủ',
                },
                {
                    slug: 'gioi-thieu',
                    category_name: 'Giới thiệu',
                },
                {
                    slug: 'collections/all',
                    category_name: 'Sản phẩm',
                    lv2Item: [
                        {
                            slug: 'collections/coffee',
                            product_name: 'Coffee',
                        },
                        {
                            slug: 'collections/tra-sua',
                            product_name: 'Trà sữa',
                        },
                        {
                            slug: 'collections/nuoc-ep',
                            product_name: 'Nước ép',
                        },
                        {
                            slug: 'collections/cocktail',
                            product_name: 'Cocktail',
                        },
                    ],
                },
                {
                    slug: 'tin-tuc',
                    category_name: 'Tin tức',
                },
                {
                    slug: 'lien-he',
                    category_name: 'Liên hệ',
                },
            ],
        };

        dispath(changeColectionState(ColectionCategory));

        setTimeout(() => {
            setIsLoaded(true);
        }, 500);
    }, [dispath]);

    useEffect(() => {
        CallApi(
            `${process.env.REACT_APP_DOMAIN_URL_BE}/posts/get-all-posts?page_index=${
                pageIndex * limit - limit
            }&limit=${limit}`,
            'get',
        )
            .then((result: postType[]) => {
                if (result) {
                    setPosts(result);
                    setMaxPage(result[0].max_row / limit);
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [limit, pageIndex]);

    return (
        <div className={cx('news__container')}>
            {isLoaded ? <></> : <LoadedComp />}
            <Layout Banners={Banners} breadcrumb={breadcrumb}>
                <div className="row">
                    <div className={cx('wrap__content')}>
                        <ul>
                            {posts.map((item, index) => {
                                return (
                                    <li className={cx('post__box')} key={index}>
                                        <div className={cx('post__box-thumbnail')}>
                                            <Link to={`/tin-tuc/${item?.slug}`}>
                                                <picture>
                                                    <source
                                                        media="(max-width: 46.25em)"
                                                        srcSet={item?.url_thumbnail_480}
                                                    />
                                                    <source
                                                        media="(max-width: 46.25em) and (max-width: 63.938em)"
                                                        srcSet={item?.url_thumbnail_medium}
                                                    />

                                                    <img src={item?.url_thumbnail_max} alt={item?.post_name} />
                                                </picture>
                                            </Link>
                                        </div>
                                        <div className={cx('post__box-info')}>
                                            <h1 className={cx('post__name')}>
                                                <Link to={`/tin-tuc/${item?.slug}`}>{item?.post_name}</Link>
                                            </h1>
                                            <span className={cx('post__meta')}>
                                                <p className={cx('post__author')}>{item?.post_author} -</p>
                                                <p className={cx('post__date')}>{FormmatDate(item?.post_date)}</p>
                                                <p className={cx('post__count-comment')}>
                                                    - {item?.post_count_comment}
                                                </p>
                                                <p>bình luận</p>
                                            </span>
                                            <p className={cx('post__content')}>{item?.post_content_title}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        {maxPage > 1 ? (
                            <div className={cx('wrap__pagination')}>
                                <Pagination
                                    className={cx('pagination')}
                                    count={maxPage}
                                    shape="rounded"
                                    size="large"
                                    onChange={(e: any, page: number) => {
                                        setPageIndex(page);
                                    }}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default NewsPage;
