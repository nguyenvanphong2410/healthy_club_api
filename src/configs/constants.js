import path from "path";
import short from "short-uuid";
import {config as loadEnv} from "dotenv";

loadEnv();

// directory
export const SOURCE_DIR = path.dirname(__dirname);
export const APP_DIR = path.dirname(SOURCE_DIR);
export const PUBLIC_DIR = path.join(APP_DIR, "public");
export const STORAGE_DIR = path.join(APP_DIR, "src", "storage");
export const LOG_DIR = path.join(STORAGE_DIR, "logs");
export const CACHE_DIR = path.join(STORAGE_DIR, "cache");
export const VIEW_DIR = path.join(APP_DIR, "src", "views");

// environment
export const APP_ENV = {
    PRODUCTION: "production",
    DEVELOPMENT: "development",
};
export const NODE_ENV = Object.values(APP_ENV).includes(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : APP_ENV.DEVELOPMENT;

export const APP_NAME = process.env.APP_NAME;
export const APP_DEBUG = process.env.APP_DEBUG === "true";
export const APP_URL_API = process.env.APP_URL_API;
export const APP_URL_CLIENT = process.env.APP_URL_CLIENT;
export const URL_ADMIN_ORDER_MANAGEMENT = process.env.URL_ADMIN_ORDER_MANAGEMENT;
export const OTHER_URLS_CLIENT = process.env.OTHER_URLS_CLIENT
    ? JSON.parse(process.env.OTHER_URLS_CLIENT)
    : [];
export const SECRET_KEY = process.env.SECRET_KEY;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const REQUESTS_LIMIT_PER_MINUTE = parseInt(process.env.REQUESTS_LIMIT_PER_MINUTE, 10) || 1000;

export const LINK_STATIC_URL = `${APP_URL_API}/static/`;

export const DATABASE_URI =
    "mongodb" +
    (process.env.DB_PORT ? "" : "+srv") +
    "://" +
    process.env.DB_HOST +
    (process.env.DB_PORT ? ":" + process.env.DB_PORT : "");
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_AUTH_SOURCE = process.env.DB_AUTH_SOURCE || "admin";

export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

export const CHANGE_PASSWORD_EXPIRES_IN = process.env.CHANGE_PASSWORD_EXPIRES_IN
    ? Number(process.env.CHANGE_PASSWORD_EXPIRES_IN)
    : 120;
export const FORGOT_PASSWORD_EXPIRES_IN = process.env.FORGOT_PASSWORD_EXPIRES_IN
    ? Number(process.env.CHANGE_PASSWORD_EXPIRES_IN)
    : 300;

export const VIETQR_IMAGE_API = process.env.VIETQR_IMAGE_API || "https://img.vietqr.io/image";

export const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
export const NUMEROLOGY_SECRET_KEY = process.env.NUMEROLOGY_SECRET_KEY;

export const AUSPICIOUS_YEAR_FOR_CHILDBIRTH_API = process.env.AUSPICIOUS_YEAR_FOR_CHILDBIRTH_API;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// other
export const SALT_ROUNDS = 10;
export const PER_PAGE = 20;
export const TOKEN_TYPE = {
    AUTHORIZATION: "AUTHORIZATION",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
};
export const MAX_STRING_SIZE = 255;

export const UUID_TRANSLATOR = short();

export const JOI_DEFAULT_MESSAGE = {
    // boolean
    "boolean.base": "{{#label}} sai định dạng.",

    // string
    "string.base": "{{#label}} sai định dạng.",
    "string.empty": "{{#label}} không được bỏ trống.",
    "string.min": "{{#label}} không được ít hơn {{#limit}} ký tự.",
    "string.max": "{{#label}} không được vượt quá {{#limit}} ký tự.",
    "string.pattern.base": "{{#label}} không đúng định dạng.",
    "string.email": "{{#label}} không đúng định dạng.",

    // number
    "number.base": "{{#label}} sai định dạng.",
    "number.integer": "{{#label}} sai định dạng.",
    "number.min": "{{#label}} không được nhỏ hơn {{#limit}}.",
    "number.max": "{{#label}} không được lớn hơn {{#limit}}.",

    // array
    "array.base": "{{#label}} sai định dạng.",
    "array.unique": "Các {{#label}} không được giống nhau.",
    "array.min": "{{#label}} không được ít hơn {{#limit}} phần tử.",
    "array.max": "{{#label}} không được vượt quá {{#limit}} phần tử.",
    "array.length": "{{#label}} phải có đúng {{#limit}} phần tử.",
    "array.includesRequiredUnknowns": "{{#label}} không hợp lệ.",
    "array.includesRequiredKnowns": "{{#label}} không hợp lệ.",

    // object
    "object.base": "{{#label}} sai định dạng.",
    "object.unknown": "Trường {#key} không được xác định.",
    "object.instance": "{{#label}} không đúng định dạng.",

    // binary
    "binary.base": "{{#label}} sai định dạng.",
    "binary.min": "{{#label}} không được ít hơn {{#limit}} bytes.",
    "binary.max": "{{#label}} không được vượt quá {{#limit}} bytes.",

    // any
    "any.only": "{{#label}} phải là {if(#valids.length == 1, '', 'một trong ')}{{#valids}}.",
    "any.required": "{{#label}} không được bỏ trống.",
    "any.unknown": "Trường {#key} không được xác định.",
    "any.invalid": "{{#label}} không hợp lệ.",
    "any.exists": "{{#label}} đã tồn tại.",
    "any.not-exists": "{{#label}} không tồn tại.",
    "any.activated": "{{#label}} đã được kích hoạt.",
    "any.not-activated": "{{#label}} chưa được kích hoạt.",
    "any.incorrect": "{{#label}} không chính xác.",
    "any.locked": "{{#label}} đã bị khóa.",

    // date
    "date.not-exists": "{{#label}} không tồn tại.",
};

export const JOI_DEFAULT_OPTIONS = {
    abortEarly: false,
    errors: {
        wrap: {label: false},
        language: {"any.exists": "any.exists"},
    },
    externals: false,
    stripUnknown: true,
};

export const BANK_TEMPLATE_OPTIONS = {
    COMPACT: "compact",
    COMPACT2: "compact2",
    QR_ONLY: "qr_only",
    PRINT: "print",
};

export const VALIDATE_PHONE_REGEX = /^(0[235789])[0-9]{8}$/;
export const VALIDATE_EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const MAX_NAME_ROLE_SIZE = 50;
export const MAX_DESCRIPTION_SIZE = 500;
export const NAME_LOOKUP = "COMPATIBILITY_BY_BIRTH_AND_NAME";
export const NAME_BEAUTIFUL = "NAME_BASED_ON_BIRTH";
