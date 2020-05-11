var mongoose=require("mongoose");
var messageSchema=new mongoose.Schema({
    text: String,
    //Each Message has an author
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        Name: String,
        Username: String
    },
    //Each Message has an receiver
    receiver: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        Name: String,
        Username: String
    },
    type: String
},{timestamps: true});
module.exports=mongoose.model("Message", messageSchema);