<style lang="less" scoped>
.raduis {
  border-radius: 10px;
  margin-right: 6px;
}
</style>
<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>快递管理</BreadcrumbItem>
      <BreadcrumbItem>快递详情</BreadcrumbItem>
    </Breadcrumb>
    <div style="padding:9px 0;"></div>
    <Card :bordered="false" :shadow="true">
      <p slot="title">基本信息</p>
      <Row>
        <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>快递编号</b>
            </Col>
            <Col span="11">{{ExpressInfo.id}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>客户名称</b>
            </Col>
            <Col span="11">{{ExpressInfo.customer.name}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>创建人</b>
            </Col>
            <Col span="11">{{ExpressInfo.creator.name}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>创建时间</b>
            </Col>
            <Col span="11">{{ExpressInfo.creationTimeStr}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>快递状态</b>
            </Col>
            <Col span="11">{{status}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>运单号码</b>
            </Col>
            <Col span="11">{{ExpressInfo.trackingNumber}}</Col>
          </Row>
        </Col>
      </Row>
    </Card>
    <br />
    <Card :bordered="false" :shadow="true" v-if="CancelDetails.length>0&&ExpressInfo.status<4">
      <div>
        <Row>
          <Col span="24">
            <Row>
              <Col span="3">
                <b>作废无需快递数据</b>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <br />
      <hr />
      <br />
      <Row>
        <Table :data="CancelDetails" :columns="CancelDetailsColumns" stripe :loading="tableLoading"></Table>
      </Row>
    </Card>
    <br />
    <Card :bordered="false" :shadow="true" v-if="CancelingDetails.length>0&&ExpressInfo.status<4">
      <div>
        <Row>
          <Col span="24">
            <Row>
              <Col span="3">
                <b>作废审核中的数据</b>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <br />
      <hr />
      <br />
      <Row>
        <Table
          :data="CancelingDetails"
          :columns="CancelDetailsColumns"
          stripe
          :loading="tableLoading"
        ></Table>
      </Row>
    </Card>
    <br />
    <Card :bordered="false" :shadow="true">
      <div>
        <Row>
          <Col span="24">
            <Row>
              <Col span="3">
                <b>单据信息</b>
              </Col>
              <Col style="float:right">
                <b>共计{{listData.length}}条</b>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <br />
      <hr />
      <br />
      <Row>
        <Table :data="listData" :columns="listColumns" stripe :loading="tableLoading"></Table>
      </Row>
    </Card>
    <br />
    <Card :bordered="false" :shadow="true">
      <p slot="title">快递信息</p>
      <Row>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>快递方式</b>
            </Col>
            <Col span="11">{{ExpressInfo.expressWayStr}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>物品类型</b>
            </Col>
            <Col span="11">{{ExpressInfo.stdmodeStr}}</Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>收件人</b>
            </Col>
            <Col span="11">{{ExpressInfo.receiver}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>收件人电话</b>
            </Col>
            <Col span="11">{{ExpressInfo.receiverPhone}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="12" :lg="12" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>详细地址</b>
            </Col>
            <Col
              span="11"
            >{{ExpressInfo.prov+ExpressInfo.city+ExpressInfo.country+ExpressInfo.address}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件人</b>
            </Col>
            <Col span="11">{{ExpressInfo.sender}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件人电话</b>
            </Col>
            <Col span="11">{{ExpressInfo.senderPhone}}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="12" :lg="12" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件人地址</b>
            </Col>
            <Col span="11">{{ExpressInfo.senderAddress}}</Col>
          </Row>
        </Col>
        <!-- <Col :xs="12" :sm="12" :md="8" :lg="8" class="col-padding">
                    <Row>
                        <Col span="6" class="info-title">
                            <b>预计配送时长</b>
                        </Col>
                        <Col span="11">
                            {{ExpressInfo.expectedTime}}天
                        </Col>
                    </Row>
        </Col>-->
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>预估运费</b>
            </Col>
            <Col span="11">{{ExpressInfo.expectedFee}}元</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="6" :lg="6" class="col-padding">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件备注</b>
            </Col>
            <Col span="11">{{ExpressInfo.remark}}</Col>
          </Row>
        </Col>
      </Row>
    </Card>
    <br />

    <Modal v-model="IsPrintModel" title="打印面单" :closable="true" :mask-closable="false" width="400">
      <div
        ref="print"
        style="width:100mm; height:180mm;background-color:#fff;text-align:center;font-family:SimHei;color:#000;line-height:1.2;">
        <div style="height:110mm;width:100mm;">
          <div style="width:30mm;height:14mm;float:left;"></div>
          <div
            style="width:100mm;height:15mm;line-height:15mm;float:left;font-size:36pt;"
          >{{PrintRtInfo.shortAddress}}</div>
          <div style="width:9mm;height:10mm;float:left;"></div>
          <div
            style="width:56mm;height:10mm;line-height:10mm;float:left;font-size:16pt;text-indent:-50mm;"
          >{{PrintRtInfo.packageCenterName}}</div>
          <div style="width:35mm;height:10mm;line-height:10mm;float:left;">
            <svg id="barcode3" />
          </div>
          <div style="width:9mm;height:15mm;line-height:15mm;float:left;font-size:11pt;">收</div>
          <div
            style="width:91mm;height:15mm;float:left;text-align:left;font-size:9pt;font-weight:blod;padding-top:2mm;"
          >
            <span>
              {{PrintRtInfo.receiver}} &nbsp;{{PrintRtInfo.receiverPhone}}
              <br />
              {{PrintRtInfo.prov}}{{PrintRtInfo.city}}{{PrintRtInfo.address}}
            </span>
          </div>
          <div style="width:9mm;height:12mm;line-height:12mm;float:left;font-size:11pt;">寄</div>
          <div
            style="width:91mm;height:12mm;background-color:azure;float:left;text-align:left;font-size:8pt;padding-top:2mm;"
          >
            {{PrintRtInfo.sender}} {{PrintRtInfo.senderPhone}}
            <br />
            {{PrintRtInfo.senderAddress}}
          </div>
          <div style="width:100mm;height:23mm;float:left;text-align:center;">
            <svg id="barcode" />
          </div>
          <div style="width:23mm;height:22mm;float:left;font-size:1mm;">
            <p style="font-size:8pt;">{{PrintRtInfo.creationTime}}</p>
            <p style="font-size:11pt;">打印时间</p>
            <p style="font-size:8pt;">数量：1</p>
          </div>
          <div style="width:27mm;height:22mm;float:left;" >
            <img style="width:75%;height:75%;objec-fit:cover;" src="../../../static/otw_code.jpg">
          </div>
          <div style="width:50mm;height:22mm;float:left;">
            <span
              style="margin:auto;padding-top:8px;display:block;width:90%;height:15mm;font-size:6pt;"
            ></span>
            <p style="text-indent:75px;font-size:7pt;">签收处</p>
          </div>
        </div>
        <div style="height:31mm;width:100mm;">
          <div style="width:30mm;height:10mm;float:left;"></div>
          <div style="width:70mm;height:10mm;float:left;">
            <svg id="barcode2" />
          </div>
          <div style="width:9mm;height:10mm;line-height:10mm;float:left;font-size:11pt;">收</div>
          <div style="width:91mm;height:10mm;float:left;font-size:7pt;text-align:left;">
            <span>
              {{PrintRtInfo.receiver}} &nbsp;{{PrintRtInfo.receiverPhone}}
              <br />
              {{PrintRtInfo.prov}}{{PrintRtInfo.city}}{{PrintRtInfo.address}}
            </span>
          </div>
          <div style="width:9mm;height:10mm;float:left;font-size:11pt;line-height:10mm;">寄</div>
          <div style="width:91mm;height:10mm;float:left;font-size:7pt;text-align:left;">
            {{PrintRtInfo.sender}} {{PrintRtInfo.senderPhone}}
            <br />
            {{PrintRtInfo.senderAddress}}
          </div>
        </div>

        <div style="height:40mm;width:100mm;">
          <div style="width:100mm;height:9mm;line-height:9mm;float:left;">
            <span
              style="display:block;width:30%;text-align:left;text-indent:3mm;font-size:16pt;float:left;"
            >圆通速递</span>
            <span
              style="font-size:1mm;display:block;float:left;text-indent:120px;font-size:12pt;"
            >{{PrintRtInfo.expressCode}}</span>
          </div>

          <div style="width:50mm;height:6mm;float:left;">
            <span
              style="width:100%;line-height:6mm;font-size:7pt;"
            >打印时间 {{PrintRtInfo.creationTime}}</span>
          </div>
          <div style="width:50mm;height:6mm;float:left;">
            <span style="text-align:center;font-size:7pt;line-height:6mm;">数量：1</span>
          </div>
          <div style="width:9mm;height:12mm;line-height:12mm;float:left;font-size:11pt;">收</div>
          <div style="width:91mm;height:12mm;float:left;text-align:left;font-size:7pt;">
            <span>
              {{PrintRtInfo.receiver}} &nbsp;{{PrintRtInfo.receiverPhone}}
              <br />
              {{PrintRtInfo.prov}}{{PrintRtInfo.city}}{{PrintRtInfo.address}}
            </span>
          </div>
          <div style="width:9mm;height:12mm;line-height:12mm;float:left;font-size:11pt;">寄</div>
          <div
            style="width:91mm;height:12mm;float:left;text-align:left;font-size:7pt;padding-top:2mm;"
          >
            {{PrintRtInfo.sender}} {{PrintRtInfo.senderPhone}}
            <br />
            {{PrintRtInfo.senderAddress}}
          </div>
        </div>
      </div>
    </Modal>

    <Row style="float:right">
      <Button
        type="info"
        v-show="ExpressInfo.status==2&&ExpressInfo.creator.id==userInfo.id"
        @click="cancelExpress"
      >取消快递</Button>
      <Button
        type="info"
        v-show="ExpressInfo.status==2&&ExpressInfo.creator.id==userInfo.id"
        @click="appendExpress"
      >追加快递</Button>
      <Button
        type="info"
        v-show="status=='待快递'&&show(4)&&listData.filter(l=>l.status==8).length==0"
        @click="printOrder"
      >打印面单</Button>
    </Row>
    <Modal v-model="showModel" title="追加单据信息" :closable="true" :mask-closable="false" width="900">
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="modalOk" :loading="submitLoading">
          <span v-if="!submitLoading">确定</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
      <Table :data="AppendList" :columns="AppendColumns" stripe :loading="AppendLoading"></Table>
    </Modal>
    <Modal
      v-model="showPlaceOrder"
      title="打印面单"
      :closable="true"
      :mask-closable="false"
      width="600"
    >
      <div slot="footer">
        <Button type="text" size="large" @click="PlaceOrderCancel">取消</Button>
        <Button type="primary" size="large" @click="PlaceOrderOk" :loading="PlaceOrderLoading">
          <span v-if="!PlaceOrderLoading">确定</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
      <Form :label-width="180" ref="PlaceOrder" :model="PlaceOrderValidate" :rules="PlaceOrderRule">
        <Row>
          <Col style="width:80%">
            <FormItem label="回填运单号" prop="TrackingNumber">
              <Input
                type="text"
                v-model="PlaceOrderValidate.TrackingNumber"
                placeholder="请输入回填运单号"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import api from "@/api/api.js";
import CommonApi from "@/api/common.js";
import { dateToStr } from "@/common/tools/DateTime.js";
// 权限控制显示
import rolePage from "@/common/tools/Role.js";
import expressCategory from "@/components/Base/ExpressCategory";

// 圆通模板二维码
import QRCode from "qrcodejs2";
// 导入条形码模块
import JsBarcode from "jsbarcode";

export default {
  beforeCreate: function() {
    let _this = this;
    CommonApi.Common.getAll({
      keys: "ExpressStatus;"
    }).then(function(res) {
      _this.enums = res.data.data;
    });
  },
  data() {
    const validateTrackingNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写回填运单号"));
      } else {
        const re = /^((618|680|828|571|518)[0-9]{9})$|^(2008[0-9]{8})$|^((00|10)[0-9]{10})$|^[C,E][A-Z][0-9]{9}(CN)$|^[0-9]{12}$|^[A-Z]{2}[0-9]{9}[A-Z]{2}$/g;
        if (!re.exec(value)) {
          callback(new Error("请填写正确回填运单号"));
        } else {
          callback();
        }
      }
    };
    return {
      enums: {
        ExpressStatus: []
      },
      ExpressInfo: {
        customer: {},
        creator: {}
      },
      PrintRtInfo: {},
      tableLoading: false,
      strPrint: "",
      listColumns: [
        {
          title: "单号",
          width: 100,
          render: (h, params) => {
            return h(expressCategory, {
              props: {
                data: params.row
              }
            });
          }
        },
        {
          title: "客户",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.customer.name);
          }
        },
        {
          title: "行程/发票号",
          align: "center",
          key: "invoiceNumber"
        },
        {
          title: "创建人",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.creator.name);
          }
        },
        {
          title: "开票时间",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.invoiceTimeStr);
          }
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.status < 3 ? "未打印" : "已打印");
          }
        },
        {
          title: "类型",
          align: "center",
          key: "invoiceTypeStr"
        }
      ],
      listData: [],
      showModel: false,
      loading: false,
      AppendList: [],
      IsPrintModel: false,
      AppendColumns: [
        {
          title: " ",
          width: 20,
          render: (h, params) => {
            return h("Checkbox", {
              props: {
                value: params.row.select
              },
              on: {
                "on-change": val => {
                  this.AppendList[params.index].select = val;
                }
              }
            });
          }
        },
        {
          title: "单号",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.id);
          }
        },
        {
          title: "客户",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.customer.name);
          }
        },
        {
          title: "行程/发票号",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.invoiceNumber);
          }
        },
        {
          title: "类型",
          width: 90,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.invoiceTypeStr);
          }
        },
        {
          title: "创建人",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.creator.name);
          }
        },
        {
          title: "开票时间",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.invoiceTimeStr);
          }
        }
      ],
      AppendLoading: false,
      AppendData: {
        checkAllGroup: ["行程单", "税务发票"]
      },
      submitLoading: false,
      showPlaceOrder: false,
      PlaceOrderValidate: {
        Id: this.$route.params.Id
      },
      PlaceOrderRule: {
        TrackingNumber: [
          { required: true, validator: validateTrackingNumber, trigger: "blur" }
        ]
      },
      PlaceOrderLoading: false,
      CancelDetails: [],
      CancelDetailsColumns: [
        {
          title: "单号",
          width: 100,
          key: "invoiceId"
        },
        {
          title: "客户",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.customer.name);
          }
        },
        {
          title: "行程/发票号",
          align: "center",
          key: "eticketNumber"
        },
        {
          title: "创建人",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.creator.name);
          }
        },
        {
          title: "开票时间",
          align: "center",
          key: "invoiceTimeStr"
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              params.row.eticketNumber != "" ? "已打印" : "未打印"
            );
          }
        },
        {
          title: "类型",
          align: "center",
          key: "invoiceTypeStr"
        }
      ],
      CancelingDetails: []
    };
  },
  methods: {
    show(params) {
      return rolePage(params);
    },
    getDetail() {
      let _this = this;
      let id = this.$route.params.Id;
      api.Express.GetDetail(id).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          _this.ExpressInfo = data.expressInfo;
          _this.listData = data.customerInvoices;
          _this.CancelingDetails = data.cancelingDetails.map(i => {
            let invoice = data.customerInvoices.filter(
              m => m.id == i.invoiceId
            );
            if (invoice.length > 0) {
              i.customer = invoice[0].customer;
              i.invoiceTimeStr = invoice[0].invoiceTimeStr;
              i.invoiceTypeStr = invoice[0].invoiceTypeStr;
              i.creator = invoice[0].creator;
            } else {
              i.customer = {};
              i.invoiceTimeStr = "";
              i.invoiceTypeStr = "";
              i.creator = {};
            }
            return i;
          });
          _this.CancelDetails = data.cancelDetails.map(i => {
            let invoice = data.customerInvoices.filter(
              m => m.id == i.invoiceId
            );
            if (invoice.length > 0) {
              i.customer = invoice[0].customer;
              i.invoiceTimeStr = invoice[0].invoiceTimeStr;
              i.invoiceTypeStr = invoice[0].invoiceTypeStr;
              i.creator = invoice[0].creator;
            } else {
              i.customer = {};
              i.invoiceTimeStr = "";
              i.invoiceTypeStr = "";
              i.creator = {};
            }
            return i;
          });
        }
      });
    },
    cancelExpress() {
      api.Express.Cancel(this.$route.params.Id).then(res => {
        if (res.data.success) {
          if (res.data.data > 0) {
            this.getDetail();
            this.$Message.success("取消成功!");
          } else {
            this.$Message.error("取消失败，可能已经发送了快递");
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    appendExpress() {
      this.AppendData.Customer = this.ExpressInfo.customer;
      this.showModel = true;
      this.GetAppendList();
    },
    printOrder() {
      if (this.ExpressInfo.expressWay !== 5) {
        this.showPlaceOrder = true;
      } else {
        this.PlaceOrder();
      }
    },
    GetAppendList() {
      let _this = this;
      this.AppendLoading = true;
      api.Express.ApplyExpressList(this.AppendData).then(res => {
        if (res.data.success) {
          _this.AppendList = res.data.data.map(x => {
            x.select = false;
            return x;
          });
        } else {
          _this.AppendList = [];
        }
        this.AppendLoading = false;
      });
    },
    modalOk() {
      this.submitLoading = true;
      let _this = this;
      let appendList = this.AppendList.filter(i => i.select).map(i => {
        return i.id;
      });
      if (appendList.length > 0) {
        api.Express.Append({
          id: this.ExpressInfo.id,
          invoices: appendList
        }).then(res => {
          if (res.data.success) {
            this.$Message.success("追加成功！");
            _this.getDetail();
            _this.showModel = false;
          } else {
            this.$Message.error("追加失败！");
          }

          this.submitLoading = false;
        });
      } else {
        this.$Message.error("请选择追加单据信息！");
        this.submitLoading = false;
      }
    },
    modalCancel() {
      this.showModel = false;
    },
    PlaceOrderOk() {
      this.$refs["PlaceOrder"].validate(valid => {
        if (valid) {
          this.PlaceOrder();
        }
      });
    },
    PlaceOrderCancel() {
      this.showPlaceOrder = false;
    },
    PlaceOrder() {
      let _this = this;
      this.PlaceOrderValidate.expressWay = this.ExpressInfo.expressWay;
      api.Express.PlaceOrder(this.PlaceOrderValidate).then(res => {
        if (res.data.data.success) {
          _this.getDetail();
          _this.PrintRtInfo.receiver = _this.ExpressInfo.receiver;
          _this.PrintRtInfo.receiverPhone = _this.ExpressInfo.receiverPhone;

          // 收件人
          _this.PrintRtInfo.prov = _this.ExpressInfo.prov;
          _this.PrintRtInfo.city = _this.ExpressInfo.city;
          _this.PrintRtInfo.address = _this.ExpressInfo.address;

          // 发件人
          _this.PrintRtInfo.sender = _this.ExpressInfo.sender;
          _this.PrintRtInfo.senderPhone = _this.ExpressInfo.senderPhone;
          _this.PrintRtInfo.senderAddress = _this.ExpressInfo.senderAddress;
          _this.PrintRtInfo.expectedWeight = _this.ExpressInfo.expectedWeight;
          _this.PrintRtInfo.creationTime = dateToStr(
            new Date(),
            "yyyy-MM-dd hh:mm:ss"
          );
          _this.PrintRtInfo.expressCode = res.data.data.data.expressCode; //" ";
          _this.PrintRtInfo.shortAddress =
            res.data.data.data.distributeInfo.shortAddress;

          // "";
          _this.PrintRtInfo.packageCenterCode =
            res.data.data.data.distributeInfo.packageCenterCode;

          // "";
          _this.PrintRtInfo.packageCenterName =
            res.data.data.data.distributeInfo.packageCenterName;

          // "res.data.data.data.distributeInfo.packageCenterName";

          this.IsPrintModel = true;
          _this.showPlaceOrder = false;
          // _this.qrcode();
          _this.barcode();
          _this.barcode2();
          _this.barcode3();

          setTimeout(() => {
            this.$print(_this.$refs.print);
            this.IsPrintModel = false;
          }, 1000);
        } else {
          this.$Message.error(res.data.data.message);
        }
        _this.PlaceOrderLoading = false;
      });
    },
    // qrcode() {
    //   let qrcode = new QRCode("qrcode", {
    //     width: 80,
    //     height: 70
    //   });
    //   qrcode.makeCode({
    //     mn: "YT2880031626937",
    //     pcn: "",
    //     rbc: "035201",
    //     sbc: "210045",
    //     ssc: "183-726-03",
    //     tsc: "900"
    //   });
    // },
    barcode() {
      let _this = this;
      JsBarcode("#barcode", _this.PrintRtInfo.expressCode, {
        format: "CODE128A",
        text: _this.PrintRtInfo.expressCode.replace(/(.{4})/g, "$1 "),
        displayValue: true,
        margin: 10,
        width: 3,
        fontSize: 30,
        font: "SimHei",
        textPosition: "bottom"
      });
    },
    barcode2() {
      let _this = this;
      JsBarcode("#barcode2", _this.PrintRtInfo.expressCode, {
        format: "CODE128A",
        text: _this.PrintRtInfo.expressCode.replace(/(.{4})/g, "$1 "),
        displayValue: true,
        margin: 1,
        width: 3,
        textPosition: "bottom",
        fontSize: 30,
        font: "SimHei"
      });
    },
    barcode3() {
      let _this = this;
      JsBarcode("#barcode3", _this.PrintRtInfo.packageCenterCode, {
        format: "CODE128A",
        text: _this.PrintRtInfo.packageCenterCode,
        margin: 5,
        width: 3,
        displayValue: true,
        textPosition: "bottom",
        fontSize: 30,
        font: "SimHei"
      });
    }
  },
  computed: {
    status() {
      var expressStatus = this.enums.ExpressStatus.filter(i => {
        return i.key == this.ExpressInfo.status;
      });
      if (JSON.stringify(expressStatus) == "{}") {
        return "";
      } else {
        if (expressStatus.length > 0) {
          if (
            this.listData.filter(i => {
              return i.status < 3;
            }).length > 0 &&
            this.ExpressInfo.status <= 2
          ) {
            return "未打印";
          }
          return expressStatus[0].value;
        }
      }
    },
    userInfo() {
      return this.$store.state.app.userInfo;
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>
<style>
#barcode {
  width: 278px;
  height: 87px;
}
#barcode3 {
  width: 80px;
  height: 37px;
}
#barcode2 {
  width: 70mm;
  height: 10mm;
}
</style>