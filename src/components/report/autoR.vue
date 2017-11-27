<template>
    <div class="right_">
           <div id="themeSet" class="tab-pane active">
                <div class="xftup">
                    报告类别：
                    <!-- <el-select v-model="heads.type"  @change="doAjax()" placeholder="请选择">
                        <el-option  value="">全部 </el-option>
                        <el-option value="1"> 日报</el-option>//value冲突
                        <el-option value="2"> 周报</el-option>
                    </el-select>-->
                       <select v-model="heads.type"  @change="doAjax()">
                        <option  value="">全部</option>
                        <option value="1">日报</option>
                        <option value="2">周报</option>
                        </select>

                        报告时间：
                        <select v-model="heads.date_range"  @change="doAjax()">
                        <option value="">全部</option>
                        <option value="6days">一周内</option>
                        <option value="1month">一月内</option>
                        <option value="3month">三月内</option>
                        <option value="6month">半年内</option>
                        <option value="1year">一年内</option>
                        <option value="-1year">一年外</option>
                        </select>

                 <!--      <span >
                     <router-link :to="{name:'newR'}">创建报告</router-link>
                        </span> -->
                </div>
                <div class="set_table">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>选择</th><th>报告名称</th><th>报告类别</th><th>创建时间</th><th>状态</th><th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in tableData3 "  :key="item.id" >
                                    <td><input type="checkbox" v-model="checkitem" :value="{id:item.id, status:-2,st:item.send_status}"/></td>
                                    <td>
                                      <a @click="myhtml(item)" v-if="item.send_status!=3">{{item.name}}</a>
                                      <a href="javascript:void(0)" v-else>{{item.name}}</a>
                                    </td>
                                    <td>{{item.type==1?"日报":'周报'}}</td>
                                    <td>{{item.created | tolocal}}</td>
                                    <td ><span :style="item.send_status==3?'color:#ff0000':''">{{item.send_status==0?"未生成":item.send_status==1?"未发送":item.send_status==2?"已发送":item.send_status==3?"主题状态不正常":"异常"}}</span></td>
                                    <td>

                                        <span v-show="item.send_status == 0">
                                          <!-- <a class="btn btn-sm" @click="tohtml(item.file_path.pdf)">预览</a> -->
                                          <a class="btn btn-sm" @click="cannotsee(item)">生成报告</a>
                                          <a class="btn btn-sm"  @click="handleDelete(item.id,item.status)">删除</a>
                                        </span>
                                        <span v-show="item.send_status == 1">
                                          <!-- 已生成 -->
                                              <a class="btn btn-sm"  @click="tohtml(item.file_path.pdf)">预览</a>
                                              <a class="btn btn-sm" @click="toemail(item.id,item)" >发送邮件</a>
                                              <a class="btn btn-sm" @click="toword(item.file_path.doc)">导出word</a>
                                              <a class="btn btn-sm" @click="topdf(item.file_path.pdf)">导出pdf</a>
                                              <a class="btn btn-sm"  @click="handleDelete(item.id,item.status)">删除</a>
                                        </span>
                                        <span v-show="item.send_status == 2">
                                              <!-- <a class="btn btn-sm disabled">报告生成中</a> -->
                                              <a class="btn btn-sm"  @click="tohtml(item.file_path.pdf)">预览</a>
                                              <a class="btn btn-sm" @click="toemail(item.id,item)" >发送邮件</a>
                                              <a class="btn btn-sm" @click="toword(item.file_path.doc)">导出word</a>
                                              <a class="btn btn-sm" @click="topdf(item.file_path.pdf)">导出pdf</a>
                                              <a class="btn btn-sm"  @click="handleDelete(item.id,item.status)">删除</a>
                                        </span>
                                        <span v-show="item.send_status == 3">
                                              <!-- <a class="btn btn-sm  disabled red" >主题已经被删除或冻结</a> -->
                                              <!-- <a class="btn btn-sm"  @click="tohtml(item.file_path.pdf)">预览</a>
                                              <a class="btn btn-sm" @click="toemail(item.id)" >发送邮件</a>
                                              <a class="btn btn-sm" @click="toword(item.file_path.doc)">导出word</a>
                                              <a class="btn btn-sm" @click="toword(item.file_path.pdf)">导出pdf</a> -->
                                              <a class="btn btn-sm"  @click="handleDelete(item.id,item.status)">删除</a>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot v-show="this.pagetotal>0">
                                <td colspan="3"><input type="checkbox" name=""  @click="reportAll"  v-model='reportchecked' />全选

                                    <button class="btn btn-sm"  @click="toemail()" v-show="this.checkitem.length>0">发邮件</button>
                                    <button class="btn btn-sm disabled"  v-show="this.checkitem.length<=0">发邮件</button>
                                    <button class="btn btn-sm"  @click="handleDeleteall()" v-show="this.checkitem.length>0">删除</button>
                                    <button class="btn btn-sm disabled"  v-show="this.checkitem.length<=0">删除</button>
                                </td>
                                <td colspan="3">
                                    <div v-show = "this.pagetotal>0">
                                        <el-pagination
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page="currentPage"
                                            :page-sizes="[10, 20, 50]"
                                            :page-size="heads.limit"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="pagetotal">
                                        </el-pagination>
                                    </div>
                                </td>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!--邮件模态矿工-->
            <div class="modal fade bs-example-modal-lg" tabindex="-1"  id="emailModel">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                    <form class="form-horizontal">
                        <div class="form-group groupmbox" >
                            <label col-sm-2 for="receive" class="col-sm-2 control-label">收件人</label>
                            <div class="col-sm-10">

                                    <!-- <div class="mpeoplediv">
                                        <div v-for="item in mpeople">
                                            <span>{{item.name}}</span>
                                            <i class="glyphicon glyphicon-remove" title="删除"  @click="mdel(item)"></i>
                                        </div>

                                    </div>
                                    <div class="mbox">
                                        <input type="text"    v-model="inputValue2" placeholder="可键入收件人邮箱地址"
                                                    ref="saveTagInput2" @focus="mfocus"
                                                    @keyup.13="handleInputConfirm2"
                                                    @blur="handleInputConfirm2"/>
                                        <div id="mailbox" v-show="mmp"    @mouseover="mfocus"  @mouseout="mblur"   >
                                            <div v-for="item in people"  @click="peoplepush(item)" @mouseover="mouseover($event)"  class="pp_i">
                                                <span>{{item.name}}</span>
                                                <span style="    color: #b9b7b7;">{{item.email}}</span>
                                            </div>
                                        </div>
                                    </div> -->
                                </div>


                                        <label><input type="checkbox" value="" name="receive" v-model="allreceive"  @click="checkedAll($event)"/>全部</label>
                                            <label v-for="item in p"  :key="item.id">
                                                <input type="checkbox" :value="item.email" v-model="set.receive"/> {{item.name}}
                                            </label>
                                      <div style="display:inline-block">
                                          <input
                                          type="email" name = 'email' v-validate="'email'"
                                            class="input-new-tag"
                                            v-if="inputVisible"
                                            v-model="inputValue"
                                            ref="saveTagInput"
                                            size="mini"
                                            @keyup.13="handleInputConfirm"
                                            @blur="handleInputConfirm">
                                        </input>
                                        <button v-else class="btn btn-xft btn-sm btn-sky" size="small" @click="showInput">+ 新增收件人</button>
                                          <span class="red" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                                      </div>
                        </div>

                        <div class="form-group">
                            <label for="emailtheme" class="col-sm-2 control-label">主题</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="emailtheme" placeholder="" v-model="set.subject">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="emailtheme" class="col-sm-2 control-label">内容</label>
                            <div class="col-sm-10">
                                <textarea class="form-control" rows="3" v-model="set.message"></textarea>
                            </div>
                        </div>

                        </form>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info  btn-sm" @click="tosend">发送</button>
                            <button type="button" class="btn btn-default  btn-sm" data-dismiss="modal">取消</button>
                    </div>
                    </div>

                </div>
            </div>

            <!--长图预览-->
            <div class="modal fade bs-example-modal-lg reportmodal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">监测{{modelword.title}}</h4>
                    </div>
                    <div class="modal-body">
                        <h4>一、数据总览</h4>
                        <div>
                            <p v-for="item in modelword.data_screen"  :key="item.id">{{item}}</p>
                        </div>
                        <h4>二、传播分析</h4>
                        <h5>1、舆情走势</h5>
                        <p>{{modelword.media_distr.media_distr}}</p>
                          <div id="yuqing" style="width: 500px;height:300px;    margin: 0 auto;"   v-loading="loading2"></div>
                         <h5>2、活跃媒体</h5>
                        <p>{{modelword.web}}</p>
                          <div id="hotmedia" style="width: 500px;height:300px;    margin: 0 auto;"  v-loading="loading2"></div>
                        <h5>3、媒体分布</h5>
                        <p>{{modelword.media_total.media_total}}</p>
                          <div id="mediaarea" style="width: 500px;height:300px;    margin: 0 auto;"  v-loading="loading2"></div>
                         <h5>4、发布热区</h5>
                         <p>{{modelword.hotspot.hotspot}}</p>
                         <br/>
                          <div id="hotarea" style="width: 400px;height:400px;    margin: 0 auto;"  v-loading="loading2"></div>
                           <ul class="myul">
                               <li>
                                   <dl>
                                       <dt>地域</dt>
                                       <dd v-for="(item,index) in modelword.hotspot.title"  :key="item.id">{{item}}</dd>
                                   </dl>
                               </li>
                               <li>
                                 <dl>
                                   <dt>占比</dt>

                                   <dd v-for="(item,index) in modelword.hotspot.total" :key="item.id">
                                      <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                        :style='"width:"+ (item*100)/hotspotmax+"%;"'>
                                        </div>
                                      </div>
                                   </dd>
                                 </dl>
                               </li>
                                <li>
                                   <dl>
                                       <dt>数量</dt>
                                       <dd v-for="(item,index) in modelword.hotspot.total" :key="item.id">{{item}}</dd>
                                   </dl>
                               </li>
                           </ul>

                            <!-- <table>
                              <th><td>地域</td><td>占比</td><td>数量</td></th>
                             <tbody>
                                <tr v-for="(item,index) in myabc">
                                  <td>{{item.title}} </td>
                                  <td style="width:200px;">
                                      <div class="progress">
                                        <div class="progress-bar" role="progressbar"
                                        :style='"width:"+ (item.total*100)/hotspotmax+"%;"'>
                                        </div>
                                      </div>
                                  </td>
                                  <td>{{item.total}}</td>
                                </tr>
                              </tbody>
                          </table> -->



                        <h4>三、内容分析</h4>


                         <h5>1、情感属性</h5>
                                <p>{{modelword.side_percent.side_percent}}        </p>
                            <div id="side_percent" style="width: 500px;height:300px;"  v-loading="loading2"></div>
                         <h5>2、情感走势</h5>
                                <p>{{modelword.side_analysis.side_analysis}}        </p>
                            <div id="side_analysis" style="width: 500px;height:300px;"  v-loading="loading2"></div>

                        <h5>3、敏感信息 top10</h5>
                            <table class="table table-hover ">
                                <thead>
                                    <tr>
                                        <td>序号</td><td>媒体</td><td>标题</td><td>发布时间</td><td>相似文章</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in modelpic.sensitive"  :key="item.id">
                                        <td>{{index+1}}</td><td>{{item.site_name}}</td><td>{{item.title}}</td><td>{{item.snatch_time|tolocal}}</td><td>{{item.sim_count}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        <h5>4、负面信息 top10</h5>
                            <table  class="table table-hover ">
                                <thead>
                                    <tr>
                                        <td>序号</td><td>媒体</td><td>标题</td><td>发布时间</td><td>相似文章</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in modelpic.bad_info"  :key="item.id">
                                        <td>{{index+1}}</td><td>{{item.site_name}}</td><td>{{item.title}}</td><td>{{item.snatch_time|tolocal}}</td><td>{{item.sim_count}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default btn-sm" data-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-info  btn-sm">确定</button>
                    </div>
                    </div>
                </div>
                </div>
    </div>
</template>
<script>
let bootbox = require("bootbox");
let NProgress = require("NProgress");
import { getCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
      inputValue: "",
      inputVisible: false,
      myabc: [],
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      loading2: false,
      modelword: {
        data_screen: [],
        media_total: {
          media_total: ""
        },
        media_distr: {
          media_distr: ""
        },
        hotspot: {
          hotspot: ""
        },
        side_percent: {
          side_percent: ""
        },
        side_analysis: {
          side_analysis: ""
        },
        image_source: {
          media_total:
            "/home/www/h2data/application/cache/report/image/26/media_total.png",
          media_distr:
            "/home/www/h2data/application/cache/report/image/26/media_distr.png",
          hotspot:
            "/home/www/h2data/application/cache/report/image/26/hotspot.png",
          weixin:
            "/home/www/h2data/application/cache/report/image/26/weixin.png",
          web: "/home/www/h2data/application/cache/report/image/26/web.png",
          weibo: "/home/www/h2data/application/cache/report/image/26/weibo.png",
          side_analysis:
            "/home/www/h2data/application/cache/report/image/26/side_analysis.png",
          side_percent:
            "/home/www/h2data/application/cache/report/image/26/side_percent.png",
          image_path: "/home/www/h2data/application/cache/report/image/26/"
        },
        title: "日报报告",
        bad_info: [],
        sensitive: [],
        type: "day"
      },
      modelpic: {},

      mpeople: [],
      inputVisible2: false,
      inputValue2: "",
      mmp: false,
      checkitem: [],
      reportchecked: false,
      allreceive: "",
      reportids: "",
      isabled: false,
      isfalse: false,
      myurl: "",
      myname: "",
      pagetotal: "",
      pageCount: "",
      pageSize: "10",
      heads: {
        token: getCookie("user"),
        type: "",
        date_range: "",
        offset: "0",
        limit: "10"
      },
      head: {
        name: ""
      },
      tableData3: [],
      people: [],
      p: [],
      idd: "",
      set: {
        token: getCookie("user"),
        receive: [],
        subject: "",
        message: "注意查收",
        id: []
      }
    };
  },
  computed: {
    hotspotmax: function() {
      return Math.max.apply(null, this.modelword.hotspot.total);
    }
  },
  watch: {
    "p":{
      handler: function(val, oldVal) {
        if (this.set.receive.length === this.p.length) {
          this.allreceive = true;
        } else {
          this.allreceive = false;
        }
      },
      deep: true
    },
    "set.receive": {
      handler: function(val, oldVal) {
        if (this.set.receive.length === this.p.length) {
          this.allreceive = true;
        } else {
          this.allreceive = false;
        }
      },
      deep: true
    },
    checkitem: {
      handler: function(val, oldVal) {
        if (this.checkitem.length === this.tableData3.length) {
          this.reportchecked = true;
        } else {
          this.reportchecked = false;
        }
      },
      deep: true
    }
  },
  methods: {
    handleInputConfirm() {
      let inputValue = $.trim(this.inputValue);
      if (inputValue && this.errors.items.length == 0) {
        this.p.push({
          name: inputValue,
          email: inputValue
        });

        this.inputVisible = false;
        this.inputValue = "";
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    drowLineOrBarView(d, ele, item) {
      var option = {
        seriesTypes: [],
        title: "",
        legend: [],
        //dataZoom:[{type: 'slider',show: true,xAxisIndex: [0],start: 1,end: 15}],
        axisDirec: "x",
        imgname: "趋势图",
        axis: d.title,
        seriesData: []
      };
      var obj = d.total;
      for (var na in d.total) {
        option.legend.push(na);
        option.seriesTypes.push("line");
        option.seriesData.push({ name: na, value: obj[na] });
      }
      $(ele).echartsSetDataForLineBar(option);
    },
    drowRingPieView(d, ele, item) {
      typeof item == "string" ? (item = JSON.parse(item)) : "";
      var option = {
        title: "",
        seriesRadius: ["30%", "50%"],
        legend: d.title,
        seriesname: item.name,
        imgname: "媒体分布图",
        seriesData: []
      };
      d.title.map(function(it, idx) {
        option.seriesData.push({ name: it, value: d.total[idx] });
      });
      $(ele).echartsSetDataForPie(option);
    },
    drowMapView(d, ele) {
      var option = {
        title: "地域分布",
        visualMapMin: 0,
        visualMapMax: 100,
        imgname: "发布热区",
        series: [
          {
            seriesMapName: "地域分布",
            seriesMapType: "china",
            seriesLabel: false,
            seriesMapData: []
          }
        ]
      };
      var arr = [];
      d.title.map(function(it, id) {
        arr.push({ name: it, value: d.total[id] });
      });
      option.visualMapMax = arr.sort(function(a, b) {
        return b.value - a.value;
      })[0].value;
      option.series[0].seriesMapData = arr;
      $(ele).echartsSetDataForMap(option);
    },
    drowBarView(d, ele, direc) {
      var option = {
        seriesTypes: [],
        title: "",
        legend: d.title,
        axisDirec: direc,
        imgname: "活跃媒体",
        axis: [],
        stack: "sum",
        seriesData: []
      };
      for (var na in d.total) {
        option.axis.push(na);
      }
      var ld = option.legend;
      for (var i = 0; i < ld.length; i++) {
        option.seriesTypes.push("bar");
        option.seriesData.push({ name: ld[i], value: [] });
        for (var na in d.total) {
          option.seriesData[i].value.push(d.total[na][i]);
        }
      }
      $(ele).echartsSetDataForLineBar(option);
    },
    myhtml(i) {
      this.loading2 = true;
      //  NProgress.start();
      // $(".loading-container").removeClass("loading-inactive");
      // /client/report/report_html
      // console.log(i)

      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/report/report_html",
        data: {
          id: i.id,
          report_setting_id: i.report_setting_id,
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          console.log(res);
          // NProgress.done();
          // $(".loading-container").addClass("loading-inactive");
          // console.log(JSON.stringify(res.data.data));
          // console.log(JSON.stringify(res.data.template));
          if (res.code == 1) {
            $("#myModal").modal("show");
            t.modelword = res.data.data;

            t.modelpic = res.data.template;
            t.drowLineOrBarView(t.modelpic.media_total, "#yuqing");
            t.drowRingPieView(
              t.modelpic.media_distr,
              "#mediaarea",
              t.modelpic.media_distr.title
            );
            t.setrank(t.modelpic.web, "#hotmedia");
            t.drowLineOrBarView(t.modelpic.side_analysis, "#side_analysis");
            t.drowRingPieView(
              t.modelpic.side_percent,
              "#side_percent",
              t.modelpic.side_percent.title
            );
            t.drowMapView(t.modelpic.hotspot, "#hotarea");

            var n1 = t.modelword.hotspot.title.length,
              n2 = t.modelword.hotspot.total.length;
            var i = 0,
              abc = [],
              hotspottitle = t.modelword.hotspot.title,
              hotspottotal = t.modelword.hotspot.total;
            for (; i < n1; i++) {
              var obj = {};
              obj.title = hotspottitle[i];
              obj.total = hotspottotal[i];
              abc.push(obj);
            }
            console.log(abc);
            t.myabc = abc.sort(function(a, b) {
              return b.total - a.total;
            });

            //  $('#myModal').modal('show')
          } else {
            t.$message.error(res.msg);
            // $("#myModal").modal("hide");
          }
        },
        error: function() {
          // NProgress.done();
          // $(".loading-container").addClass("loading-inactive");
          t.$message.error("系统繁忙，请稍后...");
        }
      });
    },
    cannotsee(i) {
      var url = "/client/report/report_view",
        t = this;
      this.$message({ message: "报告生成中，请稍后", type: "warning" });
      t.enter(
        url,
        {
          params: {
            id: i.id,
            report_setting_id: i.report_setting_id,
            token: getCookie("user")
          }
        },
        function(res) {
          res.code == 1
            ? t.doAjax()
            : t.$message({ message: res.msg, type: "warning" });
        }
      );
    },
    setrank(d, ele) {
      d = d.sort(function(a, b) {
        return a.total - b.total;
      });
      var a = [],
        b = [];
      d.map(function(it) {
        a.push(it.title);
        b.push(it.total);
      });
      var option = {
        seriesTypes: ["bar"],
        title: "",
        legend: "数量",
        axisDirec: "x",
        axis: a,
        imgname: "活跃媒体",
        grid: {
          top: 20,
          bottom: 20
        },
        seriesData: [{ name: "数量", value: b }]
      };
      $(ele).echartsSetDataForLineBar(option);
    },
    handleSizeChange(val) {
      this.heads.limit = val;
      // console.log(`每页 ${val} 条`);
      this.doAjax();
    },
    handleCurrentChange(val) {
      this.$nextTick(function() {
        this.currentPage = val;
        this.heads.offset = this.heads.limit * (val - 1);
        // console.log( '当前'+val)
        // console.log(this.heads)
        this.doAjax();
      });
    },
    peoplepush(it) {
      // console.log(it)
      this.mpeople.push(it);
      this.people.splice(this.people.indexOf(it), 1);
    },
    mouseover(e) {
      e.preventDefault();
      // console.log(e)
    },
    showInput2() {
      this.inputVisible2 = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.focus();
      });
    },
    handleInputConfirm2() {
      let inputValue = this.inputValue2;
      if (inputValue) {
        this.mpeople.push({ email: inputValue, name: inputValue });
      }
      this.inputVisible2 = false;
      this.inputValue2 = "";
    },
    mfocus() {
      if (this.people.length == 0) {
        this.mmp = false;
      } else {
        this.mmp = true;
      }
    },
    mblur() {
      this.mmp = false;
    },
    mdel(it) {
      // console.log(this.mpeople)
      this.$nextTick(function() {
        this.mpeople.splice(this.mpeople.indexOf(it), 1);
        this.people.push(it);
      });
      //   console.log(this.mpeople)
    },
    reportAll() {
      var _this = this;
      if (this.reportchecked == false) {
        //实现反选
        _this.checkitem = [];
      } else {
        //实现全选
        _this.checkitem = [];
        _this.tableData3.forEach(function(item) {
          _this.checkitem.push({
            id: item.id,
            status: -2,
            st: item.send_status
          });
        });
      }
    },
    checkedAll() {
      var _this = this;
      if (this.allreceive == false) {
        //实现反选
        _this.set.receive = [];
      } else {
        //实现全选
        _this.set.receive = [];
        _this.p.forEach(function(item) {
          _this.set.receive.push(item.email);
        });
      }
    },
    changePageSize() {
      this.heads.offset = 1;
      // this.artlistChange();
      this.doAjax();
    },
    toload(ids, types) {
      //  NProgress.start();
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/report/upload",
        data: {
          id: ids,
          type: types,
          token: getCookie("user")
        },
        dataType: "json",
        success: function(res) {
          //  NProgress.done();
          // debugger
          if (res.code == "-5") {
            // 文件不存在
            t.$message(res.msg);
          } else if (res.code == 0) {
            t.myurl = res.data;
            let xft = t.myurl.lastIndexOf("/");
            t.myname = t.myurl.substring(xft + 1, 100);
            // console.log(t.myname)
            // alert(res.msg)
          }
          // console.log(res)
        },
        error: function() {
          //  NProgress.done();
          // alert("INTERNET ERROR")
        }
      });
    },
    topdf(url) {
      var t = this;
      bootbox.confirm({
        message: "是否下载pdf？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-sky"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            var a = document.createElement("a");
            var myurl = t.dataurl + url;
            var filename = "download.pdf";
            a.href = myurl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          } else {
          }
        }
      });
      // var isSure = confirm("是否下载pdf");
      // if (isSure) {
      //   var a = document.createElement("a");
      //   var url = this.dataurl + url;
      //   var filename = "download.pdf";
      //   a.href = url;
      //   a.download = filename;
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      // } else {
      // }
    },
    toword(url) {
      var t = this;
      bootbox.confirm({
        message: "是否下载word？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-sky"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            var a = document.createElement("a");

            var myurl = t.dataurl + url;
            var filename = "download.doc";
            a.href = myurl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            // document.getElementById('result').innerHTML = "You downLoad OK!"
          } else {
          }
        }
      });
    },
    tohtml(url) {
      // this.toload(ids,"html")

      var a = document.createElement("a");
      var myurl = this.dataurl + url;
      var filename = "download.pdf";
      a.href = myurl;
      a.target = "_blank";
      $(a).addClass("media");
      a.click();
      $(".media").show();
    },
    toemail(ids, item) {
      // this.mpeople = this.p;

      $("#emailModel").modal("show");
      // 拿到报告的i
      var t = this;
      if (ids) {
        this.set.id = [ids];
        this.set.subject = item.name;
      } else {
        // 判断一下状态完成煤油
        let mid = [];
        this.checkitem.forEach(function(item) {
          if (item.st == 1) {
            mid.push(item.id);
          }
        });
        this.set.id = mid;
        this.set.subject = "批量发送周报和日报";
      }
    },
    tosend() {
      //  NProgress.start();
      var t = this;
      var abc = [];
      // this.mpeople.forEach(function(item) {
      //   abc.push(item.email);
      // });
      // this.set.receive = abc;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/report/send_email",
        data: this.set,
        dataType: "json",
        success: function(res) {
          //  NProgress.done();
          //    console.log(res)
          if (res.code == "1") {
            t.$message("发送成功！");
            $("#emailModel").modal("hide");
          } else {
            t.$message("发送失败！");
          }
        },
        error: function() {
          //  NProgress.done();
          t.$message("系统繁忙，请稍后！");
        }
      });
    },
    doAjax() {
      //  NProgress.start();
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/report/get_report_lists",
        data: this.heads,
        dataType: "json",
        success: function(res) {
          // NProgress.done();
          // console.log(res)
          if (res.code == "-1") {
            // -1没有数据
            t.tableData3 = [];
            t.pagetotal = 0;
          } else {
            t.pagetotal = res.data.total;
            t.tableData3 = res.data.data;
          }
        },
        error: function() {
          // NProgress.done();
          // alert("INTERNET ERROR!")
        }
      });
    },
    handleDeleteall() {
      let checkids = [];
      this.checkitem.forEach(function(item) {
        checkids.push({
          id: item.id,
          status: "-2"
        });
      });
      var t = this;
      bootbox.confirm({
        message: "您确定要删除吗？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-sky"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            $.ajax({
              type: "post",
              url: t.dataurl + "/client/report/update_report_status",
              data: {
                data: checkids,
                token: getCookie("user")
              },
              dataType: "json",
              success: function(res) {
                // console.log(res)
                if (res.code == 1) {
                  t.doAjax();
                  t.$message("删除成功！");
                } else {
                  t.$message("删除失败！");
                }
              },
              error: function() {
                // alert("INTERNET ERROR")
              }
            });
          }
        }
      });
    },
    handleDelete(ids, st) {
      var t = this;
      bootbox.confirm({
        message: "您确定要删除吗？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-sky"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            $.ajax({
              type: "post",
              url: t.dataurl + "/client/report/update_report_status",
              data: {
                data: [{ id: ids, status: "-2" }],
                token: getCookie("user")
              },
              dataType: "json",
              success: function(res) {
                // console.log(res)
                if (res.code == 1) {
                  t.doAjax();
                  t.$message("删除成功！");
                } else {
                  t.$message("删除失败！");
                }
              },
              error: function() {
                // alert("INTERNET ERROR")
              }
            });
          }
        }
      });
    },
    tonew() {
      var t = this;
      setInterval(function() {
        // NProgress.start();
        //  t.doAjax();
        // NProgress.done();
        // console.log("s")
      }, 5000);
    }
  },
  update() {},
  created() {
    this.doAjax();
    NProgress.start();
    var t = this;
    $.ajax({
      type: "post",
      url: this.dataurl + "/admin/user",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        t.p = res.data;
      },
      error: function() {}
    });
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>报告</li> <li class="active"> 自动报告</li>';
    $("#Crumbs").html(html);
    NProgress.done();
    // $('.media').media({width:800, height:600});
  }
};
</script>
<style scoped>
#hotarea {
  display: inline-block;
}
#mediaarea,
#hotarea,
#yuqing,
#side_analysis,
#side_percent {
  margin: 0 auto !important;
}
#hotarea {
  left: 200px;
}
ul.myul {
  padding: 10px;
  width: 260px;
  margin: 0;
  /* display: inline-block; */
  height: 290px;
  overflow: auto;
  margin-bottom: 30px;
  float: right;
  position: relative;
  top: 105px;
  right: 0px;
}
ul.myul > li {
  display: inline-block;
  width: 75px;
  text-align: center;
}
.right_ {
  width: 100%;
}
i {
  cursor: pointer;
}
table {
  border-collapse: collapse;
}
.reportmodal .modal-body{
  height: 600px;
  overflow-x: hidden;
}
#mailbox {
  position: relative;
  left: 0px;
  top: 0px;
  background-color: white;
  z-index: 3;
  padding: 0px 0;
  width: 250px;
  overflow-x: none;
  overflow-y: auto;
  height: 200px;
}
.mbox {
  /* position:absolute;*/
}
.mbox input {
  outline: none;
  background-color: white;
  border: none;
  height: 45px;
  margin-left: 10px;
  padding-left: 10px;
  border-radius: 20px;
}
.pp_i {
  padding: 5px 10px;
  margin: 5px;
  width: 162px;
  /* height: 35px; */
  line-height: 35px;
  border: 1px solid gainsboro;
  border-radius: 7px;
}
.pp_i span {
  display: block;
  width: 100px;
  height: 17px;
  line-height: 17px;
  font-size: 14px;
}
.mpeoplediv > div {
  font-size: 14px;
  z-index: 3;
  float: left;
  /* background-color: #cecece; */
  margin: 3px;
  padding: 5px 12px;
  border-radius: 7px;
  /* box-shadow: 1px 1px 1px #cecece; */
  border: 1px solid lightsteelblue;
}
.groupmbox {
}
.button-new-tag,
.input-new-tag {
  /* background-color: transparent; */
  /* border: none; */
  outline: none;
}
dd {
  height: 18px;
  margin: 5px 0 15px 0;
}
.progress {
  margin-bottom: 0;
}
</style>
