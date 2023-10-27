import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faPinterest, faSquareFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton, EmailShareButton } from 'react-share';

const cx = classNames.bind(styles);

interface Props {
    url_image: string;
}

function ListShare({ url_image }: Props) {
    const url = window.location.href;
    return (
        <div className="flex__center">
            <p className="space-r5 font-size14 font-weight700">Chia sẻ: </p>
            <ul className="flex__center">
                <li>
                    <FacebookShareButton url={url}>
                        <div className={cx('btn__share', 'btn__facebook')}>
                            <FontAwesomeIcon icon={faSquareFacebook} />
                        </div>
                    </FacebookShareButton>
                </li>
                <li>
                    <TwitterShareButton url={url}>
                        <div className={cx('btn__share', 'btn__twiter')}>
                            <FontAwesomeIcon icon={faTwitter} />
                        </div>
                    </TwitterShareButton>
                </li>
                <li>
                    <PinterestShareButton url={url_image} media={url_image}>
                        <div className={cx('btn__share', 'btn__pinterest')}>
                            <FontAwesomeIcon icon={faPinterest} />
                        </div>
                    </PinterestShareButton>
                </li>
                <li>
                    <EmailShareButton url={url}>
                        <div className={cx('btn__share', 'btn__google')}>
                            <FontAwesomeIcon icon={faGooglePlusG} />
                        </div>
                    </EmailShareButton>
                </li>
            </ul>
        </div>
    );
}

export default ListShare;
