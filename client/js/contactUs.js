$('#submit-btn').click(e => {
  e.preventDefault();
  const name = $('#name').val();
  const email = $('#email').val();
  const message = $('#message').val();

  const nameRegex = /^\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/;
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  let error = false;
  if (name === '') {
    error = true;
    $('#alert').show();
    $('#alert').html('Enter a name');
  } else if (!nameRegex.test(name)) {
    error = true;
    $('#alert').show();
    $('#alert').html('Name supports only alphabets and spaces');
  } else if (email === '') {
    error = true;
    $('#alert').show();
    $('#alert').html('Enter a email');
  } else if (!emailRegex.test(email)) {
    error = true;
    $('#alert').show();
    $('#alert').html('Invalid email');
  } else if (message.length < 50) {
    error = true;
    $('#alert').show();
    $('#alert').html('Message must at least be 50 characters');
  }

  if (!error) {
    $('#alert').hide();
    $('#form').submit();
  }
});
