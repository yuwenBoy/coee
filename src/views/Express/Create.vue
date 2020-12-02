<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>快递管理</BreadcrumbItem>
      <BreadcrumbItem>申请快递</BreadcrumbItem>
    </Breadcrumb>
    <div style="padding:9px 0;"></div>
    <Card :bordered="false" :shadow="true">
      <p slot="title">基本信息</p>
      <Form
        :label-width="80"
        ref="searchValidate"
        :model="ParamsValidate"
        :rules="ruleValidate"
        inline
      >
        <Row>
          <Col :md="12" :lg="8">
            <FormItem label="单号" style="width: 84%;">
              <Input type="text" v-model="ParamsValidate.Code" placeholder="单号" />
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="开票时间" style="width: 84%;">
              <DatePicker
                type="date"
                :clearable="true"
                @on-change="datatime=$event"
                v-model="ParamsValidate.InvoiceTimeStart"
                placement="bottom-end"
                placeholder="选择开票时间"
                style="width: 47%"
              ></DatePicker>--
              <DatePicker
                type="date"
                :clearable="true"
                @on-change="datatime=$event"
                v-model="ParamsValidate.InvoiceTimeEnd"
                placement="bottom-end"
                placeholder="选择开票时间"
                style="width: 47%"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="操作员" style="width: 84%;">
              <Input type="text" v-model="ParamsValidate.Name" placeholder="请输入姓名" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="12" :lg="8">
            <FormItem label="行程/发票号" style="width: 84%;">
              <Input type="text" v-model="ParamsValidate.InvoiceNumber" placeholder="行程/发票号" />
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="客户" prop="Customer" style="width: 84%;">
              <i-select
                filterable
                remote
                :remote-method="getCustomer"
                :loading="selectLoading"
                @on-change="changeCustomer"
                clearable
                @on-clear="clearCustomer"
              >
                <Option
                  v-for="(option, index) in customerList"
                  :value="option.id"
                  :key="index"
                >{{ option.name }}</Option>
              </i-select>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="订单类型" style="width: 84%;">
              <CheckboxGroup
                v-model="ParamsValidate.checkAllGroup"
                @on-change="checkAllGroupChange"
                style="float:left"
              >
                <Checkbox v-for="item in enums.OpenTicketType" :label="item.value" :key="item.key"></Checkbox>
              </CheckboxGroup>
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll"
                style="float:left"
              >全选</Checkbox>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <!-- 搜索和重置按钮-->
          <Col :md="12" :lg="21">
            <FormItem span="20" style="float:right">
              <Button type="info" @click="SearchInvoices">搜索</Button>
              <Button type="success">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <br />
    <Card :bordered="false" :shadow="true">
      <div>
        <Row>
          <Col span="24">
            <Row>
              <Col span="3">
                <b>选择总号数:</b>
                <font color="green">{{DataValidate.InvoiceIds.length}}</font>
              </Col>
              <Col style="float:right">
                <b>共{{listData.length}}条数据</b>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <hr />
        <br />
        <Row>
          <Col span="24">
            <!-- <Table ref="selection" :columns="columns" :data="listData" :loading="loading" :height="tableHeight" ></Table> -->
            <Table
              ref="selection"
              :columns="columns"
              :data="listData"
              :loading="loading"
              @on-selection-change="selectTable"
            ></Table>
          </Col>
        </Row>
        <br />
        <Row>
          <Form
            :label-width="100"
            ref="ExpressData"
            :model="DataValidate"
            :rules="DataRuleValidate"
          >
            <Row>
              <Col :md="12" :lg="8">
                <FormItem label="快递方式" prop="ExpressWay">
                  <i-select v-model="DataValidate.ExpressWay">
                    <Option
                      v-for="item in enums.ExpressWay"
                      :value="item.key"
                      :key="item.key"
                    >{{ item.value }}</Option>
                  </i-select>
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem label="物品类型" prop="Stdmode">
                  <i-select v-model="DataValidate.Stdmode">
                    <Option
                      v-for="item in enums.Stdmode"
                      :value="item.key"
                      :key="item.key"
                    >{{ item.value }}</Option>
                  </i-select>
                </FormItem>
              </Col>
              <Col :md="12" :lg="8"></Col>
            </Row>
            <Row>
              <Col :md="12" :lg="8">
                <FormItem label="收件人" prop="Receiver">
                  <Input
                    type="text"
                    v-model="DataValidate.Receiver"
                    placeholder="请填写收件人"
                    style="width:80%"
                  />
                  <Button type="success" @click="ShowAddressListModel" size="small">地址簿</Button>
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem label="收件人电话" prop="ReceiverPhone">
                  <Input type="text" v-model="DataValidate.ReceiverPhone" placeholder="请填写收件人电话" />
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem label="省市区" prop="AreaModel">
                  <Cascader
                    v-model="areaInfo"
                    :data="AreaData"
                    :load-data="loadArea"
                    @on-change="handleChange"
                    placeholder="请选择省市区"
                  ></Cascader>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="18" :lg="11">
                <FormItem label="详细地址" prop="Address">
                  <Input type="text" v-model="DataValidate.Address" placeholder="请填写详细地址" />
                </FormItem>
              </Col>
              <Col :md="6" :lg="5">
                <FormItem>
                  <Checkbox v-model="DataValidate.isSave">保存到常用地址簿</Checkbox>
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem label="预估运费" prop="ExpectedFee">
                  <span>{{DataValidate.ExpectedFee}}</span> 元
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="12" :lg="8">
                <FormItem label="寄件人" prop="Sender">
                  <Input type="text" v-model="DataValidate.Sender" placeholder="请填写寄件人" />
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem label="寄件人电话" prop="SenderPhone">
                  <Input type="text" v-model="DataValidate.SenderPhone" placeholder="请填写寄件人电话" />
                </FormItem>
              </Col>
              <Col :md="12" :lg="8">
                <FormItem label="寄件备注" prop="Remark">
                  <Input
                    type="text"
                    v-model="DataValidate.Remark"
                    placeholder="您可以在此备注您的需求，快递小哥可以看到"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- <Col :md="12" :lg="8">
                            <FormItem  label="预估配送时长" prop="ExpectedTime">
                                <span>{{DataValidate.ExpectedTime}}</span> 天
                            </FormItem>
              </Col>-->
            </Row>
            <Row>
              <Col :lg="23">
                <FormItem style="float:right">
                  <Button type="primary" @click="SubmitExpress" :loading="submitLoading">
                    <span v-if="!submitLoading">提交申请</span>
                    <span v-else>Loading...</span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Modal
            v-model="AddressShow"
            title="地址簿信息"
            :closable="true"
            :mask-closable="false"
            width="900"
          >
            <div slot="footer">
              <Button type="text" size="large" @click="AddressCancel">取消</Button>
              <Button type="primary" size="large" @click="AddressResult">确定</Button>
            </div>
            <Form ref="formInline" inline>
              <FormItem prop="user">
                <Input type="text" v-model="AddressDate.Search" placeholder="请输入公司/电话/姓名查询"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="AddressSearch">搜索</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="AddressInfoShow(0)">新增地址</Button>
              </FormItem>
              <!-- <FormItem>
                        <Button type="primary" @click="setDefault">设置默认寄件地址</Button>
              </FormItem>-->
            </Form>
            <br />
            <Table
              :data="AddressList"
              :columns="AddressColumns"
              stripe
              :loading="AddressLoading"
              :highlight-row="true"
              height="400px"
            ></Table>
          </Modal>

          <Modal v-model="ShowAddressInfo" :title="Title" :closable="false" :mask-closable="false">
            <div slot="footer">
              <Button type="text" size="large" @click="AddressInfoCancel">取消</Button>
              <Button type="primary" size="large" @click="AddressInfoOk">保存</Button>
            </div>
            <Form
              ref="AddressInfoformValidate"
              :model="AddressValidate"
              :rules="AddressRuleValidate"
              :label-width="100"
            >
              <FormItem label="客户信息" prop="Customer">
                <span>{{AddressValidate.Customer.name}}</span>
              </FormItem>
              <FormItem label="收件人" prop="Receiver">
                <Input v-model="AddressValidate.Receiver" placeholder="请填写收件人姓名"></Input>
              </FormItem>
              <FormItem label="收件人电话" prop="ReceiverPhone">
                <Input
                  v-model="AddressValidate.ReceiverPhone"
                  placeholder="请填写收件人电话/手机 例:010-xxxxxxxx或188xxxxxxxx"
                ></Input>
              </FormItem>
              <FormItem label="省市区" prop="AreaModel">
                <Cascader
                  v-model="areaInfoModel"
                  :data="AreaData"
                  :load-data="loadArea"
                  @on-change="AddressInfohandleChange"
                  placeholder="请选择省市区"
                ></Cascader>
              </FormItem>
              <FormItem label="详细地址" prop="Address">
                <Input v-model="AddressValidate.Address" placeholder="请填写收件人详细地址"></Input>
              </FormItem>
              <FormItem label="默认地址" prop="IsDefault">
                <i-switch v-model="AddressValidate.IsDefault" size="large">
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
                </i-switch>
              </FormItem>
            </Form>
          </Modal>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
