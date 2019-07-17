function creditClientChanged(rider_id) {
  const shouldCreditClient = document.getElementById(`driver_bill_to_client_${rider_id}`).checked;
  if (shouldCreditClient) {
    document.getElementById(`driver_bill_account_box_${rider_id}`).style.visibility = 'visible';
  } else {
    document.getElementById(`driver_bill_account_box_${rider_id}`).style.visibility = 'hidden';
  }
}

function defaultToChargeCorporateCommission(cop_id) {
  document.getElementById(`charge_biz_commission_${cop_id}`).checked = true;
}
function loanTypeChanged(id) {
  const loanTypeValue = document.getElementById(`new_l_reason_${id}`).value;
  const repaymentModeValue = document.getElementById(`new_l_frequency_${id}`).value;
  if (loanTypeValue === 'Advance') {
    document.getElementById(`new_l_repayment_amount_${id}`).style.visibility = 'hidden';
  } else {
    if (repaymentModeValue === '3') {
      document.getElementById(`new_l_repayment_amount_${id}`).style.visibility = 'hidden';
    } else {
      document.getElementById(`new_l_repayment_amount_${id}`).style.visibility = 'visible';
    }
  }
}

function repaymentMode(id) {
  const repaymentModeValue = document.getElementById(`new_l_frequency_${id}`).value;
  const loanTypeValue = document.getElementById(`new_l_reason_${id}`).value;
  if (repaymentModeValue === '3') {
    document.getElementById(`new_l_repayment_amount_${id}`).style.visibility = 'hidden';
  } else {
    if (loanTypeValue === 'Advance') {
      document.getElementById(`new_l_repayment_amount_${id}`).style.visibility = 'hidden';
    } else {
      document.getElementById(`new_l_repayment_amount_${id}`).style.visibility = 'visible';
    }
  }
}
