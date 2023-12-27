import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { faComments, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';
import { CallApi, FormatTime, FormmatDate, GetCookie } from '@/method/until';
import EmojiPicker from 'emoji-picker-react';

const host = 'http://localhost:8080';

const cx = classNames.bind(styles);

interface messageType {
    to: string;
    msg: string;
    sender: boolean;
}

function FormChat() {
    const [message_value, setMessageValue] = useState('');
    const [isMiniForm, setIsMiniForm] = useState(true);
    const user = useSelector((state: RootState) => state.user);
    const [messages, setMessages] = useState([] as messageType[]);
    const socketRef = useRef<Socket>({} as Socket);
    const scrollbar = useRef<HTMLDivElement>(null);
    const wrapFormChatRef = useRef<HTMLDivElement>(null);
    const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
    const formHeightRef = useRef<HTMLDivElement>(null);
    const [isShowForm, setIsShowFrom] = useState(false);
    const [limit, setLimit] = useState(3);

    useEffect(() => {
        socketRef.current = io(host, {
            withCredentials: true,
        });

        if (user.customer_id !== -1) {
            socketRef.current.emit('add-user', user.email);

            socketRef.current.on('send-data-server', (msg) => {
                const message = {
                    msg,
                    sender: false,
                    to: user.email,
                };

                setMessages((prev) => [...prev, ...[message]]);
            });
        }

        return () => {
            socketRef.current.close();
        };
    }, [user]);

    useEffect(() => {
        scrollbar.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!isMiniForm) return;
        if (user.customer_id === -1) return;

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const body = {
            sender: user.email,
            receiver: 'hallu-coffee',
        };

        CallApi(`${process.env.REACT_APP_DOMAIN_URL_BE}/chat/get-all-message?limit=${limit}`, 'post', header, body)
            .then((res: any) => {
                if (res) {
                    const arr = [] as messageType[];

                    for (let i = 0; i < res.length; i++) {
                        arr.push({ to: res[i].receiver, msg: res[i].msg, sender: res[i].sender === user.email });
                    }

                    setMessages(arr);
                }

                setIsShowFrom(true);
            })
            .catch((error: Error) => console.log(error));
    }, [user, isMiniForm, limit]);

    function KeyEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            SendMessage();
        }
    }

    function ChangeEmojiClick(emoji: any) {
        setMessageValue((prev) => `${prev} ${emoji}`);
    }

    async function SendMessage() {
        try {
            if (message_value.replace(/\s+/g, '').trim().length > 0) {
                const msg = {
                    msg: message_value,
                    to: 'halu-coffee',
                };

                socketRef.current.emit('send-data-client', msg);

                setMessages((prev) => [...prev, ...[{ to: 'halu-coffe', msg: message_value, sender: true }]]);
                setMessageValue('');

                const date = new Date();
                const date_format = `${FormmatDate(date.toString())} ${FormatTime(date.toString())}`;
                const header = {
                    'Content-Type': 'application/json',
                    access_token: GetCookie('_user') || '',
                };

                const body = {
                    sender: user.email,
                    receiver: 'hallu-coffee',
                    msg: message_value,
                    create_at: date_format,
                    delete_at: date_format,
                };

                const res = await CallApi(
                    `${process.env.REACT_APP_DOMAIN_URL_BE}/chat/add-new-message`,
                    'post',
                    header,
                    body,
                );
                if (res.status === 500 || res.status === 400) console.log(res.msg);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function ShowMiniForm() {
        if (!wrapFormChatRef.current || !formHeightRef.current) return;

        const wrapFormChat = wrapFormChatRef.current as HTMLElement;
        const formHeight = formHeightRef.current as HTMLDivElement;

        wrapFormChat.style.bottom = '-100%';
        wrapFormChat.style.borderRadius = '0';
        wrapFormChat.style.borderTopLeftRadius = '8px';
        wrapFormChat.style.borderTopRightRadius = '8px';

        setTimeout(() => {
            setIsMiniForm(false);
            wrapFormChat.style.bottom = ` calc(-${formHeight.offsetHeight}px + 30.8px)`;
        }, 500);
    }

    function ShowMaxForm() {
        if (!wrapFormChatRef.current) return;

        const wrapFormChat = wrapFormChatRef.current as HTMLElement;

        setIsMiniForm(true);
        wrapFormChat.style.bottom = '50px';
        wrapFormChat.style.borderRadius = '10px';
    }

    function CheckScroll(e: React.MouseEvent<HTMLElement>) {
        const element = e.target as HTMLElement;

        if (element.scrollTop !== 0) return;

        setLimit((prev) => (prev += 3));
    }

    return isShowForm ? (
        <div className={cx('wrap_form-chat')} ref={wrapFormChatRef}>
            {isMiniForm ? (
                <div className={cx('form_chat')} onClick={() => setIsShowEmojiPicker(false)} ref={formHeightRef}>
                    <header className={cx('form_chat-header', 'flex__center')}>
                        <div className={cx('left', 'flex__center')}>
                            <img
                                className={cx('img_logo')}
                                src={`${process.env.REACT_APP_DOMAIN__URL_FE}/logo192.png`}
                                alt="halu coffee"
                            />
                            <div style={{ flex: 1 }}>
                                <h3>Nhâm viên tư vấn</h3>
                                <p>Giải đáp</p>
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <div className={cx('icon')} onClick={ShowMiniForm}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>
                    </header>

                    <div className={cx('wrap_content_footer')}>
                        <main className={cx('form_chat-content')} onScroll={CheckScroll}>
                            <div style={{ height: '16px', width: '100%' }}></div>
                            <div className={cx('content_item-wrap')} ref={scrollbar} style={{ margin: 0 }}>
                                <div className={cx('content_item')}>
                                    <img
                                        className={cx('img_logo')}
                                        src={`${process.env.REACT_APP_DOMAIN__URL_FE}/logo192.png`}
                                        alt="halu coffee"
                                    />
                                    <p>
                                        Chào mừng quý khách đến với HaluCafe, hay gửi tin nhắn trực tiếp cho shop nếu
                                        bạn có bất kì nghi vấn gì. HalucCafe xin trân thành cảm ơn quý khách!
                                    </p>
                                </div>
                            </div>

                            {messages.map((item, index) => {
                                return item?.sender ? (
                                    <div
                                        className={cx('content_item-wrap', 'content_item-me')}
                                        key={index}
                                        ref={scrollbar}
                                    >
                                        <div className={cx('content_item')}>
                                            <p>{item.msg}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={cx('content_item-wrap')} key={index} ref={scrollbar}>
                                        <div className={cx('content_item')}>
                                            <img
                                                className={cx('img_logo')}
                                                src={`${process.env.REACT_APP_DOMAIN__URL_FE}/logo192.png`}
                                                alt="halu coffee"
                                            />
                                            <p>{item.msg}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div style={{ height: '16px', width: '100%' }}></div>
                        </main>
                        <footer className={cx('form_chat-input', 'flex__center')}>
                            <textarea
                                placeholder="Nhập nội dung..."
                                maxLength={1000}
                                value={message_value}
                                onChange={(e) => setMessageValue(e.target.value)}
                                onKeyDown={(e) => KeyEnter(e)}
                            />
                            <div className={cx('right')}>
                                <div
                                    className="font-size18 flex__center"
                                    style={{ cursor: 'pointer', lineHeight: 'normal' }}
                                >
                                    <div className={cx('picker_wrap')}>
                                        <FontAwesomeIcon
                                            icon={faFaceSmile}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsShowEmojiPicker(!isShowEmojiPicker);
                                            }}
                                        />
                                        <div className={cx('picker')} onClick={(e) => e.stopPropagation()}>
                                            {isShowEmojiPicker ? (
                                                <EmojiPicker
                                                    onEmojiClick={(Emoji, e) => {
                                                        ChangeEmojiClick(Emoji.emoji);
                                                    }}
                                                    width={300}
                                                    height={300}
                                                />
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                    {message_value.replace(' ', '').length > 0 ? (
                                        <p
                                            className="text-uppercase font-size14 space-l10 blue-color font-weight500"
                                            onClick={SendMessage}
                                        >
                                            Gửi
                                        </p>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <span>HaluCafe</span>
                            </div>
                        </footer>
                    </div>
                </div>
            ) : (
                <div className={cx('wrap_mini_chat')}>
                    <div className={cx('mini_chat')} onClick={ShowMaxForm}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faComments} />
                        </div>
                        <p>Chat với nhân viên tư vấn</p>
                    </div>
                    <div style={{ flex: '1', background: 'var(--white-color)' }}></div>
                </div>
            )}
        </div>
    ) : (
        <></>
    );
}

export default FormChat;
