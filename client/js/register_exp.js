$('.add-field').click(e => {
    e.preventDefault();
});
$('.delete').click(e => {
    e.preventDefault();
});
$(document).on('click', 'button.delete', e => {
    e.preventDefault();
});

$('input[name="datetimes"]').daterangepicker({
    autoUpdateInput: false,
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment()
        .startOf('hour')
        .add(32, 'hour'),
    locale: {
        cancelLabel: 'Clear'
    }
});

$('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(
        picker.startDate.format('DD/MM/YYYY') +
        ' - ' +
        picker.endDate.format('DD/MM/YYYY')
    );
});

$('input[name="datetimes"]').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});

let edu = 1,
    skill = 1,
    exp = 1,
    vh = 1,
    awards = 1,
    training = 1;

$(document).on('click', 'input#app_years', e => {
    console.log('year');
    $(e.target).daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $('input#app_years').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(
            picker.startDate.format('DD/MM/YYYY') +
            ' - ' +
            picker.endDate.format('DD/MM/YYYY')
        );
    });

    $('input#app_years').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });
});
$(document).on('click', '#add-vh-chamber', e => {
    const chamber = `
        <div class="oneChamber">
                  <div class="arrow_sign">
                    <i class="fa fa-arrow-right"></i>
                  </div>
                  <div class="chamberInfo">
                    <div class="nameAddress">
                      <div class="free-input">
                        <input
                          type="text"
                          placeholder="Name of the chamber"
                          name="chamberName"
                        />
                      </div>
                      <div class="free-input">
                        <input
                          type="text"
                          placeholder="Address of the chamber"
                          name="chamberPlace"
                        />
                      </div>
                      <div class="delete-btn delete-vh-chamber-class-wrapper">
                        <button
                          class="delete delete-vh-chamber-class"
                          id="delete-vh-chamber"
                        >
                          <i class="fa fa-minus"></i>
                        </button>
                      </div>
                    </div>
                    <div class="dayTime">
                      <div class="allRowsDayTime">
                        <div class="DayTimeFlexParent">
                          <div class="free-input">
                            <div class="input_box slct_picker">
                              <div class="form-selectpicker">
                                <select
                                  class="vh-selector selectpicker year-selector sp-1"
                                  data-width="100%"
                                  title="Day: From"
                                  id="vhFrom"
                                  data-size="6"
                                  name="vh-day-from"
                                  required
                                >
                                  <% for (let i=0; i < 7; i++) { %>
                                  <option value="<%=days[i] %>">
                                    <%= days[i] %>
                                  </option>
                                  <% } %>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="free-input">
                            <div class="input_box slct_picker">
                              <div class="form-selectpicker">
                                <select
                                  class="vh-selector selectpicker year-selector sp-2"
                                  data-width="100%"
                                  title="Day: To"
                                  id="vhFrom"
                                  data-size="6"
                                  name="vh-day-to"
                                  required
                                >
                                  <% for (let i=0; i < 7; i++) { %>
                                  <option value="<%=days[i] %>">
                                    <%= days[i] %>
                                  </option>
                                  <% } %>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="free-input">
                            <div class="input_box slct_picker">
                              <div class="form-selectpicker">
                                <select
                                  class="vh-selector selectpicker sp-3"
                                  data-width="100%"
                                  title="Time: From"
                                  id="vhFrom"
                                  data-size="6"
                                  required
                                >
                                  <% for (let i=1; i<=12; i++) { %>
                                  <option value="<%=i %>:00 AM">
                                    <%= i %>:00 AM
                                  </option>
                                  <% } %> <% for (let i=1; i<=12; i++) { %>
                                  <option value="<%= i %>:00PM">
                                    <%= i %>:00PM</option
                                  >
                                  <% } %>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="free-input">
                            <div class="input_box slct_picker">
                              <div class="form-selectpicker ">
                                <select
                                  class="vh-selector selectpicker sp-4"
                                  data-width="100%"
                                  title="Time: To"
                                  id="vhFrom"
                                  data-size="6"
                                  required
                                >
                                  <% for (let i=1; i<=12; i++) { %>
                                  <option value="<%=i %>:00 AM">
                                    <%= i %>:00 AM
                                  </option>
                                  <% } %> <% for (let i=1; i<=12; i++) { %>
                                  <option value="<%= i %>:00PM">
                                    <%= i %>:00PM</option
                                  >
                                  <% } %>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="delete-btn">
                            <button
                              class="delete delete-vh-shift-class"
                              id="delete-vh-shift"
                            >
                              <i class="fa fa-minus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <button id="add-vh-shift" class="add-vh-shift">
                        <i class="fa fa-plus plus"></i>Add Shifts
                      </button>
                    </div>
                  </div>
                </div>
      `;
    $('.chambers').append(chamber);

    $('.sp-1').selectpicker('refresh');
    $('.sp-1').css('width', '100%');
    $('.sp-2').selectpicker('refresh');
    $('.sp-2').css('width', '100%');
    $('.sp-3').selectpicker('refresh');
    $('.sp-3').css('width', '100%');
    $('.sp-4').selectpicker('refresh');
    $('.sp-4').css('width', '100%');
});
$(document).on('click', '.delete-vh-chamber-class', e => {
    let fld = e.target;
    while (true) {
        let val = $(fld)[0].className;
        if (val === 'oneChamber') break;
        fld = fld.parentElement;
    }
    const numOfChildren = fld.parentElement.children.length;
    if (numOfChildren > 1) {
        $(fld).remove();
    }
});
$(document).on('click', '.delete-vh-shift-class', e => {
    let fld = e.target;
    while (true) {
        let val = $(fld)[0].className;
        if (val === 'DayTimeFlexParent') break;
        fld = fld.parentElement;
    }
    const numOfChildren = fld.parentElement.children.length;
    if (numOfChildren > 1) {
        $(fld).remove();
    }
});
$(document).on('click', '#add-vh-shift', e => {
    const shift = `
      <div class="DayTimeFlexParent">
        <div class="free-input">
          <div class="input_box slct_picker">
            <div class="form-selectpicker">
              <select
                class="vh-selector selectpicker year-selector sp-1"
                data-width="100%"
                title="Day: From"
                id="vhFrom"
                data-size="6"
                name="vh-day-from"
                required
              >
                <% for (let i=0; i < 7; i++) { %>
                <option value="<%=days[i] %>">
                  <%= days[i] %>
                </option>
                <% } %>
              </select>
            </div>
          </div>
        </div>
        <div class="free-input">
          <div class="input_box slct_picker">
            <div class="form-selectpicker">
              <select
                class="vh-selector selectpicker year-selector sp-2"
                data-width="100%"
                title="Day: To"
                id="vhFrom"
                data-size="6"
                name="vh-day-to"
                required
              >
                <% for (let i=0; i < 7; i++) { %>
                <option value="<%=days[i] %>">
                  <%= days[i] %>
                </option>
                <% } %>
              </select>
            </div>
          </div>
        </div>
        <div class="free-input">
          <div class="input_box slct_picker">
            <div class="form-selectpicker">
              <select
                class="vh-selector selectpicker sp-3"
                data-width="100%"
                title="Time: From"
                id="vhFrom"
                data-size="6"
                required
              >
                <% for (let i=1; i<=12; i++) { %>
                <option value="<%=i %>:00 AM">
                  <%= i %>:00 AM
                </option>
                <% } %> <% for (let i=1; i<=12; i++) { %>
                <option value="<%= i %>:00PM">
                  <%= i %>:00PM</option
                >
                <% } %>
              </select>
            </div>
          </div>
        </div>
        <div class="free-input">
          <div class="input_box slct_picker">
            <div class="form-selectpicker ">
              <select
                class="vh-selector selectpicker sp-4"
                data-width="100%"
                title="Time: To"
                id="vhFrom"
                data-size="6"
                required
              >
                <% for (let i=1; i<=12; i++) { %>
                <option value="<%=i %>:00 AM">
                  <%= i %>:00 AM
                </option>
                <% } %> <% for (let i=1; i<=12; i++) { %>
                <option value="<%= i %>:00PM">
                  <%= i %>:00PM</option
                >
                <% } %>
              </select>
            </div>
          </div>
        </div>
        <div class="delete-btn">
          <button
            class="delete delete-vh-shift-class"
            id="delete-vh-shift"
          >
            <i class="fa fa-minus"></i>
          </button>
        </div>
      </div>`;
    $(e.target.parentElement.children[0]).append(shift);

    $('.sp-1').selectpicker('refresh');
    $('.sp-1').css('width', '100%');
    $('.sp-2').selectpicker('refresh');
    $('.sp-2').css('width', '100%');
    $('.sp-3').selectpicker('refresh');
    $('.sp-3').css('width', '100%');
    $('.sp-4').selectpicker('refresh');
    $('.sp-4').css('width', '100%');
});
$(document).on('click', '#add-training-field', e => {
    const trainingField = `
            <div class="training_input">
                    <div class="arrow_sign">
                      <i
                        class="fa fa-arrow-right"
                        style="margin-right: 20px;"
                      ></i>
                    </div>
                    <div class="training_in">
                      <div class="same_row_inputs">
                        <div class="input_box">
                          <input
                            type="text"
                            placeholder="Name of Training"
                            id="training-name"
                            class="training-name"
                          />
                        </div>
                        <div class="input_box slct_picker">
                          <div class="form-selectpicker">
                            <select
                              id="trainingFrom"
                              class="selectpicker year-selector additional-select-field"
                              data-width="100%"
                              title="Training Year"
                              data-size="6"
                              name="training-year"
                              required
                            >
                              <% for (let i= yr; i >= 1950; i--) { %>
                              <option value="<%= i %>"><%= i %></option>
                              <% } %>
                            </select>
                          </div>
                        </div>
                      </div>
                      <textarea
                        name="training-details"
                        placeholder="Tell us about your professional training"
                        id="training-details"
                        cols="30"
                        rows="5"
                        class="more_on_workplace"
                      ></textarea>
                    </div>
                    <div class="delete-btn">
                      <button
                        class="delete delete-training-class"
                        id="delete-training"
                      >
                        <i class="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>
              `;
    training++;
    $('#training-section').append(trainingField);

    $('.additional-select-field').selectpicker('refresh');
    $('.additional-select-field').css('width', '100%');
});
$(document).on('click', 'button.delete-training-class', e => {
    let fld = e.target;
    while (true) {
        let val = $(fld)[0].className;
        if (val === 'training_input') break;
        fld = fld.parentElement;
    }
    const numOfChildren = fld.parentElement.children.length;
    if (numOfChildren > 1) {
        $(fld).remove();
    }
});
$(document).on('click', '#add-awards-field', e => {
    awards++;
    $('#awards-section').append(`<div class="awards_input">
                    <div class="arrow_sign">
                      <i
                        class="fa fa-arrow-right"
                        style="margin-right: 20px;"
                      ></i>
                    </div>
                    <div class="awards_in">
                      <div class="same_row_inputs">
                        <div class="input_box">
                          <input
                            type="text"
                            placeholder="Name of the award"
                            id="awards-name"
                            class="award-name"
                          />
                        </div>
                        <div class="input_box slct_picker">
                          <div class="form-selectpicker">
                            <select
                              id="award-year"
                              class="selectpicker year-selector additional-select-field"
                              data-width="100%"
                              title="Achievement Year"
                              data-size="6"
                              name="award-year"
                              required
                            >
                              <% for (let i= yr; i >= 1950; i--) { %>
                              <option value="<%= i %>"><%= i %></option>
                              <% } %>
                            </select>
                          </div>
                        </div>
                      </div>
                      <textarea
                        name="award-details"
                        placeholder="Tell us about your award"
                        id="award-details"
                        cols="30"
                        rows="5"
                        class="award-details"
                      ></textarea>
                    </div>
                    <div class="delete-btn">
                      <button
                        class="delete delete-awards-class"
                        id="delete-awards"
                      >
                        <i class="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>`);

    $('.additional-select-field').selectpicker('refresh');
    $('.additional-select-field').css('width', '100%');
});
$(document).on('click', 'button.delete-awards-class', e => {
    let fld = e.target;
    while (true) {
        let val = $(fld)[0].className;
        if (val === 'awards_input') break;
        fld = fld.parentElement;
    }
    const numOfChildren = fld.parentElement.children.length;
    if (numOfChildren > 1) {
        $(fld).remove();
    }
});
$(document).on('click', '#add-edu-field', e => {
    const edu_field = ` <div class="education_input">
                    <div class="arrow_sign">
                      <i class="fa fa-arrow-right"></i>
                    </div>
                    <div class="edu_in">
                      <input
                        type="text"
                        name="institute"
                        placeholder="Institute"
                        id="institute"
                        class="institute"
                      />
                    </div>
                    <div class="edu_in">
                      <input
                        type="text"
                        name="degree"
                        placeholder="Degree"
                        id="degree"
                        class="degree"
                      />
                    </div>
                    <div class="edu_in">
                      <div class="input_box slct_picker">
                        <div class="form-selectpicker">
                          <select
                            id="eduFrom"
                            class="selectpicker year-selector additional-from"
                            data-width="100%"
                            title="From"
                            data-size="6"
                            name="eduFrom"
                            required
                          >
                            <% for (let i= yr; i >= 1950; i--) { %>
                            <option value="<%= i %>"><%= i %></option>
                            <% } %>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="edu_in">
                      <div class="input_box slct_picker">
                        <div class="form-selectpicker">
                          <select
                            id="eduTo"
                            class="selectpicker year-selector additional-to"
                            data-width="100%"
                            title="To"
                            data-size="6"
                            name="eduTo"
                            required
                          >
                            <% for (let i= yr; i >= 1950; i--) { %>
                            <option value="<%= i %>"><%= i %></option>
                            <% } %>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="delete-btn">
                      <button class="delete delete-edu-class" id="delete-edu">
                        <i class="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>`;
    edu++;
    $('#all_edu_inputs').append(edu_field);

    $('.additional-from').selectpicker('refresh');
    $('.additional-from').css('width', '100%');

    $('.additional-to').selectpicker('refresh');
    $('.additional-to').css('width', '100%');
});
$(document).on('click', '.delete-edu-class', e => {
    let fld = e.target;
    while (true) {
        let val = $(fld)[0].className;
        if (val === 'education_input') break;
        fld = fld.parentElement;
    }
    const numOfChildren = fld.parentElement.children.length;
    if (numOfChildren > 1) {
        $(fld).remove();
    }
});
$(document).on('click', '#add-exp-field', e => {
    const edu_field = `
              <div class="exp_input">
                  <div class="arrow_sign">
                    <i class="fa fa-arrow-right"></i>
                  </div>
                  <div class="exp_in">
                    <input
                      type="text"
                      name="exp-institute"
                      placeholder="Work Place"
                      id="exp-institute"
                      class="exp-institute"
                    />
                  </div>
                  <div class="exp_in">
                    <div class="input_box slct_picker">
                      <div class="form-selectpicker">
                        <select
                          id="expFrom"
                          class="selectpicker year-selector additional-select-field1"
                          data-width="100%"
                          title="Year: From"
                          data-size="6"
                          name="from"
                          required
                        >
                          <% for (let i= yr; i >= 1950; i--) { %>
                          <option value="<%= i %>"><%= i %></option>
                          <% } %>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="exp_in">
                    <div class="input_box slct_picker">
                      <div class="form-selectpicker">
                        <select
                          id="expTo"
                          class="selectpicker year-selector additional-select-field2"
                          data-width="100%"
                          title="Year: To"
                          data-size="6"
                          name="to"
                          required
                        >
                          <% for (let i= yr; i >= 1950; i--) { %>
                          <option value="<%= i %>"><%= i %></option>
                          <% } %>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="delete-btn">
                    <button class="delete delete-exp-class" id="delete-exp">
                      <i class="fa fa-minus"></i>
                    </button>
                  </div>
                </div>
            `;
    exp++;
    $('#exp-section').append(edu_field);

    $('.additional-select-field1').selectpicker('refresh');
    $('.additional-select-field1').css('width', '100%');

    $('.additional-select-field2').selectpicker('refresh');
    $('.additional-select-field2').css('width', '100%');
});
$(document).on('click', '.delete-exp-class', e => {
    let fld = e.target;
    while (true) {
        let val = $(fld)[0].className;
        if (val === 'exp_input') break;
        fld = fld.parentElement;
    }
    const numOfChildren = fld.parentElement.children.length;
    if (numOfChildren > 1) {
        $(fld).remove();
    }
});

