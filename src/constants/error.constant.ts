export const ErrorConstants = {
  UPDATE_TASK_ID_REQ: {
    message: 'Please provide task ID.',
  },
  CREATE_REQ_FIELD_ERROR: {
    message: 'Please make sure all requirement fields are passed.',
  },
  NO_USER_FOUND: {
    message: 'Could not find user with given email Id.',
  },
  EMAIL_ALREADY_USED: {
    message: 'Account exist with email id',
  },
  WRONG_PASSWORD: {
    message: 'Password incorrect',
  },
  TOKEN_FORMAT_ERROR: {
    message: 'Token format error, it should be `Bearer {token}`',
  },
  TOKEN_MISMATCH: {
    message: 'Invalid Token',
  },
  TOKEN_NOT_FOUND: {
    message: 'Token Not Found',
  }
};
