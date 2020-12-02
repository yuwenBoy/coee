<template>
    <div>
        <Breadcrumb>
            <BreadcrumbItem>首页</BreadcrumbItem>
            
            <BreadcrumbItem>行程单列表</BreadcrumbItem>
        </Breadcrumb>
        <br>
        
        <Card>
        <p slot="title">
            <b></b>
        </p>
               
        <Form :label-width="80">
            <Row>
                <Col :md="12" :lg="8">
                    <FormItem label="编号">
                        <Input type="text" v-model="query.id"  placeholder="编号"/>
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
            </Row>
            <Row>
                <Col :md="12" :lg="8">
                    <FormItem label="行程单号">
                        <Input type="text" v-model="query.invoiceNumber"  placeholder="请输入行程单号"/>
                    </FormItem>
                </Col>
                
                <Col :md="12" :lg="8">
                    <FormItem label="开票时间">
                      <!-- <DatePicker v-model="query.auditTime"  @on-clear="query.auditTime=['','']" type="daterange" placement="bottom-end" placeholder="选择开票时间" style="width:260px"></DatePicker> -->
                      <DatePicker v-model="query.auditTime[0]" type="date" placement="bottom-end" placeholder="选择开票时间" style="width: 49%"></DatePicker>--<DatePicker v-model="query.auditTime[1]" type="date" placement="bottom-end" placeholder="选择开票时间" style="width: 49%"></DatePicker>
                    </FormItem>
                </Col>
                
                <Col :md="12" :lg="8">
                    <FormItem label="收款单位:" :md="12" :lg="8">
                      <Select v-model="query.collectCompany">
                        <Option :value="-1">全部</option>
                        <Option v-for="item in enums.Receivables" :value="item.key" :key="item.key">{{ item.value }}</Option>
                      </Select>
                    </FormItem>
                </Col>

            </Row>
            <Row>
                <Col :md="12" :lg="8">
                  <FormItem label="状态">
                      <Select v-model="query.status">
                        <Option :value="-1">全部</option>
                        <Option v-for="item in enums.CustomerInvoiceStatus" :value="item.key" :key="item.key">{{ item.value }}</Option>
                      </Select>
                  </FormItem>
                </Col>
                
                
                <Col :md="12" :lg="8">
                    <FormItem label="客户" :md="12" :lg="8">
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
                
                <!-- <Col :md="12" :lg="8">
                    <FormItem label="部门">
                      <Select v-model="query.collectCompany2" style="width:260px">
                        <Option v-for="item in enums.Receivables" :value="item.key" :key="item.key">{{ item.value }}</Option>
                      </Select>
                    </FormItem>
                </Col> -->
                <Col :md="12" :lg="8">
                    <FormItem label="票号">
                        <Input type="text" v-model="query.TicketNumber"  placeholder="请输入票号"/>
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

                <Col :md="12" :lg="8">
                    <div class="queryButtons" style="float:right;padding:0">
                      <Button type="info" @click="searchClick" style="float:left;width:100px;margin-right:10px;">搜索</Button>
                      <Button type="success" @click="reset" style="float:left;width:100px;">重置</Button>
                    </div>
                </Col>
            </Row>
        </Form>
    </Card>
    <br/>
    <hr/>
    <br/> 
    <Card>
      <Table :columns="columns" :data="listData.listData" :loading="tableLoading"></Table>
      <!-- 分页  -->
      <div style="margin: 10px;overflow: hidden" v-if="listData.so">
          <div style="float: right;">
              <Page :total="totalRows" :current="1" @on-change="changePage" show-total show-sizer @on-page-size-change="changePageSize"></Page>
          </div>
      </div>
    </Card> 
    <!-- 容器END -->
     
    </div>
</template>
<script>

//API
import CommonApi from "@/api/common.js";
import Api from "@/api/api.js";
import { pageInfo } from "@/common/Index.js";

