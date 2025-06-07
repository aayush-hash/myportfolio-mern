//The catchAsyncErrors function is a utility used to handle errors in asynchronous functions in an Express.js application. 
//It wraps an asynchronous function (theFunction) to ensure that any errors occurring in the asynchronous operation are caught and passed to the Express error-handling middleware using next


export const catchAsyncErrors =(theFunction)=>{
      return(req,res,next)=>{
            Promise.resolve(theFunction(req,res,next)).catch(next)
      }
}
