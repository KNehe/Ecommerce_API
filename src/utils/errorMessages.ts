const SIGN_UP_ERR_MSG ='An error occurred while signing up';
const USER_WITH_EMAIL_EXISTS_MSG = 'User with email already exists';
const NO_JWT_SECRET_MSG = 'No jwt secret was found on the server';
const NO_JWT_EXPIRY_TIME_MSG = 'No jwt expiry time was found on the server';
const NO_EMPTY_FIELD = 'All fields are required';
const INVALID_CREDENTIALS ='Wrong email or password';
const SIGN_IN_ERR_MSG ='An error occurred while signing in';
const USER_WITH_ID_NOT_FOUND = 'User with id not found';
const DELETE_USER_MSG = 'An error occurred while deleting user';
const BAD_FORMAT_ID = 'Id provided is in a bad format';
const ATLEAST_ONE_FIELD_REQUIRED = 'Atleast one filed is required';
const UPDATE_USER_ERR_MSG = 'An error occurred while updating user';
const EMAIL_REQUIRED = 'Email is required';
const USER_WITH_EMAIL_NOT_EXISTS ='No account is registered with email provided';
const SEND_RESET_PASSWORD_EMAIL_ERR =' An error occurred while sending a reset email';
const SEND_EMAIL_ERROR = 'An error occured while sending email';
const PASSWORD_REQUIRED_FOR_RESET = 'New Password required';
const PASSWORD_RESET_TOKEN_REQUIRED = 'Password reset token not provided';
const PASSWORD_RESET_TOKEN_INVALID ='Invalid password reset token';
const PASSWORD_RESET_TOKEN_EXPIRED ='Password reset time has expired';
const RESET_PASSWORD_ERR = 'An error occurred while changing your password';
const IMAGE_UPLOAD_ERROR = 'Error occurred while uploading image';
const LIMIT_FILE_SIZE_ERROR = 'File is greater than 1mb';
const WRONG_IMG_MIME = 'Image must be either jpeg, jpg or png';
const NO_IMAGE_PROVIDED = 'No image provided';
const NAME_PRICE_IMGURL_CATEGORY_DETAILS_REQUIRED = 'A name, price, category,details and imageUrl are required';
const PRODUCT_ID_REQUIRED = 'A product ID is required.';
const ERROR_ADDING_IMAGE = 'An error occurred while adding image';
const ERROR_ADDING_PRODUCT = 'An error occurred while adding product';
const PRODUCT_EXISTS = 'Product already already created';
const ERROR_FETCHING_PRODUCTS = 'An error occurred while fetching products';
const ERROR_FETCHING_PRODUCT = 'An error occurred while fetching product';
const PRODUCT_NOT_EXISTS = 'Product does not exist';
const ERROR_DELETING_PRODUCT = 'An error occurred while deleting product';
const ERROR_UPDATING_PRODUCT = 'An error occurred while updating product';
const SEARCH_VALUE_REQUIRED = 'A value is required to perform search';
const ERROR_SEARCHING = 'An error occurred while searching';
const PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED ='User id, product id and quantity required to add to cart';
const ERROR_ADDING_TO_CART = 'An error occurred while saving cart items';
const ERROR_FETCHING_CART = 'An error occurred while fetching cart items';
const ERROR_DELETING_CART = 'An error occurred while deleting cart items';
const ERROR_MAKING_PAYMENT = 'An error occurred while processing payment';
const PAYMENT_DETAILS_REQUIRED = 'All payments details are required';
const FB_EMAIL_REQUIRED = 'Email from facebook account is required';
const FB_AUTH_FAILED = 'Facebook authentication failed';
const GOOGLE_EMAIL_REQUIRED = 'Email from google account is required';
const GOOGLE_AUTH_FAILED = 'Google authentication failed';
const JWT_TOKEN_NOT_FOUND = 'Jwt token not found, please log in';
const INVALID_JWT_TOKEN = 'Jwt token is invalid';
const USER_ASSOCIATED_WITH_TOKEN_NOT_FOUND = 'User belonging to token not found in the system';
const ROLE_NOT_ALLOWED = 'You have no permission to perform this action.';
const ERROR_ADDING_CATEGORY = 'An error occurred while adding category';
const CATEGORY_REQUIRED = 'A category is required';
const CATEGORY_EXISTS = 'Category already created';
const ERROR_FETCHING_CATEGORIES = 'An error occurred while fetching categories';
const CATEGORY_ID_REQUIRED = 'A category id is required';
const CATEGORY_NOT_FOUND = 'Category not found';
const ERROR_UPDATING_CATEGORY = 'An error occurred while updating category';
const ERROR_DELETING_CATEGORY = 'An error occurred while deleting category';




export { SIGN_UP_ERR_MSG, USER_WITH_EMAIL_EXISTS_MSG, NO_JWT_SECRET_MSG, NO_JWT_EXPIRY_TIME_MSG,NO_EMPTY_FIELD, 
    INVALID_CREDENTIALS,SIGN_IN_ERR_MSG ,USER_WITH_ID_NOT_FOUND,DELETE_USER_MSG, BAD_FORMAT_ID,ATLEAST_ONE_FIELD_REQUIRED,
    UPDATE_USER_ERR_MSG,EMAIL_REQUIRED,USER_WITH_EMAIL_NOT_EXISTS,SEND_RESET_PASSWORD_EMAIL_ERR,SEND_EMAIL_ERROR,
    PASSWORD_REQUIRED_FOR_RESET,PASSWORD_RESET_TOKEN_REQUIRED,PASSWORD_RESET_TOKEN_INVALID,PASSWORD_RESET_TOKEN_EXPIRED,
    RESET_PASSWORD_ERR,IMAGE_UPLOAD_ERROR,LIMIT_FILE_SIZE_ERROR,WRONG_IMG_MIME,NO_IMAGE_PROVIDED,NAME_PRICE_IMGURL_CATEGORY_DETAILS_REQUIRED,
    PRODUCT_ID_REQUIRED,ERROR_ADDING_IMAGE,PRODUCT_EXISTS,ERROR_ADDING_PRODUCT,ERROR_FETCHING_PRODUCTS,
    ERROR_FETCHING_PRODUCT,PRODUCT_NOT_EXISTS,ERROR_DELETING_PRODUCT,ERROR_UPDATING_PRODUCT, SEARCH_VALUE_REQUIRED, ERROR_SEARCHING,
    PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED,ERROR_ADDING_TO_CART,ERROR_FETCHING_CART,ERROR_DELETING_CART,ERROR_MAKING_PAYMENT,
    PAYMENT_DETAILS_REQUIRED,FB_EMAIL_REQUIRED,FB_AUTH_FAILED,GOOGLE_EMAIL_REQUIRED,GOOGLE_AUTH_FAILED,JWT_TOKEN_NOT_FOUND,
    INVALID_JWT_TOKEN,USER_ASSOCIATED_WITH_TOKEN_NOT_FOUND,ROLE_NOT_ALLOWED,ERROR_ADDING_CATEGORY,CATEGORY_REQUIRED,CATEGORY_EXISTS,
    ERROR_FETCHING_CATEGORIES,CATEGORY_ID_REQUIRED,CATEGORY_NOT_FOUND,ERROR_UPDATING_CATEGORY,ERROR_DELETING_CATEGORY};