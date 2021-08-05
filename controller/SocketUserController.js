const c_users = [];

// joins the user to the specific chatroom
function join_User(id, username, room) {
  
 
  var roomuser = Array.from(c_users);
  roomuser = roomuser.filter((p_user) => p_user.room === room)
  roomuser = roomuser.filter((p_user) => p_user.username === username)
  if (roomuser.length !== 0) {
    console.log('---------------------roomuser', roomuser)
    selectedUser = c_users.findIndex(c => c.id == roomuser[0].id);
    console.log('---------------------selectedUser', selectedUser)
    remaining = c_users.splice(selectedUser, 1);
    console.log('---------------------remaining', remaining)
  }
  // selectedUser = c_users.findIndex(c => c.id === roomuser.id);
  // c_users.splice(selectedUser, 1);

    const p_user = { id, username, room };
    c_users.push(p_user);
  console.log(c_users, "users");
  return p_user;
}

console.log("user out", c_users);

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

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) 
{
  const index = c_users.findIndex((p_user) => p_user.id === id);
console.log('-------------------------disconnect')
  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
  send_Msg_User,
};