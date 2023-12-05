// short form of try-catch statement
module.exports =  (fn)=>{
    return (req, res, next)=>{
        fn(req,res,next).catch(next);
    }
};