import { dateToStr , defaultDateRange} from "@/common/tools/DateTime.js"
let searchCount = 0;
export default {
  beforeCreate: function() {
    let _this = this;
    CommonApi.Common.getAll({
      keys: "Receivables;CustomerInvoiceStatus;ExpressType;"
    }).then(function(res) {
      _this.enums = res.data.data;
    });
  },
  created: function(){
    this.reset();
    this.search();     
  },
  data() {
    const _this = this;
    return {
      enums: {},
      columns: [ 
        {
          title: "编号",
          key: "id",
          width: 120,
          fixed: "left",
          align: "center" ,
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
        { title: "客户", key: "customerName",align: "center" , width: 240},
        { title: "收款单位", key: "companyCategaryStr",align: "center" , width: 220 },
         { title: "开票总额", key:"totalAmount",align: "center" , width: 120 },
        { title: "行程单号",key: "invoiceNumber",align: "center" , width: 120 },
        { title: "状态", key: "statusStr" ,align: "center" , width: 100},
        { title: "创建人", key: "creatorName",align: "center" , width: 80 },
        { title: "销售", 
          key: "saleName",
          align: "center" , 
          width: 80,
          render: (h, params) => {
            return h('span',(params.row.sales || {}).name)    
          } 
        },
        { title: "创建时间", key: "creationTime",align: "center" , width: 133 },
        { title: "开票时间", key: "invoiceTime",align: "center" , width: 133 },
        { title: "快递形式", key: "expressTypeStr", align: "center" , width: 100},
        { title: "运单号", key: "trackingNumber", align: "center" , width: 140},
        { title: "部门", key: "creatorOrgName",align: "center" , width: 180 },
      ],
      selectDataStore: [],
      query: {
        InvoiceType: 2
      },
      listData: {},
      page: pageInfo,
      selectLoading: false,
      customerList: [],
      tableLoading: false
    };
  },
  methods: {
    search() {
      
      let _this = this;
      _this.tableLoading = true;
      
      let criteria = _this.query;
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
      
      if (criteria.collectCompany == -1) {
        criteria.collectCompany = null;
      }
      if (criteria.status == -1) {
        criteria.status = null;
      }

      Api.Invoice.getInvoiceList(criteria, _this.page).then(function(res) {
            
        // 数据格式处理
        if (res.data.listData.length > 0) {

          res.data.listData.map(x => {
            
            if (x.creator) {
              x.creatorName = x.creator.name;
              x.creatorOrgName = x.creator.orgName;
            }
            if (x.creationTime) {
              let date = new Date(x.creationTime);
              x.creationTime = dateToStr(date,'yyyy-MM-dd  hh:mm');
            }
            if (x.customer) {
              x.customerName = x.customer.name;
            }
            if (x.invoiceTime) {
              let date = new Date(x.invoiceTime);
              x.invoiceTime = dateToStr(date,'yyyy-MM-dd  hh:mm');
            }
            
          });
          
        }
        
        _this.listData = res.data;
        _this.tableLoading = false;
      });

    },
    searchClick(){
      const _this = this;
      _this.page.pageIndex = 1;
      _this.search();
    },
    changePage(index) {
      this.page.pageIndex = index;
      this.search();
    },
    changePageSize(size){
     
      if (searchCount === 0) {
        searchCount ++;
        this.page.pageSize = size;
        return;
      }
      this.page.pageSize = size;
      this.search();
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
    reset(){
      
      let time = defaultDateRange();
      
      this.query = {
        auditTime: ["", ""],
        InvoiceType: 2,
        createDate: time,
        ClientId: null
      };
      this.customerList = [];
    },
    select(params) {
      this.$router.push({
        name: "InvoiceInfo",
        params: { Id: params.row.id }
      });
      
    }
  },
  computed: {
    totalRows() {
      if (!this.listData.so) {
        return 10;
      } else {
        return this.listData.so.totalRows;
      }
    },
    totalPrices(){
      if (!this.listData.so) {
        return 0;
      } else {
        return this.listData.so.price;
      }
    }
  },
  components: {
    
  }
};
</script>

<style lang="less" scoped>
.queryButtons {
  float: right;
  padding-right: 15em;
  outline: 0px springgreen solid;
}

.total-price{
    padding-bottom: 1em;
}
.font-price{
    color: orange;
    font-size: 1.4em;
    margin-top: 0.2em;
}
</style>
