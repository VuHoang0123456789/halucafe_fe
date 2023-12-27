import classNames from 'classnames/bind';
import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmark, faTriangleExclamation, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

interface messages {
    id?: number;
    content: string;
    type: string;
}

interface props {
    message: messages;
}

function MessageComp({ message }: props) {
    const [messages, setMessages] = useState<messages[] | []>([]);
    const colors = [
        {
            type: 'success',
            color: '--success-color',
            icon: faCheckCircle,
        },
        {
            type: 'cancel',
            color: '--cancel-color',
            icon: faTriangleExclamation,
        },
        {
            type: 'info',
            color: ' --info-color',
            icon: faExclamation,
        },
    ];

    useEffect(() => {
        setMessages((prev) => {
            let arr = [...prev] as messages[];
            const newMessage = { ...message, id: arr.length };
            arr.push(newMessage);

            setTimeout(() => {
                const removeIndex = arr.findIndex((item) => item.id === newMessage.id);

                arr.splice(0, removeIndex + 1);
                setMessages(arr);
            }, 4200);

            return arr;
        });
    }, [message]);

    function Color(typeColor: string) {
        return colors[colors.findIndex((item) => item.type === typeColor)];
    }

    function CloseItem(index: number) {
        const arr = [...messages];
        const CloseItem = document.getElementsByClassName(cx('message_item'))[index] as HTMLDivElement;

        if (!CloseItem) return;

        CloseItem.style.opacity = '0';

        setTimeout(() => {
            arr.splice(index, 1);
            setMessages(arr);
        }, 600);
    }

    return (
        <div className={cx('wrap_message')}>
            {messages.map((item, index) => (
                <div
                    className={cx('message_item')}
                    key={index}
                    style={{ borderLeft: `4px solid var(${Color(item.type)?.color})` }}
                >
                    <div className={cx('icon')} style={{ color: `var(${Color(item.type)?.color})` }}>
                        <FontAwesomeIcon icon={Color(item.type).icon} />
                    </div>
                    <p className={cx('content')}>{item.content}</p>
                    <div className={cx('icon', 'icon_close')} onClick={() => CloseItem(index)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MessageComp;
