<template>
  <Card>
    <div>
      <Row>
        <i-col span="24">
          <Row>
            <i-col span="3">
              <b>开票金额：</b>
              <font color="green">{{ totalAmount }}</font>
            </i-col>
            <i-col span="3">
              <b>选择总号数:</b>
              <font color="green">{{ selectCount }}</font>
            </i-col>
            <i-col style="float:right">
              <b>共{{ listDataCount }}条数据</b>
            </i-col>
          </Row>
        </i-col>
      </Row>
      <br />
      <hr />
      <br />
      <Row>
        <i-col span="24">
          <Table
            size="small"
            ref="selection"
            :columns="columns"
            :data="listData"
            :loading="loading"
            @on-select="selectItem"
            @on-select-cancel="cancelItem"
            @on-select-all="selectItemAll"
            @on-selection-change="cancelSelectAll"
          ></Table>
        </i-col>
      </Row>
    </div>
    <br />
    <br />
    <br />
    <Row>
      <Form
        :label-width="100"
        :rules="ruleValidate"
        ref="formData"
        :model="formData"
        style="width:96%"
      >
        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="发票抬头" prop="title">
              <Input
                type="text"
                v-model="formData.title"
                placeholder="请填写客户抬头"
                @on-keyup="checkTitle"
              />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="收款单位" prop="CollectCompany">{{formData.CollectCompany}}</FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="客户类型" prop="titleType">
              <Select v-model="formData.titleType" @on-change="changeTitleType">
                <Option
                  v-for="item in enums.CustomerTitleType"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="开票类型" prop="type">
              <RadioGroup v-model="formData.type" @on-change="changeType">
                <Radio v-for="item in enums.OpenInvoiceType" :key="item.key" :label="item.key">
                  <span>{{ item.value }}</span>
                </Radio>
              </RadioGroup>
              <i-switch v-model="formData.IsProforma" style="width:80px;">
                <span slot="open">预开</span>
                <span slot="close">非预开</span>
              </i-switch>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="经营项目" prop="content">
              <Select v-model="formData.content">
                <OptionGroup label="其他经纪代理服务">
                  <Option
                    v-for="item in DealProxyFee"
                    :value="item.key"
                    :key="item.key"
                  >{{ item.value }}</Option>
                </OptionGroup>
                <OptionGroup label="旅游服务">
                  <Option
                    v-for="item in DealOperationContent"
                    :value="item.key"
                    :key="item.key"
                  >{{ item.value }}</Option>
                </OptionGroup>
                <OptionGroup label="会议服务">
                  <Option
                    v-for="item in MeetingFee"
                    :value="item.key"
                    :key="item.key"
                  >{{ item.value }}</Option>
                </OptionGroup>
              </Select>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="纳税人类型" prop="ratepayerType">
              <Select v-model="formData.ratepayerType">
                <Option
                  v-for="item in enums.ClientTaxpayingType"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>

        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="纳税识别号" prop="ratepayerNumber">
              <Input type="text" v-model="formData.ratepayerNumber" placeholder="请填写15-20位数字" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="地址" prop="adress">
              <Input type="text" v-model="formData.adress" placeholder="请填写地址" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="固定电话" prop="phone">
              <Input type="text" v-model="formData.phone" placeholder="如:010-999123456" />
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col :md="12" :lg="8">
            <FormItem label="开户行" prop="openingBank">
              <Input type="text" v-model="formData.openingBank" placeholder="xx银行xx分行xx支行" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="账号" prop="accountNumber">
              <Input type="text" v-model="formData.accountNumber" placeholder="请填写" />
            </FormItem>
          </i-col>

          <i-col :md="12" :lg="8">
            <FormItem label="发票类型" prop="printType">
              <RadioGroup v-model="formData.printType" @on-change="changePrintType">
                <Radio v-for="item in enums.InvoiceType" :key="item.key" :label="item.key">
                  <span>{{ item.value }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
        </Row>
        <!-- 电子发票  -->
        <Row v-if="formData.printType === 2">
          <i-col :md="12" :lg="8">
            <FormItem label="接收人姓名" prop="takerName">
              <Input type="text" v-model="formData.takerName" placeholder="请填写姓名" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="接收人手机" prop="takerTel">
              <Input type="text" v-model="formData.takerTel" placeholder="139xxxxxxxx" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="接收人邮箱" prop="takerEmail">
              <Input type="text" v-model="formData.takerEmail" placeholder="xingmin@163.com" />
            </FormItem>
          </i-col>
        </Row>

        <!-- 纸质发票 -->
        <Row v-if="formData.printType === 1">
          <i-col :md="12" :lg="8">
            <FormItem label="快递形式" prop="ExpressType">
              <Select v-model="formData.ExpressType" @on-change="changeExpressType">
                <Option
                  v-for="item in enums.ExpressType"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8" v-if="formData.ExpressType===1">
            <FormItem label="快递方式" prop="ExpressWay">
              <Select v-model="formData.ExpressWay" @on-change="changeExpressWay">
                <Option
                  v-for="item in enums.ExpressWay"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8" v-if="formData.ExpressType===1">
            <FormItem label="物品类型" prop="Stdmode">
              <Select v-model="formData.Stdmode">
                <Option
                  v-for="item in enums.Stdmode"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="formData.printType === 1&&formData.ExpressType===1">
          <i-col :md="12" :lg="8">
            <FormItem label="收件人" prop="Receiver">
              <Input
                type="text"
                v-model="formData.Receiver"
                placeholder="请填写收件人"
                style="width:80%"
              />
              <Button type="success" @click="ShowAddressListModel" size="small">地址簿</Button>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="收件人电话" prop="ReceiverPhone">
              <Input type="text" v-model="formData.ReceiverPhone" placeholder="请填写收件人电话" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="省市区" prop="AreaModel">
              <Cascader
                v-model="areaInfo"
                :data="AreaData"
                :load-data="loadArea"
                @on-change="handleChange"
                placeholder="请选择省市区"
              ></Cascader>
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="formData.printType === 1&&formData.ExpressType===1">
          <i-col :md="18" :lg="11">
            <FormItem label="详细地址" prop="Address">
              <Input type="text" v-model="formData.Address" placeholder="请填写详细地址" />
            </FormItem>
          </i-col>
          <i-col :md="6" :lg="5">
            <FormItem>
              <Checkbox v-model="formData.isSave">保存到常用地址簿</Checkbox>
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="预估运费" prop="ExpectedFee">
              <span>{{ExpectedFee}}</span> 元
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="formData.printType === 1&&formData.ExpressType===1">
          <i-col :md="12" :lg="8">
            <FormItem label="寄件人" prop="Sender">
              <Input type="text" v-model="formData.Sender" placeholder="请填写寄件人" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="寄件人电话" prop="SenderPhone">
              <Input type="text" v-model="formData.SenderPhone" placeholder="请填写寄件人电话" />
            </FormItem>
          </i-col>
          <i-col :md="12" :lg="8">
            <FormItem label="寄件备注" prop="ExpressRemark">
              <Input
                type="text"
                v-model="formData.ExpressRemark"
                placeholder="您可以在此备注您的需求，快递小哥可以看到"
              />
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="formData.printType === 1&&formData.ExpressType===1"></Row>
        <Row>
          <i-col>
            <FormItem label="发票备注" prop="invoiceRemark">
              <Input
                type="textarea"
                v-model="formData.invoiceRemark"
                placeholder="该备注会打印到发票上，请谨慎填写,最多50字"
              />
            </FormItem>
          </i-col>
        </Row>

        <i-col>
          <FormItem label="备注:">
            <Input type="textarea" :row="9" v-model="formData.remark" placeholder="填写备注" />
          </FormItem>
        </i-col>
        <i-col v-show="upload.showUploader">
          <FormItem lable="附件:">
            <Upload
              multiple
              :action="upload.uploadAction"
              :max-size="4096"
              ref="upload"
              :before-upload="handleBeforeUpload"
              :on-exceeded-size="onSizeError"
              :on-success="onSuccess"
              :on-remove="onRemove"
            >
              <Button icon="ios-cloud-upload-outline">上传附件</Button>
            </Upload>
            <Alert type="error" show-icon v-if="upload.errorMsg!==''">{{upload.errorMsg}}</Alert>
          </FormItem>
        </i-col>
        <FormItem style="float:right">
          <Button type="primary" @click="submit" :disabled="submitLoading">提交申请{{formData.validate}}</Button>
          <!-- 摆放计算属性  -->
          {{ getCustomerInfo }}
        </FormItem>
      </Form>
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
import Api from "@/api/api.js";
import CommonApi from "@/api/common.js";
import Tools from "./Module/Index";

import Category from "../Base/TicketsCategory";
import SignOrderType from "@/components/Base/SignOrderType";
import TableEx from "../CreartInvoice/TaxExpand";

import { dataArr, baseUrl } from "@/config/Index.js";

import api from "../../api/api";
import { provData } from "@/common/tools/City";
import Vue from "vue";

export default {
  beforeCreate: function() {
    let _this = this;
    CommonApi.Common.getAll({
      keys: "OperationContent;ProxyFee;MeetingFee;"
    }).then(function(res) {
      _this.DealProxyFee = res.data.data.ProxyFee;
      _this.DealOperationContent = res.data.data.OperationContent;
      _this.MeetingFee = res.data.data.MeetingFee;
    });
  },
  mounted() {
    debugger;
    this.upload.uploadedFileList = this.$refs.upload.fileList;
  },
  data() {
    const _this = this;
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
    return {
      receivables: dataArr,
      baseUrl: baseUrl,
      columns: [
        {
          type: "selection",
          width: 32,
          align: "center"
        },
        {
          type: "expand",
          width: 50,
          align: "center",
          render: (h, params) => {
            return h(TableEx, {
              props: {
                item: params.row
              }
            });
          }
        },
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
          title: "团号",
          key: "groupNumber",
          width: 130,
          align: "center"
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
          title: "已开票金额",
          key: "completeInvoiceAmount",
          width: 100,
          align: "center"
        },
        {
          title: "开票金额",
          key: "accountDue",
          width: 100,
          align: "center",
          render: (h, params) => {
            let attr = {
              value: params.row.accountDue,
              min: 0,
              max: params.row.totalAmount - params.row.completeInvoiceAmount
            };
            if (params.row.category === 2) {
              attr.min =
                params.row.totalAmount - params.row.completeInvoiceAmount;
            }
            return h("div", [
              h("InputNumber", {
                attrs: attr,
                on: {
                  "on-change": event => {
                    params.row.accountDue = event;
                    // TODO: 创建另一个数组去存储,最后再去操作替换
                    let id = params.row.id;

                    let item = _this.updateFee.find(x => x.id === id);
                    if (!item) {
                      _this.updateFee.push({ id: id, accountDue: event });
                      return;
                    } else {
                      item.accountDue = event;
                    }
                  }
                }
              })
            ]);
          }
        },
        {
          title: "开票总额",
          key: "totalAmount",
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
          title: "销售/操作",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [params.row.sales + "/" + params.row.op]);
          }
        },
        {
          title: "票台(出票/审核)日期",
          width: 150,
          align: "center",
          key: "issuerTime"
        }
      ],
      formData: {
        title: "",
        content: "",
        ratepayerType: 1,
        ratepayerNumber: "",
        companyCategary: 2,
        adress: "",
        printType: 1,
        phone: "",
        openingBank: "",
        accountNumber: "",
        invoiceRemark: "",
        remark: "",
        takerName: "",
        takerTel: "",
        takerEmail: "",
        takerEmail: "",
        ExpectedTime: 0,
        ExpectedFee: 0,
        ExpressId: 0,
        ExpressWay: 5, // 默认圆通快递方式
        Stdmode: 1,
        Sender: "",
        SenderPhone: "",
        AreaModel: [],
        type: 1,
        titleType: 1,
        CollectCompany: "",
        Attachment:[]
      },
      // 类型检查
      ruleValidate: {
        title: [{ required: true, message: "抬头不能为空", trigger: "blur" }],
        CollectCompany: [
          {
            required: true,
            message: "收款单位不能为空",
            trigger: "blur"
          }
        ],
        titleType: [
          {
            type: "number",
            required: true,
            message: "客户开票类型不能为空",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "开票类型不能为空",
            trigger: "change"
          }
        ],
        content: [
          {
            type: "number",
            required: true,
            message: "经营项目不能为空",
            trigger: "change"
          }
        ],
        ratepayerType: [
          {
            type: "number",
            required: true,
            message: "纳税人类型不能为空",
            trigger: "change"
          }
        ],
        ratepayerNumber: [
          { required: false, message: "纳税识别号不能为空", trigger: "blur" },
          {
            type: "string",
            min: 15,
            max: 20,
            message: "长度应为15-20字符",
            trigger: "change"
          },
          {
            type: "string",
            min: 15,
            max: 20,
            message: "长度应为15-20字符",
            trigger: "blur"
          }
        ],
        adress: [{ required: false, message: "地址不能为空", trigger: "blur" }],
        phone: [
          { required: false, message: "固话不能为空", trigger: "blur" },
          {
            required: false,
            validator(rule, value, callback, source, options) {
              const re = /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$$/g;
              let error = [];
              if (rule.required) {
                if (!re.exec(value)) {
                  error.push(
                    new Error("固定电话格式  :“010-65206133”,请规范填写")
                  );
                }
              } else {
                if (value != "" && !re.exec(value)) {
                  error.push(
                    new Error("固定电话格式  :“010-65206133”,请规范填写")
                  );
                }
              }
              callback(error);
            }
          }
        ],

        openingBank: [
          { required: false, message: "开户行不能为空", trigger: "blur" },
          {
            type: "string",
            min: 4,
            max: 35,
            message: "开户行长度应为4-35个字符",
            trigger: "change"
          },
          {
            type: "string",
            min: 4,
            max: 35,
            message: "开户行长度应为4-35个字符",
            trigger: "blur"
          }
        ],

        accountNumber: [
          { required: false, message: "账号不能为空", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              const re = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g;
              let error = [];
              if (re.exec(value)) {
                error.push(new Error("账号中不能出现汉字"));
              }
              callback(error);
            }
          },
          {
            type: "string",
            min: 8,
            max: 27,
            message: "账号长度应为8-27个字符",
            trigger: "change"
          },
          {
            type: "string",
            min: 8,
            max: 27,
            message: "账号长度应为8-27个字符",
            trigger: "blur"
          }
        ],
        printType: [
          {
            type: "number",
            required: true,
            message: "发票类型不能为空",
            trigger: "change"
          }
        ],
        takerName: [
          { required: true, message: "接收人姓名", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              const re = /^[\u4e00-\u9fa5]{2,8}$$/g;
              let error = [];
              if (!re.exec(value)) {
                error.push(new Error("请输入正确的接收人姓名"));
              }
              callback(error);
            }
          }
        ],
        takerTel: [
          { required: true, message: "接收人手机号", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              const re = /^((1[345789]\d{9}))$$/g;
              let error = [];
              if (!re.exec(value)) {
                error.push(new Error("请填写正确手机号"));
              }
              callback(error);
            }
          }
        ],
        takerEmail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              const re = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$$/g;
              let error = [];
              if (!re.exec(value)) {
                error.push(new Error("请填写正确的邮箱格式"));
              }
              callback(error);
            }
          }
        ],
        invoiceRemark: [
          {
            type: "string",
            max: 50,
            message: "发票备注为0-50个字符",
            trigger: "change"
          },
          {
            type: "string",
            max: 50,
            message: "发票备注为0-50个字符",
            trigger: "blur"
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
      params: {},
      selectDataStore: [],
      updateFee: [],

      selectLock: false,
      submitLoading: false,
      DealProxyFee: [],
      DealOperationContent: [],
      MeetingFee: [],
      AreaData: [],
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
      upload: {
        showUploader: false,
        uploadAction: baseUrl + "financepush/Uploader/upload",
        uploadedFileList: [],
        errorMsg: ""
      },

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
    /**
     * 取消选中
     */
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
        let issueIdArr = this.listData.filter(
          x => x.issueId === issueId && x.lock === false
        );
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

    //检测发票抬头，不一致的时候，需要显示上传附件组件
    checkTitle() {
      setTimeout(() => {
        if (
          this.myCustomer === undefined ||
          this.myCustomer.customer === undefined
        ) {
          return true;
        }
        if (
          this.myCustomer.customer.name == "散客" ||
          this.formData.title === ""
        ) {
          return false;
        }

        this.upload.showUploader =
          this.formData.title &&
          this.myCustomer.customer.name !== this.formData.title.trim();
      }, 300);
    },

    onSizeError(file, fileList) {
      this.upload.uploadedFileList = fileList;
      this.formData.Attachment.splice(this.formData.Attachment.indexOf(file.response.data),1);
      this.upload.errorMsg = "文件太大了，最大支持4M";
    },

    onRemove(file, fileList) {
      this.formData.Attachment.splice(this.formData.Attachment.indexOf(file.response.data),1);
      this.upload.uploadedFileList.splice(
        this.upload.uploadedFileList.indexOf(file),
        1
      );
    },
    onSuccess(reps, file, fileList) {
      this.upload.uploadedFileList.push(file);
      this.upload.errorMsg = "";
      if (reps.success) {
       // this.formData.attachment=reps.data;
        this.formData.Attachment.push(reps.data);
      } else {
        this.upload.uploadedFileList = [];
        this.upload.errorMsg = "上传失败，原因" + reps.Message;
      }
    },
    handleBeforeUpload() {
      const check = this.upload.uploadedFileList.length < 10;
      if (!check) {
        this.$Notice.warning({
          title: "最多不能超过10个文件."
        });
      }
      return check;
    },
    submit() {
      let _this = this;

      debugger;

      let data = _this.formData;
      // 转化数组
      let details = Tools.dataConvert(_this.selectDataStore);

      if (details.length === 0) {
        _this.$Message.error("未选择任何单据!!");
        return;
      }

      if (
        _this.formData.titleType != 2 &&
        _this.formData.ratepayerNumber === ""
      ) {
        _this.$Message.error("请输入纳税人识别号!!");
        return;
      }

      if (this.upload.showUploader && this.formData.Attachment.length==0) {
        _this.$Message.error("开票单位不一致，请上传附件!!");
        return;
      }

      if (_this.formData.ExpressType == 4) {
        if (_this.formData.ExpressId === 0) {
          _this.$Message.error("请选择追加信息或者选择其他快递形式!!");
          return;
        }
      }

      data.customerInvoiceDetails = details;

      // 在这里替换数据
      _this.updateFee.forEach(element => {
        const item = data.customerInvoiceDetails.find(
          x => x.PassengerTicketId === element.id
        );
        if (item) {
          item.InvoiceAmount = element.accountDue;
        }
      });
      // 客户参数
      data.Customer = _this.myCustomer;
      data.totalAmount = _this.totalAmount;

      // 验证 begin
      _this.$refs["formData"].validate(valid => {
        if (valid) {
          let errMsg = "";

          if (data.totalAmount === 0) {
            errMsg += "开票总金额必须大于0\n";
          }

          // 检查填写完毕后
          if (errMsg !== "") {
            _this.$Message.error({
              duration: 5,
              content: errMsg,
              closable: true
            });
            return;
          }
          // --------验证结束--------
          data.InvoiceType = 1; //税务发票
          _this.submitLoading = true;
          Api.Invoice.create(data).then(function(res) {
            let data = res.data;
            if (!data.success) {
              _this.submitLoading = false;
              _this.selectDataStore = [];
              _this.$refs.selection.selectAll(false);
              return;
            } else {
              _this.$Message.success({
                content: "创建成功",
                duration: 5,
                closable: true
              });

              _this.$router.push({
                name: "TaxInvoice"
              });
              _this.submitLoading = false;
            }
          });
        }
      });
    },
    /**
     * 开票类型转换 普通/专用
     */
    changeType(state) {
      // 普1专2
      switch (state) {
        case 1:
          this.ruleValidate.adress[0].required = false;
          this.ruleValidate.phone[0].required = false;
          this.ruleValidate.phone[1].required = false;
          this.ruleValidate.openingBank[0].required = false;
          this.ruleValidate.adress[0].required = false;
          this.ruleValidate.accountNumber[0].required = false;
          break;
        case 2:
          this.ruleValidate.adress[0].required = true;
          this.ruleValidate.phone[0].required = true;
          this.ruleValidate.phone[1].required = true;
          this.ruleValidate.openingBank[0].required = true;
          this.ruleValidate.adress[0].required = true;
          this.ruleValidate.accountNumber[0].required = true;
          break;
        default:
          break;
      }
    },
    /**
     * 客户开票类型转换 行政/企业/个人
     */
    changeTitleType(value) {
      if (value === 1) {
        this.ruleValidate.ratepayerNumber[0].required = true;
      } else {
        this.ruleValidate.ratepayerNumber[0].required = false;
      }
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
          area.EndProvince = this.formData.AreaModel[1].label.substr(0,this.formData.AreaModel[1].label.length-1);
          area.EndCity = this.formData.AreaModel[1].label +","+ this.formData.AreaModel[2].label;
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
                  _this.DefaultAddress(address);
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
    getEmployeeInfo() {
      let _this = this;
      api.Customer.GetEmployeeById(this.$store.state.app.userInfo.id).then(
        res => {
          if (res.data.success) {
            _this.formData.takerTel = res.data.data.mobile;
            _this.formData.takerEmail = res.data.data.email;
            _this.formData.takerName = res.data.data.userName;
          }
        }
      );
    },
    changePrintType(value) {
      if (value === 2) {
        this.getEmployeeInfo();
      } else {
        this.formData.takerTel = "";
        this.formData.takerEmail = "";
        this.formData.takerName = "";
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
      let _this = this;
      let amount = _this.amount;
      let length = _this.selectCount;
      let store = _this.selectDataStore;

      if (length > 0) {
        // 第一层分组的 {IssueId,value}
        store.forEach((x, index) => {
          x.value.forEach((y, index2) => {
            // 寻找是否有被修改的数值
            if (_this.updateFee.length === 0) {
              amount += parseFloat(y.accountDue);
            } else {
              let updateItem = _this.updateFee.find(x => x.id === y.id);

              if (!updateItem) {
                amount += parseFloat(y.accountDue);
              } else {
                // 如果发生了调价 则 amount += 调价后的
                amount += parseFloat(updateItem.accountDue);
              }
            }
          });
        });
      }
      amount = Math.round(amount * 100) / 100;
      return amount.toFixed(2);
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

    getCustomerInfo() {
      if (this.myCustomer.id) {
        const _this = this;

        //_this.formData = _this.getEmptyFormData();

        let id = _this.myCustomer.id;

        CommonApi.Common.invoiceInfo(id).then(res => {
          if (res.data.success) {
            let data = res.data.data;
            if (!data) {
              _this.formData.title = "";
              _this.formData.ratepayerType = 1;
              _this.formData.ratepayerNumber = "";
              _this.formData.phone = "";
              _this.formData.openingBank = "";
              _this.formData.adress = "";
              _this.formData.accountNumber = "";
              return;
            }
            _this.formData.title = data.title;
            _this.formData.ratepayerType = data.ratepayerType;
            _this.formData.ratepayerNumber = data.ratepayerNumber;
            _this.formData.phone = data.phone == null ? "" : data.phone;
            _this.formData.openingBank =
              data.openingBank == null ? "" : data.openingBank;
            _this.formData.adress = data.address == null ? "" : data.address;
            _this.formData.accountNumber =
              data.accountNumber == null ? "" : data.accountNumber;
          }
        });
      }
    },
    ExpectedFee() {
      this.formData.ExpectedFee = this.FirstMoney + this.ExpressDiff;
      return this.FirstMoney + this.ExpressDiff;
    }
  },
  mounted: function() {
    this.province();
  },
  created: function() {
    var _this = this;
    api.Invoice.getInvoiceCollCompany().then(function(res) {
      if (res.data.success) {
        _this.formData.CollectCompany = res.data.data.companyName;
      }
    });
  },
  props: ["enums", "listData", "amount", "myCustomer", "loading"]
};
</script>
<style lang="less" scoped>
.p_form {
  padding: 0.6em;
}
</style>


