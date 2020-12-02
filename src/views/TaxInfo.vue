<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>

      <BreadcrumbItem>税务发票详情</BreadcrumbItem>
    </Breadcrumb>
    <!-- 基本信息 -->
    <div style="padding:9px 0;"></div>
    <InvocieInfo :data="info"></InvocieInfo>
    <div style="padding:9px 0;"></div>
    <!-- 票据信息 -->
    <Card :bordered="false" style="margin:0.2em">
      <p slot="title">票据信息</p>
      <Table stripe :columns="columns" :data="invoiceDetails"></Table>
      <p>
        <b>合计:</b>
        {{ info.totalAmount }}
      </p>
    </Card>
    <div style="padding:9px 0;"></div>
    <!-- 开票信息 -->
    <Card :bordered="false" style="margin:0.2em">
      <p slot="title">开票信息</p>
      <Row>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>发票抬头:</b>
            </i-col>
            <i-col span="12">
              {{info.title}}
              <span style="color:#ed4014;margin:5px">{{info.isProforma?'【预开】':''}}</span>
            </i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>收款单位:</b>
            </i-col>
            <i-col span="12">{{ info.companyCategaryStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>客户开票类型:</b>
            </i-col>
            <i-col span="12">{{ info.titleTypeStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>开票类型:</b>
            </i-col>
            <i-col span="12">{{ info.typeStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>经营项目:</b>
            </i-col>
            <i-col span="12">{{ info.contentStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>纳税人类型:</b>
            </i-col>
            <i-col span="12">{{ info.ratepayerTypeStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>纳税人识别号:</b>
            </i-col>
            <i-col span="12">{{ info.ratepayerNumber }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>地址:</b>
            </i-col>
            <i-col span="12">{{ info.adress }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>固定电话:</b>
            </i-col>
            <i-col span="12">{{ info.phone }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>开户行:</b>
            </i-col>
            <i-col span="12">{{ info.openingBank }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>账号:</b>
            </i-col>
            <i-col span="12">{{ info.accountNumber }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>发票类型:</b>
            </i-col>
            <i-col span="12">{{ info.printTypeStr }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <Row>
            <i-col span="2" class="info-title">
              <b>附件:</b>
            </i-col>
            <i-col span="12">
              <div v-for="file in uploadFiles" :key="file.id">
                <span>
                  <a :href="file.url" target="_blank">{{file.name}}</a>
                </span>
              </div>
            </i-col>
          </Row>
        </i-col>
      </Row>
      <!-- 电子发票 -->
      <Row v-if="info.printType === 2">
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>接收人姓名:</b>
            </i-col>
            <i-col span="12">{{ info.takerName }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>接收手机号:</b>
            </i-col>
            <i-col span="12">{{ info.takerTel }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <i-col span="6" class="info-title">
              <b>接收邮箱:</b>
            </i-col>
            <i-col span="12">{{ info.takerEmail }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row v-if="info.printType === 1">
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressTypeStr!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>快递形式:</b>
            </i-col>
            <i-col span="12">{{ info.expressTypeStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>快递方式:</b>
            </i-col>
            <i-col span="12">{{ express.expressWayStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>物品类型:</b>
            </i-col>
            <i-col span="12">{{ express.stdmodeStr }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>收件人:</b>
            </i-col>
            <i-col span="12">{{ express.receiver }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>收件人电话:</b>
            </i-col>
            <i-col span="12">{{ express.receiverPhone }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>收件人地址:</b>
            </i-col>
            <i-col span="12">{{ express.prov+express.city+express.country+express.address }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>寄件人:</b>
            </i-col>
            <i-col span="12">{{ express.sender }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>寄件人电话:</b>
            </i-col>
            <i-col span="12">{{ express.senderPhone }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>预估运费:</b>
            </i-col>
            <i-col span="12">{{ express.expectedFee }}</i-col>
          </Row>
        </i-col>
        <i-col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <i-col span="6" class="info-title">
              <b>寄件备注:</b>
            </i-col>
            <i-col span="12">{{ express.remark }}</i-col>
          </Row>
        </i-col>
        <i-col
          :xs="12"
          :sm="12"
          :md="8"
          :lg="8"
          v-if="(info.expressType===4||info.expressType===1)&&express!=null"
        >
          <Row>
            <i-col span="6" class="info-title">
              <b>快递编号:</b>
            </i-col>
            <i-col span="12">
              <a @click="getExpress(express.id)">{{express.id}}</a>
            </i-col>
          </Row>
        </i-col>
      </Row>
      <Row>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <Row>
            <i-col span="2" class="info-title">
              <b>发票备注（标注到发票上面）:</b>
            </i-col>
            <i-col span="12">{{ info.invoiceRemark }}</i-col>
          </Row>
        </i-col>
      </Row>
      <Row>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <Row>
            <i-col span="2" class="info-title">
              <b>开票备注:</b>
            </i-col>
            <i-col span="12">{{ info.remark }}</i-col>
          </Row>
        </i-col>
      </Row>

      <Row>
        <i-col span="24">
          <div style="float:right">
            <Button
              type="primary"
              @click="modalAudit = true"
              v-show="show(4) && info.status === 2"
            >开票</Button>

            <Button type="primary" @click="showClaimModal" v-show="show(63)&& info.status === 3">认领</Button>

            <Button
              type="warning"
              @click="Cancel"
              v-show="(express!=null?express.status!=3:true)&&show(214) && (info.status > 2 && info.status < 5  || info.status > 6 && info.status < 10)"
            >作废</Button>
          </div>
        </i-col>
      </Row>
    </Card>

    <div style="padding:9px 0;"></div>
    <Card :bordered="false" style="margin:0.3em" v-if="actions.length > 0">
      <p slot="title">审核详情</p>
      <Row>
        <i-col
          span="24"
          v-for="item in actions.filter(function(cItem){return cItem.status==4;})"
          :key="item.id"
        >
          <div v-if="info.claimName">
            <div v-if="item.auditInfo.auditor">
              <span class="auditWord">
                <b>操作人：{{ item.auditInfo.auditor.name }}</b>
              </span>
            </div>
            <span class="auditWord">【{{ item.remark}} 】</span>
            <span>
              <b>时间 :</b>
            </span>
            <span class="auditWord">{{ item.auditInfo.auditTime }}</span>
          </div>
          <span class="auditWord">认领人：{{info.claimName}} 认领备注： {{info.remark}}</span>
        </i-col>
        <i-col
          span="24"
          v-for="item in actions.filter(function(cItem){return cItem.status!=4;})"
          :key="item.id"
        >
          <div v-if="item.auditInfo">
            <div v-if="item.auditInfo.auditor">
              <span class="auditWord">
                <b>{{ item.auditInfo.auditor.name }} :</b>
              </span>
            </div>
            <span class="auditWord">【{{ item.auditInfo.opinionStr}} 】</span>
            <span>
              <b>时间 :</b>
            </span>
            <span class="auditWord">{{ item.auditInfo.auditTime }}</span>
            <span>
              <b>备注 :</b>
            </span>
          </div>
          <span class="auditWord">{{item.auditInfo.remark}}</span>
        </i-col>
      </Row>
    </Card>
    <!-- 开票的 Modal  Begin-->
    <Modal v-model="modalAudit" width="780">
      <p slot="header" style="color:#000;text-align:center">
        <span style="font-size: 1.4em;">开票</span>
      </p>
      <div style="text-align:center">
        <table class="dataTable">
          <tr>
            <th>开票方式:</th>
            <td class="dataRow">
              <RadioGroup v-model="invoice.IsAutoFiscal">
                <Radio label="false">
                  <span>回填票号</span>
                </Radio>
                <Radio label="true" v-if="info.invoiceType == 1" :disabled="info.isProforma">
                  <span>自动开票</span>
                  <span style="color:#ed4014;margin:5px">{{info.isProforma?'【预开】':''}}</span>
                </Radio>
              </RadioGroup>
            </td>
          </tr>
          <tr v-if="invoice.IsAutoFiscal == 'false'">
            <th>票号:</th>
            <td>
              <Input
                type="textarea"
                v-model="invoice.InvoiceNumber"
                :rows="3"
                placeholder="发票号规则65499912(8位)或65499912-25"
              />
            </td>
          </tr>
          <tr v-if="info.invoiceType == 2">
            <th>票据信息</th>
            <td>
              <table class="trickTable">
                <tr>
                  <td>乘客</td>
                  <td>票号</td>
                  <td>行程单号</td>
                </tr>
                <tr v-for="item in Ticket " :key="item.ticketId">
                  <td>{{ item.name }}</td>
                  <td>{{ item.ticketId }}</td>
                  <td>
                    <Input type="text" v-model="item.invoce" placeholder/>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <br>
          </tr>
          <tr>
            <th>开票备注:</th>
            <td>
              <Input type="textarea" v-model="invoice.Remark" :rows="3" placeholder="填写备注"/>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button type="success" :loading="loading" size="large" @click="agree">
          <span v-if="!loading">同意</span>
          <span v-else>Loading...</span>
        </Button>
        <Button type="error" size="large" @click="refuse">拒绝</Button>
        <Button size="large" @click="modalExit">取消</Button>
      </div>
    </Modal>
    <!-- 开票Modal End -->
  </div>
</template>

<script>
import api from "../api/api.js";

// 组件
import invocieInfo from "@/components/ItineraryInvoice/Info";
import modalClaim from "@/components/Base/ModalClaim";

import modalCancel from "@/components/Base/ModalCancel";

// 业务单前的 '出' '改' 提示字
import invoiceCategory from "@/components/Base/TicketsCategory";

//
import rolePage from "@/common/tools/Role.js";

import { dateToStr } from "@/common/tools/DateTime.js";

export default {
  beforeCreate: function() {
    let _this = this;
    let id = this.$route.params.Id;

    _this.id = this.$route.params.Id;

    api.Invoice.getDetail(id).then(function(res) {
      let data = res.data.data;
      _this.info = data.customerInvoice;
      
      _this.info.companyCategaryStr=data.customerInvoice.invoiceType===1?data.customerInvoice.collectCompany:data.customerInvoice.companyCategaryStr;
      _this.uploadFiles = data.uploadFiles || [];
      _this.invoiceDetails = data.customerInvoiceDetails;
      _this.creator = data.creator;
      _this.actions = data.customerInvoiceActions;
      _this.express = data.expressInfo;
    });
  },
  data() {
    const _this = this;
    return {
      // 展示的列表 列
      columns: [
        { title: "利润单号", key: "ticketId" },
        {
          title: "业务单号",
          key: "issueId",
          render: (h, params) => {
            return h(invoiceCategory, {
              props: {
                data: params.row
              }
            });
          }
        },
        { title: "类型", key: "orderTypeStr" },
        { title: "姓名", key: "passengerName" },
        { title: "票号", key: "ticketNum" },
        { title: "开票金额", key: "invoiceAmount" }
      ],
      invoiceDetails: [],
      actions: [],
      info: {},
      creator: {},
      express: [],
      // 认领model
      claimModel: {},

      // 废票model
      cancelModel: {
        Mode: -1
      },

      // 开票model
      invoice: {
        Id: 0, // Model 里面
        IsOk: 0, // 接受和拒绝按钮
        Remark: "", // 填写的备注
        InvoiceNumber: "", // 填写的票号
        IsAutoFiscal: 0 // radio 标签
      },
      // 认领模态框
      modalAudit: false,
      id: 0,
      loading: false,
      uploadFiles: []
    };
  },
  methods: {
    // 废票
    Cancel() {
      this.$Modal.confirm({
        render: h => {
          return h(modalCancel, {
            props: {
              Invoice: this.info,
              cancelModel: this.cancelModel
            }
          });
        },
        okText: "作废",
        onOk: this.cancelOk,
        width: 450
      });
    },
    cancelOk() {
      let _this = this;
      let model = {
        Id: this.$route.params.Id,
        Type: this.info.invoiceType,
        Mode: parseInt(this.cancelModel.Mode),
        Remark: this.cancelModel.Remark
      };
      if (model.Mode < 0) {
        _this.$Message.error({
          content: "请选择作废方式",
          duration: 5
        });
        return;
      }
      api.Invoice.Cancel(model).then(function(res) {
        if (res.data.success) {
          _this.$Message.info({
            content: "已生成作废流程，请前往OA查看审核",
            duration: 5
          });
          _this.info.status += 2;
          _this.okCallback(model.Id);
        }
      });
    },

    // 认领模态框
    showClaimModal() {
      this.$Modal.confirm({
        render: h => {
          return h(modalClaim, {
            props: {
              Model: this.claimModel
            }
          });
        },
        okText: "确认",
        onOk: this.claim
      });
    },
    claim() {
      let _this = this;
      let model = _this.claimModel;
      model.Id = _this.$route.params.Id;
      if (!model.Claimer || model.Claimer === "") {
        _this.$Message.error({
          content: "认领人不能为空",
          duration: 5
        });
        return;
      }
      api.Invoice.Claim(model).then(function(res) {
        if (res.data.success) {
          _this.$Message.success({
            content: "认领成功",
            duration: 5
          });
          _this.info.status += 1;
          _this.okCallback(model.Id);
        }
      });
    },
    // 权限控制显示
    show(params) {
      return rolePage(params);
    },

    /**
     * 开票modal退出
     */
    modalExit() {
      this.modalAudit = false;
    },
    /**
     * 开票 同意
     */
    agree() {
      this.invoice.IsOk = true;
      this.InvoiceAudit();
    },
    /**
     * 开票 拒绝
     */
    refuse() {
      this.invoice.IsOk = false;
      this.InvoiceAudit();
    },
    InvoiceAudit() {
      let _this = this;
      _this.loading = true;
      let invoice = _this.invoice;

      invoice.Id = _this.info.id;
      invoice.IsTravelItinerary = _this.info.invoiceType === 2 ? true : false;
      // 点击拒绝不用选择开票方式

      if (invoice.IsOk) {
        if (invoice.IsAutoFiscal === 0) {
          _this.$Message.error({
            content: "提交失败，未选择开票方式",
            duration: 5
          });
          _this.loading = false;
          return;
        }
      }

      api.Invoice.AuditInvoice(invoice)
        .then(function(res) {
          debugger;
          let msg = res.data.success
            ? "操作成功"
            : "操作失败:" + res.data.message;

          _this.$Message.success({
            content: msg,
            duration: 5
          });

          if(res.data.success){
            _this.loading = false;
            _this.modalAudit = false;
            _this.info.status += 1;
            _this.okCallback(invoice.Id);
          }else{
            _this.loading = false;
            return;
          }
        })
        .catch(function(res) {
          _this.$Message.success({
            content: msg,
            duration: 5
          });
          _this.loading = false;
        });
    },
    okCallback(id) {
      let _this = this;
      api.Invoice.getDetail(id).then(function(res) {
        if (res.data.success) {
          let data = res.data.data;
          _this.info = data.customerInvoice;
        }
      });
    },
    getExpress(id) {
      this.$router.push({
        name: "ExpressDetail",
        params: { Id: id }
      });
    }
  },
  components: {
    InvocieInfo: invocieInfo
  },
  computed: {
    pageRole() {
      return this.$store.state.app.pageRole;
    },
    sumAccountDue() {
      const _this = this;
      let sum = 0;
      _this.invoiceDetails.map(x => {
        sum += x.invoiceAmount;
      });
      return sum.toFixed(2);
    }
  },
  filters: {
    dataFormat: function(val) {
      if (!val) {
        return "";
      }
      let data = dateToStr(val, "yyyy-MM-dd hh:mm:ss");
      return data;
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-card {
  padding: 3.3em, auto;
}

.dataTable {
  width: 740px;
}
.dataRow {
  padding: 25px 0;
}

.trickTable {
  padding-top: 0px;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 680px;
}
.trickTable td {
  border: 1px solid #ddd;
  // border-radius:25px;
  padding: 5px;
}
.info-title b {
  float: right;
  border: 0px solid red;
  padding-right: 6px;
  padding-bottom: 9px;
}
table,
th,
td {
  border-collapse: collapse;
}
.auditWord {
  padding-right: 8px;
}
</style>
