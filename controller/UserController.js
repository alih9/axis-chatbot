const express=require('express');
const db = require("../models/index");
const user = require('../models/user');
const socketUser = require('./SocketUserController')
const User = db.user;
const Tenant = db.tenant;
const Message = db.Message;
const ChatRoom = db.Chat_room;
const RoomParticipant = db.room_participants;


const customer_chatting_registration = async(req, res) => {
    console.log('---------------------------------------Customer Chat Registeration');
    console.log(req.body);
    var chattingRoom = '';
    var parent_msg = '';
    const user=await User.findOne({ where: {email: req.body.email} })
    if (user) {
        if (user.requestIsActive) {
            console.log('---------------------------------------Find Customer in Chat Registeration table');
            var RoomParticipants = await RoomParticipant.findAll({ where: { user_id: user.id } })
            if (RoomParticipants) {
                RoomParticipants.map(async (rp) => {
                    const chat_room = await ChatRoom.findOne({ where: { id: rp.room_id } })
                    if (chat_room) {
                        console.log(chat_room);
                        if (chat_room.is_active) {
                            
                           const msg= await Message.max('parent_message_id', {where : {'room_id': chat_room.id }})
                            const allMsg= await Message.findAll({where : {'room_id': chat_room.id },order: [['createdAt', 'ASC']]})
                            if (msg) {
                                parent_msg = msg;
                            }

                            console.log(msg)
                            chattingRoom = { user:user, room:chat_room ,roomParticipant:rp,parent_msg:parent_msg,allMsg:allMsg};
                            
                            console.log('-------------------------------end');
                            res.status(200).send({ chattingRoom: chattingRoom, success: true })
                        }
                    }

                })
            } 
        }
        else {
            console.log('---------------------------------------Find non active Customer Chat');
           user= user.update(
                { requestIsActive: 1 } 
            )
            .then(async(result) => {
            let chatroom =await new ChatRoom({
                room_name: user.name,
                tenant_id:req.body.tenant_id,
                is_active: 1
            
            })
               await chatroom.save().then(async (room) => {
               const roomparticipation = new RoomParticipant({
                    room_id: room.id,
                   user_id: user.id,
                    tenant_id:req.body.tenant_id,
                    is_blocked: 0
                })
                await roomparticipation.save().then(participant => {
                    chattingRoom = { user: user, room: room, roomParticipant: participant ,parent_msg:parent_msg};
                    
                    console.log('-------------------------------end');
                    res.status(200).send({ chattingRoom: chattingRoom, success: true })
                }).catch(err => res.send({ message: (err.errors[0].message), success: false }));
               }).catch(err => res.send({ message: (err.errors[0].message), success: false }));
            })
            .catch(error => {
              // error handling
              res.send({ message: (err.errors[0].message), success: false })
            })  
        }
    }
    else {
        console.log('---------------------------------------Customer Chat Registeration');
        const name = req.body.name;
        const email = req.body.email;
        let user =await new User({
            name: name,
            email: email,
            tenant_id:req.body.tenant_id,
            requestIsActive: 1,
        })
        user = await user.save().then(async (user) => {
            let chatroom = await new ChatRoom({
                room_name: user.name,
                is_active: 1,
                tenant_id:req.body.tenant_id,
            
            })
               await chatroom.save().then(async(room) => {
                const roomparticipation = new RoomParticipant({
                    room_id: room.id,
                    user_id: user.id,
                    tenant_id:req.body.tenant_id,
                    is_blocked: 0
                })
               await roomparticipation.save().then( async(participant) => {
                     chattingRoom = { user: user, room: room, roomParticipant: participant ,parent_msg:parent_msg};
                   
                   console.log('-------------------------------end');  
                   res.status(200).send({ chattingRoom: chattingRoom, success: true })
                }).catch(err => res.send({ message: err, success: false, chat: 'room' }));
               
            }).catch(err => { res.send({ message: err, success: false, chat: 'chat' });    });
        }).catch(err => { console.log(err); res.send({ message: err, success: false, user: 'user' }); });

    }
}


