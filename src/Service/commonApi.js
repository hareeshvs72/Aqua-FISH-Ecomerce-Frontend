import axios from "axios"



const commonAPI = async(httpRequest , url , reqBody , reqHeader)=>{
    const requestConfig = {
        method: httpRequest ,
        url,
        data:reqBody,
        headers:reqHeader?reqHeader:{}
    }
   return await axios(requestConfig).then(res=>{
       return res
    }).catch(err=>{
        return err
    })


}
export default commonAPI