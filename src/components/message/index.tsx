import classNames from 'classnames/bind';
import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
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
    const [messages, setMessages] = useState<messages[]>([] as messages[]);
    const colors = [
        {
            type: 'success',
            color: '--success-color',
        },
        {
            type: 'cancel',
            color: '--cancel-color',
        },
        {
            type: 'info',
            color: ' --info-color',
        },
    ];

    useEffect(() => {
        let arr = [...messages] as messages[];
        const newMessage = { ...message, id: arr.length };
        arr.push(newMessage);
        setMessages(arr);

        setTimeout(() => {
            const removeIndex = arr.findIndex((item) => item.id === newMessage.id);

            arr.splice(removeIndex, 1);

            console.log(arr);
            setMessages(arr);
        }, 4200);
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
                        <FontAwesomeIcon icon={faCheckCircle} />
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
