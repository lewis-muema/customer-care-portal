export default function(context) {
  if (!context.store.getters.isAuthenticated) {
    if (
      process.client &&
      typeof localStorage.getItem('jwtToken') === 'undefined'
    ) {
      context.redirect('/login');
    }
  }
}
