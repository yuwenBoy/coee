
<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <!-- <BreadcrumbItem to="/components/breadcrumb">行程单/发票管理</BreadcrumbItem> -->
      <BreadcrumbItem>创建</BreadcrumbItem>
    </Breadcrumb>
    <div style="padding:9px 0;"></div>
    <Card>
      <p slot="title">
        <b>创建行程单&税务发票</b>
      </p>
      <Form :label-width="120" :rules="ruleValidate" ref="params" :model="params" style="width:96%">
        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="单号">
              <Input
                type="text"
                v-model="params.TheTicketIds"
                placeholder="请输入利润单号/业务单号,多个单号可用小写逗号分隔"
              />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="出票时间" prop="issueTime">
              <DatePicker
                type="date"
                :clearable="true"
                @on-change="datatime=$event"
                v-model="params.issueTime[0]"
                placement="bottom-end"
                placeholder="选择出票时间"
                style="width: 49%"
              ></DatePicker>--
              <DatePicker
                type="date"
                :clearable="true"
                @on-change="datatime=$event"
                v-model="params.issueTime[1]"
                placement="bottom-end"
                placeholder="选择出票时间"
                style="width: 49%"
              ></DatePicker>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="操作员">
              <Input type="text" v-model="params.OpName" placeholder="请输入操作员" />
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="票号">
              <Input type="text" v-model="params.TicketNumber" placeholder="请输入票号" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="订单类型">
              <Select v-model="params.OrderType" placeholder="请选择订单类型">
                <Option :value="-1">全部</Option>
                <Option
                  v-for="item in enums.OrderType"
                  :value="item.key"
                  :key="item.value"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <!-- 搜索客户 -->
          <i-col :md="12" :lg="8">
            <FormItem label="客户" prop="clientId">
              <i-select
                filterable
                remote
                :remote-method="getCustomer"
                :loading="selectLoading"
                @on-change="changeCustomer"
                clearable
                @on-clear="clearCustomer"
                placeholder="请选择客户"
              >
                <Option
                  v-for="(option, index) in customerList"
                  :value="option.id"
                  :key="index"
                >{{ option.name }}</Option>
              </i-select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="团号">
              <Input type="text" v-model="params.GroupNumber" placeholder="请输入团号" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="开票类型" prop="openTicketType">
              <RadioGroup
                v-model="params.openTicketType"
                type="button"
                @on-change="changeTicketType"
              >
                <Radio v-for="item in enums.OpenTicketType" :key="item.key" :label="item.key">
                  <span>{{ item.value }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </i-col>

          <!-- 搜索和重置按钮-->
          <i-col :md="12" :lg="21">
            <FormItem span="20" style="float:right">
              <Button type="info" @click="query">搜索</Button>
              <Button type="success" @click="reset">重置</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <transition name="fade">
      <ListTax
        ref="child"
        v-if="params.openTicketType == 1"
        :enums="enums"
        :listData="listData"
        :myCustomer="myCustomer"
        :amount="amount"
        :loading="loading"
        v-on:okCallback="okCallback"
      ></ListTax>
      <ListItinerary
        v-if="params.openTicketType == 2"
        :enums="enums"
        :listData="listData"
        :myCustomer="myCustomer"
        :loading="loading"
        :amount="amount"
        v-on:okCallback="okCallback"
      ></ListItinerary>
    </transition>
  </div>
</template>

<script>
// 引用模块
import ListItinerary from "@/components/CreartInvoice/Itinerary";
import ListTax from "@/components/CreartInvoice/Tax";

// 引用API
import CommonApi from "@/api/common.js";
import Api from "@/api/api.js";

import { defaultDateRange, dateToStr } from "@/common/tools/DateTime.js";
export default {
  beforeCreate: function() {
    let _this = this;
    CommonApi.Common.getAll({
      keys:
        "OrderType;ReceivablesForItinerary;ReceivablesForTax;ClientTaxpayingType;OpenInvoiceType;OperationContent;InvoiceType;OpenTicketType;CustomerTitleType;ProxyFee;ExpressType;ExpressWay;Stdmode;"
    }).then(function(res) {
      _this.enums = res.data.data;
    });
  },
  data() {
    const validateIssueTime = (rule, value, callback) => {
      if (value[0] === "" || value[1] === "") {
        callback(new Error("请选择出票时间"));
      }
      if (value[0] > value[1]) {
        callback(new Error("出票起始时间不能大于出票结束时间"));
      }
      callback();
    };
    return {
      enums: {},
      listData: [],
      params: {
        openTicketType: 1,
        issueTime: defaultDateRange()
      },
      selectDataStore: [],
      customerList: [],
      selectLoading: false,
      myCustomer: {},
      amount: 0,
      ruleValidate: {
        clientId: {
          type: "number",
          required: true,
          message: "客户不能为空",
          trigger: "blur"
        },
        issueTime: {
          type: "array",
          required: true,
          validator: validateIssueTime,
          trigger: "blur"
        },
        openTicketType: {
          type: "number",
          required: true,
          message: "请选择开票类型",
          trigger: "blur"
        }
      },
      loading: false
    };
  },
  methods: {
    query() {
      let _this = this;
   
      let criteria = _this.params;
if( _this.params.openTicketType===1){
    _this.$refs.child.checkTitle();
    }
      _this.$refs["params"].validate(valid => {
        if (valid) {
          // 添加客户对象
          let customer = this.customerList.find(
            x => x.id === criteria.clientId
          );

          _this.myCustomer = customer;

          criteria.IssueTimeBegin = dateToStr(
            criteria.issueTime[0],
            "yyyy-MM-dd"
          );
          criteria.IssueTimeEnd = dateToStr(
            criteria.issueTime[1],
            "yyyy-MM-dd 23:59:59"
          );

          criteria.Ids = [];
          _this.loading = true;
          Api.Invoice.getList(criteria).then(function(res) {
            _this.loading = false;
            if (!res.data.success) {
            } else {
              let listData = res.data.data.data;
              listData.map(x => {
                if (x.issueTime && x.issuer) {
                  x.issuerTime = x.issuer.concat(
                    "(",
                    x.issueTime.substring(0, 10),
                    ")"
                  );
                }

                if (criteria.openTicketType === 1) {
                  x._disabled = x.lock;
                }
              });
              _this.listData = listData;
              _this.amount = res.data.data.amount;
            }
          });
        }
      });
    },

    reset() {
      let time = defaultDateRange();
      this.params = {
        TheTicketIds: "",
        GroupNumber: "",
        issueTime: time,
        SettledDate: ["", ""],
        openTicketType: 1,
        clientId: null
      };
      this.customerList = [];
    },
    changeTicketType(item) {
      if (this.loading == true) {
        this.$Message.error({
          content: "数据加载中。。。",
          duration: 3,
          closable: true
        });
        return;
      }
      this.listData = [];
    },
    getCustomer(queryText) {
      let _this = this;
      let result = _this.customerList.find(x => x.name === queryText);
      if (result) {
        // _this.customerList = [result];
        return;
      }
      if (queryText === "" || queryText.length === 1) {
        _this.customerList = [];
        return;
      }
      CommonApi.Common.getCustomerList(queryText).then(res => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            _this.customerList = res.data.data;
          }
        }
      });
    },
    okCallback() {
      this.query();
    },
    changeCustomer(option) {
      let _this = this;
      let customer = this.customerList.map(i => {
        if (i.id === option) {
          _this.params.clientId = i.id;
        }
      });
    },
    clearCustomer() {
      this.params.clientId = null;
      this.customerList = [];
    }
  },
  components: {
    ListTax,
    ListItinerary
  }
};
</script>