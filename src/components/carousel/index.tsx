import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function Carousel({ children, extraWidth }: any) {
    const [widthTranslate, setWidthTranslate] = useState(0);
    const [widthCarousel, setWidthCarousel] = useState(0);
    const [childrenWidth, setChildrenWidth] = useState(0);

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current as HTMLElement;
        const children = carousel.firstChild as HTMLElement;

        children.style.transform = `translateX(-${widthTranslate}px)`;
    }, [widthTranslate]);

    useEffect(() => {
        window.addEventListener('resize', Resize);

        function Resize() {
            const carousel = carouselRef.current as HTMLElement;
            const children = carousel.firstChild as HTMLElement;

            setChildrenWidth(children.clientWidth);
            setWidthCarousel(carousel.clientWidth);
            setWidthTranslate(0);
        }

        Resize();

        return () => {
            window.removeEventListener('resize', Resize);
        };
    }, []);

    function handleClickLeft() {
        let width = widthTranslate;

        if (width - widthCarousel >= 0) {
            width -= widthCarousel;
        } else {
            width = 0;
        }

        setWidthTranslate(width);
    }

    function handleClickRight() {
        let width = widthTranslate;

        if (!extraWidth) {
            extraWidth = 0;
        }

        if (childrenWidth - (widthTranslate + widthCarousel) < widthCarousel) {
            width += childrenWidth - (widthTranslate + widthCarousel) - extraWidth;
        } else {
            width += widthCarousel + extraWidth;
        }

        setWidthTranslate(width);
    }

    // function MouseDown(event: MouseEvent<HTMLDivElement>) {
    //     const carousel = carouselRef.current as HTMLElement;
    //     const children = carousel.firstChild as HTMLElement;

    //     setPressed(true);
    //     carousel.style.cursor = 'grabbing';
    //     setStartX(event.nativeEvent.offsetX - children.offsetLeft);
    // }

    // function MouseEnter() {
    //     const carousel = carouselRef.current as HTMLElement;
    //     carousel.style.cursor = 'grab';
    // }

    // function MouseUp() {
    //     const carousel = carouselRef.current as HTMLElement;
    //     setPressed(false);
    //     carousel.style.cursor = 'grab';
    // }

    // function MouseMove(event: MouseEvent<HTMLDivElement>) {
    //     const carousel = carouselRef.current as HTMLElement;
    //     const children = carousel.firstChild as HTMLElement;

    //     if (!pressed) return;

    //     event.preventDefault();

    //     let x = event.nativeEvent.offsetX;
    //     setWidthTranslate((x - startX) * -1);

    //     if (getTranslateXY(children).translateX > 0) {
    //         setWidthTranslate(0);
    //     }

    //     // if (childrenWidth - (getTranslateXY(children).translateX * -1 + widthCarousel) < widthCarousel) {
    //     //     children.style.transform = `-${childrenWidth - widthCarousel}px`;
    //     // }
    // }

    // function getTranslateXY(element: any) {
    //     const style = window.getComputedStyle(element);
    //     const matrix = new DOMMatrixReadOnly(style.transform);
    //     return {
    //         translateX: matrix.m41,
    //         translateY: matrix.m42,
    //     };
    // }

    return (
        <div className={cx('carousel')} ref={carouselRef}>
            {children}
            <button className={cx('btn__left')} onClick={handleClickLeft}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button className={cx('btn__right')} onClick={handleClickRight}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </div>
    );
}

export default Carousel;
