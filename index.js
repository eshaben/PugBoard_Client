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
          <div class="card-header post-by">Post by: ${data.username}</div>
          <div class="row">
            <div class="col-sm-9">
              <div class="card-block">
                <h4 class="card-title">${data.title}</h4>
                <p class="card-text">${data.message}</p>
              </div>
            </div>
            <div class="col-sm-3 card-block text-center">
              <div class="rating rounded">
                <p id="rating-${data.message_id}">${data.rating}</p>
                <button type="button" id="up-${data.message_id}" class="btn btn-outline-success upvote"><i id="up-${data.message_id}" class="fa fa-hand-o-up fa-2x" aria-hidden="true"></i></button>
                <button type="button" id="down-${data.message_id}" class="btn btn-outline-danger downvote"><i id="down-${data.message_id}" class="fa fa-hand-o-down fa-2x" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
          <p>
            <a id="${data.user_id}" class="seeComments btn btn-primary" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
            Comments
            </a>
            </p>
            <div class="collapse" id="collapseExample">
            <div class="card card-block">
            <div class="emptyGuy"></div>
            <div class="form-group">
            <label for="comment-text">Add a Comment</label>
            <textarea class="form-control" id="message-text" rows="3"></textarea>
            <button type="button" id="${data.user_id}" class="btn btn-success">Submit Comment</button>
            </div>
            </div>
            </div>
          </div>
        </div>
      `
    )
  })


  //this is where I was last working
  $('.upvote').on('click', function(event){
    event.preventDefault()
    var id = Number((event.target.id).slice(-1))
    $.get(localURL + 'message/' + id)
    .then(function(data){
    data = data.filter(function (item) {
      return item.id == id
      })[0]
    // var rating = data.rating
      $.ajax({
        type: 'PUT',
        url: localURL + id,
        data: {
          title: data.title,
          message: data.message,
          rating: Number(data.rating) + 1,
          user_id: data.user_id
        }
      })
      .then(function(data){
        let rating = data[0].rating;
        // getMessages()
        $('#rating-' + id).text(rating)
      })
    })
  })

  $('.downvote').on('click', function(event){
    event.preventDefault()
    var id = Number((event.target.id).slice(-1))
    $.get(localURL + 'message/' + id)
    .then(function(data){
      data = data.filter(function (item) {
        return item.id == id
        })[0]
    // var rating = data.rating
      $.ajax({
        type: 'PUT',
        url: localURL + id,
        data: {
          title: data.title,
          message: data.message,
          rating: Number(data.rating) - 1,
          user_id: data.user_id
        }
      })
      .then(function(data){
        let rating = data[0].rating;
        // getMessages()
        $('#rating-' + id).text(rating)
      })
    })
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
  getUserData()
}

function submitSignUp() {
  let email = $('#sign-up-email').val();
  let password = $('#sign-up-password').val()
  let username = $('#sign-up-username').val()
  let formData = {
    'email': email,
    'password': password,
    'username': username
  }
  $.post(localURL + 'users', formData)
  $('#sign-up-modal').modal('hide')
  $('.message-data').empty()
  alertSuccessfulSignup()
  getUserData()
}

function getUserData(id){
  $.get(localURL + 'users/1')
  .then(displayUserPage)
  .then( function() {
    $(document).on('click', '#submit-new-message', function(event){
      $.get(localURL + 'users/1')
      .then(data => {
        addMessage()
        $('.message-data').empty()
        loadAddMessageForm()
        getMessages(localURL)
      })
    })
  })
}

function addMessage() {
  var id = 0
  var messageTitle = $('#message-title').val()
  var messageText = $('#message-text').val()
  $.get(localURL + 'users/1')
  .then(data => {
    id = data[0].id
    var rating = 0
    var postData = {
      title: messageTitle,
      message: messageText,
      rating: rating,
      user_id: id
    }
    if(messageTitle && messageText) {
      $.post(localURL + '1', postData)
      .then(()=> {
        $('.message-data').empty()
        loadAddMessageForm()
        getMessages(localURL)
      })
    }
  })
}

function loadAddMessageForm(id){
  $('.message-data').append(`
    <div class="card random">
      <div class="card-header" role="tab" id="heading-add-message">
        <h5 class="text-center mb-0">
          <a class="collapsed text-center" data-toggle="collapse" data-parent="#accordion" href="#add-message" aria-expanded="false" aria-controls="add-message">
            Add a message!
          </a>
        </h5>
      </div>
      <div id="add-message" class="collapse" role="tabpanel" aria-labelledby="headingThree">
        <div class="card-block add-message-card-block">
          <form>
            <div class="form-group">
              <label for="message-title">Message Title</label>
              <input type="text" class="form-control" id="message-title" placeholder="Example input">
            </div>
            <div class="form-group">
              <label for="message-text">Message</label>
              <textarea class="form-control" id="message-text" rows="3"></textarea>
            </div>
            <div class="form-group">
              <input type="hidden" class="form-control hide" id="message-text" rows="3" value="${id}"></input>
            </div>
            <div class="form-group">
              <select class="custom-select">
                <option selected>Pick a category</option>
                <option value="1">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input">
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description">I don't see my category!</span>
              </label>
            </div>
            <div class="form-group">
              <div class="form-group hide blah">
                <label for="other-category">Enter a new category</label>
                <input type="text" class="form-control" id="other-category" placeholder="snorting pugs">
              </div>
            </div>
            <div class="form-group">
              <button type="button" id='submit-new-message' class="btn btn-success">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}


function displayUserPage(id){
  // appendUserData(id);
  editNavButtons(id)
  loadAddMessageForm(id)
  getMessages(localURL)
}

function alertSuccessfulSignup(){
  $('.user-data').append(
  `
  <div class="alert alert-success alert-dismissible fade show" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    <strong>Successful sign up!</strong> Welcome to PugBoard!
  </div>
  `
  )
}

function editNavButtons(id){
  $('#sign-in').hide()
  $('#sign-up').hide()
  $('.form-inline').append(
    `
    <div class="dropdown">
      <button class="btn btn-outline-primary" type="submit"><i class="fa fa-home" aria-hidden="true"></i></button>
      <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
         <i class="fa fa-user-circle" aria-hidden="true"></i>
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <div class="dropdown-item">
          <p>Username: ${id[0].username}</p>
          <p>Email: ${id[0].email}</p>
        </div>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" id="my-posts" href="#">My Posts</a>
      </div>
    </div>
      <button class="btn btn-primary" type="submit">Sign Out</button>
    `
  )
}
$(document).on('click', '#my-posts', function(id){
  var id = 1
  console.log("you clicked me!");
  $('.message-data').empty()
  $.get(localURL + id)
  .then(function(data){
    displayMessages(data)
    console.log(data);
    $('.post-by').text("Post by: You")
  })
})

function deleteMessage() {
  $.ajax({
    url: `http://localhost:3000/`,
    method: 'DELETE'
  })
}




getMessages(localURL)


$('#sign-in').on('click', loadSignIn)
$('#sign-up').on('click', loadSignUp)
$('.submit-sign-in').on('click', submitSignIn)
$('#submit-sign-up').on('click', submitSignUp)
$('#deleteButton').on('click', deleteMessage)
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
