var baseURL = 'https://blooming-plateau-13338.herokuapp.com/'
var localURL = 'http://localhost:3000/'

getMessages(localURL)
$('.submit-sign-in').on('click', submitSignIn)
$('#submit-sign-up').on('click', submitSignUp)

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
                <button type="button" id="up-${data.message_id}" class="btn btn-outline-success upvote" disabled><i id="up-${data.message_id}" class="fa fa-hand-o-up fa-2x" aria-hidden="true"></i></button>
                <button type="button" id="down-${data.message_id}" class="btn btn-outline-danger downvote" disabled><i id="down-${data.message_id}" class="fa fa-hand-o-down fa-2x" aria-hidden="true"></i></button>
              </div>
              <div class ="delete hide">
              <button type="button" id="${data.message_id}" class="btn btn-outline-danger"><i class="fa fa-trash" id="${data.id}" aria-hidden="true"></i>
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
            <button type="button" id="${event.target.id}" class="btn btn-success" disabled>Submit Comment</button>
          </div>
        </div>
      </div>
    </div>
    `
  )
}

function submitSignIn() {
  let email = $('#sign-in-email').val();
  let password = $('#sign-in-password').val()
  let data = {email, password}

  $.post(localURL + 'auth/login', data)
    .then(response => {
      if(response.error){
        alert(response.error)
      } else {
        localStorage.setItem('token', response.token)
        location.href = '/user.html'
      }
    })
}

function submitSignUp() {
  let formData = {
    'email': $('#sign-up-email').val(),
    'password': $('#sign-up-password').val(),
    'username': $('#sign-up-username').val()
  }
  $.post(localURL + 'auth/signup', formData)
    .then(data => {
      let token = data.token.replace(/['"]+/g, '')
      let decoded = parseJwt(token)

      localStorage.setItem('token', token)
      location.href = '/user.html'
      $('#sign-up-modal').modal('hide')
    })
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

  // $('.upvote').on('click', function(event){
  //   event.preventDefault()
  //   var id = Number((event.target.id).substring(3))
  //   $.get(localURL + 'message/' + id)
  //   .then(function(data){
  //   data = data.filter(function (item) {
  //     return item.id == id
  //     })[0]
  //     $.ajax({
  //       type: 'PUT',
  //       url: localURL + id,
  //       data: {
  //         message: data.message,
  //         rating: Number(data.rating) + 1,
  //         title: data.title,
  //         user_id: data.user_id
  //       }
  //     })
  //     .then(function(data){
  //       let rating = data[0].rating;
  //       $('#rating-' + id).text(rating)
  //     })
  //   })
  // })
  //
  // $('.downvote').on('click', function(event){
  //   event.preventDefault()
  //   var id = Number((event.target.id).substring(5))
  //   $.get(localURL + 'message/' + id)
  //   .then(function(data){
  //     data = data.filter(function (item) {
  //       return item.id == id
  //       })[0]
  //     $.ajax({
  //       type: 'PUT',
  //       url: localURL + id,
  //       data: {
  //         title: data.title,
  //         message: data.message,
  //         rating: Number(data.rating) - 1,
  //         user_id: data.user_id
  //       }
  //     })
  //     .then(function(data){
  //       let rating = data[0].rating;
  //       $('#rating-' + id).text(rating)
  //     })
  //   })
  // })


// function loadSignIn() {
//   $('#sign-in').on('show.bs.modal', function(event) {
//     var modal = $(this)
//     modal.find('.modal-title').text('Welcome back! Please sign in!')
//   })
// }
//
// function loadSignUp() {
//   $('#sign-up').on('show.bs.modal', function(event) {
//     var modal = $(this)
//     modal.find('.modal-title').text('Hi! Please sign up for everything pugs!')
//   })
// }
//
// function submitSignIn() {
//   let email = $('#sign-in-email').val();
//   let password = $('#sign-in-password').val()
//   let data = {email, password}
//
//   $('#sign-in-modal').modal('hide')
//
//   $.post(localURL + 'auth/login', data)
//     .then(response => {
//       if(response.error){
//         alert(response.error)
//       } else {
//         localStorage.setItem('token', response.token)
//         location.href = '/user.html'
//       }
//     })
// }
//
// function submitSignUp() {
//   let formData = {
//     'email': $('#sign-up-email').val(),
//     'password': $('#sign-up-password').val(),
//     'username': $('#sign-up-username').val()
//   }
//   $.post(localURL + 'auth/signup', formData)
//   .then(data => {
//     let tokenString = data.token
//     let token = tokenString.replace(/['"]+/g, '')
//     let decoded = parseJwt(token)
//     console.log(decoded);
//     let id = decoded.id;
//     $('#sign-up-modal').modal('hide')
//     $('.message-data').empty()
//     alertSuccessfulSignup()
//     getUserData(id)
//   })
// }
//
// function parseJwt (token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace('-', '+').replace('_', '/');
//   return JSON.parse(window.atob(base64));
// };
//
// function getUserData(id){
//   $.get(localURL + 'users/' + id)
//   .then(displayUserPage(id))
//   .then(function(id) {
//     $(document).on('click', '.submit-new-message', function(id){
//       // var id = id.target.id;
//       // $.get(localURL + 'users/' + id)
//       // .then(data => {
//       //   console.log(data);
//         addMessage(id)
//         $('.message-data').empty()
//         loadAddMessageForm()
//         getMessages(localURL)
//         editNavButtons()
//       })
//     })
//   }
//
//
// function addMessage(id) {
//   var id = id.target.id
//   var messageTitle = $('#message-title').val()
//   var messageText = $('#message-text').val()
//   $.get(localURL + 'users/' + id)
//   .then(data => {
//    id = data[0].id
//     var rating = 0
//     var postData = {
//       title: messageTitle,
//       message: messageText,
//       rating: rating,
//       user_id: id
//     }
//     if(messageTitle && messageText) {
//       $.post(localURL + id, postData)
//       .then(()=> {
//         $('.message-data').empty()
//         loadAddMessageForm()
//         getMessages(localURL)
//       })
//     }
//   })
// }
//
// function loadAddMessageForm(id){
//   console.log(id);
//   $('.message-data').append(`
//     <div class="card random">
//       <div class="card-header" role="tab" id="heading-add-message">
//         <h5 class="text-center mb-0">
//           <a class="collapsed text-center" data-toggle="collapse" data-parent="#accordion" href="#add-message" aria-expanded="false" aria-controls="add-message">
//             Add a message!
//           </a>
//         </h5>
//       </div>
//       <div id="add-message" class="collapse" role="tabpanel" aria-labelledby="headingThree">
//         <div class="card-block add-message-card-block">
//           <form>
//             <div class="form-group">
//               <label for="message-title">Message Title</label>
//               <input type="text" class="form-control" id="message-title" placeholder="Example input">
//             </div>
//             <div class="form-group">
//               <label for="message-text">Message</label>
//               <textarea class="form-control" id="message-text" rows="3"></textarea>
//             </div>
//             <div class="form-group">
//               <input type="hidden" class="form-control hide" id="message-text" rows="3" value="${id}"></input>
//             </div>
//             <div class="form-group">
//               <select class="custom-select">
//                 <option selected>Pick a Category</option>
//                 <option value="1">Chew Toys</option>
//                 <option value="1">Kibble</option>
//                 <option value="1">Training</option>
//                 <option value="1">Activities</option>
//                 <option value="1">Breeds</option>
//               </select>
//             </div>
//             <div class="form-group">
//               <div class="form-group hide blah">
//                 <label for="other-category">Enter a new category</label>
//                 <input type="text" class="form-control" id="other-category" placeholder="snorting pugs">
//               </div>
//             </div>
//             <div class="form-group">
//               <button type="button" id="${id}" class="submit-new-message btn btn-success">Submit</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   `)
// }
//
//
// function displayUserPage(id){
//   editNavButtons(id)
//   loadAddMessageForm(id)
//   getMessages(localURL)
// }
//
// function alertSuccessfulSignup(){
//   $('.user-data').append(
//   `
//   <div class="alert alert-success alert-dismissible fade show" role="alert">
//     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//       <span aria-hidden="true">&times;</span>
//     </button>
//     <strong>Successful sign up!</strong> Welcome to PugBoard!
//   </div>
//   `
//   )
// }
//
// function editNavButtons(id){
//   $.get(localURL + 'users/' + id)
//   .then(function(data){
//     $('#sign-in').hide()
//     $('#sign-up').hide()
//     $('.form-inline').append(
//       `
//       <div class="dropdown theThing">
//         <button class="btn homeButton btn-outline-primary" type="submit"><i class="fa homeButton fa-home" aria-hidden="true"></i></button>
//         <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//            <i class="fa fa-user-circle" aria-hidden="true"></i>
//         </button>
//         <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
//           <div class="dropdown-item">
//             <p>Username: ${data[0].username}</p>
//             <p>Email: ${data[0].email}</p>
//           </div>
//           <div class="dropdown-divider"></div>
//           <a class="dropdown-item my-posts" id="${id}" href="#">My Posts</a>
//         </div>
//       </div>
//         <button class="btn signOut btn-primary" type="submit">Sign Out</button>
//       `
//     )
//   })
// }
//
//
// function displayUserMessages(id){
//   var id = id.target.id
//   $('.message-data').empty()
//   $.get(localURL + id)
//   .then(function(data){
//     displayMessages(data)
//     $('.post-by').text("Post by: You")
//     data.forEach(function(data){
//       $('.delete').removeClass('hide')
//     })
//   })
// }
//
// function displayComments(event){
//   $('.card-footer-' + event.target.id).append(
//     `
//     <div class="collapse" id="collapse-${event.target.id}">
//       <div class="card card-block">
//         <div class="emptyGuy"></div>
//           <div class="form-group">
//             <label for="comment-text">Add a Comment</label>
//             <textarea class="form-control" id="comment-text" rows="3"></textarea>
//             <button type="button" id="${event.target.id}" class="btn btn-success">Submit Comment</button>
//           </div>
//         </div>
//       </div>
//     </div>
//     `
//   )
// }
//
// $(document).on('click', '.delete', function(event){
//   console.log("you clicked me");
//   var id = event.target.id;
//   console.log(id);
//   $.ajax({
//     type: 'DELETE',
//     url: localURL + 'message/' + id,
//
//   })
//   .then(()=> {
//     displayUserMessages(id)
//     $('header').append(
//       `
//       <div class="alert alert-success alert-dismissible fade show" role="alert">
//         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//         Your message was successfully deleted!
//       </div>
//       `
//     )
//   })
// })
//
// function goHome(id){
//   $('.message-data').empty()
//   loadAddMessageForm(id)
//   getMessages(localURL)
// }
// function signOut(){
//   $('.message-data').empty()
//   getMessages(localURL)
//   $('#sign-in').show()
//   $('#sign-up').show()
//   $('.signOut').hide()
//   $('.theThing').hide()
// }
// getMessages(localURL)
//
//
//
// $('#sign-in').on('click', loadSignIn)
// $('#sign-up').on('click', loadSignUp)
// $('.submit-sign-in').on('click', submitSignIn)
// $('#submit-sign-up').on('click', submitSignUp)
// // $('#deleteButton').on('click', deleteMessage)
// // $('.homeButton').on('click')
// $(document).on('click', '.homeButton', goHome)
// $(document).on('click', '.signOut', signOut)
// $('.custom-control-input').on('click', function(){
//   $('.hide').toggle()
// })
//
// $(document).on('click', '.my-posts', displayUserMessages)
