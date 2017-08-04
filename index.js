var baseURL = 'https://blooming-plateau-13338.herokuapp.com/'
var localURL = 'http://localhost:3000/'

function getMessages(localURL) {
  $.get(localURL)
    .then(displayMessages)
}

function displayMessages(data) {
  data.forEach(function(data) {
    $('.message-data').append(
      `
        <div class="card">
          <div class="card-header">Post by: ${data.username}</div>
          <div class="row">
            <div class="col-sm-9">
              <div class="card-block">
                <h4 class="card-title">${data.title}</h4>
                <p class="card-text">${data.message}</p>
                <a href="#" class="btn btn-seconday">Read More</a>
              </div>
            </div>
            <div class="col-sm-3 card-block text-center">
              <div class="rating rounded">
                <p>${data.rating}</p>
                <button type="button" class="btn btn-outline-success upvote"><i class="fa fa-hand-o-up fa-2x" aria-hidden="true"></i></button>
                <button type="button" class="btn btn-outline-danger downvote"><i class="fa fa-hand-o-down fa-2x" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            <p class="num-of-comments">6 Comments</p>
            <a href="#" class="see-thread btn btn-seconday">See Thread</a>
          </div>
        </div>
      `
    )
  })
}

function loadSignIn() {
  $('#sign-in').on('show.bs.modal', function(event) {
    var modal = $(this)
    modal.find('.modal-title').text('Welcome back! Please sign in!')
  })
}

function loadSignUp() {
  $('#sign-up').on('show.bs.modal', function(event) {
    var modal = $(this)
    modal.find('.modal-title').text('Hi! Please sign up for everything pugs!')
  })
}

function submitSignIn() {
  let email = $('#sign-in-email').val();
  let password = $('#sign-in-password').val()
  $('#sign-in-modal').modal('hide')
  $('.message-data').empty()
  loadUserData()
}

function submitSignUp() {
  let email = $('#sign-up-email').val();
  let password = $('#sign-up-password').val()
  let username = $('#sign-up-username').val()

  $('#sign-up-modal').modal('hide')
}

function loadUserData(id){
  $.get(localURL + `users/1`)
  .then(function(id){
    $('.message-data').append(
      `
      <div class="card blahhh">
        <div class="card-block">
          <p>${id[0].username}</p>
        </div>
      </div>
      `
    )
    // getMessages(localURL)
  })
}

$(document).ready(function() {
  getMessages(localURL)
})

$('#sign-in').on('click', loadSignIn)
$('#sign-up').on('click', loadSignUp)
$('.submit-sign-in').on('click', submitSignIn)
$('#submit-sign-up').on('click', submitSignUp)

$('.custom-control-input').on('click', function(){
  $('.hide').toggle()
})


//once we are dynamically appending cards, we can limit the description text to X amount of characters
// and then we can create a click handler for the read more button that will then reveal the rest of the text,
// and a show less button that will then make it go back to normal, this way we can control
// the size of the messages and list more messages on one screen allowing users to scroll through messages quickly
// MESSAGES.
// //var myDiv = $('.myclass');        /*/select the description field/*/
// myDiv.text(myDiv.text().substring(0,200));    /*/limit characters to 200/*/
