export default {
  showCurrencyBasedAmounts(orderDetails, currencyConversions, amount) {
    const clientCurrency = orderDetails.client_details.default_currency;
    const riderCurrency = orderDetails.rider_details.default_currency;
    const orderCurrency = orderDetails.payment_details.order_currency;

    const clientConversionArray = this.getSpecificCurrencyConversion(
      orderCurrency,
      clientCurrency,
      currencyConversions,
    );
    const clientAmount = this.calculateConvertedAmount(
      clientConversionArray,
      amount,
      orderCurrency,
      clientCurrency,
    );
    const riderAmount = this.calculateConvertedAmount(
      clientConversionArray,
      amount,
      orderCurrency,
      riderCurrency,
    );

    amount = Number(amount).toLocaleString('en');
    return `${orderCurrency} ${amount}${clientAmount}${riderAmount}`;
  },

  getSpecificCurrencyConversion(
    fromCurrency,
    toCurrency,
    currency_conversions,
  ) {
    const res = currency_conversions.filter(conversion =>
      conversion.from_currency.includes(fromCurrency),
    );
    const newArray = res.filter(arr => arr.to_currency.includes(toCurrency));
    return newArray;
  },

  calculateConvertedAmount(
    conversionArray,
    orderAmount,
    orderCurrency,
    currency,
  ) {
    let convertedAmount = '';

    if (currency !== orderCurrency) {
      convertedAmount = conversionArray[0].rate * orderAmount;
      convertedAmount = Number(convertedAmount).toLocaleString('en');
      convertedAmount = `<span class="col-md-8 pull-right exchangerate"> ( ${currency} ${convertedAmount} )</span>`;
    }

    return convertedAmount;
  },
  display_conditional_amounts(orderDetails, currencyConversions, amount) {
    let displayAmount = 0;
    const convertedAmount = this.showCurrencyBasedAmounts(
      orderDetails,
      currencyConversions,
      amount,
    );
    if (amount > 0) {
      displayAmount = convertedAmount;
    }
    return displayAmount;
  },
};