import api from "@/api/api.js";
import CommonApi from "@/api/common.js";

import { baseUrl } from "@/config/Index.js";
import { provData } from "@/common/tools/City";

export default {
  beforeCreate: function() {
    let _this = this;
    CommonApi.Common.getAll({
      keys: "OpenTicketType;ExpressWay;Stdmode;"
    }).then(function(res) {
      _this.enums = res.data.data;
    });
  },
  data() {
    const validateCustomer = (rule, value, callback) => {
      if (JSON.stringify(value) == "{}") {
        callback(new Error("请选择客户"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error("请填写收件人电话/手机 例:010-xxxxxxxx或188xxxxxxxx")
        );
      } else {
        const re = /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$$/g;
        if (!re.exec(value)) {
          callback(
            new Error("请填写正确电话/手机 例:010-xxxxxxxx或188xxxxxxxx")
          );
        } else {
          callback();
        }
      }
    };
    return {
      baseUrl: baseUrl,
      indeterminate: false,
      checkAll: true,
      enums: {},
      selectLoading: false,
      loading: false,
      params: {},
      customerList: [],
      ParamsValidate: {
        checkAllGroup: ["行程单", "税务发票"],
        Customer: {},
        InvoiceTimeStart: "",
        InvoiceTimeEnd: ""
      },
      ruleValidate: {
        Customer: [
          { required: true, validator: validateCustomer, trigger: "change" }
        ]
      },
      listData: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "单号",
          width: 100,
          key: "id",
          align: "center"
        },
        {
          title: "客户",
          render: (h, params) => {
            return h("div", params.row.customer.name);
          },
          align: "center"
        },
        {
          title: "行程/发票号",
          key: "invoiceNumber",
          align: "center"
        },
        {
          title: "类型",
          width: 100,
          key: "invoiceTypeStr",
          align: "center"
        },
        {
          title: "创建人",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.creator.name);
          },
          align: "center"
        },
        {
          title: "开票时间",
          align: "center",
          width: 150,
          key: "invoiceTimeStr"
        },
        {
          title: "部门",
          render: (h, params) => {
            return h("div", params.row.creator.orgName);
          },
          align: "center"
        }
      ],
      tableHeight: 400,
      DataValidate: {
        ExpectedTime: 0,
        ExpectedFee: 0,
        InvoiceIds: [],
        ExpressWay: 5,
        Stdmode: 1,
        Sender: "",
        SenderPhone: "",
        AreaModel: []
      },
      DataRuleValidate: {
        ExpressWay: [
          {
            type: "number",
            required: true,
            message: "请选择快递方式",
            trigger: "change"
          }
        ],
        Stdmode: [
          {
            type: "number",
            required: true,
            message: "请选择物品类型",
            trigger: "change"
          }
        ],
        Receiver: [
          { required: true, message: "请填写收件人姓名", trigger: "blur" },
          {
            type: "string",
            max: 10,
            message: "收件人姓名长度不能超过10位",
            trigger: "blur"
          }
        ],
        ReceiverPhone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        AreaModel: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请选择省市区",
            trigger: "change"
          },
          { type: "array", max: 3, message: "请选择省市区", trigger: "change" }
        ],
        Address: [
          { required: true, message: "请填写收件人详细地址", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "详细地址不能超过50位",
            trigger: "blur"
          }
        ],
        Sender: [
          { required: true, message: "请填写寄件人姓名", trigger: "blur" },
          {
            type: "string",
            max: 10,
            message: "寄件人姓名长度不能超过10位",
            trigger: "blur"
          }
        ],
        SenderPhone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ]
      },
      AreaData: [],
      submitLoading: false,
      areaInfo: [],

      AddressShow: false,
      AddressList: [],
      AddressColumns: [
        {
          title: " ",
          align: "left",
          key: "checkBox",
          width: 50,
          render: (h, params) => {
            let _this = this;
            return h("div", [
              h("Checkbox", {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  "on-change": e => {
                    _this.AddressList.forEach(items => {
                      //先取消所有对象的勾选，checkBox设置为false
                      _this.$set(items, "checkBox", false);
                    });
                    _this.AddressList[params.index].checkBox = e; //再将勾选的对象的checkBox设置为true
                  }
                }
              })
            ]);
          }
        },
        {
          title: "公司",
          key: "customerInfo",
          render: (h, params) => {
            return h("div", params.row.customerInfo.name);
          }
        },
        {
          title: "收件人",
          key: "receiver"
        },
        {
          title: "收件人电话",
          key: "receiverPhone"
        },
        {
          title: "详细地址",
          key: "address"
        },
        {
          title: "默认地址",
          key: "isDefault",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.isDefault ? "是" : "否");
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.AddressInfoShow(params.row.id);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.AddressInfoRemove(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      AddressLoading: false,
      AddressDate: {
        Search: "",
        CustomerId: 0
      },
      ShowAddressInfo: false,
      Title: "",
      ShowAddressInfoLoading: true,
      AddressValidate: {
        Receiver: "",
        ReceiverPhone: "",
        AreaModel: [],
        Address: "",
        Customer: {},
        IsDefault: false,
        Id: 0
      },
      AddressRuleValidate: {
        Receiver: [
          { required: true, message: "请填写收件人姓名", trigger: "blur" },
          {
            type: "string",
            max: 10,
            message: "收件人姓名长度不能超过10位",
            trigger: "blur"
          }
        ],
        ReceiverPhone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        AreaModel: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请选择省市区",
            trigger: "change"
          },
          { type: "array", max: 3, message: "请选择省市区", trigger: "change" }
        ],
        Address: [
          { required: true, message: "请填写收件人详细地址", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "详细地址不能超过50位",
            trigger: "blur"
          }
        ],
        Customer: [
          { required: true, validator: validateCustomer, trigger: "change" }
        ]
      },
      areaInfoModel: []
    };
  },
  methods: {
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.ParamsValidate.checkAllGroup = ["行程单", "税务发票"];
      } else {
        this.ParamsValidate.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 2) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
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
            _this.customerList.length = 0;
            res.data.data.map(i => {
              _this.customerList.push({ id: i.id, name: i.name });
            });
          }
        }
      });
    },
    changeCustomer(option) {
      let _this = this;
      let customer = this.customerList.map(i => {
        if (i.id === option) {
          _this.ParamsValidate.Customer = { id: i.id, name: i.name };
        }
      });
    },
    clearCustomer() {
      this.ParamsValidate.Customer = {};
      this.customerList = [];
    },
    defaultTime() {
      let dt = new Date();
      dt.setDate(dt.getDate() - 60);
      return dt;
    },
    SearchInvoices() {
      let _this = this;
      this.$refs["searchValidate"].validate(valid => {
        if (valid) {
          _this.getList();

          this.axios
            .all([
              this.axios.get(
                `${this.baseUrl}web/Employee/GetEmployeeById/` +
                  _this.$store.state.app.userInfo.id
              ),
              this.axios.get(
                `${this.baseUrl}finance/ExpressAddress/GetDefault/` +
                  _this.ParamsValidate.Customer.id
              )
            ])
            .then(
              this.axios.spread(function(userResp, addressResp) {
                if (userResp.data.success) {
                  if (userResp.data.data != null) {
                    _this.DataValidate.Sender = userResp.data.data.userName;
                    _this.DataValidate.SenderPhone = userResp.data.data.mobile;
                  }
                }
                if (addressResp.data.success) {
                  if (addressResp.data.data != null) {
                    let address = addressResp.data.data;
                    _this.DefaultAddress(address);
                  }
                }
              })
            );
        }
      });
    },
    getList() {
      let _this = this;
      _this.loading = true;
      api.Express.ApplyExpressList(this.ParamsValidate).then(res => {
        _this.loading = false;
        if (res.data.success) {
          _this.listData = res.data.data;
          _this.DataValidate.Customer = _this.ParamsValidate.Customer;
        } else {
          _this.listData = [];
        }
      });
    },
    SubmitExpress() {
      let _this = this;
      this.submitLoading = true;
      if (this.DataValidate.InvoiceIds.length === 0) {
        this.$Message.error("未选择任何单据!!");
        this.submitLoading = false;
        return;
      }
      this.$refs["ExpressData"].validate(valid => {
        if (valid) {
          api.Express.Create(this.DataValidate).then(res => {
            _this.submitLoading = false;
            if (res.data.success) {
              _this.getList();
              _this.$Message.success("提交成功!");
              _this.$router.push({
                name: "ExpressList"
              });
              _this.submitLoading = false;
            } else {
              this.$Message.error("提交失败!");
            }
          });
        } else {
          _this.submitLoading = false;
        }
      });
    },
    loadArea(item, callback) {
      var str = item.value + "";
      item.loading = true;
      api.Express.RqArea(item.value).then(function(res) {
        if (res.data.Data != null) {
          res.data.Data.forEach(function(ele, index) {
            if (str.charAt(3) !== "0" || str.charAt(2) !== "0")
              item.children.push({ value: ele.Code, label: ele.FullName });
            else
              item.children.push({
                value: ele.Code,
                label: ele.FullName,
                children: [],
                loading: false
              });
          });
          item.loading = false;
        } else {
          item.loading = false;
          delete item.children;
          delete item.loading;
        }
        callback();
      });
    },
    handleChange(value, selectedData) {
      this.DataValidate.AreaModel = selectedData.map(i => {
        return { label: i.label, value: i.value };
      });
      let _this = this;
      let area = {};
      if (this.DataValidate.AreaModel.length >= 2) {
        if (this.DataValidate.AreaModel[0].label.includes("市")) {
          area.EndProvince = this.DataValidate.AreaModel[1].label.substr(
            0,
            this.DataValidate.AreaModel[1].label.length - 1
          );
          area.EndCity =
            this.DataValidate.AreaModel[1].label +
            "," +
            this.DataValidate.AreaModel[2].label;
        } else {
          area.EndProvince = this.DataValidate.AreaModel[0].label;
          area.EndCity = this.DataValidate.AreaModel[1].label;
        }
      }
      if (JSON.stringify(area) != "{}") {
        api.Express.RqYTPrice(area).then(res => {
          if (res.data.Success) {
            _this.DataValidate.ExpectedFee = res.data.Data;
            //_this.DataValidate.ExpectedTime=res.data.Data.Hour;
          }
        });
      }
      //api.Express.RqPrice()
      //this.text = selectedData;
    },
    province() {
      let _this = this;
      _this.AreaData = [];
      provData.forEach(function(ele, index) {
        _this.AreaData.push({
          value: ele.Code,
          label: ele.FullName,
          children: [],
          loading: false
        });
      });
    },
    selectTable(selection) {
      this.DataValidate.InvoiceIds = selection.map(i => {
        return i.id;
      });
    },
    getPrice() {
      let _this = this;
      let area = {};
      if (this.DataValidate.AreaModel.length >= 2) {
        if (this.DataValidate.AreaModel[0].label.includes("市")) {
          area.EndProvince = this.DataValidate.AreaModel[1].label.substr(
            0,
            this.DataValidate.AreaModel[1].label.length - 1
          );
          area.EndCity =
            this.DataValidate.AreaModel[1].label +
            "," +
            this.DataValidate.AreaModel[2].label;
        } else {
          area.EndProvince = this.DataValidate.AreaModel[0].label;
          area.EndCity = this.DataValidate.AreaModel[1].label;
        }
      }
      if (JSON.stringify(area) != "{}") {
        api.Express.RqYTPrice(area).then(res => {
          if (res.data.Success) {
            _this.DataValidate.ExpectedFee = res.data.Data;
            //_this.DataValidate.ExpectedTime=res.data.Data.Hour;
          }
        });
      }
    },

    ShowAddressListModel() {
      if (this.ParamsValidate.Customer.id == undefined) {
        this.$Message.info("请先选择客户");
      } else {
        this.GetAddressList();
      }
    },
    GetAddressList() {
      let _this = this;
      _this.AddressLoading = true;
      this.AddressDate.CustomerId = this.ParamsValidate.Customer.id;
      api.ExpressAddress.GetCustomerAllList(this.AddressDate).then(res => {
        if (res.data.success) {
          _this.AddressList = res.data.data.map(i => {
            i.checkBox = false;
            return i;
          });
          _this.AddressShow = true;
        } else {
          _this.AddressList = [];
          _this.$Message.error(res.data.message);
        }
        _this.AddressLoading = false;
      });
    },
    AddressSearch() {
      this.GetAddressList();
    },
    AddressResult() {
      let address = this.AddressList.filter(i => i.checkBox);
      if (address.length > 0) {
        this.DefaultAddress(address[0]);
        this.AddressShow = false;
      } else {
        this.$Message.info("请选择地址");
      }
    },
    AddressCancel() {
      this.AddressShow = false;
    },
    DefaultAddress(address) {
      this.DataValidate.Receiver = address.receiver;
      this.DataValidate.ReceiverPhone = address.receiverPhone;
      this.DataValidate.Address = address.address;
      this.DataValidate.AreaModel = [];
      this.areaInfo = [];
      if (address.provCode != null) {
        this.areaInfo.push(parseInt(address.provCode));
        this.DataValidate.AreaModel.push({
          label: address.prov,
          value: parseInt(address.provCode)
        });
      }
      if (address.cityCode != null) {
        this.areaInfo.push(parseInt(address.cityCode));
        this.DataValidate.AreaModel.push({
          label: address.city,
          value: parseInt(address.cityCode)
        });
      }
      if (address.countryCode != null) {
        this.areaInfo.push(parseInt(address.countryCode));
        this.DataValidate.AreaModel.push({
          label: address.country,
          value: parseInt(address.countryCode)
        });
      }
      this.getPrice();
    },
    Address(str) {
      if (str == "add") {
        this.Title = "新增地址";
      } else {
        this.Title = "修改地址";
      }
      this.AddressValidate.Customer = this.ParamsValidate.Customer;
      this.ShowAddressInfo = true;
    },
    AddressInfoShow(id) {
      let _this = this;
      api.ExpressAddress.GetById(id).then(res => {
        let addressInfo = res.data.data;
        if (addressInfo != null) {
          _this.AddressValidate.Id = addressInfo.id;
          _this.AddressValidate.Receiver = addressInfo.receiver;
          _this.AddressValidate.ReceiverPhone = addressInfo.receiverPhone;
          _this.AddressValidate.AreaModel = [];
          if (addressInfo.provCode !== null)
            _this.AddressValidate.AreaModel.push({
              label: addressInfo.prov,
              value: addressInfo.provCode
            });
          if (addressInfo.cityCode !== null)
            _this.AddressValidate.AreaModel.push({
              label: addressInfo.city,
              value: addressInfo.cityCode
            });
          if (addressInfo.countryCode !== null)
            _this.AddressValidate.AreaModel.push({
              label: addressInfo.country,
              value: addressInfo.countryCode
            });

          _this.AddressValidate.Address = addressInfo.address;
          _this.AddressValidate.Customer = addressInfo.customerInfo;
          _this.AddressValidate.IsDefault = addressInfo.isDefault;
          _this.areaInfoModel = [];
          if (addressInfo.provCode !== null)
            _this.areaInfoModel.push(parseInt(addressInfo.provCode));
          if (addressInfo.cityCode !== null)
            _this.areaInfoModel.push(parseInt(addressInfo.cityCode));
          if (addressInfo.countryCode !== null)
            _this.areaInfoModel.push(parseInt(addressInfo.countryCode));
          _this.Address("update");
        } else {
          _this.AddressValidate.Id = 0;
          _this.AddressValidate.Receiver = "";
          _this.AddressValidate.ReceiverPhone = "";
          _this.AddressValidate.AreaModel = [];
          _this.AddressValidate.Address = "";
          _this.AddressValidate.Customer = {};
          _this.AddressValidate.IsDefault = false;
          _this.AddressValidate.AreaModel = [];
          _this.areaInfoModel = [];
          _this.customerList = [];
          _this.Address("add");
        }
      });
    },
    AddressInfoRemove(id) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提醒",
        content: "确定删除吗？",
        loading: true,
        onOk: function() {
          api.ExpressAddress.Delete(id).then(res => {
            if (res.data.success) {
              _this.GetAddressList();
              this.$Modal.remove();
            } else {
              this.buttonLoading = false;
            }
          });
        }
      });
    },
    AddressInfoCancel() {
      this.ShowAddressInfo = false;
    },
    AddressInfoOk() {
      this.$refs["AddressInfoformValidate"].validate(valid => {
        if (valid) {
          api.ExpressAddress.Save(this.AddressValidate).then(res => {
            if (res.data.success) {
              if (res.data.data > 0) {
                this.$Message.success("保存成功!");
                this.ShowAddressInfo = false;
                this.GetAddressList();
              } else if (res.data.data === 0) {
                this.$Message.error("保存失败!");
              } else {
                this.$Message.error("该客户已经存在默认地址!");
              }
            } else {
              this.$Message.error("保存失败!");
            }
          });
        }
      });
    },
    AddressInfohandleChange(value, selectedData) {
      this.AddressValidate.AreaModel = selectedData.map(i => {
        return { label: i.label, value: i.value };
      });
    }
  },
  mounted() {
    // 设置表格高度
    this.tableHeight =
      window.innerHeight - this.$refs.selection.$el.offsetTop - 500;
    this.province();
  }
};
</script>