function showAlert(msg) {
    console.log(msg);
    $('#alert').show();
    $('#alert').html(msg);
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

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
$(document).on('click', '.minusChamber', e => {
    const len =
        e.target.parentElement.parentElement.parentElement.children.length;
    if (len !== 1) {
        $(e.target.parentElement.parentElement).remove();
    }
});
$(document).on('click', '.minusDayTime', e => {
    const len = e.target.parentElement.parentElement.children.length;
    console.log(len);
    if (len !== 1) {
        $(e.target.parentElement).remove();
    }
});
$(document).on('click', '.plusDayTime', e => {
    $(e.target.parentElement.children[1]).append(`
        <div class="eachDayTime">
            <input type="text" name="dayFrom" />
            <input type="text" name="dayTo" />
            <input type="text" name="timeFrom" />
            <input type="text" name="timeTo" />
            <button class="minusDayTime">minusDayTime</button>
          </div>`);
});
$('.addChamber').on('click', e => {
    $('.chambers').append(`<div class="oneChamber">
        <div class="chamber_name_place">
          <input type="text" name="chamberName" />
          <input type="text" name="chamberPlace" />
          <button class="minusChamber">minusChamber</button>
        </div>
        <div class="chamber_day_time">
          <div class="eachDayTime">
            <input type="text" name="dayFrom" />
            <input type="text" name="dayTo" />
            <input type="text" name="timeFrom" />
            <input type="text" name="timeTo" />
            <button class="minusDayTime">minusDayTime</button>
          </div>
        </div>
        <button class="plusDayTime">Plus Day Time</button>
      </div>`);
});

$('.addDoctor__submit').on('click', e => {
    const name = $('#name').val();
    const gender = $('#genderInput').val();
    const designation = $('#designation').val();
    const expertise = $('#expertise').val();
    const about_me = $('#about_me').val();
    const institute = $('#institute').val();
    const dob = $('#dob').val();
    const speciality = $('#speciality').val();
    const visitingFee = $('#visitingFee').val();
    const email = $('#email').val();
    const phone = $('#phone').val();
    const affiliation = $('#affiliation').val();
    const country = $('#countryInput').val();
    const researchArea = $('#research-area').val();
    const regno = $('#regno').val();
    const password = $('#password').val();
    const cPassword = $('#cpassword').val();
    const profDegree = $('#prof-degree').val();
    let error = false;
    const nameRegex = new RegExp('^[a-zA-Z ]+$');
    const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const dobRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const phoneRegex = /^[0-9]*$/;
    if (!nameRegex.test(name)) {
        error = true;
        showAlert('Invalid name');
    } else if (!emailRegex.test(email)) {
        error = true;
        showAlert('Invalid email');
    } else if (!dobRegex.test(dob)) {
        error = true;
        showAlert('Invalid date of birth');
    } else if (password == '') {
        error = true;
        showAlert('Enter password');
    } else if (password.length < 6) {
        error = true;
        showAlert('Password must contain at least 6 characters');
    } else if (cPassword == '') {
        error = true;
        showAlert('Confirm password');
    } else if (password != cPassword) {
        error = true;
        showAlert('Passwords do not match');
    } else if (affiliation == '') {
        error = true;
        showAlert('Enter current affiliation');
    } else if (expertise == '') {
        error = true;
        showAlert('Enter the expertise area');
    } else if (about_me == '') {
        error = true;
        showAlert('Write about yourself');
    } else if (institute == '') {
        error = true;
        showAlert('Enter the institute');
    } else if (designation == '') {
        error = true;
        showAlert('Enter designation');
    } else if (!phoneRegex.test(phone) || phone.length < 6) {
        error = true;
        showAlert('Invalid phone number');
    } else if (!phoneRegex.test(visitingFee)) {
        error = true;
        showAlert('Invalid visiting fee amount');
    } else if (gender == '') {
        error = true;
        showAlert('Confirm gender');
    } else if (country == '') {
        error = true;
        showAlert('Confirm country');
    } else if (speciality == '') {
        error = true;
        showAlert('Confirm speciality');
    } else if (regno == '') {
        error = true;
        showAlert('Enter license number');
    } else if (researchArea == '') {
        error = true;
        showAlert('Enter research area');
    } else if (profDegree == '') {
        error = true;
        showAlert('Enter professional degree');
    }

    const workInstitutes = $('.exp_in input.exp-institute');
    const workFrom = $('.exp_in select[name="from"]');
    const workTo = $('.exp_in select[name="to"]');
    const eduInValue = $('.edu_in input');
    const eduInSelect = $('.edu_in select');
    const trainingNames = $('.training_in input.training-name');
    const trainingYears = $('.training_in select[name="training-year"]');
    const trainingDescriptions = $('.training_in textarea');
    const awardsNames = $('.awards_in input.award-name');
    const awardsYears = $('.awards_in select[name="award-year"]');
    const awardsDescriptions = $('.awards_in textarea');

    if (eduInValue.length == 0) {
        error = true;
        showAlert('Enter atleast one educational details');
    } else if (trainingNames.length == 0) {
        error = true;
        showAlert('Enter atleast one professional training details');
    } else if (workInstitutes.length == 0) {
        error = true;
        showAlert('Enter atleast one work experience details');
    }

    const eduArray = [];
    const workExpArray = [];
    const awardsArray = [];
    const trainingArray = [];

    for (let i = 0; i < eduInValue.length / 2; i++) {
        const institute = eduInValue[2 * i + 0].value;
        const degree = eduInValue[2 * i + 1].value;
        const eduFrom = eduInSelect[2 * i + 0].value;
        const eduTo = eduInSelect[2 * i + 1].value;

        if (institute == '') {
            error = true;
            showAlert('Name of educational institute left empty');
        } else if (degree == '') {
            error = true;
            showAlert('Educational degree left empty');
        } else if (eduFrom == '') {
            error = true;
            showAlert('Beginning year at education section left empty');
        } else if (eduTo == '') {
            error = true;
            showAlert('Ending year at education section left empty');
        }

        eduArray.push({
            institute,
            degree,
            eduFrom,
            eduTo
        });
    }
    for (let i = 0; i < trainingNames.length; i++) {
        const name = trainingNames[i].value;
        const year = trainingYears[i].value;
        const description = trainingDescriptions[i].value;

        if (name == '') {
            error = true;
            showAlert('Name of training left empty');
        } else if (year == '') {
            error = true;
            showAlert('Year field left empty at training section');
        } else if (description == '') {
            error = true;
            showAlert('Description field left empty at training section');
        }

        trainingArray.push({
            name,
            year,
            description
        });
    }
    for (let i = 0; i < awardsNames.length; i++) {
        const name = awardsNames[i].value;
        const year = awardsYears[i].value;
        const description = awardsDescriptions[i].value;
        awardsArray.push({
            name,
            year,
            description
        });
    }
    for (let i = 0; i < workInstitutes.length; i++) {
        const institute = workInstitutes[i].value;
        const from = workFrom[i].value;
        const to = workTo[i].value;

        if (institute == '') {
            error = true;
            showAlert('Name of work institute left empty');
        } else if (from == '') {
            error = true;
            showAlert(
                'Beginning year field at work and experience section left empty'
            );
        } else if (to == '') {
            error = true;
            showAlert('Ending year field at work and experience section left empty');
        }

        workExpArray.push({
            institute,
            from,
            to
        });
    }
    const vhArray = [{
        chamberName: 'Popular Diagonisitc',
        chamberAddress: 'Shyamoli',
        chamberTimings: [{
                dayFrom: 'Saturday',
                dayTo: 'Monday',
                timeFrom: '2:00PM',
                timeTo: '5:00PM'
            },
            {
                dayFrom: 'Thursay',
                dayTo: 'Sunday',
                timeFrom: '7:00PM',
                timeTo: '10:00PM'
            }
        ]
    }];
    postData = {
        name,
        gender,
        institute,
        expertise,
        designation,
        speciality,
        dob,
        email,
        phone,
        affiliation,
        regno,
        researchArea,
        country,
        fee: visitingFee,
        aboutYourself: about_me,
        trainingArray: JSON.stringify(trainingArray),
        awardsArray: JSON.stringify(awardsArray),
        visitingHour: JSON.stringify(vhArray),
        education: JSON.stringify(eduArray),
        workExperience: JSON.stringify(workExpArray)
    };
    if (!error) {
        formSubmit(postData);
    }
});

function formSubmit(data) {
    $.ajax({
        type: 'POST',
        url: '/auth/register/new/exp',
        data,
        success: data => {
            if (data.status == false) {
                showAlert(data.message);
            } else {
                location.reload();
            }
        }
    });
}