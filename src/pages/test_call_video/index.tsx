import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Socket, io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useSelector } from 'react-redux';
import { RootState } from '@/reduce/store';

const cx = classNames.bind(styles);

const host = 'http://localhost:8080';

function CallVideoApp() {
    const videoLargeRef = useRef<HTMLVideoElement | null>(null);
    const videoSmallRef = useRef<HTMLVideoElement | null>(null);
    const thumbnailRef = useRef<HTMLDivElement | null>(null);
    const localStream = useRef<MediaStream | undefined>();
    const socketRef = useRef<Socket>({} as Socket);
    const [me, setMe] = useState<string>('');
    const [call, setCall] = useState<any | {}>({});
    const connectionRef = useRef<any>();
    const [answerButtonEnabed, setAnswerButtonEnabed] = useState<boolean>(true);
    const [callButtonEnabed, setCallButtonEnabed] = useState<boolean>(true);
    const [leaveButtonEnabed, setLeaveButtonEnabed] = useState<boolean>(true);
    // const [callAccepted, setCallAccepted] = useState(false);
    // const [callEnded, setCallEnded] = useState(false);
    const [id, setId] = useState<string | undefined>();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        socketRef.current = io(host, {
            withCredentials: true,
        });

        socketRef.current.on('user-id', (id) => setMe(id));
        socketRef.current.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        return () => {
            socketRef.current.close();
        };
    }, []);

    useEffect(() => {
        if (call.signal) setAnswerButtonEnabed(false);
        else setAnswerButtonEnabed(true);
    }, [call]);

    useEffect(() => {
        if (id) setCallButtonEnabed(false);
        else setCallButtonEnabed(true);
    }, [id]);

    const answerCall = async () => {
        setAnswerButtonEnabed(true);
        setCallButtonEnabed(true);
        setLeaveButtonEnabed(false);

        const constraints = { video: true, audio: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream.current = stream;

        //setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        if (!videoSmallRef.current) return;
        const smallVideo = videoSmallRef.current;
        smallVideo.srcObject = stream;

        peer.on('signal', (data) => {
            socketRef.current.emit('answerCall', { signal: data, to: call.from });
        });
        peer.on('stream', (currentStream) => {
            if (!videoLargeRef.current) return;
            const largeVideo = videoLargeRef.current;
            largeVideo.srcObject = currentStream;
        });
        peer.signal(call.signal);
        connectionRef.current = peer;

        if (!thumbnailRef.current) return;
        const thumbnail = thumbnailRef.current;
        thumbnail.style.display = 'none';
    };

    const callUser = async () => {
        setCallButtonEnabed(true);
        setAnswerButtonEnabed(true);
        setLeaveButtonEnabed(false);

        const constraints = { video: true, audio: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream.current = stream;

        const name = user.show_name;
        const peer = new Peer({ initiator: true, trickle: false, stream });

        if (!videoSmallRef.current) return;
        const smallVideo = videoSmallRef.current;
        smallVideo.srcObject = stream;

        peer.on('signal', (data: any) => {
            socketRef.current.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        });
        peer.on('stream', (currentStream: any) => {
            if (!videoLargeRef.current) return;
            const largeVideo = videoLargeRef.current;
            largeVideo.srcObject = currentStream;
        });
        socketRef.current.on('callAccepted', (signal) => {
            //setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;

        if (!thumbnailRef.current) return;
        const thumbnail = thumbnailRef.current;
        thumbnail.style.display = 'none';
    };

    const leaveCall = () => {
        //setCallEnded(true);
        setLeaveButtonEnabed(true);
        connectionRef.current.destroy();
        window.location.reload();
    };

    // async function OpenCamera() {
    //     const constraints = { video: true, audio: false };
    //     const stream = await navigator.mediaDevices.getUserMedia(constraints);
    //     localStream.current = stream;

    //     if (!videoLargeRef.current) return;
    //     const largeVideo = videoLargeRef.current;
    //     largeVideo.srcObject = stream;
    //     largeVideo.muted = true;
    //     largeVideo.play();

    //     if (!videoSmallRef.current) return;
    //     const smallVideo = videoSmallRef.current;
    //     smallVideo.srcObject = stream;
    //     smallVideo.muted = true;
    //     smallVideo.play();

    //     if (!thumbnailRef.current) return;
    //     const thumbnail = thumbnailRef.current;
    //     thumbnail.style.display = 'none';
    // }

    // function CloseCamera() {
    //     if (!videoLargeRef.current) return;
    //     const largeVideo = videoLargeRef.current;
    //     largeVideo.srcObject = null;
    //     largeVideo.pause();

    //     if (!videoSmallRef.current) return;
    //     const smallVideo = videoSmallRef.current;
    //     smallVideo.srcObject = null;
    //     smallVideo.pause();

    //     localStream.current?.getTracks()[0].stop();

    //     if (!thumbnailRef.current) return;
    //     const thumbnail = thumbnailRef.current;
    //     thumbnail.style.display = 'block';
    // }

    return (
        <div className="container">
            <div className={cx('test_call-video')}>
                <div className={cx('wrap_video')}>
                    <video ref={videoLargeRef} autoPlay muted></video>
                    <div className={cx('video_small')}>
                        <video ref={videoSmallRef} autoPlay muted></video>
                    </div>
                    <div className={cx('thumbnail')} ref={thumbnailRef}></div>
                </div>
                <div className="space-l10">
                    <div className="flex" style={{ justifyContent: 'space-between' }}>
                        <button onClick={callUser} disabled={callButtonEnabed}>
                            Gọi
                        </button>

                        <button onClick={answerCall} disabled={answerButtonEnabed}>
                            Trả lời
                        </button>

                        <button onClick={leaveCall} disabled={leaveButtonEnabed}>
                            Rời khỏi
                        </button>
                    </div>

                    <div className="flex__center space-t10">
                        <h5 className="space-r10">Id:</h5>
                        <input
                            value={me}
                            onChange={(e) => setMe(e.target.value)}
                            disabled
                            style={{ flex: '1', cursor: 'text' }}
                        />
                    </div>

                    <input
                        className="space-t10"
                        style={{ width: '100%', minWidth: '240px' }}
                        type="text"
                        placeholder="Nhập id của người bạn muốn gọi"
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CallVideoApp;
