const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

const jwtPassword = "abc123"
const users = [{
    userName : "ankuryadav869@gmaail.com",
    password : "132",
    name : "ankur"
},{
    userName : "ayadavgmaail.com",
    password : "456",
    name : "yadav"
},{
    userName : "post@gmaail.com",
    password : "111",
    name : "post"
}]

const userExits = (userName) =>{
    const userNameExists = users.find(obj => userName == obj.userName)
    // console.log(userNameExists, userName)
    if(userNameExists)
        return true
    return false    
}
app.use(express.json())

app.post("/signin", (req, res)=>{
    const userName = req.body.userName
    // console.log(userName)
    if(!userExits(userName)){
        res.json({msg : "User not present in db"})
    }    

    const token = jwt.sign({userName}, jwtPassword)

    res.json({
        token 
    })
    
})

app.get("/users", (req, res) =>{
    try{
        const token = req.headers.authorization
        const userName = jwt.verify(token, jwtPassword) 

        // console.log(userlist)
        res.json({
            users  : users.filter((obj) => {
                if(obj.userName != userName.userName){
                    return true
                }
                return false
            })
        })

    }catch(err){
        console.log(err)
        res.json({
            msg : "not a right token"
        })
    }
})

app.listen(3001)