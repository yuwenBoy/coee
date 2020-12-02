import axios from 'axios';

import { baseUrl } from '@/config/Index'

const TicketNumberBase = `${baseUrl}finance/TicketNumber`

class TicketNumber{
    
  /**
   * 
   * @param {Object} criteria 条件
   * @param {Object} pageInfo 分页参数
   */
  getTicketNumbers(criteria,pageInfo){
   
    return axios.post(`${TicketNumberBase}/GetTicketNumbers`, { 'Criteria': criteria, 'PageInfo': pageInfo });
  }
}
export default {
  TicketNumber: new TicketNumber()
}
