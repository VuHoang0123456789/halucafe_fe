import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import Layout from '../components/layout';
import ListShare from '@/components/button/list__share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeColectionState } from '@/reduce/slice/colectionCategorySlice';
import { useEffect, useState } from 'react';
import { RootState } from '@/reduce/store';
import { CallApi, FormatDateDb, FormatTime, FormmatDate, GetCookie } from '@/method/until';
import { feedbackType, postType } from '@/type';
import CommentComp from './components/comment';
import FormComment from './components/form_comment';
import { commenType } from '@/type';
import PostContent from './components/contentPost';

const cx = classNames.bind(styles);

function PostInfo() {
    const dispath = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [comments, setComments] = useState<commenType[]>([] as commenType[]);
    const breadcrumb = {
        title: 'Chế biến cà phê',
        listItem: [
            { link: '/trang-chu', name: 'Trang chủ' },
            { link: '/tin-tuc', name: 'Tin tức' },
            { link: '/che-bien-ca-phe', name: 'Chế biến cà phê' },
        ],
    };
    const [relatedPosts, setRelatedPosts] = useState<postType[]>([] as postType[]);
    const [post_info, setPostInfo] = useState<postType>({} as postType);
    const pathName = useLocation().pathname;

    useEffect(() => {
        document.title = `${post_info.post_name} halucafe`;
    }, [post_info]);

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
                            slug: 'coffee',
                            product_name: 'Coffee',
                        },
                        {
                            slug: 'tra-sua',
                            product_name: 'Trà sữa',
                        },
                        {
                            slug: 'nuoc-ep',
                            product_name: 'Nước ép',
                        },
                        {
                            slug: 'cocktail',
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
    }, [dispath]);

    const Banners = [`${process.env.REACT_APP_DOMAIN__URL}/pages/introduce/sitebar/aside_banner.png`];

    useEffect(() => {
        CallApi(
            `${process.env.REACT_APP_DOMAIN_URL_BE}/posts/get-post/${
                pathName.split('/')[pathName.split('/').length - 1]
            }`,
            'get',
        )
            .then((result: postType) => {
                if (result) {
                    setPostInfo(result);
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [pathName]);

    useEffect(() => {
        if (!post_info.slug) return;

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        CallApi(
            `${process.env.REACT_APP_DOMAIN_URL_BE}/comments/get-all-comment?post_slug=${post_info.slug}&customer_id=${user.customer_id}`,
            'get',
            header,
        )
            .then((result: commenType[]) => {
                if (result) setComments(result);
                else setComments([]);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [post_info, user]);

    useEffect(() => {
        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const body = {
            slug: post_info.slug,
            post_author: post_info.post_author,
        };

        CallApi(`${process.env.REACT_APP_DOMAIN_URL_BE}/posts/get-posts-related?limit=2`, 'post', header, body)
            .then((result: postType[]) => {
                if (result) {
                    setRelatedPosts((prev: postType[]) => {
                        prev = [] as postType[];
                        return [...prev, ...result];
                    });
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, [post_info]);

    async function SendComment(comment: commenType) {
        if (user.customer_id === -1) return;

        comment = { ...comment, create_at: new Date().toString() };

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const body = {
            author_id: user.customer_id,
            note: comment.note,
            create_at: `${FormatDateDb(comment.create_at)} ${FormatTime(comment.create_at)}`,
            slug: post_info.slug,
        } as commenType;

        const result = await CallApi(
            `${process.env.REACT_APP_DOMAIN_URL_BE}/comments/add-new-comment`,
            'post',
            header,
            body,
        );

        if (result) {
            setComments((prev: commenType[]) => [...[{ ...comment }], ...prev]);
            return true;
        }

        return false;
    }

    async function SendFeeback(feedback: feedbackType) {
        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const isAddNewFeedback = await CallApi(
            `${process.env.REACT_APP_DOMAIN_URL_BE}/comments/add-new-feedback`,
            'post',
            header,
            feedback,
        );

        if (!isAddNewFeedback) return false;

        const addIndex = comments.findIndex((item) => item.comment_id === feedback.comment_id);
        const newComment = { ...comments[addIndex] };
        const list_comment = [...comments];

        if (newComment.feebacks) newComment.feebacks.push(feedback);
        else newComment.feebacks = [...[feedback]];

        list_comment.splice(addIndex, 1, newComment);
        setComments(list_comment);
        return true;
    }

    async function handleClickLike(arr: any[], index: number, isLike?: string) {
        let url = `${process.env.REACT_APP_DOMAIN_URL_BE}/comments/like-or-dislike`;

        const body = {
            customer_id: user.customer_id,
            comment_id: arr[index].feedback_of_comment_id ? arr[index].feedback_of_comment_id : arr[index].comment_id,
            is_like: isLike ? isLike : 'undefined',
        };

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const list_comment = [...arr];

        const isLikeComment = await CallApi(url, 'post', header, body);

        if (isLikeComment) {
            let comment = {
                ...arr[index],
                like_count: arr[index].like_count * 1 + 1,
                is_like: 1,
            };

            if (isLike === 'like') {
                comment = {
                    ...arr[index],
                    like_count: arr[index].like_count * 1 - 1 > 0 ? arr[index].like_count * 1 - 1 : 0,
                    is_like: 0,
                };
            }

            if (isLike === 'dislike') {
                comment = {
                    ...arr[index],
                    like_count: arr[index].like_count * 1 + 1,
                    dislike_count: arr[index].dislike_count * 1 - 1 > 0 ? arr[index].dislike_count * 1 - 1 : 0,
                    is_like: 1,
                    is_dislike: 0,
                };
            }

            list_comment.splice(index, 1, comment);
        }

        return list_comment;
    }

    async function handleClickDisLike(arr: any[], index: number, isDislike?: string) {
        let url = `${process.env.REACT_APP_DOMAIN_URL_BE}/comments/dislike-of-like`;

        const body = {
            customer_id: user.customer_id,
            comment_id: arr[index].feedback_of_comment_id ? arr[index].feedback_of_comment_id : arr[index].comment_id,
            is_dislike: isDislike ? isDislike : 'undefined',
        };

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const list_comment = [...arr];

        const is_dislike = await CallApi(url, 'post', header, body);

        if (is_dislike) {
            let comment = {
                ...arr[index],
                dislike_count: arr[index].dislike_count * 1 + 1,
                is_dislike: 1,
            };

            if (isDislike === 'dislike') {
                comment = {
                    ...arr[index],
                    dislike_count: arr[index].dislike_count * 1 - 1 > 0 ? arr[index].dislike_count * 1 - 1 : 0,
                    is_dislike: 0,
                };
            }

            if (isDislike === 'like') {
                comment = {
                    ...arr[index],
                    dislike_count: arr[index].dislike_count * 1 + 1,
                    like_count: arr[index].like_count * 1 - 1 > 0 ? arr[index].like_count * 1 - 1 : 0,
                    is_dislike: 1,
                    is_like: 0,
                };
            }

            list_comment.splice(index, 1, comment);
        }

        return list_comment;
    }

    return (
        <div className={cx('posts__info-page')}>
            <Layout Banners={Banners} breadcrumb={breadcrumb}>
                <div className={cx('space-b15', 'post_content')}>
                    <p
                        style={{
                            textTransform: 'uppercase',
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '10px',
                            lineHeight: '1.4',
                        }}
                    >
                        {post_info?.post_name}
                    </p>
                    <span>
                        Đăng bởi <span className="font-weight600">{post_info?.post_author}</span> vào lúc{' '}
                        <span className="font-weight600">{FormatTime(post_info?.post_date)}</span> ngày{' '}
                        <span className="font-weight600">{FormmatDate(post_info?.post_date)}</span>
                    </span>
                    <div className="space-t10" style={{ lineHeight: '1.7' }}>
                        <PostContent text={post_info.post_content} />
                    </div>
                </div>
                <div>
                    <ListShare url_image={''} />
                    <div className={cx('title')}>
                        <h1 className="font-size20 space-t20">Tin liên quan</h1>
                    </div>
                    <div className="space-b30">
                        {relatedPosts.map((item, index) => (
                            <aside key={index}>
                                <Link className="flex__center" to={`/tin-tuc/${item.slug}`}>
                                    <FontAwesomeIcon className="space-r5" icon={faCaretRight} />
                                    <h2 className="font-size14">{item.post_name}</h2>
                                </Link>
                            </aside>
                        ))}
                    </div>

                    <div style={{ lineHeight: '0' }}>
                        <h3 className="font-size16 space-b10 space-t10">Bình luận</h3>
                        <FormComment SendComment={SendComment} />
                    </div>

                    <div className={cx('wrap_comments')}>
                        {comments.map((item, index) => (
                            <div key={index}>
                                <CommentComp
                                    comment={item}
                                    likeComment={async (isLike?: string) => {
                                        const list_comment = await handleClickLike(comments, index, isLike);

                                        setComments(list_comment);
                                    }}
                                    disLikeComment={async (isDislike?: string) => {
                                        const list_comment = await handleClickDisLike(comments, index, isDislike);

                                        setComments(list_comment);
                                    }}
                                    SendComment={SendComment}
                                    SendFeeback={SendFeeback}
                                />

                                {item.feebacks?.map((feedback, feedbackIndex) => (
                                    <div key={feedbackIndex} style={{ paddingLeft: '50px' }}>
                                        <CommentComp
                                            feeback={feedback}
                                            likeComment={async (isLike?: string) => {
                                                if (!item.feebacks) return;

                                                const list_feedback = await handleClickLike(
                                                    item.feebacks,
                                                    feedbackIndex,
                                                    isLike,
                                                );
                                                const list_comment = [...comments];

                                                const comment = { ...item, feebacks: list_feedback };

                                                list_comment.splice(index, 1, comment);
                                                setComments(list_comment);
                                            }}
                                            disLikeComment={async (isDislike?: string) => {
                                                if (!item.feebacks) return;

                                                const list_feedback = await handleClickDisLike(
                                                    item.feebacks,
                                                    feedbackIndex,
                                                    isDislike,
                                                );
                                                const list_comment = [...comments];

                                                const comment = { ...item, feebacks: list_feedback };

                                                list_comment.splice(index, 1, comment);
                                                setComments(list_comment);
                                            }}
                                            SendComment={SendComment}
                                            SendFeeback={SendFeeback}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default PostInfo;
