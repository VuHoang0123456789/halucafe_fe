import { Link } from 'react-router-dom';

interface ProductImageProps {
    url_image: string;
    product__name: string;
    product__link: string;
}

function ProductImage({ url_image, product__name, product__link }: ProductImageProps) {
    return (
        <div style={{ padding: '28.195px 30px 28.195px 20px' }}>
            <Link to={`/${product__link}`}>
                <img src={url_image} alt={product__name} style={{ maxHeight: 98 }} />
            </Link>
        </div>
    );
}

export default ProductImage;
