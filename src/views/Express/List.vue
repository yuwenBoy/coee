<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>快递管理</BreadcrumbItem>
      <BreadcrumbItem>快递列表</BreadcrumbItem>
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
            <FormItem label="快递编号" style="width: 84%;">
              <Input type="text" v-model="ParamsValidate.ExpressIds" placeholder="快递编号" />
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
            <FormItem label="创建人" style="width: 84%;">
              <Input type="text" v-model="ParamsValidate.CreatorName" placeholder="请输入创建人" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="12" :lg="8">
            <FormItem label="创建时间" style="width: 84%;">
              <DatePicker
                type="date"
                :clearable="true"
                @on-change="datatime=$event"
                v-model="ParamsValidate.CreationTimeStart"
                placement="bottom-end"
                placeholder="选择创建时间"
                style="width: 48%"
              ></DatePicker>--
              <DatePicker
                type="date"
                :clearable="true"
                @on-change="datatime=$event"
                v-model="ParamsValidate.CreationTimeEnd"
                placement="bottom-end"
                placeholder="选择创建时间"
                style="width: 48%"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="快递状态" style="width: 84%;">
              <i-select v-model="ParamsValidate.ExpressStatus">
                <Option
                  v-for="item in enums.ExpressStatus"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </i-select>
            </FormItem>
          </Col>
          <Col :md="12" :lg="8">
            <FormItem label="运单号码" style="width: 84%;">
              <Input type="text" v-model="ParamsValidate.TrackingNumber" placeholder="运单号码" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="12" :lg="8">
            <FormItem label="快递方式" style="width: 84%;">
              <i-select v-model="ParamsValidate.ExpressWay">
                <Option
                  v-for="item in enums.ExpressWay"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </i-select>
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
        <Table
          :data="listData"
          :columns="listColumns"
          stripe
          ref="table"
          :loading="tableLoading"
          :highlight-row="true"
          @on-selection-change="selectTable"
        ></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page
              :total="ParamsValidate.PageInfo.Total"
              @on-change="getList"
              @on-page-size-change="getList"
              :current.sync="ParamsValidate.PageInfo.PageIndex"
              show-elevator
              :page-size="ParamsValidate.PageInfo.PageSize"
              :page-size-opts="[1,10,20,50]"
              show-total
              show-sizer
              ref="tablePage"
            ></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal v-model="showModel" title="物流追踪" :closable="true" :mask-closable="false" width="900">
      <div slot="footer"></div>
      <Timeline v-if="Traces.length>0">
        <TimelineItem v-for="(data,index) in Traces" :key="index">
          <p class="time">{{data.UploadTime}}</p>
          <p class="content">{{data.ProcessInfo}}</p>
        </TimelineItem>
      </Timeline>
    </Modal>
  </div>
</template>
<script>
import api from "@/api/api.js";
import CommonApi from "@/api/common.js";
// 权限控制显示
import rolePage from "@/common/tools/Role.js";
export default {
  beforeCreate: function() {
    let _this = this;
    CommonApi.Common.getAll({
      keys: "ExpressWay;ExpressStatus;"
    }).then(function(res) {
      _this.enums = res.data.data;
    });
  },
  data() {
    return {
      ParamsValidate: {
        CreationTimeStart: this.defaultTime(),
        CreationTimeEnd: new Date(),
        PageInfo: {}
      },
      ruleValidate: {},
      listColumns: [
        {
          title: "揽收",
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "快递编号",
          width: 100,
          key: "id",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
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
                      this.SelectId(params.row);
                    }
                  }
                },
                params.row.id
              )
            ]);
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
          title: "快递方式",
          width: 100,
          align: "center",
          key: "expressWayStr"
        },
        {
          title: "运单号",
          width: 300,
          align: "center",
          render: (h, params) => {
            if (params.row.expressWay == 5) {
              return h("div", [
                h(
                  "a",
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
                        this.Track(params.row.trackingNumber);
                      }
                    }
                  },
                  params.row.trackingNumber
                )
              ]);
            } else {
              return h("div", params.row.trackingNumber);
            }
          }
        },
        {
          title: "状态",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              params.row.status === 2
                ? params.row.minStatus < 3
                  ? "未打印"
                  : params.row.statusStr
                : params.row.statusStr
            );
          }
        },
        {
          title: "运费",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.expectedFee);
          }
        },
        {
          title: "创建人",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.creator.name);
          }
        },
        {
          title: "创建时间",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.creationTimeDateStr);
          }
        },
        {
          title: "部门",
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", params.row.creator.orgName);
          }
        }
        // {
        //   title: "所属公司",
        //   width: 200,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", "");
        //   }
        // }
      ],
      listData: [],
      tableLoading: false,
      InvoiceIds: [],
      selectLoading: false,
      customerList: [],
      enums: {},
      tableHeight: 400,
      ExpressInfos: [],
      showModel: false,
      Traces: []
    };
  },
  methods: {
    show(params) {
      return rolePage(params);
    },
    defaultTime() {
      let dt = new Date();
      dt.setDate(dt.getDate() - 60);
      return dt;
    },
    SearchInvoices() {
      this.ParamsValidate.PageInfo.PageIndex = 1;
      this.getList();
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
    getList() {
      let _this = this;
      _this.ExpressInfos.length = 0;
      _this.tableLoading = true;
      this.ParamsValidate.PageInfo.PageSize = this.$refs.tablePage.currentPageSize;
      api.Express.List(this.ParamsValidate).then(res => {
        if (res.data.success) {
          _this.listData = res.data.data.listData.map(i => {
            if (i.status != 3) {
              i._disabled = true;
            }
            return i;
          });
          _this.ParamsValidate.PageInfo.Total = res.data.data.totalRecorder;
          _this.listData.forEach(items => {
            items.checkBox = false;
          });
        } else {
          _this.listData = [];
        }
        _this.tableLoading = false;
      });
    },
    selectTable(selection) {
      this.ExpressInfos = selection;
    },
    BatchNoPackage() {
      let _this = this;
      if (this.ExpressInfos.length > 0) {
        let expressLists = this.ExpressInfos.filter(i => i.status != 3);
        if (expressLists.length > 0)
          this.$Message.warning("请确认所选数据的状态是否为待揽收!");
        else {
          let ids = this.ExpressInfos.map(i => {
            return i.id;
          });
          api.Express.BatchPackage({ ids: ids }).then(res => {
            if (res.data.success) {
              if (res.data.data) {
                _this.getList();
                this.$Message.success("揽收成功!");
              } else {
                this.$Message.error("揽收失败");
              }
            } else {
              this.$Message.error(res.data.message);
            }
          });
        }
      } else {
        this.$Message.warning("请选择需要揽收的信息!");
      }
    },
    SelectId(params) {
      this.$router.push({
        name: "ExpressDetail",
        params: { Id: params.id }
      });
    },
    Track(trackingNumber) {
      let _this = this;
      api.Express.RqYTTract(trackingNumber).then(res => {
        if (res.data.Success) {
          _this.Traces = res.data.Data.Result.WaybillProcessInfo;
          if (_this.Traces.length > 0) {
            _this.showModel = true;
          } else {
            _this.$Message.warning("暂时没有快递信息");
          }
        } else {
          _this.$Message.warning("该单号暂无物流进展！");
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>