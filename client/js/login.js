/* eslint-disable */
$('.SELECT_CATEGORY_MODAL_wrapper .form-submit button').on('click', function() {
  const role = $('.selectOrganization')[1].value;
  if (role === undefined || role === '') {
  }
  if (role === 'General User') {
    location = '/auth/register/general-user';
  }
  if (role === 'Expert User') {
    location = '/auth/register/expert-user';
  }
  if (role === 'Organization') {
    location = '/auth/register/organization';
  }
});

$('.gotoResetPass').on('click', function() {
  location = '/auth/create-new-password';
});
