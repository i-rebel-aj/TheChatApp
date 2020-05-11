var express=require("express");
var router=express.Router();
var Users=require("../models/user");
var Message=require("../models/message");
router.get("/", (req,res)=>{
    res.render("messenger/rules");
});
router.get("/:id",function(req,res){
    //console.log(req.params.id);
    Users.find({}, function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            //receiver
            Users.findById(req.params.id,function(err, foundUser){
                if(err){
                    console.log(err)
                }else{
                    Message.find({"author.Username": req.session.user.Username, "receiver.Username": foundUser.Username, type:"personal"}, function(err, found_author_msg){
                        if(err){
                            console.log("No messages were found");
                            console.log(err);
                        }else{
                            Message.find({"author.Username": foundUser.Username, "receiver.Username": req.session.user.Username, type:"personal"}, function(err, found_receiver_texts){
                                if(err){
                                    console.log(err)
                                }else{
                                   var history=found_author_msg.concat(found_receiver_texts);
                                   //Sorting based on TimeStamp
                                   history.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
                                   res.render("messenger/personalchat",{Users: allUsers, chattingTo:foundUser, history: history}); 
                                }
                            });
                        }
                    });
                    
                }
            });
        }
    });
});
router.get("/room/:id", (req,res)=>{
    Users.findById(req.params.id, (err, foundUser)=>{
        Message.find({"receiver.Username": null, type:"room"}, function(err, broadcastMessages){
            if(err){
                console.log("No messages were found");
                console.log(err);
            }else{
                Message.find({"receiver.Username": { $ne: null }, "author.Username": foundUser.Username,type:"room"}, function(err, sentPm){
                    if(err){
                        console.log(err)
                    }else{
                            var history=broadcastMessages.concat(sentPm);
                            Message.find({"receiver.Username": foundUser.Username,type:"room"},(err,receivedPm)=>{
                            if(err){
                                console.log(err);
                            }else{
                                var history1=history.concat(receivedPm);
                                //Sorting based on TimeStamp
                                history1.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
                                res.render("messenger/roomchat",{history: history1}); 
                            }
                       }); 
                    }
                });
            }
        });
    });
    
});
module.exports=router;