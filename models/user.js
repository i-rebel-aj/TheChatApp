var mongoose=require("mongoose");
var UserSchema=new mongoose.Schema({
    Name: {
        type:String,
        required: true
    },
    Username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    }
});
module.exports=mongoose.model("User", UserSchema);