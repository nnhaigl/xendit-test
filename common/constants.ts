export const HTTP_CODE_METADATA = 'HTTP_CODE_METADATA'
export const HEADERS_METADATA = 'HEADERS_METADATA'
export const ROUTE_ARGS_METADATA = 'ROUTE_ARGS_METADATA'
export const ROUTE_METADATA = 'ROUTE_METADATA'
export const MIDDLEWARES_METADATA = 'MIDDLEWARES_METADATA'
export const PROXY_METADATA = 'PROXY_METADATA'
export const HANDLER_OPTIONS = 'HANDLER_OPTIONS'
export const ALL_HTTP_METHOD = 'all'
export const CUSTOM_DECORATORS_GROUP = 'CUSTOM_DECORATORS_GROUP'

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}


export enum FunctionParamtypes {
  BODY,
  QUERY,
  PARAM,
  HEADERS,
  REQUEST,
  RESPONSE,
  RESPONSE_HEADER,
  UPLOADED_FILE,
}

export enum HTTP_STATUS {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export enum LOG_LEVEL {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  VERBOSE = 'VERBOSE',
}

export const HEADERS = {
  CONTENT_LENGTH: 'content-length',
  CONTENT_TYPE: 'content-type',
  CORRELATION_ID: 'x-correlation'
}

export const BODY_PARSER_JSON_ERROR = 'Parse JSON failed. Invalid JSON body'
export const COMMON_LIMIT_LEVEL_VALIDATION =
  process.env.COMMON_LIMIT_LEVEL_VALIDATION || 5

export const MASK_METADATA_KEYS = {
  MASK_PROPERTIES: 'MASK_PROPERTIES',
  NESTED_MASK: 'NESTED_MASK',
}
export const METADATA_DESIGN_PARAMETERS = 'design:paramtypes'
export const MASK_CHARS = '***'
export const WHITE_LIST_HEADERS = [
  'accept-language',
  'origin',
  'user-agent',
  'host',
  'accept-encoding',
  'x-correlation-id',
  'content-type',
]

export const WHITE_LIST_BODY = ['errors']

export const CONTENT_LENGTH_HEADER = 'content-length'