class ErrorHandler extends Error{
      constructor(message, statusCode){
            super(message);
            this.statusCode= statusCode;
      }
}
//middle chahinxa work garna lai
export const errorMiddleware = (err, req,res, next)=>{
      err.message = err.message || 'Internal server error';
      err.statusCode = err.statusCode || 500;


      if(err.code === 11000){ // internet connection slow or timeout huda aauxa 11000 error
            const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
            err = new ErrorHandler(message,400);

      }

      if(err.name === 'JsonWebTokenError'){ // internet connection slow or timeout huda aauxa 11000 error
            const message = `Json Web Token Is Invalid. Try Again`;
            err = new ErrorHandler(message,400);

      }

      if(err.name === 'TokenExpireError'){ // internet connection slow or timeout huda aauxa 11000 error
            const message = `Json Web Token Is Expire. Try to Login Again`;
            err = new ErrorHandler(message,400);

      }

      if(err.name === 'CastError'){ // internet connection slow or timeout huda aauxa 11000 error
            const message = `Invalid ${err.path}`;
            err = new ErrorHandler(message,400);

      }

      const errorMessage = err.errors
       ? Object.values(err.errors)
       .map((error)=>error.message)
       .join(' ')
       :err.message;

       return res.status(err.statusCode).json({
            success:false,
            message:errorMessage,
       });
};

export default ErrorHandler;