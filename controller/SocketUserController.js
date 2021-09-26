const c_users = [];
const active_users = [];

// joins the user to the specific chatroom
function add_active_user(id, username) {

  const index = active_users.findIndex((a_user) => a_user.username === username);
  
    if (index !== -1) {
      return active_users.splice(index, 1)[0];
    }
    const a_user = { id, username };
    active_users.push(a_user);
    console.log('------------------a_user',a_user);
}

function get_active_user(username) {

  const user = active_users.filter((a_user) => a_user.username === username);
  return user;

}

function join_User(id, username, room) {
 
  var roomuser = Array.from(c_users);
  roomuser = roomuser.filter((p_user) => p_user.room === room)
  roomuser = roomuser.filter((p_user) => p_user.username === username)
  if (roomuser.length !== 0) {
    console.log('---------------------Finding Existing User in roomuser', roomuser)
    selectedUser = c_users.findIndex(c => c.id == roomuser[0].id);
    console.log('--------------------- Getting the index of the selectedUser', selectedUser)
    remaining = c_users.splice(selectedUser, 1);
    console.log('---------------------remaining', remaining)
  }
  // selectedUser = c_users.findIndex(c => c.id === roomuser.id);
  // c_users.splice(selectedUser, 1);

  const index = active_users.findIndex((a_user) => a_user.username === username);
  console.log('-------------------------Deactivate User')
    if (index !== -1) {
      return active_users.splice(index, 1)[0];
    }
    const a_user = { id, username };
    active_users.push(a_user);

    const p_user = { id, username, room };
    c_users.push(p_user);
  console.log(c_users, "User Added in chat User array");
  return p_user;
}

function user_Disconnect(id) 
{
  const index = c_users.findIndex((p_user) => p_user.id === id);
console.log('-------------------------disconnect')
  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

// Gets a particular user id to return the current user
function get_Current_User(id) {
  return c_users.find((p_user) => p_user.id === id);
}

function send_Msg_User(id) {
  console.log('----------------------------------socketID')
  console.log(id)
  console.log('----------------------------------List')
  console.log(c_users)

  if (c_users.length == 0) {  return null;}

    const user = c_users.find((p_user) => p_user.id === id);
    console.log('----------------------------------user')
  console.log(user)
  if (user == undefined) {  return null;}
    var roomuser = Array.from(c_users);
    roomuser = roomuser.filter((p_user) => p_user.room === user.room)
    return roomuser.filter((p_user) => p_user.id !== user.id)
  
 
}
function get_reciever_user(email)
{
  
console.log('email----------------------------->(get_reciever_user)',email)
console.log('All active users----------------------------->(get_reciever_user)',active_users)

  const user = active_users.find((a_user) => a_user.username === email);
  console.log('user----------------------------->(get_reciever_user)',user)
return user;

}

// called when the user leaves the chat and its user object deleted from array


function deactivate_Room(id) 
{
  const index = active_users.findIndex((p_user) => p_user.id === id);
  console.log('-------------------------Deactivate User')
    if (index !== -1) {
      return active_users.splice(index, 1)[0];
    }
}
function userexist(room) {

 
  var roomuser = Array.from(c_users);
  roomuser = roomuser.filter((p_user) => p_user.room === room)
  return roomuser;
}
module.exports = {
  add_active_user,
  get_active_user,
  join_User,
  get_Current_User,
  user_Disconnect,
  send_Msg_User,
  deactivate_Room,
  userexist,
  get_reciever_user


};