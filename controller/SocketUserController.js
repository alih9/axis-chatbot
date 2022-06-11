
const db=require('../models/index')
const SocketUser=db.SocketUser
const SocketRoom=db.SocketRoom
const Tenant=db.tenant
const RoomParticipant = db.room_participants;
const User = db.user;
const add_active_users=async(socketid,email,socket,is_active = 1)=>
{
  console.log('------addsocketEMAIL',email)
  let user= await User.findOne({where:{email:email}})
  console.log('------addsocketuser',user)
  let RoomParticipants = await RoomParticipant.findAll({ where: { user_id: user.id } })
  for (let i=0;i<RoomParticipants.length;i++){
    console.log("Joining ",RoomParticipants,email);
    //If the user is a tenant don't join any room
    if(RoomParticipant.room_id != null)
      socket.join(RoomParticipants.room_id)}
    let exist_active_user= await SocketUser.findOne({ where:{email: email }})
    if(exist_active_user)
    {
      exist_active_user=await exist_active_user.update({ socket_id: socketid, is_active: is_active})
    }
    else
    {
      exist_active_user = await  SocketUser.create({socket_id:socketid,email:email,is_active: is_active})
    }
    return exist_active_user;
}

const get_user_socketid=async(email)=> {
 const user= SocketUser.findOne({ where: {email:email} })
  return user;
}

const get_active_customers = async()=>{
  const users = SocketUser.findAll({where: {is_active: 1}});
  console.log(users);
  return users;
}

const get_room = async(user_email)=>{
  //Will return null if email belongs to a tenent
  try{
      var user = SocketRoom.findOne({where: {email:user_email}});
      var tenants = await Tenant.findAll({
        attributes: ['email']
      });
      for(var i=0;i<tenants.length;i++)
      {
        if(user_email == tenants[i].email)
        {
          return null;
        }
      }
      return user;
  }
  catch(error){
      console.log(error);
  }
}

const get_participants_emails = async(room_id)=>{
  try {
      var rooms = await SocketRoom.findAll({where: {room_id: room_id}});
      var tenants = await Tenant.findAll({
        attributes: ['email']
      });
      var room_customer = rooms.map((room)=>{
        for(let i=0;i<tenants.length;i++)
        {
          if(room.email == tenants[i].email)
          {
            room["is_tenant"] = true;
            return room;
          }
        }
        return room;
      });
      
      return room_customer;
  } catch(error) {
      console.log(error);
  }
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

const deactivate_User=async(email) =>
{
  var user = await SocketUser.findOne({ where: { email:email  }});
  user.update({is_active:0});
  //await SocketUser.destroy({ where: { email:email  } })

}





module.exports = {

  add_active_users,
  get_user_socketid,
  join_user,
  deactivate_Room,
  deactivate_User,
  get_active_customers,
  get_room,
  get_participants_emails
};