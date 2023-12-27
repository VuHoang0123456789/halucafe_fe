import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { commenType, feedbackType } from '@/type';
import { Link } from 'react-router-dom';
import { FormatDateDb, FormatTime } from '@/method/until';

interface props {
    comment_of_feedback?: commenType | feedbackType;
    SendComment: (comment: commenType) => Promise<boolean | undefined>;
    SendFeeback?: (feedback: feedbackType) => Promise<boolean | undefined>;
}

function FormComment({ SendComment, comment_of_feedback, SendFeeback }: props) {
    const user = useSelector((state: RootState) => state.user);
    const [comment, setComment] = useState<commenType>({} as commenType);
    const [isValidate, setIsValidate] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (user.customer_id === -1) return;

        setComment((prev: commenType) => {
            return { ...prev, author_id: user.customer_id, author_name: user.show_name, avatar: user.avatar };
        });
    }, [user]);

    useEffect(() => {
        if (!comment.note) {
            setIsValidate(false);
            return;
        }

        if (comment.note.replace(/\s/g, '').length > 0 && comment.author_id !== -1) {
            setIsValidate(true);
        } else {
            setIsValidate(false);
        }
    }, [comment]);

    function EnterKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        HandleSendComment();
    }

    function ChangeValue(e: ChangeEvent<HTMLTextAreaElement>) {
        setComment({ ...comment, [e.target.name]: e.target.value });
    }

    async function HandleSendComment() {
        if (comment_of_feedback && SendFeeback) {
            const feedback: feedbackType = {
                create_at: `${FormatDateDb(new Date().toString())} ${FormatTime(new Date().toString())}`,
                note: comment.note,
                author_id: user.customer_id,
                author_name: user.show_name,
                dislike_count: 0,
                like_count: 0,
                avatar: user.avatar,
                comment_id: comment_of_feedback.comment_id,
                receiver_id: comment_of_feedback.author_id,
                receiver_name: comment_of_feedback.author_name,
            };

            if (await SendFeeback(feedback)) setComment({ ...comment, note: null });

            return;
        }

        if (await SendComment(comment)) setComment({ ...comment, note: null });
    }

    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    return user.customer_id === -1 ? (
        <div className="flex__center">
            Vui lòng
            <Link to={'/account/login'} style={{ padding: '0 3px', color: 'var(--info-color)' }}>
                Đăng nhập
            </Link>
            để sử dụng chức năng bình luận
        </div>
    ) : (
        <div>
            <textarea
                ref={textAreaRef}
                placeholder="Nội dung"
                rows={6}
                name="note"
                value={comment?.note ? comment.note : ''}
                onChange={ChangeValue}
                onKeyDown={EnterKeyPress}
            />

            <div className="flex__center">
                <input className="width-45 space-r5" placeholder="Họ tên" value={user.show_name} disabled />
                <input className="width-45 space-l5 space-r5" placeholder="Email" value={user.email} disabled />
                <button
                    className="default width-10 space-l5 space-b8"
                    disabled={!isValidate}
                    onClick={HandleSendComment}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}

export default FormComment;
