// export const BASE_URL = 'https://backend-gpj.onrender.com';
// export const BASE_URL = 'http://13.61.105.213:3001';
export const BASE_URL = 'http://localhost:3002';

export const PRODUCTS_URL = BASE_URL + '/api/products';
export const PRODUCTS_METALTYPES_URL = PRODUCTS_URL + '/metalType';
export const PRODUCTS_CATEGORIES_URL = PRODUCTS_URL + '/category';
export const PRODUCTS_BY_SEARCH_URL = PRODUCTS_URL + '/search/';
export const PRODUCTS_BY_METALTYPE_URL = PRODUCTS_URL + '/metalType/';
export const PRODUCTS_BY_CATEGORY_URL = PRODUCTS_URL + '/category/';
export const PRODUCTS_BY_ID_URL = PRODUCTS_URL + '/';
export const DELETE_PRODUCT_BY_ID_URL = PRODUCTS_URL + '/deleteProduct/';
export const UPDATE_PRODUCT_BY_ID_URL = PRODUCTS_URL + '/getProductValue/';

export const IMG_UPLOAD = PRODUCTS_URL + '/upload'
export const GET_IMAGE = BASE_URL + '/uploads/'

export const BANNER_URL = BASE_URL + '/api/banner';
export const DELETE_BANNER_BY_ID_URL = BANNER_URL + '/deleteBanner/';

export const USERS_LOGIN_URL = BASE_URL + '/api/users/login';
export const USERS_REGISTER_URL = BASE_URL + '/api/users/register';
export const USERS_SEND_OTP = BASE_URL + '/api/users/send-otp';
export const USERS_VERIFY_OTP = BASE_URL + '/api/users/verify-otp';

export const ADMIN_REGISTER_URL = BASE_URL + '/api/users/admin/login';

export const ORDER_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDER_URL + '/create';
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDER_URL + '/newOrderForCurrentUser';
export const ORDER_PAY_URL = ORDER_URL + '/pay';
export const ORDER_VERIFY_URL = ORDER_URL + '/verify-payment';

export const SEND_TO_DB = BASE_URL + '/api/goldSilver/goldSilverRate';
export const GET_GSGST_FROM_DB = BASE_URL + '/api/goldSilver/';

export const ADD_REVIEW = BASE_URL + '/api/reviews/post';
export const SHOP_REVIEW = BASE_URL + '/api/reviews/';