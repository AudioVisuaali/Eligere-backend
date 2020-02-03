module.exports = {
  unAuthenticated: () => {
    throw new Error('UNAUTHENTICATED');
  },
};
