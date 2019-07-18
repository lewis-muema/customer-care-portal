export default function(context) {
  //   console.log('test middleware', route.name);
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
  // let r = null;
  // if (context.route.name === 'peer') {
  //   r = 'peer';
  // }
  const selectedBreadcrumb = breadcrumbsObject.peer;

  store.commit('setbreadcrumbs', selectedBreadcrumb);
  console.log('testing midd', context.store.getters.breadcrumbs);
  console.log('route', routeName);
  // console.log('efrtyutrfedsadfg');
}
