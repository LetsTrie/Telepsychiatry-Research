$('.homepage_submit').click(e => {
  e.preventDefault();
  const name = $('#homepage_name').val();
  const email = $('#homepage_email').val();
  const message = $('#homepage_message').val();

  const nameRegex = /^\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/;
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  let error = false;
  if (name === '') {
    error = true;
    $('#alertF').show();
    $('#alertF').html('Enter a name');
  } else if (!nameRegex.test(name)) {
    error = true;
    $('#alertF').show();
    $('#alertF').html('Name supports only alphabets and spaces');
  } else if (email === '') {
    error = true;
    $('#alertF').show();
    $('#alertF').html('Enter a email');
  } else if (!emailRegex.test(email)) {
    error = true;
    $('#alertF').show();
    $('#alertF').html('Invalid email');
  } else if (message.length < 50) {
    error = true;
    $('#alertF').show();
    $('#alertF').html('Message must at least be 50 characters');
  }

  if (!error) {
    $('#alertF').hide();
    $('#form').submit();
  }
});
