// eslint-disable-next-line import/no-mutable-exports
let AuthToken = '';
if (process.client) {
  AuthToken = {
    jwtToken: localStorage.getItem('jwtToken'),
  };
}
export default AuthToken;
