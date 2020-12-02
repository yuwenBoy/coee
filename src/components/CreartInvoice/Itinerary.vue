<!-- 行程单列表 -->
<template>
  <Card>
    <Row>
      <Col span="24">
        <div class="map-incon">
          <Row>
            <Col span="24">
              <Row>
                <Col span="3">
                  <b>开票金额：</b>
                  <font color="green">{{ totalAmount }}</font>
                </Col>
                <Col span="3">
                  <b>选择总号数:</b>
                  <font color="green">{{ selectCount }}</font>
                </Col>
                <Col style="float:right">
                  <b>共{{ listDataCount }}条数据</b>
                </Col>
              </Row>
            </Col>
          </Row>
          <br />
          <hr />
          <br />
          <Row>
            <Col span="24">
              <Table
                ref="selection"
                :loading="loading"
                :columns="columns"
                :data="listData"
                @on-select="selectItem"
                @on-select-cancel="cancelItem"
                @on-select-all="selectItemAll"
                @on-selection-change="cancelSelectAll"
              ></Table>
            </Col>
            <!-- <Page></Page> -->
          </Row>
        </div>
      </Col>
    </Row>
    <br />
    <Row>
      <Form :label-width="120" :rules="ruleValidate" ref="formData" :model="formData">
        <Row>
          <Col :md="12" :lg="8">
            <FormItem label="收款单位:" prop="companyCategary">
              <Select v-model="formData.companyCategary">
                <Option
                  v-for="item in enums.ReceivablesForItinerary"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="12" :lg="8">
            <FormItem label="快递形式" prop="ExpressType">
              <Select v-model="formData.ExpressType" @on-change="changeExpressType">
                <Option
                  v-for="item in enums.ExpressType"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8" v-if="formData.ExpressType===1">
            <FormItem label="快递方式" prop="ExpressWay">
              <Select v-model="formData.ExpressWay" @on-change="changeExpressWay">
                <Option
                  v-for="item in enums.ExpressWay"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8" v-if="formData.ExpressType===1">
            <FormItem label="物品类型" prop="Stdmode">
              <Select v-model="formData.Stdmode">
                <Option
                  v-for="item in enums.Stdmode"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formData.ExpressType===1">
          <Col :md="12" :lg="8">
            <FormItem label="收件人" prop="Receiver">
              <Input
                type="text"
                v-model="formData.Receiver"
                placeholder="请填写收件人"
                style="width:80%"
              />
              <Button type="success" @click="ShowAddressListModel" size="small">地址簿</Button>
            </FormItem>
          </Col>

          <Col :md="12" :lg="8">
            <FormItem label="收件人电话" prop="ReceiverPhone">
              <Input type="text" v-model="formData.ReceiverPhone" placeholder="请填写收件人电话" />
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
                ref="AreaCascader"
              ></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formData.ExpressType===1">
          <Col :md="18" :lg="11">
            <FormItem label="详细地址" prop="Address">
              <Input type="text" v-model="formData.Address" placeholder="请填写详细地址" />
            </FormItem>
          </Col>
          <Col :md="6" :lg="5">
            <FormItem>
              <Checkbox v-model="formData.isSave">保存到常用地址簿</Checkbox>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="预估运费" prop="ExpectedFee">
              <span>{{ExpectedFee}}</span> 元
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formData.ExpressType===1">
          <Col :md="12" :lg="8">
            <FormItem label="寄件人" prop="Sender">
              <Input type="text" v-model="formData.Sender" placeholder="请填写寄件人" />
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="寄件人电话" prop="SenderPhone">
              <Input type="text" v-model="formData.SenderPhone" placeholder="请填写寄件人电话" />
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="寄件备注" prop="ExpressRemark">
              <Input
                type="text"
                v-model="formData.ExpressRemark"
                placeholder="您可以在此备注您的需求，快递小哥可以看到"
              />
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formData.ExpressType===1">
          <!-- <Col :md="12" :lg="8">
                  <FormItem  label="预估配送时长" prop="ExpectedTime">
                    <span>{{formData.ExpectedTime}}</span> 天
                  </FormItem>
          </Col>-->
        </Row>
        <Row>
          <Col :md="36" :lg="24">
            <FormItem label="备注:">
              <Input v-model="formData.remark" type="textarea" :rows="7" placeholder="备注" />
            </FormItem>
          </Col>
        </Row>
        <div style="padding-top:80px;"></div>
      </Form>
      <Col span="24">
        <div style="float:right">
          <Button type="primary" @click="submit" :loading="submitLoading">
            <span v-if="!submitLoading">提交申请</span>
            <span v-else>Loading...</span>
          </Button>
        </div>
      </Col>
    </Row>
    <Modal v-model="showModel" title="追加快递" :closable="true" :mask-closable="false" width="900">
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="modalOk">确定</Button>
      </div>
      <Table
        :data="AppendList"
        :columns="AppendColumns"
        stripe
        ref="appendTable"
        :loading="AppendLoading"
        :highlight-row="true"
      ></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            :total="AppendData.PageInfo.Total"
            @on-change="getList"
            @on-page-size-change="getList"
            :current.sync="AppendData.PageInfo.PageIndex"
            show-elevator
            :page-size="AppendData.PageInfo.PageSize"
            :page-size-opts="[1,10,20,50]"
            show-total
            show-sizer
            ref="appendTablePage"
          ></Page>
        </div>
      </div>
    </Modal>

    <Modal v-model="AddressShow" title="地址簿信息" :closable="true" :mask-closable="false" width="900">
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
  </Card>
