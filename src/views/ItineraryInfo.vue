<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>行程单详情</BreadcrumbItem>
    </Breadcrumb>
    <!--  出票单基本信息  -->
    <div style="padding:9px 0;"></div>
    <InvocieInfo :data="info"></InvocieInfo>
    <div style="padding:9px 0;"></div>
    <!-- 原票据信息·-->

    <Card :bordered="false" style="margin:0.3em" v-if="invoiceInvalidDetails.length !== 0">
      <p slot="title">已作废信息</p>
      <Table stripe :columns="invalidColumns" :data="invoiceInvalidDetails"></Table>
    </Card>

    <!-- 票据信息 -->
    <Card :bordered="false" style="margin:0.3em">
      <p slot="title">票据信息</p>
      <Table
        stripe
        :columns="columns"
        :data="invoiceDetails"
        @on-select="selectItem"
        @on-select-cancel="cancelItem"
        @on-select-all="selectItemAll"
        @on-selection-change="cancelSelectAll"
      ></Table>
    </Card>
    <!-- 票据信息 END -->
    <div style="padding:9px 0;"></div>
    <!-- 开票信息-->
    <Card style="margin:0.3em">
      <p slot="title">开票信息</p>
      <Row></Row>
      <Row>
        <Col :xs="12" :sm="12" :md="8" :lg="8">
          <Row>
            <Col span="6" class="info-title">
              <b>收款单位:</b>
            </Col>
            <Col span="12">{{ info.companyCategaryStr }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressTypeStr!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>快递形式:</b>
            </Col>
            <Col span="12">{{ info.expressTypeStr }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>快递方式:</b>
            </Col>
            <Col span="12">{{ express.expressWayStr }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>物品类型:</b>
            </Col>
            <Col span="12">{{ express.stdmodeStr }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>收件人:</b>
            </Col>
            <Col span="12">{{ express.receiver }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>收件人电话:</b>
            </Col>
            <Col span="12">{{ express.receiverPhone }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>收件人地址:</b>
            </Col>
            <Col span="12">{{ express.prov+express.city+express.country+express.address }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件人:</b>
            </Col>
            <Col span="12">{{ express.sender }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件人电话:</b>
            </Col>
            <Col span="12">{{ express.senderPhone }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>预估运费:</b>
            </Col>
            <Col span="12">{{ express.expectedFee }}</Col>
          </Row>
        </Col>
        <Col :xs="12" :sm="12" :md="8" :lg="8" v-if="info.expressType===1&&express!=null">
          <Row>
            <Col span="6" class="info-title">
              <b>寄件备注:</b>
            </Col>
            <Col span="12">{{ express.remark }}</Col>
          </Row>
        </Col>

        <Col
          :xs="12"
          :sm="12"
          :md="8"
          :lg="8"
          v-if="(info.expressType===4||info.expressType===1)&&express!=null"
        >
          <Row>
            <Col span="6" class="info-title">
              <b>快递编号:</b>
            </Col>
            <Col span="12">
              <a @click="getExpress(express.id)">{{express.id}}</a>
            </Col>
          </Row>
        </Col>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
          <Row>
            <Col span="2" class="info-title">
              <b>备注:</b>
            </Col>
            <Col span="12">{{ info.remark }}</Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <div style="float:right">
            <Button type="primary" @click="modalAudit = true" v-if="show(4) && info.status === 2">开票</Button>
            <Button
              type="warning"
              @click="Cancel"
              v-if="(express!=null?express.status!=3:true)&&show(214) && (info.status ==3  || info.status == 4)&&invoiceDetails.length>0"
            >作废/换开</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <i-col span="24">
          <div style="float:right">
            <!--有权限或自己可以取消-->
            <Button
              type="primary"
              v-if="(show(4) ||  $store.state.app.userInfo.id ==info.creator.id )  && info.status === 10"
              @click="rqCancel(info.id)"
              :disabled="disCancelState"
            >取消</Button>
          </div>
        </i-col>
      </Row>
    </Card>
    <!-- 开票信息 END -->
    <Card :bordered="false" style="margin:0.3em" v-if="actions.length > 0">
      <p slot="title">审核详情</p>
      <Row>
        <Col span="24" v-for="item in actions" :key="item.id">
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
          <span class="auditWord">{{item.remark}}</span>
        </Col>
      </Row>
    </Card>
    <!-- 开票 Modal  Begin-->
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
                <Radio label="true" v-if="info.invoiceType == 1">
                  <span>自动开票</span>
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
                placeholder="单号规则6549991210或6549991210-25,空行程单规则0000000000(10位)或0000000000-01,多行程单号请用英文逗号 , 分割"
                @on-change="changeInvoiceNumber"
              />
              <br />
              <p style="color:red" v-show="agreeRules.show">* {{ agreeRules.msg }}</p>
            </td>
          </tr>
          <tr v-if="info.invoiceType == 2" rows>
            <th>票据信息:</th>
            <td>
              <table class="trickTable">
                <tr>
                  <td>乘客</td>
                  <td>票号</td>
                  <td>行程单号</td>
                </tr>
                <tr v-for="item in tickets " :key="item.ticketId">
                  <td>{{ item.name }}</td>
                  <td>{{ item.ticketId }}</td>
                  <td>
                    <Input type="text" v-model="item.invoice" placeholder />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <th>开票备注:</th>
            <td>
              <Input type="textarea" v-model="invoice.Remark" :rows="3" placeholder="填写备注" />
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="agree" :disabled="disagreeState">同意</Button>
        <Button type="error" size="large" @click="refuse">拒绝</Button>
        <Button size="large" @click="modalExit">取消</Button>
      </div>
    </Modal>
    <!-- 开票Modal End -->
  </div>
</template>
<script>
// 组件
import invocieInfo from "@/components/ItineraryInvoice/Info";
import modalCancel from "@/components/Base/ModalCancel";

// Api
import api from "@/api/api.js";

// 权限控制显示
import rolePage from "@/common/tools/Role.js";

import Category from "@/components/Base/TicketsCategory";
/**
 * 获得行程单数组
 *
 */
function getTripNums(nums, length) {
  let tripNums = [];
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    const args = element.split("-");
    if (args.length === 2) {
      if (args[0].length < 10 || args[0].length > 10) {
        return { msg: "票号格式不正确", success: false };
      }

      let header = args[0].substring(0, args[0].length - args[1].length);
      let upper = parseInt(header.concat(args[1]));
      let lower = parseInt(args[0]);

      // 混入了非数字
      if (isNaN(upper) || isNaN(lower)) {
        return { msg: "票号格式不正确,请输入10位纯数字", success: false };
      }
      // 超出了数组本身的长度
      if (upper - lower > length) {
        return { msg: "输入的单据数量超过了行程单本身数量", success: false };
      }

      for (let i = lower; i <= upper; i++) {
        if (i < 1000) {
          tripNums.push(padLeft("0", args[0].toString().length));
        } else {
          tripNums.push(padLeft(i, args[0].toString().length));
        }
      }
      // for end
    } else if (args.length === 1 && args[0].length === 10) {
      if (parseInt(element) < 1000) {
        tripNums.push(padLeft("0", element.toString().length));
      } else {
        tripNums.push(element);
      }
    } else {
      // return {'msg': '票号长度不正确' , 'success': false};
    }
  }

  return { success: true, data: tripNums };
}
function padLeft(num, n) {
  let len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

export default {
  created() {
    this.initData();
  },

  data: () => ({
    disagreeState: true,
    disCancelState: false,
    agreeRules: {
      show: false,
      msg: ""
    },
    actions: [],
    columns: [
      {
        type: "selection",
        width: 32,
        align: "center"
      },
      {
        title: "业务单号",
        key: "issueId",
        render: (h, params) => {
          return h(Category, {
            props: {
              data: params.row
            }
          });
        }
      },
      { title: "类型", key: "orderTypeStr" },
      { title: "乘客姓名", key: "passengerName" },
      { title: "行程单号", key: "eticketNumber" },
      { title: "票面价", key: "pmprice" },
      { title: "税", key: "tax" },
      { title: "开票总额", key: "invoiceAmount" },
      { title: "票号", key: "ticketNum" }
    ],
    invalidColumns: [
      {
        title: "业务单号",
        key: "issueId",
        render: (h, params) => {
          return h(Category, {
            props: {
              data: params.row
            }
          });
        }
      },
      { title: "类型", key: "orderTypeStr" },
      { title: "乘客姓名", key: "passengerName" },
      { title: "行程单号", key: "eticketNumber" },
      { title: "票面价", key: "pmprice" },
      { title: "税", key: "tax" },
      { title: "开票金额", key: "invoiceAmount" },
      { title: "票号", key: "ticketNum" }
    ],
    info: {
      creator: {
        id: 0
      }
    },
    objData: { TicketNums: [] },
    express: {},
    cancelModel: {
      Mode: 0
    },
    invoiceDetails: [],
    invoiceInvalidDetails: [],
    selectDataStore: [],
    tickets: [],
    // 开票model
    invoice: {
      Id: 0, // Model 里面
      IsOk: 0, // 接受和拒绝按钮
      Remark: "", // 填写的备注
      InvoiceNumber: "", // 填写的票号
      IsAutoFiscal: 0 // radio 标签
    },
    // 认领模态框
    modalAudit: false
  }),
  components: {
    InvocieInfo: invocieInfo
  },
  methods: {
    initData() {
      let _this = this;
      let id = this.$route.params.Id;
      api.Invoice.getDetail(id).then(function(res) {
        let data = res.data.data;
        _this.info = data.customerInvoice;
        _this.actions = data.customerInvoiceActions;
        _this.express = data.expressInfo;

        if (_this.info.objIdList) {
          let list = _this.info.objIdList;

          _this.invoiceDetails = data.customerInvoiceDetails.filter(
            x => list.indexOf(x.id) === -1
          );

          _this.invoiceInvalidDetails = data.customerInvoiceDetails.filter(
            x => list.indexOf(x.id) >= 0
          );
        } else {
          _this.invoiceDetails = data.customerInvoiceDetails.filter(
            x => x.status < 2
          );
        }

        _this.invoiceDetails.map(x => {
          _this.tickets.push({
            name: x.passengerName,
            ticketId: x.ticketNum
          });
        });
      });
    },
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
        Remark: this.cancelModel.Remark,
        Number: this.selectDataStore
      };

      if (model.Mode === 0) {
        _this.$Message.error({
          content: "未选择作废方式",
          duration: 5
        });
        return;
      }

      if (model.Number.length === 0) {
        _this.$Message.error({
          content: "未选择作废单",
          duration: 5
        });
        return;
      }
      api.Invoice.Cancel(model).then(function(res) {
        if (res.data.success) {
          _this.$Message.success({
            content: "已生成作废流程，请前往OA查看审核",
            duration: 5
          });
          _this.info.status += 2;
          _this.okCallback(model.Id);
        }
      });
    },
    show(params) {
      return rolePage(params);
    },
    changeInvoiceNumber(event) {
      //
      let _this = this;
      let number = this.invoice.InvoiceNumber;
      if (number.length < 10) {
        _this.disagreeState = true;
        return false;
      }
      _this.agreeRules = {
        show: false,
        msg: ""
      };

      let tripNums = [];

      let arrays = number.split(",");

      let result = getTripNums(arrays, _this.tickets.length);

      if (!result.success) {
        // _this.$Message.error({
        //   content: result.msg,
        //   duration: 5
        // });
        _this.disagreeState = true;

        _this.agreeRules.show = true;
        _this.agreeRules.msg = result.msg;
        return false;
      } else {
        tripNums = result.data;
        let isTrue = true;
        // 检测长度格式
        for (let i = 0; i < tripNums.length; i++) {
          const element = tripNums[i].toString();
          if (element.length > 10) {
            // _this.$Message.error({
            //   content: '行程单号的长度不符,应为10位数',
            //   duration: 5
            // });
            isTrue = false;
            _this.disagreeState = true;
            _this.agreeRules.show = true;
            _this.agreeRules.msg = "行程单号的长度不符,应为10位数";
            break;
          }
        }
        // 检测数量
        if (tripNums.length > _this.tickets.length) {
          _this.$Message.error({
            content: "输入的票号数量超过了票号总数",
            duration: 5
          });
          isTrue = false;
        } else {
          if (isTrue) {
            _this.tickets.forEach((element, index) => {
              // invoce
              element.invoice = tripNums[index];
            });
          }
          _this.disagreeState = false;
        }
      }
    },
    GetTripNums() {},
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
      let invoice = _this.invoice;

      invoice.Id = _this.info.id;
      invoice.IsTravelItinerary = _this.info.invoiceType === 2 ? true : false;
      if (invoice.IsOk) {
        if (invoice.IsAutoFiscal === 0) {
          _this.$Message.error({
            content: "提交失败，未选择开票方式",
            duration: 5
          });
          return;
        }
      }

      api.Invoice.AuditInvoice(invoice).then(function(res) {
        if (res.data.success) {
          let msg = "";
          if (_this.invoice.IsOk) {
            msg = "开票成功";
          } else {
            msg = "拒绝成功";
          }

          _this.$Message.success({
            content: msg,
            duration: 5
          });

          _this.info.status += 1;
          _this.modalAudit = false;
          _this.okCallback(invoice.Id);
        }
      });
    },
    selectItem(selection, row) {
      this.selectDataStore.push(row.id);
    },
    cancelItem(selection, row) {
      this.selectDataStore.splice(
        this.selectDataStore.findIndex(x => x === row.id),
        1
      );
    },
    selectItemAll(selection) {
      for (let i = 0; i < selection.length; i++) {
        this.selectDataStore.push(selection[i].id);
      }
    },
    cancelSelectAll(selection) {
      if (!selection.length) {
        this.selectDataStore = [];
      }
    },
    okCallback(id) {
      let _this = this;

      api.Invoice.getDetail(id).then(function(res) {
        if (res.data.success) {
          // let data = res.data.data;
          // _this.info = data.customerInvoice;
          let data = res.data.data;
          _this.info = data.customerInvoice;
          _this.actions = data.customerInvoiceActions;

          if (_this.info.objIdList) {
            let list = _this.info.objIdList;

            _this.invoiceDetails = data.customerInvoiceDetails.filter(
              x => list.indexOf(x.id) === -1
            );

            _this.invoiceInvalidDetails = data.customerInvoiceDetails.filter(
              x => list.indexOf(x.id) >= 0
            );
          } else {
            _this.invoiceDetails = data.customerInvoiceDetails.filter(
              x => x.status < 2
            );
          }

          _this.invoiceDetails.map(x => {
            _this.tickets.push({
              name: x.passengerName,
              ticketId: x.ticketNum
            });
          });
        }
      });
    },
    getExpress(id) {
      this.$router.push({
        name: "ExpressDetail",
        params: { Id: id }
      });
    },

    // 取消回填行程单号
    rqCancel(id) {
      let _this = this;
      _this.disCancelState = false;
      this.$Modal.confirm({
        title: "信息提示",
        content: "<p>确定取消回填行程单号吗？</p>",
        onOk: () => {
          api.Express.TerminalPrint(id).then(res => {
            debugger;
            let msg = "";
            if (res.data.success) {
              msg = res.data.message;
              _this.disCancelState = false;
              _this.initData();
            } else {
              msg = res.data.message;
              _this.disCancelState = true;
            }
            _this.$Message.success({
              content: msg,
              duration: 5
            });
          });
        }
      });
    }
  },
  computed: {
    pageRole() {
      return this.$store.state.app.pageRole;
    }
  }
};
</script>
<style lang="less" scoped>
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
table,
th,
td {
  border-collapse: collapse;
}
</style>
