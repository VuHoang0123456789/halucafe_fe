import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import LikeComp from '../dislike_and_like_button/like_comp';
import DisLikeComp from '../dislike_and_like_button/dislike_comp';
import { useEffect, useState } from 'react';
import { commenType, feedbackType } from '@/type';
import FormComment from '../form_comment';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { faShare } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

interface props {
    comment?: commenType;
    feeback?: feedbackType;
    likeComment: (isLike?: string) => void;
    disLikeComment: (isDislike?: string) => void;
    SendComment: (comment: commenType) => Promise<boolean | undefined>;
    SendFeeback: (feedback: feedbackType) => Promise<boolean | undefined>;
}

function CommentComp({ comment, feeback, likeComment, disLikeComment, SendComment, SendFeeback }: props) {
    const [islike_or_dislike, setIsLikeOrDislike] = useState<string | undefined>();
    const [is_show_form_comment, setIsShowFormComment] = useState(false);
    const user = useSelector((state: RootState) => state.user);

    function ControllFormCommnent() {
        if (comment) {
            if (comment.author_id === user.customer_id) {
                setIsShowFormComment(false);

                return;
            }
        }

        if (feeback) {
            if (feeback.author_id === user.customer_id) {
                setIsShowFormComment(false);

                return;
            }
        }

        setIsShowFormComment(!is_show_form_comment);
    }

    useEffect(() => {
        if (comment) {
            if (comment.is_like !== undefined && comment.is_like * 1 !== 0) {
                setIsLikeOrDislike('like');
                return;
            }

            if (comment.is_dislike !== undefined && comment.is_dislike * 1 !== 0) {
                setIsLikeOrDislike('dislike');
                return;
            }
        }

        if (feeback) {
            if (feeback.is_like !== undefined && feeback.is_like * 1 !== 0) {
                setIsLikeOrDislike('like');
                return;
            }

            if (feeback.is_dislike !== undefined && feeback.is_dislike * 1 !== 0) {
                setIsLikeOrDislike('dislike');
                return;
            }
        }

        setIsLikeOrDislike(undefined);
    }, [comment, feeback]);

    function CheckTime(dateEnd: Date, dateStart: Date) {
        const result = dateEnd.valueOf() - dateStart.valueOf();

        const second = result / 1000;
        if (second < 1)
            return {
                type: {
                    vn: 'milisecond',
                    eng: 'milisecond',
                },
                value: Math.floor(result),
            };

        const minute = second / 60;
        if (minute < 1)
            return {
                type: {
                    vn: 'Giây',
                    eng: 'second',
                },
                value: Math.floor(second),
            };

        const house = minute / 60;
        if (house < 1)
            return {
                type: {
                    vn: 'phút',
                    eng: 'minute',
                },
                value: Math.floor(minute),
            };

        const day = house / 24;
        if (day < 1)
            return {
                type: {
                    vn: 'giờ',
                    eng: 'house',
                },
                value: Math.floor(house),
            };

        const week = day / 7;
        if (week < 1)
            return {
                type: {
                    vn: 'ngày',
                    eng: 'day',
                },
                value: Math.floor(day),
            };

        const month = week / 4;
        if (month < 1)
            return {
                type: {
                    vn: 'tuẩn',
                    eng: 'week',
                },
                value: Math.floor(week),
            };

        const year = month / 12;
        if (year < 1)
            return {
                type: {
                    vn: 'tháng',
                    eng: 'month',
                },
                value: Math.floor(month),
            };

        return {
            type: {
                vn: 'năm',
                eng: 'year',
            },
            value: Math.floor(year),
        };
    }

    function CommentDate(date: Date) {
        const end = new Date();
        const start = new Date(date);

        const result = CheckTime(end, start);
        const resultString = `${result.value} ${result.type.vn}`;

        return resultString;
    }

    return comment ? (
        <div className={cx('container')}>
            <div className="flex">
                <div className={cx('wrap_image')}>
                    <img src={comment?.avatar} alt="avatar" />
                </div>
                <aside className={cx('wrap_comment')}>
                    <div className={cx('wrap_item-top')}>
                        <span className={cx('item_top')}>
                            <span className={cx('commentator')}>{comment.author_name}</span>
                            <span className={cx('comment_date_time')}>
                                {' '}
                                {CommentDate(new Date(comment.create_at))} trước
                            </span>
                        </span>
                    </div>

                    <div className={cx('item_middle')}>
                        <p className={cx('comment_content')}>{comment.note}</p>
                    </div>

                    <div className={cx('item_bottom', 'flex__center')}>
                        <div className={cx('wrap_share')} style={{ padding: 0 }} onClick={ControllFormCommnent}>
                            <div className={cx('wrap_icon')}>
                                <FontAwesomeIcon icon={faComment} />
                            </div>
                            <p className={cx('space-l5')}>Phản hồi</p>
                        </div>

                        <div
                            className="space-l10 space-r10"
                            // onClick={() =>
                            //     setIsLikeOrDislike((prev) => {
                            //         if (prev === 'dislike') return 'like';

                            //         if (prev === 'like') return undefined;

                            //         return 'like';
                            //     })
                            // }
                        >
                            <LikeComp isLike={islike_or_dislike} count={comment.like_count} likeComment={likeComment} />
                        </div>

                        <div
                            className={cx('wrap_share')}
                            // onClick={() =>
                            //     setIsLikeOrDislike((prev) => {
                            //         if (prev === 'like') return 'dislike';

                            //         if (prev === 'dislike') return undefined;

                            //         return 'dislike';
                            //     })
                            // }
                        >
                            <DisLikeComp
                                isDisLike={islike_or_dislike}
                                count={comment.dislike_count}
                                disLikeComment={disLikeComment}
                            />
                        </div>
                    </div>
                </aside>
            </div>
            {is_show_form_comment && (
                <div className={cx('wrap_form-comment')}>
                    <FormComment comment_of_feedback={comment} SendComment={SendComment} SendFeeback={SendFeeback} />
                </div>
            )}
        </div>
    ) : feeback ? (
        <div className={cx('container')}>
            <div className="flex">
                <div className={cx('wrap_image')}>
                    <img src={feeback?.avatar} alt="avatar" />
                </div>
                <aside className={cx('wrap_comment')}>
                    <div className={cx('wrap_item-top')}>
                        <span className={cx('item_top')}>
                            <span className={cx('commentator')}>{feeback.author_name}</span>
                            <span className={cx('comment_date_time')}>
                                {' '}
                                {CommentDate(new Date(feeback.create_at))} trước
                            </span>
                        </span>
                    </div>

                    <div className={cx('item_middle')}>
                        <span className={cx('comment_content')}>
                            <span className="blue-color font-weight600">
                                <span className="font-size12">
                                    <FontAwesomeIcon icon={faShare} />
                                </span>
                                {feeback.receiver_name}
                            </span>{' '}
                            {feeback.note}
                        </span>
                    </div>

                    <div className={cx('item_bottom', 'flex__center')}>
                        <div className={cx('wrap_share')} style={{ padding: 0 }} onClick={ControllFormCommnent}>
                            <div className={cx('wrap_icon')}>
                                <FontAwesomeIcon icon={faComment} />
                            </div>
                            <p className={cx('space-l5')}>Phản hồi</p>
                        </div>

                        <div
                            className="space-l10 space-r10"
                            onClick={() =>
                                setIsLikeOrDislike((prev) => {
                                    if (prev === 'dislike') return 'like';

                                    if (prev === 'like') return undefined;

                                    return 'like';
                                })
                            }
                        >
                            <LikeComp isLike={islike_or_dislike} count={feeback.like_count} likeComment={likeComment} />
                        </div>

                        <div
                            className={cx('wrap_share')}
                            onClick={() =>
                                setIsLikeOrDislike((prev) => {
                                    if (prev === 'like') return 'dislike';

                                    if (prev === 'dislike') return undefined;

                                    return 'dislike';
                                })
                            }
                        >
                            <DisLikeComp
                                isDisLike={islike_or_dislike}
                                count={feeback.dislike_count}
                                disLikeComment={disLikeComment}
                            />
                        </div>
                    </div>
                </aside>
            </div>
            {is_show_form_comment && (
                <div className={cx('wrap_form-comment')}>
                    <FormComment comment_of_feedback={feeback} SendComment={SendComment} SendFeeback={SendFeeback} />
                </div>
            )}
        </div>
    ) : (
        <></>
    );
}
export default CommentComp;
