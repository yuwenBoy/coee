import axios from 'axios';
import { baseUrl } from '../config/Index'
// 财务网关
const commonUrl = `${baseUrl}finance/common`;



const crmUrl = `${baseUrl}crm/Customer`;
 // const crmUrl = `http://localhost:10003/api/Customer`;

class Common{
    /**
     *  获取所有的枚举参数
     * @param {*} params 
     */
    getAll(params){
        return axios.get(`${commonUrl}/GetEnum`, {params: params});
    }
    /**
     *  获取客户
     * @param {Object} q 查询参数
     */
    getCustomerList(q){
        let params={
            Name:q
        }
        return axios.post(`${crmUrl}/GetList`,params);
    } 
    invoiceInfo(id){
        return axios.get(`${crmUrl}/InvoiceInfo?id=${id}`);
    }
}


export default{
    Common: Common.prototype
}