const customer_chatting = async (req, res) => {
    var msg_ack = '';
    var parent_id = await Message.findAll({limit: 1,where: {room_id:req.body.room_id },order: [ [ 'createdAt', 'DESC' ]] })
    if (parent_id.length === 0)
    {
        parent_id = 0; 
    }
    else
    {
        parent_id = parent_id[0].parent_message_id + 1;  
    }
   
    
    let msg = new Message({
            message: req.body.message,
            creator_id: req.body.user_id,
            room_id: req.body.room_id,
            parent_message_id:parent_id,
            email: req.body.email,
            sent_at:req.body.date
        })
        msg = await msg.save().then(async (message) => {
            msg_ack = message;
            var chat_room_update = await ChatRoom.findOne({ where: { id: req.body.room_id } })
            await chat_room_update.update({ last_message: req.body.message,last_message_update_at:req.body.date })
            
        }).catch(err => res.send({ message: (err.errors[0].message), success: false }));
    
     
    res.status(200).send({ message: msg_ack, success: true })
    return msg_ack;
}



const show_all_chat_user = async (req,res) => {
    console.log('-------------------------------start (show_all_chat_user)');
    var chat = [];
    const user_temp = await User.findOne({ where: { email: req.body.email } });
    if (user_temp)
    {
    const roomparticipants_temp = await RoomParticipant.findAll({
        where: { user_id: user_temp.id }
    });
    // console.log(roomparticipants_temp)
        for (h = 0; h < roomparticipants_temp.length; h++) {
            // console.log('-------------------------------h->' + JSON.stringify(roomparticipants_temp[h]));
            const chatRoom = await ChatRoom.findOne({
            where: { id: roomparticipants_temp[h].room_id }
        });
        // console.log('-------------------------------chatroom->'+chatRoom);
        var user = [];
        if (chatRoom) {
            // console.log('-------------------------------2');
            const roomparticipants = await RoomParticipant.findAll({
                where: { room_id: chatRoom.id }
            });
            
            for (let j = 0; j < roomparticipants.length; j++) {
                console.log('-------------------------------3');
                const u = await User.findOne({ where: { id: roomparticipants[j].user_id } });
                user.push(u);
            }
            // console.log(chatRoom[i])
            // console.log(roomparticipants)
            // console.log(user)
            chat.push({ chatRoom: chatRoom, roomparticipants: roomparticipants, user: user });
        }
        }
    }
    console.log('-------------------------------end');
    res.status(200).send({ chat: chat,success:true })
  
}


const show_all_chat_users = async (req,res) => {
    console.log('-------------------------------start (show_all_chat_user)');
    var chat = [];
    
    const tenant_temp = await Tenant.findOne({ where: { email: req.body.email } });
    if (tenant_temp)
    {
                console.log(tenant_temp)
        const chatRoom = await ChatRoom.findAll({
            where: { tenant_id: tenant_temp.id }
        });
        console.log(chatRoom)
        for (h = 0; h < chatRoom.length; h++) {
        var user = [];
        if (chatRoom) {
            // console.log('-------------------------------2');
            const roomparticipants = await RoomParticipant.findAll({
                where: { room_id: chatRoom[h].id }
            });
            
            for (let j = 0; j < roomparticipants.length; j++) {
                console.log('-------------------------------3');
                const u = await User.findOne({ where: { id: roomparticipants[j].user_id } });
                user.push(u);
            }
            // console.log(chatRoom[i])
            // console.log(roomparticipants)
            // console.log(user)
            chat.push({ chatRoom: chatRoom[h], roomparticipants: roomparticipants, user: user });
        }
        }
    }
    console.log('-------------------------------end');
    res.status(200).send({ chat: chat,success:true })
  
}



