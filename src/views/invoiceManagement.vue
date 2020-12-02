<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>财务系统</BreadcrumbItem>
      <BreadcrumbItem>票号库管理</BreadcrumbItem>
    </Breadcrumb>
    <div style="padding:9px 0;"></div>
    <Card>
        <p slot="title">
        <b></b>
        </p>
        <Row>
        <Form :label-width="140" :model="params" inline>
            <Row>

              <Col :md="12" :lg="8">
                  <FormItem  label="综合查询:">
                    <Input type="text" v-model="params.title"  placeholder="票号/PNR/OP/公司" style="width: 260px"/>
                  </FormItem>
              </Col>
              
              <Col :md="12" :lg="8">
                  <FormItem label="供应商:" span="6">
                    <Input type="text" v-model="params.supplier"  placeholder="请输入供应商" style="width: 260px"/>
                  </FormItem>
              </Col>

              <!-- 国内国际 -->
              <Col :md="12" :lg="8">
                <FormItem label="类型:" span="6">
                  <Select v-model="params.orderType" style="width: 260px" filterable>
                    <Option :value="-1" :key="-1" >全部</Option>
                    <Option v-for="item in enums.OrderType" :value="item.key" :key="item.key" >{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>

            </Row>
            <Row>
              <Col :md="12" :lg="8">
              
                <FormItem label="Office:" span="6">
                  <Select v-model="params.office" style="width: 260px" filterable>
                    <Option :value="-1" :key="-1" >全部</Option>
                    <Option v-for="item in officeArr" :value="item.value" :key="item.key" >{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem  label="出票时间:">
                  
                  <DatePicker 
                    v-model="params.issueTime" 
                    type="daterange" 
                    placement="bottom-end" 
                    placeholder="选择出票时间" 
                    style="width: 260px"
                    @on-clear="params.issueTime=['','']"
                  >
                  </DatePicker>
                </FormItem>
              </Col>
              <!-- 行程单号 税务发票   -->
              <Col :md="12" :lg="8">
                <FormItem  label="行程单号:">
                  <Input type="text" v-model="params.ticketNum"  placeholder="单号" style="width: 260px"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- 状态: 未打印 待开票  已入库  已扫描 领取中 已领取-  已作废-->
              <Col :md="12" :lg="8">
                <FormItem  label="状态:">
                  <Select v-model="params.status" style="width: 260px" filterable>
                    <Option :value="-1" :key="-1" >全部</Option>
                    <Option v-for="item in enums.TicketStatus" :value="item.key" :key="item.key" >{{ item.value }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem  label="首飞时间:">
                  <DatePicker v-model="params.departureTime" @on-clear="params.departureTime=['','']" type="daterange" placement="bottom-end" placeholder="选择出票时间" style="width: 260px"></DatePicker>
                  
                </FormItem>
              </Col>
              <!-- 喜闻乐见二字码  -->
              <!-- <Col :md="12" :lg="8">
                <FormItem  label="航司:">
                  <Input type="text" v-model="params.airLines"  placeholder="请输入航司二字码" style="width: 260px"/>
                </FormItem>
              </Col> -->
            </Row>
            <Row>
              <!-- 搜索和重置按钮-->
              <Col :md="12" :lg="21">
                <FormItem span="6" style="float:right">
                  <Button type="info" @click="searchClick">搜索</Button>
                  <Button type="success" @click="reset">重置</Button>
                </FormItem>
              </Col>
            </Row>                
        </Form>
        </Row>
    </Card>
    <div>
    <br/>
    <br/>
    <hr/>
    
    <Row>
      <Col span="24">
        <div class="pad">
          <Card>
            <p slot="title">
              <b></b>
            </p>
            <Table 
              stripe 
              ref="selection" 
              :columns="columns" 
              :data="listData"
              :loading="tableLoading"
              small  
            >
            </Table>

            <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page 
                  :total="totalRows" 
                  :current="1"
                   
                  @on-change="changePage" 
                  show-total show-sizer 
                  @on-page-size-change="changePageSize">

                </Page>
              </div>
            </div>

          </Card>
        </div>
        
      </Col>
    </Row>
  </div>
</div>
</template>
<script>
// 引用
import { pageInfo } from "@/common/Index.js";

import api from "../api/api.js";

import commonApi from "@/api/common.js";
import { dateToStr, firstFlightDateRange } from "@/common/tools/DateTime.js";
import { officeArr } from "@/config/Index.js";
// 默认首飞时间
const flightTime = firstFlightDateRange();
// 用来防止分页变化触发的标志
let searchCount = 0;
export default {
  beforeCreate() {
    let _this = this;
    commonApi.Common.getAll({ keys: "TicketStatus;OrderType;" }).then(function(
      res
    ) {
      _this.enums = res.data.data;
    });
  },
  created() {
    this.reset();
    this.search();
  },
  data() {
    const _this = this;
    return {
      columns: [
        {
          title: "编号",
          key: "id",
          width: 100,
          fixed: "left",
          align: "left"
        },
        {
          title: "票号",
          key: "ticetNum",
          fixed: "left",
          width: 140,
          align: "left"
        },
        {
          title: "行程单/税务发票号",
          key: "eticketNumber",
          width: 140,
          fixed: "left",
          align: "left",
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
                    color: "#1E88A8"
                  },
                  on: {
                    click: () => {
                      if (
                        params.row.url == null ||
                        params.row.url.length == 0
                      ) {
                        return;
                      }
                      window.open(params.row.url, "_blank");
                    }
                  }
                },
                params.row.eticketNumber
              )
            ]);
          }
        },
        { title: "航司", key: "airline", align: "left", width: 60 },
        { title: "供应商", key: "supplierName", align: "left", width: 240 },
        { title: "单价", key: "totalPayPrice", align: "left", width: 100 },
        { title: "税", key: "tax", align: "left", width: 100 },
        { title: "代理费", key: "agentFee", align: "left", width: 100 },
        { title: "返点", key: "rebates", align: "left", width: 100 },
        { title: "返钱", key: "returnMoney", align: "left", width: 100 },
        { title: "后返点", key: "afterRebates", align: "left", width: 100 },
        {
          title: "后返钱",
          key: "afterReturnMoney",
          align: "left",
          width: 100
        },
        { title: "总应付", key: "totalPayPrice", align: "left", width: 100 },
        { title: "行程", key: "voyageStr", align: "left", width: 190 },
        { title: "航班", key: "flightNumberStr", align: "left", width: 190 },
        { title: "状态", key: "statusStr", align: "left", width: 80 },
        { title: "PNR", key: "pnrCode", align: "left", width: 80 },
        { title: "乘客", key: "passengerName", align: "left", width: 100 },
        { title: "Office", key: "office", align: "left", width: 100 },
        { title: "类型", key: "orderType", align: "left", width: 100 },
        { title: "OP", key: "opName", align: "left", width: 100 },
        { title: "公司", key: "companyName", align: "left", width: 160 },
        { title: "单号", key: "issueId", align: "left", width: 100,
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
                    color: "#1E88A8"
                  },
                  on: {
                    click: () => {
                      if (
                        params.row.categoryUrl == null ||
                        params.row.categoryUrl.length == 0
                      ) {
                        return;
                      }
                      window.open(params.row.categoryUrl, "_blank");
                    }
                  }
                },
                params.row.issueId
              )
            ]);
          } },
        { title: "出票日期", key: "issueTime", align: "left", width: 160 },
        {
          title: "起飞时间",
          key: "firstDepartureTime",
          align: "left",
          width: 160
        },
        { title: "类别", key: "ticketTypeStr", align: "left", width: 80 }
      ],
      params: {
        departureTime: flightTime
      },
      page: pageInfo,
      totalRows: 0,
      listData: [],
      enums: {},
      tableLoading: false,
      officeArr: officeArr
    };
  },
  methods: {
    search() {
      const _this = this;

      _this.tableLoading = true;
      let criteria = _this.params;

      if (criteria.issueTime[0] !== "") {
        criteria.issueTimeBegin = dateToStr(
          criteria.issueTime[0],
          "yyyy-MM-dd"
        );
        criteria.issueTimeEnd = dateToStr(
          criteria.issueTime[1],
          "yyyy-MM-dd 23:59:59"
        );
      } else {
        criteria.issueTimeBegin = null;
        criteria.issueTimeEnd = null;
      }

      if (criteria.departureTime[0] !== "") {
        criteria.departureTimeBegin = dateToStr(
          criteria.departureTime[0],
          "yyyy-MM-dd"
        );
        criteria.departureTimeEnd = dateToStr(
          criteria.departureTime[1],
          "yyyy-MM-dd 23:59:59"
        );
      } else {
        criteria.departureTimeBegin = null;
        criteria.departureTimeEnd = null;
      }

      //TODO:为什么这么做？因为直接在Option中设置value为null会报错
      if (criteria.status === -1) {
        criteria.status = null;
      }
      if (criteria.office === -1) {
        criteria.office = null;
      }
      if (criteria.orderType === -1) {
        criteria.orderType = null;
      }

      api.TicketNumber.getTicketNumbers(criteria, _this.page).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          _this.totalRows = data.totalRecorder;
          _this.listData = data.listData;
          _this.listData.map(x => {
            if (x.voyage) {
              x.voyageStr = x.voyage.join("-");
            }
            if (x.flightNumber) {
              x.flightNumberStr = x.flightNumber.join("-");
              x.airline = x.flightNumber[0].substring(0, 2);
            }
            if (x.supplier) {
              x.supplierName = x.supplier.name;
            }
            if (x.op) {
              x.opName = x.op.name;
            }
            // 起飞
            if (x.firstDepartureTime) {
              let date = new Date(x.firstDepartureTime);
              x.firstDepartureTime = dateToStr(date, "yyyy-MM-dd hh:mm");
            }
            // 到达
            if (x.lastDepartureTime) {
              let date = new Date(x.lastDepartureTime);
              x.lastDepartureTime = dateToStr(date, "yyyy-MM-dd hh:mm");
            }
            // 认领
            if (x.issueTime) {
              let date = new Date(x.issueTime);
              x.issueTime = dateToStr(date, "yyyy-MM-dd hh:mm");
            }
            if (x.payment) {
              x.tax = x.payment.tax;
              x.agentFee = x.payment.agentFee;
              x.rebates = x.payment.rebates;
              x.returnMoney = x.payment.returnMoney;
              x.afterRebates = x.payment.afterRebates;
              x.afterReturnMoney = x.payment.afterReturnMoney;
              x.totalPayPrice = x.payment.totalPayPrice;
            }
            if (x.orderType) {
              if ((x.orderType >= 4) & (x.orderType < 8)) {
                x.orderType = "国内";
              } else if ((x.orderType >= 8) & (x.orderType < 16)) {
                x.orderType = "国际";
              }
            }
          });
        } else {
          _this.listData = [];
        }

        _this.tableLoading = false;
      });
    },
    searchClick() {
      this.page.pageIndex = 1;
      this.search();
    },
    reset() {
      this.params = {
        departureTime: flightTime,
        issueTime: ["", ""]
        // status: -1,
        // office: -1,
        // type: -1
      };
    },
    changePage(index) {
      this.page.pageIndex = index;
      this.search();
    },

    changePageSize(size) {
      if (searchCount === 0) {
        searchCount++;
        this.page.pageSize = size;
        return;
      }
      this.page.pageSize = size;
      this.search();
    }
  },
  // 计算属性
  computed: {}
};
</script>
<style scoped>
.pad {
  padding: 20px 0;
}
</style>
