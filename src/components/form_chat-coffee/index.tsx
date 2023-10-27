import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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

function FormChatHallu() {
    const [message_value, setMessageValue] = useState('');
    const [isShow, setIshow] = useState(true);
    const user = useSelector((state: RootState) => state.user);
    const [messages, setMessages] = useState([] as messageType[]);
    const socketRef = useRef<Socket>({} as Socket);
    const scrollbar = useRef<HTMLDivElement>(null);
    const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
    // const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socketRef.current = io(host, {
            withCredentials: true,
        });

        if (user.customer_id !== -1) {
            socketRef.current.emit('add-user', 'hallu-coffee');

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
        if (user.customer_id === -1) return;

        const header = {
            'Content-Type': 'application/json',
            access_token: GetCookie('_user') || '',
        };

        const body = {
            sender: 'hallu-coffee',
            receiver: user.email,
        };

        CallApi(`${process.env.REACT_APP_DOMAIN_URL_BE}/chat/get-all-message`, 'post', header, body)
            .then((res: any) => {
                if (res) {
                    const arr = [] as messageType[];

                    for (let i = 0; i < res.length; i++) {
                        arr.push({ to: res[i].receiver, msg: res[i].msg, sender: res[i].sender === 'hallu-coffee' });
                    }

                    setMessages((prev) => [...prev, ...arr]);
                }
            })
            .catch((error: Error) => console.log(error));
    }, [user]);

    // useEffect(() => {
    //     if (!pickerRef.current) return;

    //     if (isShowEmojiPicker) {
    //         pickerRef.current.style.width = '300px';
    //         pickerRef.current.style.height = '300px';
    //         pickerRef.current.style.opacity = '1';
    //     } else {
    //         pickerRef.current.style.width = '0';
    //         pickerRef.current.style.height = '0';
    //         pickerRef.current.style.opacity = '0';
    //     }
    // }, [isShowEmojiPicker]);

    function KeyEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter') SendMessage();
    }

    function ChangeEmojiClick(emoji: any, e: any) {
        e.stopPropagation();
        setMessageValue((prev) => `${prev} ${emoji}`);
    }

    async function SendMessage() {
        try {
            if (message_value.replace(/\s+/g, '').trim().length > 0) {
                const msg = {
                    msg: message_value,
                    to: user.email,
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

    return isShow ? (
        <div className={cx('form_chat')} onClick={() => setIsShowEmojiPicker(false)}>
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
                    <div className={cx('icon')} onClick={() => setIshow(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
            </header>
            <main className={cx('form_chat-content')}>
                <div style={{ height: '16px', width: '100%' }}></div>
                {messages.map((item, index) => {
                    return item?.sender ? (
                        <div className={cx('content_item-wrap', 'content_item-me')} key={index} ref={scrollbar}>
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
                    aria-multiline={false}
                />
                <div className={cx('right')}>
                    <div className="font-size18 flex__center" style={{ cursor: 'pointer', lineHeight: 'normal' }}>
                        <div className={cx('picker_wrap')}>
                            <FontAwesomeIcon
                                icon={faFaceSmile}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsShowEmojiPicker(!isShowEmojiPicker);
                                }}
                            />
                            <div className={cx('picker')}>
                                {isShowEmojiPicker ? (
                                    <EmojiPicker
                                        onEmojiClick={(Emoji, e) => {
                                            ChangeEmojiClick(Emoji.emoji, e);
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
    ) : (
        <></>
    );
}

export default FormChatHallu;
