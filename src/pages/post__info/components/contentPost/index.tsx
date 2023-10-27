import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

interface props {
    text: string;
}

function PostContent({ text }: props) {
    return (
        <div className={cx('wrap_post-content')}>
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
        </div>
    );
}

export default PostContent;
