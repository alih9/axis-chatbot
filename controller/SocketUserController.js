
const db=require('../models/index')
const SocketUser=db.SocketUser
const SocketRoom=db.SocketRoom
const RoomParticipant = db.room_participants;
const User = db.user;
const add_active_users=async(socketid,email,socket)=>
{
  console.log('------addsocketEMAIL',email)
  let user= await User.findOne({where:{email:email}})
  console.log('------addsocketuser',user)
  let RoomParticipants = await RoomParticipant.findAll({ where: { user_id: user.id } })
  for (let i=0;i<RoomParticipants.length;i++){
    socket.join(RoomParticipants.room_id)}
    let exist_active_user= await SocketUser.findOne({ where:{email: email }})
    if(exist_active_user)
    {
      exist_active_user=await exist_active_user.update({ socket_id: socketid})
    }
    else
    {
      exist_active_user = await  SocketUser.create({socket_id:socketid,email:email,})
    }
    return exist_active_user;
}

const get_user_socketid=async(email)=> {
 const user= SocketUser.findOne({ where: {email:email} })
  return user;
}

const join_user=async(email, room) =>{
  console.log(email)
  let tmpSocketRoom = await SocketRoom.findOne({ where: { room_id: room ,email:email} })

if(!tmpSocketRoom)
{
  tmpSocketRoom =  await SocketRoom.create({
    room_id:room,
    email:email,
  })
}

return tmpSocketRoom;
}


const deactivate_Room=async(id) =>
{
await SocketUser.destroy({ where: { socket_id:id  } })

}

const deactivate_User=async(id) =>
{
await SocketUser.destroy({ where: { socket_id:id  } })

}





module.exports = {

  add_active_users,
  get_user_socketid,
  join_user,
  deactivate_Room,
  deactivate_User


};