</template>
<script>
import Tools from "./Module/Index";
import Api from "../../api/api.js";

import Category from "../Base/TicketsCategory";
import SignOrderType from "@/components/Base/SignOrderType";
import TableEx from "../CreartInvoice/ItineraryExpand";

import { dataArr, baseUrl } from "@/config/Index.js";
import { provData } from "@/common/tools/City";
export default {
  data() {
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
    const validateCustomer = (rule, value, callback) => {
      if (JSON.stringify(value) == "{}") {
        callback(new Error("请选择客户"));
      } else {
        callback();
      }
    };
    let _this = this;
    return {
      receivables: dataArr,
      baseUrl: baseUrl,
      columns: [
        { type: "selection", width: 32, align: "center" },
        {
          title: "利润单号",
          key: "theTicketId",
          width: 100,
          align: "center"
        },
        {
          title: "业务单号",
          key: "issueId",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(Category, {
              props: {
                data: params.row
              }
            });
          }
        },
        {
          title: "类型",
          key: "orderTypeStr",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h(SignOrderType, {
              props: {
                data: params.row
              }
            });
          }
        },
        {
          title: "乘客姓名",
          key: "name",
          width: 120,
          align: "center"
        } /*{ title: '行程单号', key: 'invoiceNumber' },*/,
        {
          title: "票号",
          key: "ticketNumber",
          width: 130,
          align: "center"
        },
        {
          title: "票面价(差)",
          key: "price",
          width: 100,
          align: "center"
        },
        {
          title: "改期费",
          key: "fee",
          width: 100,
          align: "center"
        },
        {
          title: "税",
          key: "tax",
          width: 100,
          align: "center"
        },
        {
          title: "开票总额",
          key: "accountDue",
          width: 100,
          align: "center"
        },
        {
          title: "供应商",
          key: "supplier",
          width: 200,
          align: "center"
        },
        {
          title: "收款单位",
          key: "collectCompany",
          width: 200,
          align: "center"
        },
        {
          title: "销售/操作",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [params.row.sales + "/" + params.row.op]);
          }
        },
        {
          title: "票台(出票/审核)日期",
          key: "issuerTime",
          width: 150,
          align: "center"
        }
      ],
      params: {},
      selectDataStore: [],
      selectLock: false,
      formData: {
        invoiceType: 2,
        companyCategary: 1,
        ExpectedTime: 0,
        ExpectedFee: 0,
        ExpressId: 0,
        ExpressWay: 5,
        Stdmode: 1,
        Sender: "",
        SenderPhone: "",
        AreaModel: []
      },
      // 数据完整性校验
      ruleValidate: {
        companyCategary: [
          {
            type: "number",
            required: true,
            message: "收款单位不能为空",
            trigger: "change"
          },
          {
            validator(rule, value, callback, source, options) {
              let store = _this.selectDataStore;
              let key = value;
              let isOk = 0;
              if (key !== 8) {
                for (let i = 0; i < store.length; i++) {
                  if (store[i].value[0]) {
                    let data = _this.dataArr.find(x => x.key === key);
                    if (data.data.indexOf(store[i].value[0].supplier) === -1) {
                      isOk++;
                    }
                    if (
                      isOk > 0 &&
                      data.payType.indexOf(store[i].value[0].payType) > -1
                    ) {
                      isOk = 0;
                    }
                  }
                }
              }
              if (isOk > 0) {
                callback(new Error("无法使用此单位作为收款单位!"));
              }
              callback();
            }
          }
        ],
        ExpressType: [
          {
            type: "number",
            required: true,
            message: "请选择快递形式",
            trigger: "change"
          }
        ],
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
      submitLoading: false,
      AreaData:[],
      AppendList: [],
      AppendColumns: [
        {
          title: " ",
          width: 100,
          render: (h, params) => {
            return h("Checkbox", {
              props: {
                value: params.row.select
              },
              on: {
                "on-change": val => {
                  this.AppendList.map(x => {
                    x.select = false;
                    return x;
                  });
                  this.AppendList[params.index].select = val;
                }
              }
            });
          }
        },
        {
          title: "编号",
          key: "id"
        },
        {
          title: "快递方式",
          key: "expressWayStr"
        },
        {
          title: "运单号",
          key: "trackingNumber"
        },
        {
          title: "状态",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              params.row.minStatus < 3 ? "未打印" : params.row.statusStr
            );
          }
        },
        {
          title: "创建时间",
          key: "creationTimeStr"
        }
      ],
      AppendLoading: false,
      AppendData: {
        ExpressStatus: 2,
        PageInfo: {}
      },
      showModel: false,
      dataArr: dataArr,
      areaInfo: [],
      ExpressDiff: 0,
      FirstMoney: 0,

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
    /** 获得选中 */
    selectItem(selection, row) {
      if (!this.selectLock) {
        this.selectSameIssueId(row);
      }
    },
    cancelItem(selection, row) {
      // 拿到此issueId对应的对象
      let issueData = this.selectDataStore.find(x => x.issueId === row.issueId);

      issueData.value.splice(
        issueData.value.findIndex(x => x.id === row.id),
        1
      );
    },
    /**
     * 全选
     */
    selectItemAll(selection) {
      let issueIdGroup = [];
      this.selectDataStore = [];
      // 根据issueId分组
      for (let i = 0; i < selection.length; i++) {
        const ele = selection[i];
        if (!issueIdGroup.find(x => x === ele.issueId)) {
          issueIdGroup.push(ele.issueId);
        }
      }

      let dataArr = [];
      for (let i = 0; i < issueIdGroup.length; i++) {
        const ele = issueIdGroup[i];
        dataArr.push({ issueId: ele, value: [] });
        dataArr[i].value = selection.filter(x => x.issueId === ele);
      }

      this.selectDataStore = dataArr;
    },
    cancelSelectAll(selection) {
      if (!selection.length) {
        this.selectDataStore = [];
      }
    },
    // 选中行的时候默认选中相同 业务单的数据
    selectSameIssueId(row) {
      let issueId = row.issueId;
      // 如果此 issueId不存在，添加一个新的
      let result = this.selectDataStore.find(x => x.issueId === issueId);
      if (!result) {
        this.selectDataStore.push({ issueId: issueId, value: [] });
        result = this.selectDataStore[this.selectDataStore.length - 1];
      }

      if (result.value.length === 0) {
        // 获得相同issueId 的数组
        let issueIdArr = this.listData.filter(x => x.issueId === issueId);
        // 控制勾选,同时加入锁,因为勾选会触发 selectItem 方法
        this.selectLock = true;

        issueIdArr.forEach(l => {
          // 获得同issueId的其他数值的Index,同时排除自己
          let index = this.listData.findIndex(
            x => x.id === l.id && x.id !== row.id
          );
          if (index >= 0) {
            this.$refs.selection.toggleSelect(index);
          }
        });
        this.selectLock = false;
        result.value = issueIdArr;
      } else {
        //此处就是普通的选中添加
        result.value.push(row);
      }
    },
    /**
     * 清除选中的和选择的数据
     */
    clearSubmitData() {
      let _this = this;
      _this.selectDataStore = [];
      _this.formData = { invoiceType: 2 };
    },
    submit() {
      let _this = this;
      _this.submitLoading = true;
      let data = _this.formData;
      // 转化数组
      let details = Tools.dataConvert(_this.selectDataStore);

      if (details.length === 0) {
        _this.$Message.error("未选择任何单据!!");
        _this.submitLoading = false;
        return;
      }

      if (_this.formData.ExpressType == 4) {
        if (_this.formData.ExpressId === 0) {
          _this.$Message.error("请选择追加信息或者选择其他快递形式!!");
          _this.submitLoading = false;
          return;
        }
      }

      // 检查选择供应商

      // 检查选择供应商 --- END
      data.customerInvoiceDetails = details;

      data.TotalAmount = _this.totalAmount;
      // 客户参数
      data.Customer = _this.myCustomer;
      data.totalAmount = _this.totalAmount;
      // 完整性验证
      this.$refs["formData"].validate(valid => {
        if (valid) {
          Api.Invoice.create(data).then(function(res) {
            let data = res.data;
            if (!data.success) {
              _this.submitLoading = false;
              this.$nextTick(() => {
                _this.submitLoading = true;
              });
              return;
            }
            _this.$Message.success({
              content: "创建成功",
              duration: 5,
              closable: true
            });
            // 创建成功后提示并且 刷新数据
            _this.$router.push({
              name: "Itinerary"
            });
            //_this.clearSubmitData();
            //_this.submitLoading = false;
          });
        }
        _this.submitLoading = false;
      });
    },
    // submit----END

    changeExpressType(value) {
      if (JSON.stringify(this.myCustomer) == "{}") {
        this.AppendData.CustomerId = 0;
      } else {
        this.AppendData.CustomerId = this.myCustomer.id;
      }
      if (value === 4) {
        this.showModel = true;
        this.getList();
      } else if (value === 1) {
        let _this = this;
        this.axios
          .all([
            this.axios.get(
              `${this.baseUrl}web/Employee/GetEmployeeById/` +
                this.$store.state.app.userInfo.id
            ),
            this.axios.get(
              `${this.baseUrl}finance/ExpressAddress/GetDefault/` +
                this.AppendData.CustomerId
            )
          ])
          .then(
            this.axios.spread(function(userResp, addressResp) {
              if (userResp.data.success) {
                if (userResp.data.data != null) {
                  _this.formData.Sender = userResp.data.data.userName;
                  _this.formData.SenderPhone = userResp.data.data.mobile;
                }
              }
              if (addressResp.data.success) {
                if (addressResp.data.data != null) {
                  let address = addressResp.data.data;
                  _this.formData.Receiver = address.receiver;
                  _this.formData.ReceiverPhone = address.receiverPhone;
                  _this.formData.Address = address.address;
                  _this.formData.AreaModel = [];
                  _this.areaInfo = [];
                  if (address.provCode != null) {
                    _this.areaInfo.push(parseInt(address.provCode));
                    _this.formData.AreaModel.push({
                      label: address.prov,
                      value: parseInt(address.provCode)
                    });
                  }
                  if (address.cityCode != null) {
                    _this.areaInfo.push(parseInt(address.cityCode));
                    _this.formData.AreaModel.push({
                      label: address.city,
                      value: parseInt(address.cityCode)
                    });
                  }
                  if (address.countryCode != null) {
                    _this.areaInfo.push(parseInt(address.countryCode));
                    _this.formData.AreaModel.push({
                      label: address.country,
                      value: parseInt(address.countryCode)
                    });
                  }
                  _this.$refs.AreaCascader.selected = _this.formData.AreaModel;
                  _this.getPrice();
                }
              }
            })
          );
      }
    },
    changeExpressWay(value) {
      if (value == 1) {
        this.ExpressDiff = 0;
      } else {
        this.ExpressDiff = 10;
      }
    },
    getList() {
      let _this = this;
      _this.AppendLoading = true;
      this.AppendData.PageInfo.PageSize = this.$refs.appendTablePage.currentPageSize;
      Api.Express.AppendList(this.AppendData).then(res => {
        if (res.data.success) {
          _this.AppendList = res.data.data.listData.map(x => {
            x.select = false;
            return x;
          });
          _this.AppendData.PageInfo.Total = res.data.data.totalRecorder;
        } else {
          _this.AppendList = [];
        }
        _this.AppendLoading = false;
      });
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
    getRqArea(id) {
      return Api.Express.RqArea(id).then(res => res.data);
    },
    loadArea(item, callback) {
      var str = item.value + "";
      item.loading = true;
      Api.Express.RqArea(item.value).then(function(res) {
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
      this.formData.AreaModel = selectedData.map(i => {
        return { label: i.label, value: i.value };
      });
      this.getPrice();
    },
    getPrice() {
      let _this = this;
      let area = {};
      if (this.formData.AreaModel.length >= 2) {
        if (this.formData.AreaModel[0].label.includes("市")) {
          area.EndProvince = this.formData.AreaModel[1].label.substr(
            0,
            this.formData.AreaModel[1].label.length - 1
          );
          area.EndCity =
            this.formData.AreaModel[1].label +
            "," +
            this.formData.AreaModel[2].label;
        } else {
          area.EndProvince = this.formData.AreaModel[0].label;
          area.EndCity = this.formData.AreaModel[1].label;
        }
      }
      if (JSON.stringify(area) != "{}") {
        Api.Express.RqYTPrice(area).then(res => {
          if (res.data.Success) {
            _this.FirstMoney = parseInt(res.data.Data);
          }
        });
      }
    },
    modalCancel() {
      this.showModel = false;
    },
    modalOk() {
      var express = this.AppendList.filter(i => {
        if (i.select == true) return i;
      });
      if (express.length == 0) {
        this.$Message.error("请选择数据");
      } else {
        this.formData.ExpressId = express[0].id;
        this.showModel = false;
      }
    },

    ShowAddressListModel() {
      if (this.myCustomer.id == undefined) {
        this.$Message.info("请先选择客户");
      } else {
        this.GetAddressList();
      }
    },
    GetAddressList() {
      let _this = this;
      _this.AddressLoading = true;
      this.AddressDate.CustomerId = this.myCustomer.id;
      Api.ExpressAddress.GetCustomerAllList(this.AddressDate).then(res => {
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
      this.formData.Receiver = address.receiver;
      this.formData.ReceiverPhone = address.receiverPhone;
      this.formData.Address = address.address;
      this.formData.AreaModel = [];
      this.areaInfo = [];
      if (address.provCode != null) {
        this.areaInfo.push(parseInt(address.provCode));
        this.formData.AreaModel.push({
          label: address.prov,
          value: parseInt(address.provCode)
        });
      }
      if (address.cityCode != null) {
        this.areaInfo.push(parseInt(address.cityCode));
        this.formData.AreaModel.push({
          label: address.city,
          value: parseInt(address.cityCode)
        });
      }
      if (address.countryCode != null) {
        this.areaInfo.push(parseInt(address.countryCode));
        this.formData.AreaModel.push({
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
      this.AddressValidate.Customer = this.myCustomer;
      this.ShowAddressInfo = true;
    },
    AddressInfoShow(id) {
      let _this = this;
      Api.ExpressAddress.GetById(id).then(res => {
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
          Api.ExpressAddress.Delete(id).then(res => {
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
          Api.ExpressAddress.Save(this.AddressValidate).then(res => {
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
  computed: {
    selectCount() {
      let store = this.selectDataStore;
      let length = 0;
      if (store.length > 0) {
        for (let i = 0; i < store.length; i++) {
          const ele = store[i];
          length += ele.value.length;
        }
      }
      return length;
    },
    totalAmount() {
      let length = this.selectCount;
      let store = this.selectDataStore;
      let amount = 0;
      if (length > 0) {
        store.forEach((item, index) => {
          item.value.forEach((item2, index2) => {
            amount += item2.accountDue;
          });
        });
      }
      return amount;
    },
    listDataCount() {
      if (!this.listData) {
        return 0;
      }
      if (!this.listData.length) {
        return 0;
      }
      this.selectDataStore = [];
      return this.listData.length;
    },
    ExpectedFee() {
      this.formData.ExpectedFee = this.FirstMoney + this.ExpressDiff;
      return this.FirstMoney + this.ExpressDiff;
    }
  },
  mounted: function() {
    this.province();
  },
  props: ["enums", "listData", "amount", "myCustomer", "loading"]
};
</script>
