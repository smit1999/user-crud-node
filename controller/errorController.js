exports.errformat = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error! something went wrong'
    res.status(err.statusCode).json({
        status:err.status,
        message: err.message,
        additonal_field: err.additional_field !=null ? err.additional_field :''
    })
}