import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Instance } from '@popperjs/core';
import { useRef, MouseEvent } from 'react';

interface Props {
    title?: string;
    children?: any;
}
function TooltipCustomed({ title, children }: Props) {
    let isMove = true;
    const positionRef = useRef<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const popperRef = useRef<Instance>(null);

    const handleMouseMove = (event: MouseEvent) => {
        if (!isMove) {
            return;
        }
        positionRef.current = { x: event.clientX, y: event.clientY };
        if (popperRef.current != null) {
            popperRef.current.update();
        }

        setTimeout(() => {
            isMove = false;
        }, 1000);
    };
    const handleMouseLeave = () => {
        isMove = true;
    };

    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            fontSize: 14,
            color: 'var(--text-color)',
            backgroundColor: 'var(--white-color)',
            minWidth: 50,
            whiteSpace: 'nowrap',
            maxWidth: 150,
            lineHeight: 1.7,
            textAlign: 'center',
            padding: '0 5px',
            boxShadow: '1px 1px 5px var(--box-shadow-color)',
            borderRadius: 0,
        },
    });

    return (
        <CustomTooltip
            title={title}
            enterDelay={1000}
            enterNextDelay={1000}
            placement="bottom-start"
            PopperProps={{
                popperRef,
                anchorEl: {
                    getBoundingClientRect: () => {
                        return new DOMRect(positionRef.current.x + 5, positionRef.current.y + 5, 0, 0);
                    },
                },
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </CustomTooltip>
    );
}

export default TooltipCustomed;
