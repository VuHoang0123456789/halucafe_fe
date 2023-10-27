import { ReactNode } from 'react';
import './styles.css';

interface Props {
    children?: ReactNode;
}

function GlobalStyles({ children }: Props) {
    return <>{children}</>;
}

export default GlobalStyles;
