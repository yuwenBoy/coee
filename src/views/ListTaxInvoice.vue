<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>发票列表</BreadcrumbItem>
        </Breadcrumb>
         <br>
        <Card>  
          <!-- 标题 -->           
          <p slot="title">
              <b></b>
          </p>
        <Form :label-width="80" >
            <Row>
                <Col :md="12" :lg="8">
                    <FormItem label="编号">
                        <Input type="text" v-model="query.id"  placeholder="编号"/>
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="发票号">
                        <Input type="text" v-model="query.invoiceNumber"  placeholder="请输入发票号" />
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="创建时间">
                        <!-- <DatePicker v-model="query.createDate" @on-clear="query.createDate=['',''] " type="daterange" placement="bottom-end" placeholder="选择创建时间" style="width:260px"></DatePicker> -->
                        <DatePicker v-model="query.createDate[0]" type="date" placement="bottom-end" placeholder="选择创建时间" style="width: 49%"></DatePicker>--<DatePicker v-model="query.createDate[1]" type="date" placement="bottom-end" placeholder="选择创建时间" style="width: 49%"></DatePicker>
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="创建人">
                        <Input type="text" v-model="query.creator"  placeholder="请输入创建人名称"/>
                    </FormItem>  
                </Col>
                
                <Col :md="12" :lg="8">
                    <FormItem label="状态">
                         <Select v-model="query.status">
                            <Option :value="-1">全部</option>
                            <Option v-for="item in enums.CustomerInvoiceStatus" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="发票类型">
                        <Select v-model="query.printType">
                            <Option :value="-1">全部</option>
                            <Option v-for="item in enums.InvoiceType" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="开票类型">
                        <Select v-model="query.type">
                            <Option :value="-1">全部</option>
                            <Option v-for="item in enums.OpenInvoiceType" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                  <FormItem label="经营项目" span="6">
                    <Select v-model="query.content">
                      <Option :value="-1">全部</option>
                      <OptionGroup label="其他经纪代理服务">
                        <Option v-for="item in DealProxyFee" :value="item.key" :key="item.key">{{ item.value }}</Option>
                      </OptionGroup>
                      <OptionGroup label="旅游服务">
                        <Option v-for="item in DealOperationContent" :value="item.key" :key="item.key">{{ item.value }}</Option>
                      </OptionGroup>
                    </Select>
                  </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="开票时间">
                        <!-- <DatePicker v-model="query.auditTime"  @on-clear="query.auditTime=['','']" type="daterange" placement="bottom-end" placeholder="选择开票时间" style="width:260px"></DatePicker> -->
                        <DatePicker v-model="query.auditTime[0]" type="date" placement="bottom-end" placeholder="选择开票时间" style="width: 49%"></DatePicker>--<DatePicker v-model="query.auditTime[1]" type="date" placement="bottom-end" placeholder="选择开票时间" style="width: 49%"></DatePicker>
                    </FormItem>  
                </Col>
                
                <Col :md="12" :lg="8">
                    <FormItem label="客户" span="6">
                        <Select 
                            v-model="query.ClientId" 
                            remote
                            :remote-method="getCustomer"
                            filterable
                            :loading="selectLoading"
                        >
                          <Option v-for="(option, index) in customerList" :value="option.id" :key="index" >{{ option.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                
                <Col :md="12" :lg="8">
                    <FormItem label="快递形式">
                        <Select v-model="query.ExpressType">
                            <Option v-for="item in enums.ExpressType" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </FormItem>  
                </Col>

                <Col :md="12" :lg="8">
                    <FormItem label="运单号">
                        <Input type="text" v-model="query.TrackingNumber"  placeholder="请输入运单号" />
                    </FormItem>
                </Col>

                <div class="queryButtons">
                    <Button type="info" @click="searchClick">搜索</Button>
                    <Button type="success" @click="reset">重置</Button>
                </div>
            </Row>
        </Form>
    </Card>
    <span class="isBlock">
        <hr>
    </span>
    <Card>
        <div class="total-price">
          <b>总金额:</b>
          <span class="font-price">{{ totalPrices }}</span>            
        </div>
        
        <Table :columns="columns" :data="listData" :loading="tableLoading"></Table>
        
        <!-- 分页  -->
        <div style="margin: 10px;overflow: hidden" v-if="dataCount.totalRows">
            <div style="float: right;">
                <Page :total="totalRows" :current="1" @on-change="changePage" show-total show-sizer @on-page-size-change="changePageSize"></Page>
            </div>
        </div>

    </Card>  
    </div>
</template>

<script>
// 引用API
import CommonApi from "../api/common.js";
import Api from "../api/api.js";

import { pageInfo } from "../common/Index.js";
import { dateToStr , defaultDateRange} from "@/common/tools/DateTime.js"

let searchCount = 0
export default {
  beforeCreate: function() {
    let _this = this;  
    CommonApi.Common.getAll({
      keys:
        "Receivables;ClientTaxpayingType;OpenInvoiceType;OperationContent;InvoiceType;CustomerTitleType;CustomerInvoiceStatus;ProxyFee;ExpressType;"
    }).then(function(res) {
      _this.enums = res.data.data;
      _this.DealProxyFee=res.data.data.ProxyFee;
      _this.DealOperationContent=res.data.data.OperationContent;
    });
  },
  created: function() {
    this.reset();
    this.search();
  },
  data() {
    const _this = this;
    return {
      query: {},
      enums: {},
      page: pageInfo,
      columns: [
        {
          title: "编号",
          key: "id",
          align: "center",
          fixed: "left",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      _this.select(params);
                    }
                  }
                },
                params.row.id
              )
            ]);
          }
        },
        { title: "发票抬头", key: "title" , width: 240 },
        { title: "经营项目", key: "contentStr",align: "center" , width: 120},
        { title: "发票类型", key: "printTypeStr", align: "center" , width: 130},
        { title: "开票金额", key: "totalAmount", align: "center" , width: 160},
        { title: "发票号", key: "invoiceNumber", align: "center" , width: 160},
        { title: "状态", key: "statusStr", align: "center" , width: 140},
        { title: "创建人", key: "creatorName", align: "center" , width: 140},
        { title: "销售", 
          key: "saleName",
          align: "center" , 
          width: 80,
          render: (h, params) => {
            return h('span',(params.row.sales || {}).name)    
          } 
        },
        { title: "快递形式", key: "expressTypeStr", align: "center" , width: 140},
        { title: "运单号", key: "trackingNumber", align: "center" , width: 140},
        { title: "部门", key: "creatorOrgName", align: "center" , width: 200},
        { title: "创建时间", key: "creationTime", align: "center", width: 150 },
        { title: "开票时间", key: "invoiceTime", align: "center", width: 150 }
      ],
      listData: [],
      dataCount: {},
      selectLoading: false,
      customerList: [],
      tableLoading: false,
      DealProxyFee:[],
      DealOperationContent:[]
    };
  },
  methods: {
    search() {
      let _this = this;
      _this.tableLoading = true;
      
      let criteria = _this.query;
     
      criteria.InvoiceType = 1;

      let _createDate = _this.query.createDate;

      let _auditTime = _this.query.auditTime;

      // if (_createDate[0] !== "") {
      //   criteria.createDateBegin = dateToStr(_createDate[0],'yyyy-MM-dd');
      //   criteria.createDateEnd = dateToStr(_createDate[1],'yyyy-MM-dd 23:59:59');  
      // } else {
      //   criteria.createDateBegin = null; 
      //   criteria.createDateEnd = null;
      // }
      
      // if (_auditTime[0] !== "") {
      //   criteria.auditTimeBegin = dateToStr(_auditTime[0],'yyyy-MM-dd');
      //   criteria.auditTimeEnd = dateToStr(_auditTime[1],'yyyy-MM-dd 23:59:59');  
      // } else {
      //   criteria.auditTimeBegin = null;
      //   criteria.auditTimeEnd = null;
      // }

      criteria.createDateBegin = dateToStr(_createDate[0],'yyyy-MM-dd');
      criteria.createDateEnd = dateToStr(_createDate[1],'yyyy-MM-dd 23:59:59');

      criteria.auditTimeBegin = dateToStr(_auditTime[0],'yyyy-MM-dd');
      criteria.auditTimeEnd = dateToStr(_auditTime[1],'yyyy-MM-dd 23:59:59'); 

      if(_createDate[0]!==""&&_createDate[1]!==""){
        if(_createDate[0]>_createDate[1]){
          _this.$Message.error({
              content: "创建起始时间不能大于创建结束时间!",
              duration: 3,
              closable: true
            });
          _this.tableLoading=false;
          return;
        }
      }

      if(_auditTime[0]!==""&&_auditTime[1]!==""){
        if(_auditTime[0]>_auditTime[1]){
          _this.$Message.error({
              content: "出票起始时间不能大于出票结束时间!",
              duration: 3,
              closable: true
            });
          _this.tableLoading=false;
          return;
        }
      }

      if (criteria.content == -1) {
        criteria.content = null;
      }
      if (criteria.status == -1) {
        criteria.status = null;
      }
      if (criteria.printType === -1) {
        criteria.printType = null;
      }
      if (criteria.type === -1) {
        criteria.type = null;
      }

      Api.Invoice.getInvoiceList(criteria, _this.page).then(function(res) {
        _this.listData = res.data.listData;
        _this.dataCount = res.data.so;

        
        _this.listData.map(x => {
          
          if (x.creator) {
            x.creatorName = x.creator.name;
            x.creatorOrgName = x.creator.orgName;
          }
          
          if(x.creationTime) {
            let date = new Date(x.creationTime);
            x.creationTime = dateToStr(date,'yyyy-MM-dd  hh:mm');
          }
          
          if (x.invoiceTime) {
            let date = new Date(x.invoiceTime);
            x.invoiceTime = dateToStr(date,'yyyy-MM-dd  hh:mm');
          }
          
        });
        _this.tableLoading = false;
      }).catch(function(res){
        console.info(res);
        _this.tableLoading = false;
      });
    },
    searchClick(){
      const _this = this;
      _this.page.pageIndex = 1;
      _this.search();
    },
    reset() {
      let time = defaultDateRange();
      this.query = {
        auditTime: ["", ""],
        createDate: time,
        ClientId: null
      };
      this.customerList = [];
    },
    getCustomer(queryText) {
      if (queryText === "") {
        return;
      }
      CommonApi.Common.getCustomerList(queryText).then(res => {
        if (res.data.data.length > 0) {
          this.customerList = res.data.data;
        }
      });
    },
    select(params) {
      let _this = this;
      _this.$router.push({
        name: "TaxInfo",
        params: { Id: params.row.id }
      });
    },
    changePage(index) {
      this.page.pageIndex = index;
      this.search();
    },
    changePageSize(size) {
      if (searchCount === 0) {
        searchCount ++;
        this.page.pageSize = size;
        return;
      }
      this.page.pageSize = size;
      this.search();
    }
  },
  computed: {
    totalRows() {
      if (!this.dataCount.totalRows) {
        return 10;
      } else {
        return this.dataCount.totalRows;
      }
    },
    totalPrices() {
      if (!this.dataCount) {
        return 0;
      }
      if (!this.dataCount.price) {
        return 0;
      } else {
        return this.dataCount.price;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.isBlock {
  margin: 10em;
}
.queryButtons {
  float: right;
  padding-right: 15em;
  outline: 0px springgreen solid;
}
.total-price {
  padding-bottom: 1em;
}
.font-price {
  color: orange;
  font-size: 1em;
  margin-top: 0.2em;
}
.box {
  // border: 1px solid red;
  // padding-bottom: 100px;
  // margin-bottom: 100px;
}
</style>


