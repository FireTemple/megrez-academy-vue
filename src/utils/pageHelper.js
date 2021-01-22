import axios from '../network';


function pageHelperQueryAll(url, method, pageNum, pageSize) {
   return new Promise((resolve, reject) =>{
       axios({
           url: url,
           method: method,
           data: {
               pageNum: pageNum,
               pageSize: pageSize
           }
       }).then(res => {
           resolve(res.data);
       }).catch(err => {
           reject(err);
       })
   })
}




export default pageHelperQueryAll;
