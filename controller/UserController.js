const express=require('express');
const db = require("../models/index");
const user = require('../models/user');
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
                is_active: 1
            
            })
               await chatroom.save().then(async (room) => {
               const roomparticipation = new RoomParticipant({
                    room_id: room.id,
                    user_id: user.id,
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
            requestIsActive: 1,
        })
        user = await user.save().then(async (user) => {
            let chatroom = await new ChatRoom({
                room_name: user.name,
                is_active: 1
            
            })
               await chatroom.save().then(async(room) => {
                const roomparticipation = new RoomParticipant({
                    room_id: room.id,
                    user_id: user.id,
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
            email:req.body.email
        })
        msg = await msg.save().then(async (message) => {
            msg_ack = message;

        }).catch(err => res.send({ message: (err.errors[0].message), success: false }));
    
     
    res.status(200).send({ message: msg_ack, success: true })
    return msg_ack;
}



const show_all_chat_user = async (req,res) => {
    console.log('-------------------------------start');
    const chatRoom = await ChatRoom.findAll({ order: [['updatedAt', 'DESC']] });
    var chat = [];
    var user = [];
    if (chatRoom) {
        console.log('-------------------------------1');
        for(let i = 0; i < chatRoom.length; i++) {
           
            console.log('-------------------------------2');
            const roomparticipants = await RoomParticipant.findAll({
                where: { room_id: chatRoom[i].id }
            });
            
            for (let j = 0; j < roomparticipants.length; j++) {
                console.log('-------------------------------3');
                    const u = await User.findOne({ where: { id: roomparticipants[j].user_id } });
                    user.push(u);
                
            }
            // console.log(chatRoom[i])
            // console.log(roomparticipants)
            // console.log(user)
            chat.push( { chatRoom:chatRoom[i], roomparticipants:roomparticipants, user:user });
            
        
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
            email:req.body.email
        })
        msg = await msg.save().then(async (message) => {
            msg_ack = message;

        }).catch(err => res.send({ message: (err.errors[0].message), success: false }));
    
     
    res.status(200).send({ message: msg_ack, success: true })
    return msg_ack;
}


module.exports = { customer_chatting_registration ,customer_chatting,show_all_chat_user,get_messages,tenant_chatting} ;