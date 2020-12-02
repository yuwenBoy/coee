import axios from 'axios';

import { baseUrl } from '../config/Index'

import ticketNumber from './finance/ticketNumber'
// 发票业务
const InvoiceBase = `${baseUrl}finance/InvoiceItinery`;

const CustomerBase = `${baseUrl}web`;

const ExpressBase = `${baseUrl}invoice`;

const ExpressFinanceBase = `${baseUrl}finance`;

class Invoice {

    /**
    *  返回未开发票/行程单的数据
    * @param {*} criteria 查询所需要的参数
    */
    getList(criteria) {
        return axios.post(`${InvoiceBase}/GetList`, criteria);
    }

    /**
     *  创建行程单|发票
     * @param {*} model 
     */
    create(model) {
        return axios.post(`${InvoiceBase}/Create`, model);
    }

    /**
     * 
     * @param {*} criteria  查询参数
     * @param {*} pageInfo  分页
     */
    getInvoiceList(criteria, pageInfo) {
        return axios.post(`${InvoiceBase}/GetInvoiceList`, { 'criteria': criteria, 'pageInfo': pageInfo });
    }

    /**
     * 根据Id 获取 发票详情
     */
    getDetail(Id) {
        return axios.get(`${InvoiceBase}/getDetail?Id=` + Id);
    }

    /**
     * 发票/行程单作废
     * @param {Object}  
     */
    Cancel(cancelModel) {
        return axios.post(`${InvoiceBase}/Cancel`, cancelModel);
    }

    /**
     * 发票认领
     * @param {Object} claimInvoice 
     */
    Claim(claimInvoice) {
        return axios.post(`${InvoiceBase}/ClaimInvoice`, claimInvoice);
    }

    /**
     * 开票
     * @param {Object} 
     */
    AuditInvoice(invoice) {
        return axios.post(`${InvoiceBase}/AuditInvoice`, invoice)
    }

    /**
     * 获取根据当前登录人获取发票收款单位
     */
    getInvoiceCollCompany() {
        return axios.get(`${InvoiceBase}/GetInvoiceCollCompany`);
    }
}

class Customer {
    /**
     * 用户信息
     * @param {Object} 
     */
    Info() {
        return axios.get(`${CustomerBase}/employee/getuserinfo`);
    }

    /**
     * 用户权限
     * @param {Object} 
     */
    ModuleTree() {
        return axios.get(`${CustomerBase}/Permission/GetUserModuleTree?moduleName=` + '发票业务;快递管理');
    }

    /**
     * 用户对应页面权限
     * @param {Object} 
     */
    ActionPermission(url) {
        return axios.get(`${CustomerBase}/Permission/GetModuleRole?url=` + url);
    }

    /**
     * 用户对应页面权限
     * @param {Object} 
     */
    GetEmployeeById(id) {
        return axios.get(`${CustomerBase}/Employee/GetEmployeeById/` + id);
    }
}

class Express {
    /**
     * 获取地区
     * @param {Object} 
     */
    RqArea(id) {
        return axios.get(`${ExpressBase}/express/RqArea/` + id);
    }

    /**
     * 获取圆通地区
     * @param {Object} 
     */
    RqYTArea(obj) {
        return axios.post(`${ExpressBase}/express/RqYTArea`, obj);
    }

    /**
     * 获取时效价格
     * @param {Object} 
     */
    RqPrice(criteria) {
        return axios.post(`${ExpressBase}/express/RqPrice`, criteria);
    }

    /**
     * 标准运价查询
     */
    RqYTPrice(criteria) {
        return axios.post(`${ExpressBase}/express/RqYTPrice`, criteria);
    }

    /**
     * 快递轨迹
     * @param {string} 
     */
    RqTrace(number) {
        return axios.get(`${ExpressBase}/express/RqTrace?code=` + number);
    }

    /**
     * 圆通快递轨迹
     * @param {string} 
     */
    RqYTTract(number) {
        return axios.post(`${ExpressBase}/express/RqYTTract?number=` + number);
    }


    /**
     * 申请快递行程单/税务发票列表
     * @param {Object} 
     */
    ApplyExpressList(criteria) {
        return axios.post(`${ExpressFinanceBase}/InvoiceItinery/ApplyExpressList`, criteria);
    }

    /**
     * 创建快递
     * @param {Object} 
     */
    Create(criteria) {
        return axios.post(`${ExpressFinanceBase}/Express/Create`, criteria);
    }

    /**
     * 快递列表
     * @param {Object} 
     */
    List(criteria) {
        return axios.post(`${ExpressFinanceBase}/Express/List`, criteria);
    }

    /**
     * 快递详情
     * @param {id} 
     */
    GetDetail(id) {
        return axios.get(`${ExpressFinanceBase}/Express/GetDetail/` + id);
    }

    /**
     * 取消快递
     * @param {id} 
     */
    Cancel(id) {
        return axios.get(`${ExpressFinanceBase}/Express/Cancel/` + id);
    }

    /**
     * 追加快递列表分页查询
     * @param {Object} 
     */
    AppendList(criteria) {
        return axios.post(`${ExpressFinanceBase}/Express/AppendList`, criteria);
    }

    /**
     * 追加快递
     * @param {Object} 
     */
    Append(criteria) {
        return axios.post(`${ExpressFinanceBase}/Express/Append`, criteria);
    }

    /**
     * 打印面单
     * @param {Object} 
     */
    PlaceOrder(criteria) {
        return axios.post(`${ExpressFinanceBase}/Express/PlaceOrder`, criteria);
    }

    /**
     * 批量揽收
     * @param {Object} 
     */
    BatchPackage(criteria) {
        return axios.post(`${ExpressFinanceBase}/Express/BatchPackage`, criteria);
    }

    /*
    取消行程单打印
    */
    TerminalPrint(id) {
        return axios.post(`${ExpressFinanceBase}/ETicketInvoice/TerminalPrint?id=` + id);
    }
}

class ExpressAddress {
    /**
     * 常用地址簿
     * @param {Object} 
     */
    List(criteria) {
        return axios.post(`${ExpressFinanceBase}/ExpressAddress/List`, criteria);
    }

    /**
     * 保存地址簿
     * @param {Object} 
     */
    Save(criteria) {
        return axios.post(`${ExpressFinanceBase}/ExpressAddress/Save`, criteria);
    }

    /**
     * 获取地址簿
     * @param {Object} 
     */
    GetById(id) {
        return axios.get(`${ExpressFinanceBase}/ExpressAddress/GetById/` + id);
    }

    /**
     * 删除地址簿
     * @param {Object} 
     */
    Delete(id) {
        return axios.get(`${ExpressFinanceBase}/ExpressAddress/Delete/` + id);
    }

    /**
     * 设置默认地址
     * @param {Object} 
     */
    SetDefault(id) {
        return axios.get(`${ExpressFinanceBase}/ExpressAddress/SetDefault/` + id);
    }

    /**
     * 获取地址簿列表
     * @param {Object} 
     */
    GetCustomerAllList(criteria) {
        return axios.post(`${ExpressFinanceBase}/ExpressAddress/GetCustomerAllList`, criteria);
    }
}

export default {
    Invoice: new Invoice(),
    Customer: new Customer(),
    TicketNumber: ticketNumber.TicketNumber,
    Express: new Express(),
    ExpressAddress: new ExpressAddress()
}

