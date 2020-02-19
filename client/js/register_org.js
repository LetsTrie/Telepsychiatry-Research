$('input[name="dob"]').daterangepicker({
  autoUpdateInput: false,
  singleDatePicker: true,
  showDropdowns: true,
  minYear: 1930,
  maxYear: parseInt(moment().format('YYYY'), 10),
  locale: {
    cancelLabel: 'Clear'
  }
});

$('input[name="dob"]').on('apply.daterangepicker', function(ev, picker) {
  $(this).val(picker.startDate.format('DD/MM/YYYY'));
});

$('input[name="dob"]').on('cancel.daterangepicker', function(ev, picker) {
  $(this).val('');
});

function showAlert(msg) {
  $('#alertF').show();
  $('#alertF').html(msg);
}

$('#sub-btn').click(e => {
  e.preventDefault();
  let error = false;

  const nameRegex = /^[a-z A-Z](?!.* {2})[ \w.-]{2,24}$/;
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const phoneRegex = /\w+/i;

  const name = $('#name').val();
  const orgType = $('#org_typeInput').val();
  const orgEstYear = $('#establish_yearInput').val();
  const websiteLink = $('#websiteLink').val();
  const orgRegion = $('#regionInput').val();
  const authName = $('#authName').val();
  const authEmail = $('#authEmail').val();
  const authPhoneNumber = $('#authPhoneNumber').val();
  const password = $('#password').val();
  const cPassword = $('#cPassword').val();

  if (name === '') {
    error = true;
    showAlert('Add Organization Name');
  } else if (orgType === '') {
    error = true;
    showAlert('Add Organization Type');
  } else if (orgType !== 'Profitable' && orgType !== 'Non-Profitable') {
    error = true;
    showAlert('Invalid Organization Type');
  } else if (orgEstYear === '') {
    error = true;
    showAlert('Add Year of Establishment');
  } else if (orgEstYear.length !== 4 || !phoneRegex.test(orgEstYear)) {
    error = true;
    showAlert('Invalid Year of Establishment');
  } else if (websiteLink === '') {
    error = true;
    showAlert('Enter Website Link');
  } else if (orgRegion === '') {
    error = true;
    showAlert('Enter Region Of Organiztion');
  } else if (authName === '') {
    error = true;
    showAlert('Add Authorized Person Name');
  } else if (!nameRegex.test(authName)) {
    error = true;
    showAlert('Invalid Authorized Person Name');
  } else if (!emailRegex.test(authEmail)) {
    error = true;
    showAlert('Invalid authorised person email');
  } else if (!phoneRegex.test(authPhoneNumber) || authPhoneNumber.length < 6) {
    error = true;
    showAlert('Invalid authorised person phone number');
  } else if (password === '') {
    error = true;
    showAlert('Enter password');
  } else if (password.length < 6) {
    error = true;
    showAlert('Password must contain at least 6 characters');
  } else if (cPassword === '') {
    error = true;
    showAlert('Add Confirm Password');
  } else if (password !== cPassword) {
    error = true;
    showAlert('Passwords Not Matching');
  }

  if (!error) {
    console.log('submitted');
    $('#form').submit();
  }
});
