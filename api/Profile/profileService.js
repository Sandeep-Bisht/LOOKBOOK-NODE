const ProfileModel = require("./profileModel")

module.exports={

create:(data)=>{
    return ProfileModel.create(data)
}
}