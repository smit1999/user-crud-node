class AppError extends Error{
    constructor(message,statusCode,additional_field=null){
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'failure' : 'fatal error';
        this.isOperational = true;
        if(additional_field != null){
            this.additional_field = additional_field
        }


        Error.captureStackTrace(this,this.constructor);
    }  
}

module.exports = AppError