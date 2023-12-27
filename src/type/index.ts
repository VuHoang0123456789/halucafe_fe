export type ProductType = {
    category_id: number;
    category_name: string;
    description: string;
    original_number: number;
    price: number;
    product_id: string;
    product_name: string;
    quantity_sold: number;
    sale_percent: number;
    sale_status: boolean;
    slug: string;
    trademark: string;
    url_images_large: string[];
    url_images_small: string[];
};

export type itemSelectionType = {
    key: string;
    value: string;
};

export type fillterListItemType = {
    title: string;
    item__selection: itemSelectionType[];
};

export type ProductsType = {
    title: string;
    list: ProductType[];
};

export type fillterType = {
    title: string;
    listItem: fillterListItemType[];
};

export type fillterStateSlice = {
    title: string;
    listItem: {
        title: string;
        item__selection: itemSelectionType[];
    }[];
};

export type toppingType = {
    topping_id: number;
    topping_name: string;
    price: number;
};

export type productInfoType = {
    product: ProductType;
    toppings?: toppingType[];
};

export type dataCartBody = {
    customer_id: number;

    products: {
        count: number;
        product_id: string;
        price: number;
    }[];
};

export type colectionCategoryType = {
    title: string;
    list: {
        slug: string;
        category_name: string;
        lv2Item?: {
            slug: string;
            product_name: string;
        }[];
    }[];
};

export type ProductStateSlice = {
    category_id: number;
    category_name: string;
    description: string;
    original_number: number;
    price: number;
    product_id: string;
    product_name: string;
    quantity_sold: number;
    sale_percent: number;
    sale_status: boolean;
    slug: string;
    trademark: string;
    url_images_large: string[];
    url_images_small: string[];
};

export type userStateSlice = {
    email: string;
    show_name: string;
    address_full: string;
    customer_id: number;
    avatar: string;
};

export type ProvinceType = {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
}[];

export type districtType = {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
    wards: [];
}[];

export type AddressType = {
    address_id: number;
    address_info: string;
    country_name: string;
    customer_id: number;
    district_name: string;
    full_name: string;
    is_default: boolean;
    phone: string;
    province_name: string;
    ward_name: string;
    zip_id: string;
};

export type orderType = {
    create_at: string;
    full_address: string;
    order_id: number;
    pay_status: boolean;
    total: number;
    transport_status: boolean;
};

export interface postType {
    slug: string;
    max_row: number;
    post_count_comment: number;
    post_name: string;
    post_author: string;
    post_date: string;
    post_content: string;
    post_content_title: string;
    url_thumbnail_480: string;
    url_thumbnail_medium: string;
    url_thumbnail_max: string;
}

export interface feedbackType {
    feedback_of_comment_id?: number;
    author_id: number;
    author_name?: string;
    note: string | null;
    comment_id?: number;
    create_at: string;
    update_at?: string;
    dislike_count?: number;
    like_count?: number;
    receiver_id: number;
    receiver_name?: string;
    is_like?: number;
    avatar: string;
    is_dislike?: number;
}

export interface commenType {
    author_id: number;
    author_name?: string;
    note: string | null;
    comment_id?: number;
    create_at: string;
    slug: string;
    update_at?: string | null;
    dislike_count?: number;
    like_count?: number;
    is_like?: number;
    is_dislike?: number;
    avatar: string;
    feebacks?: feedbackType[];
}
