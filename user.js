var baseURL = 'https://blooming-plateau-13338.herokuapp.com/'
var localURL = 'http://localhost:3000/'

getMessages(localURL)
showUserData()

$(document).on('click', '.homeButton', goHome)
$(document).on('click', '.signOut', signOut)
$(document).on('click', '.my-posts', displayUserMessages)
$(document).on('click', '.submit-new-message', addMessage)


function getMessages(localURL) {
  $.get(localURL)
    .then(displayMessages)
}

function displayMessages(data) {
  $('.message-section').empty()
  data.forEach(function(data) {
    $('.message-section').append(
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
                <button type="button" id="${data.message_id}" class="btn btn-outline-success upvote"><i id="${data.message_id}" class="fa fa-hand-o-up fa-2x" aria-hidden="true"></i></button>
                <button type="button" id="${data.message_id}" class="btn btn-outline-danger downvote"><i id="${data.message_id}" class="fa fa-hand-o-down fa-2x" aria-hidden="true"></i></button>
              </div>
              <div class ="delete hide">
                <button type="button" id="${data.id}" class="btn btn-outline-danger"><i class="fa fa-trash" id="${data.id}" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted card-footer-${data.message_id}">
            <p>
              <a id="${data.message_id}" class="seeComments btn btn-primary" data-toggle="collapse" href="#collapse-${data.message_id}" aria-expanded="false" aria-controls="collapse-${data.message_id}">
                Comments
              </a>
            </p>
          </div>
      `
    )
    $('.seeComments').on('click', displayComments)
  })
}

function displayComments(event){
  $('.card-footer-' + event.target.id).append(
    `
    <div class="collapse" id="collapse-${event.target.id}">
      <div class="card card-block">
        <div class="emptyGuy"></div>
          <div class="form-group">
            <label for="comment-text">Add a Comment</label>
            <textarea class="form-control" id="comment-text" rows="3"></textarea>
            <button type="button" id="${event.target.id}" class="btn btn-success">Submit Comment</button>
          </div>
        </div>
      </div>
    </div>
    `
  )
}

function goHome(id){
  $('.message-section').empty()
  getMessages(localURL)
}

function signOut(){
  localStorage.removeItem('token')
  location.href = '/'
}

function showUserData(){
  var userData = getUserDataFromToken()
  $('.username-info').append(
    `
    Username: ${userData.username}
    `)
  $('.email-info').append(
    `
    Email: ${userData.email}
    `)
}

function getUserDataFromToken(){
  var token = localStorage.getItem('token')
   return parseJwt(token)
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

function displayUserMessages(){
  var userData = getUserDataFromToken()
  $('.message-section').empty()
  $.get(localURL + userData.id)
    .then(function(data){
      if(data.length === 0){
        $('.message-section').append(
          `
          <div class="card card-block">
            <h3 class="text-center"> You have not created any messages yet! </h3>
          </div>
          `)
      } else {
        displayMessages(data)
        $('.post-by').text("Post by: You")
        addDeleteButtonToUserMessages(data)
      }
    })
}

function getNewMessageDetails(){
  var userData = getUserDataFromToken()
  var messageTitle = $('#message-title').val()
  var messageText = $('#message-text').val()
  return {userData, messageTitle, messageText}
}

function addMessage() {
  var messageDetails = getNewMessageDetails()
  var postBody = {
    title: messageDetails.messageTitle,
    message: messageDetails.messageText,
    rating: 0,
    user_id: messageDetails.userData.id
  }
  if(messageDetails.messageText && messageDetails.messageTitle) {
    $.post(localURL + messageDetails.userData.id, postBody)
      .then(()=> {
        $('.message-section').empty()
        getMessages(localURL)
      })
    clearAndCollapseMessageForm()
  }
}

function clearAndCollapseMessageForm(){
  var messageTitle = $('#message-title').val('')
  var messageText = $('#message-text').val('')
  $('#add-message').collapse('toggle')
}

function addDeleteButtonToUserMessages(data){
  $('.delete').removeClass('hide')
}
