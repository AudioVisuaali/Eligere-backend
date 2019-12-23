function usernameCheck(username) {
  if (username.length < 4) {
    return { error: true, msg: 'too-short' };
  }

  if (username.length < 32) {
    return { error: true, msg: 'too-long' };
  }

  return { error: null, msg: null };
}

function passwordCheck(password) {
  if (password.length < 8) {
    return { error: true, msg: 'too-short' };
  }

  if (password.search(/[a-z]/) < 0) {
    return {
      error: true,
      msg: 'lowercase-required',
    };
  }

  if (password.search(/[A-Z]/) < 0) {
    return {
      error: true,
      msg: 'uppercase-required',
    };
  }

  if (password.search(/[0-9]/) < 0) {
    return {
      error: true,
      msg: 'number-required',
    };
  }

  return { error: null, msg: null };
}

module.exports = {
  passwordCheck,
  usernameCheck,
};
