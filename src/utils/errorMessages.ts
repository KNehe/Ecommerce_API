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
const NAME_PRICE_IMGURL_REQUIRED = 'A name, price and imageUrl are required';
const PRODUCT_ID_REQUIRED = 'A product ID is required.';
const ERROR_ADDING_IMAGE = 'An error occurred while adding image';
const ERROR_ADDING_PRODUCT = 'An error occurred while adding product';
const PRODUCT_EXISTS = 'Product already already created';


export { SIGN_UP_ERR_MSG, USER_WITH_EMAIL_EXISTS_MSG, NO_JWT_SECRET_MSG, NO_JWT_EXPIRY_TIME_MSG,NO_EMPTY_FIELD, 
    INVALID_CREDENTIALS,SIGN_IN_ERR_MSG ,USER_WITH_ID_NOT_FOUND,DELETE_USER_MSG, BAD_FORMAT_ID,ATLEAST_ONE_FIELD_REQUIRED,
    UPDATE_USER_ERR_MSG,EMAIL_REQUIRED,USER_WITH_EMAIL_NOT_EXISTS,SEND_RESET_PASSWORD_EMAIL_ERR,SEND_EMAIL_ERROR,
    PASSWORD_REQUIRED_FOR_RESET,PASSWORD_RESET_TOKEN_REQUIRED,PASSWORD_RESET_TOKEN_INVALID,PASSWORD_RESET_TOKEN_EXPIRED,
    RESET_PASSWORD_ERR,IMAGE_UPLOAD_ERROR,LIMIT_FILE_SIZE_ERROR,WRONG_IMG_MIME,NO_IMAGE_PROVIDED,NAME_PRICE_IMGURL_REQUIRED,
    PRODUCT_ID_REQUIRED,ERROR_ADDING_IMAGE,PRODUCT_EXISTS,ERROR_ADDING_PRODUCT};