const get_messages = async (req, res) => {
    
    console.log('-------------------------------msg');
    console.log(req.body)
    const msg_id = req.body.chat_room_id;
    console.log(msg_id)
    const msg=await Message.findAll({ where: { room_id: msg_id } })
   
    var user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
        
    console.log('-------------------------------got not user');
        const tenant=await Tenant.findOne({ where: {email: req.body.email} })
   
        let user =await new User({
            name: tenant.name,
            email: tenant.email,
            requestIsActive: 1,
            tenant_id:tenant.id
        })
        user = await user.save().then(async (user) => { 
        const rmp= await RoomParticipant.findOne({ where: {room_id: req.body.chat_room_id, user_id:user.id} })
            if (!rmp) {
                const rmp = await new RoomParticipant({
                    room_id: req.body.chat_room_id,
                    user_id: user.id,
                })
                await rmp.save().then(async () => {
                    console.log(`------------------------User_id ${user.id}  Enter  in Room # ${req.body.chat_room_id}`)
                })
            }
            else {
                console.log(`------------------------User_id ${user.id}  Enter  in Room # ${req.body.chat_room_id}`)
                 
            }
        })
    }
    if (user) {
        
    console.log('-------------------------------got user');
        user = await user.update({ requestIsActive: 1 })
        const rmp = await RoomParticipant.findOne({ where: { room_id: req.body.chat_room_id, user_id: user.id } })
        if (!rmp) {
            const rmpt = await new RoomParticipant({
                room_id: req.body.chat_room_id,
                user_id: user.id,
            })
            await rmpt.save().then(async () => {
                console.log(`------------------------User_id ${user.id}  Enter  in Room # ${req.body.chat_room_id}`)
            })
        }

        else {

            console.log(`------------------------User_id ${user.id}  Enter  in Room # ${req.body.chat_room_id}`)
          

        }
    }

    if (msg) {
        console.log(`-------------------------------msg->${msg}`);
        res.status(200).send({ msg: msg,success:true })
    }

}


const tenant_chatting = async (req, res) => {
    var msg_ack = '';
   
    var parent_id = await Message.findAll({limit: 1,where: {room_id:req.body.room_id },order: [ [ 'createdAt', 'DESC' ]] })
 
    if (parent_id.length === 0)
    {
        parent_id = 0; 
    }
    else
    {
        parent_id = parent_id[0].parent_message_id + 1;  
    }
   
    console.log('Parent->', parent_id)
    const user=await User.findOne({ where: {email: req.body.email} })
    let msg = new Message({
            message: req.body.message,
            creator_id: user.id,
            room_id: req.body.room_id,
            parent_message_id:parent_id,
            email:req.body.email,
            sent_at:req.body.date
        })
        msg = await msg.save().then(async (message) => {
            msg_ack = message;

            var chat_room_update = await ChatRoom.findOne({ where: { id: req.body.room_id } })
            await chat_room_update.update({ last_message: req.body.message,last_message_update_at:req.body.date })
            
        }).catch(err => res.send({ message: (err.errors[0].message), success: false }));
    
     
    res.status(200).send({ message: msg_ack, success: true })
    return msg_ack;
}

const check_user_activation = async (req,res) => {
  var flag = false;
  const room=  socketUser.userexist(req.body.room);
    if (room.length>0) {
        flag = true;
    }
    res.status(200).send({ is_active: flag,room:room,success:true })
}

const existence_user = async (req, res) => {
console.log(req.body)

    // console.log('----->Name', req.body.user['https://axis.doneforyou.com/user_metadata'].name)
    // console.log('----->User http',req.body.user['https://axis.doneforyou.com/user_metadata'])
    var tenant = await Tenant.findOne({ where: { email: req.body.user.email } })
    // console.log(tenant)
    
    if (!tenant) {
        tenant = await Tenant.create({
            name: req.body.user['https://axis.doneforyou.com/user_metadata'].name ,
            first_name: req.body.user['https://axis.doneforyou.com/user_metadata'].first_name,
            last_name: req.body.user['https://axis.doneforyou.com/user_metadata'].last_name,
            sub: req.body.user.sub,
            email: req.body.user.email,
     
        })

    }
 
    res.status(200).send({ tenant: tenant,success:true })

}


const get_user_details = async (req, res) => {
    try {
        var tenant = await Tenant.findOne({ where: { id: req.body.tenant_id } })
        res.status(200).send({ tenant: tenant, success: true })
    }
    catch (error) {
    console.log(error)
    }
    
}
    

module.exports = { customer_chatting_registration ,customer_chatting,show_all_chat_user,get_messages,tenant_chatting , check_user_activation,existence_user,show_all_chat_users,get_user_details} ;