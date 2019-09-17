const SessionMxn = {
  methods: {
    setSession(value) {
      localStorage.setItem('_sessionSnack', value);
    },
    getSession() {
      return localStorage.getItem('_sessionSnack');
    },
    deleteSession() {
      localStorage.removeItem('_sessionSnack');
      localStorage.removeItem('jwtToken');
    },
  },
};
export default SessionMxn;
