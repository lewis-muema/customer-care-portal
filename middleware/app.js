export default function(context) {
  const store = context.store;
  const breadcrumbsObject = {
    peer: {
      name: 'Peer',
      description: 'clients',
      mainName: 'Home',
      category: 'Clients',
      subCategory: 'Peer',
    },

    biz: {
      name: 'biz',
      description: 1,
      mainName: 'dfff',
      category: '',
      subCategory: '',
    },
  };

  const routeName = context.route.name;
  const selectedBreadcrumb = breadcrumbsObject.peer;
  store.commit('setbreadcrumbs', selectedBreadcrumb);
}
