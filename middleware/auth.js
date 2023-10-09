const { validateToken } = require("../config/auth");

function checkForToken(tokenName)
{
    return (req,res,next)=>{
        const tokenValue = req.cookies[tokenName]
        if(!tokenValue) return next();

        try {
            const payload = validateToken(tokenValue)
            
            req.user =payload
        } catch (error) {
            
        }
        return next();
    }
}

 function checkForUser(req,res,next)
{   
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try {
            const token = req.headers.authorization.split(' ')[1]
            return next();
        } catch (error) {
            res.status(401);
            throw new Error('No authorization')
        }
    }
    

    res.status(401)
    throw new Error("Not authorized please login") 
   
   


  
}

module.exports = {checkForToken,checkForUser}