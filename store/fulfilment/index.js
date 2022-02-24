import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: [],
  tableData: [],
  orderActivity: [],
  tableProps: [],
  fulfilmentType: '',
  pagination: {},
  searchedEntity: null,
  searchState: false,
  isSearching: false,
  hubs: null,
  selectedHubs: null,
  processing: false,
  regions: null,
  selectedRegions: null,
  checkedOrders: [],
  selectedStatus: null,
  selectedCountry: null,
  hubDialog: false,
  tableDetails: [],
  tableDetailKeyMetrics: {
    endpoint: 'missioncontrol/orders',
    id: 'order_id',
  },
  statusMapping: null,
  vehicles: [],
  vehicles_type: '',
  batchChildOrderData: {},
  remove_order_state: false,
  statusChanged: false,
  supported_countries: null,
  batch_details_dialog_state: null,
  seller_active_page: 'seller-dash',
  routeDistance: {
    distance: '247.34 km',
    polyline:
      'fmoF}ye`FyB~BsMf@_PfBuMnJsH|BoFnH|@xAa@nDo@vE`TvTdeAdzAp`Ahh@rjA`mAvFvl@fNf]|a@ln@rLx{@|@l_@dD~UdPrGpN|PyA`EoTvPHxIzEpOcCxHbH`DbF`ExEpZnSnYf\\p`@tJkMtVdFTFT|@H~OhDlDbIs@~BdOf@rIbMS|R]|JhAr@b_@R`O}@n]_C`MG~YjHdVrVp_A~TzmAFp[tLfKh@qGsFnAuK`UuHbZkHxs@oC|]oQjUyP~ZwEf\\gGpZaN~Q}c@|[og@|s@m\\t\\gTdYkYfWu^Lmr@kQwk@gHml@oEil@qRkX~LePjNky@tGwOtDwJ~KulAn`@wjA`g@y_Ab^sn@~HafApJ{s@pGm}AjOmNzY}g@vRof@p\\qFjUQ`OmRrGiZrEqVrLkn@vVswArY}iAnMmm@v@}b@{NaLhEuSbEs[pAa^qBq^aCaWhKy~AkNw[fOmVnBca@}HcWOkYbCs^~AuGhGUbPaYjTsc@dr@vR~OfKvSfSdw@fM|\\tEjy@xEhhAjLxk@t\\lc@lKvSrWroAvSfjBpFnkA`Mn^f`@bh@lWrz@hVlaAdH|m@xVvsCeIlqDr\\hsBr_@|rCfKr|@fXpk@|kBxiBteCvmCvr@h_A~^jyAz^`uAtGzsAp@zx@{Ita@{Al|@f@xh@~AtfBqDnlB}G|T{MbMgh@jTkJ~MkAxT~c@jt@rDhTu@r_@_Ihx@yZ~qBPdfC~r@zqC|Qf|@jNt]`o@by@]pPqN~Lqp@p]yFpWVpZn@lv@jCzmApOvPlRtEdp@pOpSzKzWxu@Krv@ic@xYooApl@e}@xl@oMpXwKvo@bAh[vJ|iAlH`a@_AhZqP~l@l@`i@dFb|@bA~k@oKzp@{Jbn@xBn_@hInQtSlI|VvMrBh^tHnwBdCnk@zCd\\|AlTpJ|Qlg@ru@`h@|v@z`@hj@z~@|JfLrJhElTzUvfA`Khb@nXjXtd@lf@bIbQIlMcGrNqAhZte@xTha@hOlbAve@hiBzqAttBpmA~eD`dAhrCfbBrwCvnBhwB~uAteEdfDl_Axp@~\\`]nPra@fd@d[l~@~^neBjVnq@jNlh@b@~a@u@pMfM~Khu@zEvn@aDla@uThkAcj@pr@sLjo@}RrjCu@pcAnT~oAjQnxAbGfw@|Jdz@nuApz@b_@vZpUty@lJtgAv@df@nFxN`Q~e@`k@xHnr@l^vt@rXt[paDnI|WfP|C`RlMrb@~Kdx@lSbc@zYhR|Ktd@fIte@jNnYni@nLdNxE~LlGnJhXpKrSvI',
  },
  chosenHub: {
    hub_location: {
      description: 'Kahawa Wendani',
      latitude: -1.2017712,
      longitude: 36.9252784,
      region: null,
    },
  },
  dialogVisible: false,
  selectedDate: '',
});

export { state, getters, mutations, actions };
