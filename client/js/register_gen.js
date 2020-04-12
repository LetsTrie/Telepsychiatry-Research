$('input[name="dob"]').daterangepicker({
    autoUpdateInput: false,
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1930,
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
        cancelLabel: 'Clear',
    },
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

$('#sub-btn').click((e) => {
    e.preventDefault();
    let error = false;
    const fname = $('#fname').val();
    const lname = $('#lname').val();
    const email = $('#email').val();
    const phoneNumber = $('#phoneNumber').val();
    const password = $('#password').val();
    const cPassword = $('#cPassword').val();
    const gender = $('#genderInput').val();
    const hADegree = $('#hADegree').val();
    const country = $('#countryInput').val();
    const dob = $('#dob').val();
    const cAffiliation = $('#cAffiliation').val();
    const imageFile = $('#imageFile');

    const fileName =
        Date.parse(new Date().toString()) + $('#imageFile')[0].files[0].name;
    $('#filename').val(fileName);
    console.log($('#filename').val());

    const nameRegex = /^[a-z A-Z](?!.* {2})[ \w.-]{2,24}$/;
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const phoneRegex = /\w+/i;

    if (fname === '') {
        error = true;
        showAlert('Enter First Name');
    } else if (lname === '') {
        error = true;
        showAlert('Enter Last Name');
    } else if (!nameRegex.test(fname)) {
        error = true;
        showAlert('Invalid First Name');
    } else if (!nameRegex.test(lname)) {
        error = true;
        showAlert('Invalid Last Name');
    } else if (email === '') {
        error = true;
        showAlert('Enter Email');
    } else if (!emailRegex.test(email)) {
        error = true;
        showAlert('Invalid Email');
    } else if (phoneNumber === '') {
        error = true;
        showAlert('Enter Phone Number');
    } else if (!phoneRegex.test(phoneNumber) || phoneNumber.length < 7) {
        error = true;
        showAlert('Invalid Phone Number');
    } else {
        $.ajax({
            url: '/auth/register/checkDuplicate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, phoneNumber }),
        }).done((res) => {
            if (!res.success) {
                error = true;
                showAlert(res.message);
            } else if (password === '') {
                error = true;
                showAlert('Enter Password');
            } else if (cPassword === '') {
                error = true;
                showAlert('Enter Confirm Password');
            } else if (password.length < 6) {
                error = true;
                showAlert('Password must contain at least 6 characters');
            } else if (password !== cPassword) {
                error = true;
                showAlert('Passwords not matching');
            } else if (gender === '') {
                error = true;
                showAlert('Confirm Gender');
            } else if (!dobRegex.test(dob)) {
                error = true;
                showAlert('Invalid Date Of Birth');
            } else if (hADegree === '') {
                error = true;
                showAlert('Enter Highest Academic Degree');
            } else if (cAffiliation === '') {
                error = true;
                showAlert('Enter Current Affiliation');
            } else if (country === '') {
                error = true;
                showAlert('Confirm Country');
            } else if (!imageFile[0].files.length) {
                error = true;
                showAlert('Provide Profile Picture');
            } else if (
                imageFile[0].files.length &&
                !(
                    imageFile[0].files[0].type === 'image/png' ||
                    imageFile[0].files[0].type === 'image/jpg' ||
                    imageFile[0].files[0].type === 'image/jpeg'
                )
            ) {
                error = true;
                showAlert('Enter Appropriate Profile Picture');
            }

            if (!error) {
                $('#alertF').hide();
                $('#form').submit();
            }
        });
    }
});