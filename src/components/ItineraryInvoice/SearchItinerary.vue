<template>
    <Card>
        <p slot="title">
            <b></b>
        </p>

        <Form :label-width="80">
            <Row>
                <i-col span="6">
                    <FormItem label="编号">
                        <Input type="text" v-model="query.id"  placeholder="编号" style="width:260px"/>
                    </FormItem>  
                </i-col>
                <i-col span="6">
                    <FormItem label="票号">
                        <Input type="text" v-model="query.theTicketId"  placeholder="请输入发票号"  style="width:260px"/>
                    </FormItem>  
                </i-col>
                <i-col span="6">
                    <FormItem label="创建人">
                        <Input type="text" v-model="query.creator"  placeholder="请输入创建人名称"  style="width:260px"/>
                    </FormItem>  
                </i-col>
                <i-col span="6">
                    <FormItem label="创建时间">
                        <DatePicker v-model="query.createDate" type="daterange" placement="bottom-end" placeholder="选择创建时间" style="width:260px"></DatePicker>
                    </FormItem>  
                </i-col>

                <i-col span="6">
                    <FormItem label="行程单号">
                        <Input type="text" v-model="query.invoiceNumber"  placeholder="请输入行程单号"  style="width:260px"/>
                    </FormItem>  
                </i-col>

                <i-col span="6">
                    <FormItem label="客户">
                        <Select v-model="model1" style="width:260px">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>  
                </i-col>
                
                <i-col span="6">
                    <FormItem label="状态">
                         <Select v-model="query.status"  style="width:260px">
                            <Option v-for="item in enums.CustomerInvoiceStatus" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>  
                </i-col>
                
                <i-col span="6">
                    <FormItem label="收款单位:" span="6">
                        <Select v-model="query.collectCompany" style="width:260px">
                            <Option v-for="item in enums.Receivables" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>  
                </i-col>
                <i-col span="6">
                    <FormItem label="部门">
                        <Select v-model="model1" style="width:260px">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>  
                </i-col>
               
                <i-col span="6">
                    <FormItem label="开票时间">
                         <DatePicker v-model="query.auditTime" type="daterange" placement="bottom-end" placeholder="选择开票时间" style="width:260px"></DatePicker>
                    </FormItem>  
                </i-col>

                <Button type="info" @click="search">搜索</Button>
                <Button type="success">重置</Button>
            </Row>
        </Form>
    </Card>
</template>

<script>

import Api from '../../api/api.js';
import {pageInfo} from '../../common/Index.js'
export default {
    data () {
        return  {
            cityList: [
                {
                    value: 'New York',
                    label: 'New York'
                }
            ],
            selectDataStore: [],
            query:{},
            model1:''
            
        }
    },
    methods:{
        search(){
            let _this = this;
            let criteria = _this.query;
            criteria.createDateBegin =  criteria.createDate[0];
            criteria.createDateEnd =  criteria.createDate[1];
            criteria.auditTimeBegin = criteria.auditTime[0];
            criteria.auditTimeEnd = criteria.auditTime[1];
            
            Api.Invoice.getInvoiceList(criteria,pageInfo)
            .then(function(res) {
                
                _this.listData = res.data;
            });
        }
        
    },
    
    props:['enums','listData']
}
</script>

