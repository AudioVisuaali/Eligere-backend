function passwordCheck(password) {
  if (password.length < 6) {
    return { error: true, msg: 'too-short' };
  }

  if (password.search(/[a-z]/)) {
    return {
      error: true,
      msg: 'lowercase-required',
    };
  }

  if (password.search(/[A-Z]/)) {
    return {
      error: true,
      msg: 'uppercase-required',
    };
  }

  if (password.search(/[0-9]/)) {
    return {
      error: true,
      msg: 'number-required',
    };
  }

  return { error: null, msg: null };
}

module.exports = {
  passwordCheck,
};
