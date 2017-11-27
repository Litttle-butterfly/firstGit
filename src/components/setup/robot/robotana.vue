<template>
<div class="robtbox">
  <div class="row">
    <div class="col-xs-12 col-md-12">
        <div class="well with-header">
          <div class="header">
            <h3><i class="ifa ifa-fang-b"></i>{{artname}}--观点分析</h3>
            <el-date-picker
              v-model="mtime"
              type="daterange"
              format="yyyy/MM/dd"
              @change="changeDate"
              align="right"
              placeholder="选择日期范围"
              :picker-options="pickerOptions2">
            </el-date-picker>
            <select class="select-robot" @change="changeType" v-model="artid">
              <option v-for="it in robtlist" v-if='it.train_status==1&&it.find_count!=0' :value="it.id" >{{it.name}}</option>
            </select>
          </div>
        </div>
        <div id="timeline" class="view-timeline"></div>
    </div>
  </div>
  <div class="row">
      <div class="col-xs-12 col-md-12">
          <div class="well with-header">
              <div class="header">
                    <div class="ptitle xftdei "><i class="ifa ifa-media-b"></i><label class="myh4">媒体分布</label><span></span>
                  <!-- <label class="pstitle"></label> -->
                </div>
              </div>
              <div id="mediapie" class="row" v-loading="loading"></div>
          </div>
      </div>
  </div>
  <div class="row">
      <div class="col-xs-12 col-md-12" style="margin-bottom:15px;">
        <div class="well with-header">
            <div class="header">
                  <div class="ptitle xftdei"><i class="ifa ifa-media-b"></i><label class="myh4">详情分析</label><span></span>
                <!-- <label class="pstitle"></label> -->
              </div>
            </div>
            <div>
              <div class="view-chart-65">
                <table v-for="it in classifa" class="table table1">
                  <thead>
                    <tr>
                      <td><h5><i class="ifa ifa-up-b"></i>{{it.name}}({{it.count}}条)</h5></td>
                      <td>
                        <div class="progress">
                           <div v-for="(m,idx) in it.child_count" class="progress-bar" :class="bglt[idx]" :style='"width:"+m.total' ></div>
                        </div>
                        <label>{{it.total}}</label>
                    </td>
                    </tr>
                   </thead>
                   <tbody>
                    <tr v-for="(i,ix) in it.child_count">
                      <td>
                        <a @click="anchor(i.id+'&'+ix)">{{i.title}}</a>
                        <!-- <router-link :to="{name:'rdetail',query:{id:i.id,pid:artid,pname:artname,name:i.title}}">{{i.title}}</router-link> -->
                      </td>
                      <td>
                        <div class="progress"><div class="progress-bar" :class="bglt[ix]" :style='"width:"+i.total' ></div></div>
                        <label>{{i.total}}</label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="view-chart-25">
                <table v-for="it in progress" class="table">
                  <thead>
                    <tr>
                      <td>
                        <div :id='"psimp_"+it.id' :data-target="it.name" class="view-simple parentView"></div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(i,ix) in it.child_count">
                      <td>
                        <div :id='"simple_"+it.id+"_"+ix' :data-target="i.title" class="view-simple"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="view-chart-5">
                <table v-for="it in progress" class="table table1">
                  <thead>
                    <tr>
                      <td>
                        <label>{{it.total}}</label>
                    </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(i,ix) in it.child_count">
                      <td>
                        <!-- <i v-if="i.total.indexOf('-')==-1" class="ifa ifa-top-r"></i> -->
                        <label>{{i.total}}</label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
  </div>
  <div class="row">
    <div class="col-xs-12 col-md-12">
        <div class="well with-header">
            <div class="header">
              <div class="ptitle xftdei "><i class="ifa ifa-media-b"></i><label class="myh4">观点词云</label><span></span>
                <!-- <label class="pstitle"></label> -->
              </div>
            </div>
            <div id="mediacloud" class="row" v-loading="loading"></div>
        </div>
    </div>
  </div>
  <div class="row">
    <div class="col-xs-12 col-md-12">
        <div class="well with-header well-nopading">
            <div class="header">
              <div class="ptitle xftdei ">
                <i class="ifa ifa-media-b"></i>
                <label class="myh4">观点文章</label>
                <label class="pagedetail">共{{pageCount}}篇文章</label>
              </div>
            </div>
            <div class="widget robotart" v-loading="loading">
                <div class="widget-header bordered-bottom text-align-left" style="background-color:#f3f3f3">
                  <label><input type="checkbox" v-model="sh.checked" @click="checkedAll"/></label>
                  <a :class="idlist.all==idwords?'active':''" @click="changeWid('')">全部文章</a>
                  <div class="robotbtn" v-for="(it,idx) in idlist.dt">
                    <a :class="it.ids==idwords?'active':''" @click="changeWid([idx])">{{it.name}}</a>
                    <a v-for="(i,idi) in it.det" :class="(i.id+'&'+idi)==idwords?'active':''" @click="changeWid(i.id+'&'+idx)">{{i.name}}</a>
                  </div>
                </div><!--Widget Header-->
                <div class="art_total" v-loading="loading1">
                  <ul>
                    <li v-for="it in artlist">
                      <div class="widget-body art_list">
                        <h5>
                          <input type="checkbox" name="" v-model="sh.batch" :value="it.uuid" />
                          <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                          :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple"
                          data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title=""
                           :data-content="it.is_focus" >{{it.site_name}}</a>
                          <label>
                            <a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a>
                          </label>
                        </h5>
                        <p class="art_p_content" v-html="it.txt">{{it.txt}}</p>
                        <p class="art_p_detail grey">
                          <span>发布时间：{{it.pubdate}} </span><span> 阅读数:{{it.view}}</span>  <!--   维度：{{it.dimension}}  -->
                          <span>权重:{{it.weight}}&nbsp;</span>
                          <span v-if="sh.mediaType==6" >粉丝数:{{it.followers_count}}条</span>
                          <span v-if="sh.mediaType==6" >点赞数:{{it.attitudes_count}}条</span>
                          <span>属性:</span><span @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type})" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
                          <router-link v-if="it.sim_count!=0" :to="{name:'similar',query:{id:it.sim_id,type:1}}">相似文章:{{it.sim_count}}</router-link>
                        </p>
                        <p class="art_p_edit">
                          <!-- <i class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" ></i> 更改 -->
                          <i @click="follow({uuid:it.uuid,article_date:it.created,type:'3',side:it.side,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" :data-unid="it.is_collect" ></i><!-- 收藏 -->
                          <i @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})" data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" ></i><!-- 导出 -->
                          <i @click="getWarnType({uid:it.uuid,url:it.site_url,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o ifa-b" ></i> <!-- 发送预警 -->
                          <i @click="artDel({uuid:it.uuid,sdate:it.created,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" ></i><!-- 删除 -->
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div class="artfooter" v-show="this.artlist.length !=0">
                    <div  v-show="this.pageCount>0">
                        <el-pagination
                             style="float:right"
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page="currentPage"
                             :page-sizes="[5,10, 20, 50, 100]"
                             :page-size="pageSize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="pageCount">
                         </el-pagination>
                     </div>
                    <label><input type="checkbox" name="" v-model="sh.checked" @click="checkedAll" />全选</label>
                    <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allChange">修改<i class="fa fa-eraser right"></i></a>
                    <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allWarn">预警<i class="glyphicon glyphicon-warning-sign right"></i></a>
                    <a class="btn btn-info" @click="exportshow(1)">导出<i class="glyphicon glyphicon-download right"></i></a>
                    <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allCollect">收藏<i class="glyphicon glyphicon-heart right"></i></a>
                    <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allArtdel">删除<i class="glyphicon glyphicon-trash right"></i></a>
                  </div>
                </div><!--Widget Body-->
            </div>
        </div>
    </div>
  </div>
  <div id="detailModel" class="modal" tabindex="-1" role="dialog">
     <div class="modal-dialog" role="document">
         <div class="modal-content">
           <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
               <h4 class="modal-title"></h4>
           </div>
             <div class="modal-body">
               <div id="vChart" class="view-big-chart"></div>
             </div>
         </div>
     </div>
  </div>
  <div id="warnModel" class="modal fade" tabindex="-1" role="dialog">
     <div class="modal-dialog" role="document">
         <div class="modal-content">
             <div class="modal-header">
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                 <h4 class="modal-title">发送预警</h4>
             </div>
             <div class="modal-body">
                 <div class="row">
                   <div class="form-group">
                       <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">预警方案</label>
                       <div class="col-sm-10">
                           <select class="form-control" v-model="sh.wprogramme" @change="changewtitle($event)" >
                             <option v-for="it in wprogramme" :value="it.id">{{it.name}}</option>
                          </select>
                       </div>
                   </div>
                   <div class="form-group">
                       <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">预警级别</label>
                       <div class="col-sm-10">
                           <select class="form-control"  v-model="sh.sendWLevel"><option value='1'>常规预警</option><option value='2'>重要预警</option><option value="3">非常重要</option></select>
                       </div>
                   </div>
                   <div class="form-group">
                       <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">收件人</label>
                       <div class="col-sm-10">
                         <div class="userbox">
                             <label v-for="it in userlist"><input v-model="sh.receive" :value="it.email" type="checkbox" name="receive" />{{it.name}}</label>
                         </div>
                         <input type="text" v-model="sh.newuser" /><a @click="adduser" ><i class="glyphicon glyphicon-plus"></i></a>
                       </div>
                   </div>
                   <div class="form-group">
                       <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">主题</label>
                       <div class="col-sm-10">
                           <input v-model="sh.sendWTitle" class="form-control" type="text" :value="sh.sendWTitle" />
                       </div>
                   </div>
                   <div class="form-group">
                       <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">正文</label>
                       <div class="col-sm-10">
                           <textarea v-model="sh.sendWArticle" class="form-control" rows="6"></textarea>
                       </div>
                   </div>
                 </div>
             </div>
             <div class="modal-footer">
                 <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                 <button type="button" class="btn btn-info" @click="sendWarning">提交</button>
             </div>
         </div><!-- /.modal-content -->
     </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
  <div id="exportModel" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">导出文章</h4>
            </div>
            <div class="modal-body">
                 <div class="form-group">

                  <div class="col-sm-10">
                        <input type="text" class="form-control" v-model="sh.exportname" />
                  </div>
                  <div class="col-sm-2">
                         <select class="dowtype" v-model="sh.exporttype"><option value="2" >WORD</option><option value="3" >PDF</option><option value="1" >EXCEL</option></select>
                  </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-info" v-if="sh.exportall==0" @click="artExport">导出</button>
                <button type="button" class="btn btn-info" v-else @click="allExport">导出</button>
            </div>
        </div>
    </div>
  </div>
  <div id="snapModal" class="modal fade bs-example-modal-lg snapmodal in" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" v-html="snap.title">{{snap.title}}</h4>
                <a :href="snap.url" target="_blank">查看原文</a>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-sm-7">
                  <table class="table table-hover">
                      <tr>
                        <td>来源：<span>{{snap.website_name}}</span></td><td>发布时间：<span>{{snap.pubdate}}</span></td><td>评论数：<span>{{snap.reply}}</span></td>
                      </tr>
                      <tr>
                        <td>作者：<span>{{snap.media_type==6?'@'+snap.author:snap.author}}</span></td><td>权重：<span>{{snap.weight}}</span></td><td>阅读数：<span>{{snap.view}}</span></td>
                      </tr>
                  </table>
                </div>
                <div class="col-sm-5">
                  <table class="table table-hover text-align-center" style="border-left:1px solid #e7e7e7">
                      <tr>
                        <td><span @click="scrollP" class="art-similar">相似文章数：{{snap.sim_count}}</span></td>
                        <td><i data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" @click="exportshow(0,{uuid:snap.uuid,medtype:snap.media_type,name:snap.title})"></i><span>导出</span></td>
                        <td><i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDel({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},$event)"></i><span>删除</span></td>
                      </tr>
                      <tr>
                        <td>文章属性：<span @click="changeSide({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},1,snap)" :class="snap.side==1?'neutral':snap.side==3?'positive':snap.side==-3?'opposite':'opposite'">{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>
                        <td><i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="modalfollow({uuid:snap.uuid,article_date:snap.created,type:'3',side:snap.side,media_type:snap.media_type},$event)" :data-unid="snap.is_collect" ></i><span>收藏</span></td>
                        <td v-if="snap.is_warning==0"><i data-toggle="tooltip" data-placement="bottom" title="预警" :class="snap.is_warning==0?'ifa ifa-clock-o ifa-b':'ifa ifa-clock-s ifa-b'" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i><span>预警</span></td>
                        <td v-else><i  data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-s ifa-b"></i><span>预警</span></td>
                      </tr>
                  </table>
                </div>
              </div>
              <div class="snapsblist">
                <p v-html="snap.txt">{{snap.txt}}</p>
              </div>
            </div>
        </div>
    </div>
 </div>
</div>
</template>
<script>
import { getCookie } from "../../../static/js/globle.js";
import { Redate } from "../../../static/js/globle.js";
import "../../../static/js/globle.js";
let echarts = require("echarts");
let bootbox = require("bootbox");
export default {
  data() {
    return {
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      wid:0,
      artid: 0,
      artname: "",
      pchange: 0,
      samearticle: "",
      totalarticle: "",
      classifa: "",
      idlist:'',
      mtime:[new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() - 6),
        new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
      ],
      drange: '',
      loading:false,
      loading1:false,
      totalDrange: [],
      progress: [],
      simpdata: [],
      simpsource: [],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      bglt: [
        "pro-lt-1","pro-lt-2","pro-lt-3","pro-lt-4","pro-lt-5","pro-lt-6",
        "pro-dk-1","pro-dk-2","pro-dk-3","pro-dk-4","pro-dk-5","pro-dk-6"
      ],
      bgdk: [
        "pro-dk-1","pro-dk-2","pro-dk-3","pro-dk-4","pro-dk-5","pro-dk-6",
        "pro-lt-1","pro-lt-2","pro-lt-3","pro-lt-4","pro-lt-5","pro-lt-6",
      ],
      artlist:[],
      robtlist:[],
      pageCount: "",
      offset: 0,
      currentPage: 1,
      pageSize: 20,
      snap:{
        name:'傻逼文章快照'
      },
      idwords:'',
      sh: {
        words:'',
        batch: [],
        checked: "",
        userlist: [],
        sendWLevel: "1",
        sendWArticle: "",
        sendWTitle: "",
        receive: [],
        wprogramme: "",
        newuser: "",
        sendType: "email",
        sendUuid: "",
        exportobj: "",
        exportname: "",
        exporttype: "1",
        exportall: "0"
      },
    }
  },
  created() {
    getCookie("user") == "" ? this.$router.replace({ name: "/app" }) : "";
    var t=this;
    this.artid = this.$route.query.id;
    this.artname = this.$route.query.name;
    this.wid = this.$route.query.wid;
    this.drange=new Date(this.mtime[0]).Format('yyyy/MM/dd')+'-'+new Date(this.mtime[1]).Format('yyyy/MM/dd')
    this.enter('/client/explore/get_opinion_lists',{params:{}},function(d){
      t.robtlist = d.data;
    })
  },
  watch: {
    progress: function() {
      var t = this;
      this.$nextTick(function() {
        $(".view-simple").on("click", t.getsimpData);
      });
    },
    simpsource: function() {
      var t = this;
      this.$nextTick(function() {
        t.simpsource.map(function(item) {
          var obj = {
              name: item.name,
              value: item.total[item.name],
              axis: item.title
            },
            id = "#psimp_" + item.id;
          t.drowSimpleLineOrBarView(obj, id);
          var k = 0,d = item.child_count;
          for (var it in d.total) {
            var obj = { name: it, value: d.total[it], axis: d.title },
              id = "#simple_"+item.id+"_"+ k;
            t.drowSimpleLineOrBarView(obj, id);
            k++;
          }
        });
      });
    },
    artlist:function(){
      var t=this;
      this.$nextTick(function(){
        $('[data-toggle="tooltip"]').tooltip()
        var popovers = $("[data-toggle=popover]");
        $.each(popovers,
        function() {
          $(this).popover({
            html: !0,
            template: '<div class="popover pop ' + $(this).data("class") + '"><div class="arrow"><\/div><h3 class="popover-title ' + $(this).data("titleclass") + '">Popover right<\/h3><div class="popover-content"><\/div><\/div>'
          })
        }).on('shown.bs.popover',function(e){
            var isf=$(e.target).attr('data-content');
            isf==0?$('.popover-content').html('<a class="focusSite" data-target="'+isf+'">关注</a>'):$('.popover-content').html('<a  class="focusSite" data-target="'+isf+'">取消关注</a>')
            $('.focusSite').on('click',{sitename:$(this).text(),medtype:$(this).attr('data-value'),$ht:$(e.target)},function(e){
              var isf=$(this).attr('data-target'),url='',d={},$t=e.data.$ht;
              isf==0?(url="/client/api/media_collect",d={params:{website_name:e.data.sitename,media_type:e.data.medtype}}):(url='/client/api/media_uncollect',d={params:{id:isf,media_type:e.data.medtype,}});
              t.enter(url,d,function(d){
                d.code==1?t.listajax():''
                // isf==0?(d.code==1?$t.addClass('imp-red'):$t.removeClass('imp-red'),$t.attr('data-content',d.data)):(d.code==1?$t.removeClass('imp-red'):$t.addClass('imp-red'),$t.attr('data-content',d.data))
                $("[data-toggle=popover]").popover('hide');
              })
            })
        });
      })
    }
  },
  mounted() {
    var t = this;
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>探索</li><li><a href="#/InitRobot">智能观点</a></li><li>观点分析</li>';
    $("#Crumbs").html(html);
    t.getChangeDate();

    var dt = "2017/08/01-" + new Date().Format('yyyy/MM/dd');
    var url = "/client/explore/get_gddata",
      t = this,
      d = {params: {gd_type: "opinion_volume",opinion_id: t.artid,date_range: dt}};
    t.enter(url, d, function(d) {
      d = d.data.count;
      t.totalDrange = d.title;
      t.drowLineRelationView(d, "#timeline");
    });
  },
  methods: {
    changeDate(val) {
      this.drange = val;
      this.getChangeDate();
    },
    changeType(val){
      var t=this;
      // t.loading=true;
      this.robtlist.map(function(item){
        if(item.id==t.artid){
          t.artid = item.id;
          t.artname = item.name;
          t.wid = item.wid;
          t.idlist='';
          t.getChangeDate();
        }
      })
    },
    getChangeDate() {
      var url = "",t = this,d={};
      this.enter('/client/explore/get_opinion_lists',{params:{}},function(d){
        t.robtlist = d.data;
      })
      url = "/client/explore/get_gddata",
      d = {params: {gd_type: "opinion_volume",opinion_id: t.artid,date_range: "2017/08/01-" + new Date().Format('yyyy/MM/dd')}};
      t.enter(url, d, function(d) {
        d = d.data.count;
        t.totalDrange = d.title;
        t.drowLineRelationView(d, "#timeline");
      });
      url = "/client/explore/get_gddata",
      d = {params: {
          gd_type: "opinion_media",
          opinion_id: t.artid,
          date_range: t.drange
        }
      };
      t.enter(url, d, function(d) {
        $("#mediapie").html('');
        var w=(100/Object.keys(d.data).length).toFixed(3)
        var html='<div class="col-sm-4" style="width:'+(w>20?w:20)+'%"><div id="pie0" data-v-56e1b4eb class="chart-view-no"></div><p class="text-align-center">整体</p></div>';
        $("#mediapie").append(html);
        t.drowRingPieView(d.data['全部'],"#pie0",true,'整体')
        var k=1;
        for(var it in d.data){
          if(it!="全部"){
            var html='<div class="col-sm-4" style="width:'+(w>20?w:20)+'%"><div id="pie'+k+'" data-v-56e1b4eb class="chart-view-no"></div><p class="text-align-center">'+it+'</p></div>';
            $("#mediapie").append(html);
            t.drowRingPieView(d.data[it],"#pie"+k,false,it)
            k++;
          }
        }
      });
      url = "/client/explore/get_gddata ",
      d = {params: {
            gd_type: "category_total",
            opinion_id: t.artid,
            date_range: t.drange
          }
      };
      t.enter(url, d, function(d) {
        d = d.data;
        t.classifa = d.category_total;
        t.progress = d.category_percent;
        t.simpsource = d.classify_percent;
        var a=[],b=[];
        d.category_total.map(function(it){
          var obj=[],idx=[];
          it.child_count.map(function(i){
            obj.push({name:i.title,id:i.id});
            b.push(i.id);idx.push(i.id);
          })
          a.push({name:it.name,det:obj,ids:idx,id:it.id})
        })
        t.idlist={all:b,dt:a}
      });
      var k=setInterval(function(){
        t.idlist!=""?function(){
          clearInterval(k);
          t.sh.words=t.idlist.all
          t.idwords=t.idlist.all
          t.getResult()
          $('#mediacloud').html('')
          var a=t.idlist.dt;
          var w=(100/a.length).toFixed(3)
          a.map(function(it){
            var id='cloud'+it.id
            var html='<div class="col-sm-4" style="width:'+w+'%"><div class="well with-header"><div class="header"><div class="ptitle xftdei "><i class="ifa ifa-media-b"></i><label class="myh4">'+it.name+'</label></div></div>';
            html+='<div id="'+id+'" data-v-56e1b4eb class="cloud-view-no"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div></div>'
            $('#mediacloud').append(html)
            url='/client/article/get_hotwords',d={params:{wid:t.wid,classes:it.ids,limit:100}}
            t.enter(url,d,function(d){
              t.wordCloud(d.data,'#'+id,it.name)
            })
          })
        }():''
      },50)
    },
    getsimpData(e) {
      var na = $(e.currentTarget).attr("data-target");
      var option = {
        seriesTypes: ["line"],
        title: "",
        legend: "",
        axisDirec: "x",
        axis: [],
        seriesData: []
      };
      if ($(e.currentTarget).hasClass("parentView")) {
        this.simpsource.map(function(item) {
          item.name == na
            ? ((option.axis = item.title),
              option.seriesData.push({ name: na, value: item.total[na] }))
            : "";
        });
      } else {
        this.simpsource.map(function(item) {
          option.axis = item.child_count.title;
          var d = item.child_count.total;
          for (var it in d) {
            it == na ? option.seriesData.push({ name: it, value: d[it] }) : "";
          }
        });
      }
      $("#detailModel").modal("show");
      $("#vChart").echartsSetDataForLineBar(option);
    },
    drowLineTimeView(d, ele) {
      var myChart = echarts.init($(ele)[0], "macarons");
      // 指定图表的配置项和数据
      var defaults = {
        grid: { height: 0 },
        tooltip: { trigger: "axis" },
        dataZoom: [
          {
            show: true,
            realtime: true,
            xAxisIndex: 0,
            startValue: "20170901",
            endValue: "20170905"
          }
        ],
        xAxis: [
          { type: "category", boundaryGap: false, show: false, data: d.title }
        ],
        yAxis: [{ name: "", show: false, type: "value" }],
        series: [
          {
            name: "",
            type: "line",
            symbol: "none",
            lineStyle: { normal: { show: false, opacity: 0 } },
            data: d.total
          }
        ]
      };
      myChart.setOption(defaults);
      //myChart.on('datazoom',this.getChangeDate)
    },
    drowLineRelationView(d, ele) {
      var myChart = echarts.init($(ele)[0], "macarons");
      // 指定图表的配置项和数据
      var defaults = {
        title: {text: "声量",show:false},
        tooltip: { trigger: "axis" },
        legend: { data: ["声量"] },
        grid: {
          top: 20,
          bottom: 20
        },
        toolbox: { show: true,right:20, feature: { saveAsImage: {} } },
        xAxis: { type: "category", boundaryGap: false, data: d.title },
        yAxis: { type: "value" },
        series: [{ name: "声量", type: "line", data: d.total }]
      };
      myChart.setOption(defaults);
      myChart.on("datazoom", this.changes);
    },
    changes(params) {
      var a = params.batch[0].startValue;
      var b = params.batch[0].endValue;
      this.drange = this.totalDrange[a] + "-" + this.totalDrange[b];
      b ? "" : (this.drange = "");
      this.getChangeDate();
    },
    drowLineOrBarView(d, ele) {
      var option = {
        seriesTypes: ["bar"],
        title: this.drange + "声量分析",
        legend: [""],
        axisDirec: "x",
        axis: d.title,
        grid: {
          top: 30,
          bottom: 20
        },
        seriesData: [{ name: "", value: d.total }]
      };
      $(ele).echartsSetDataForLineBar(option);
    },
    drowSimpleLineOrBarView(d, ele,bg) {
      var myChart = echarts.init($(ele)[0], "macarons");
      // 指定图表的配置项和数据
      var defaults = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: d.axis,
          show: false
        },
        // backgroundColor:bg,
        yAxis: { type: "value", show: false, boundaryGap: [0, "100%"] },
        grid: { top: "40" },
        series: [
          {
            name: d.name,
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            data: d.value
          }
        ]
      };
      myChart.setOption(defaults);
    },
    drowRingPieView(d, ele,tp,na) {
      var option = {
        title: na,
        seriesRadius: tp?["50%", "70%"]:["30%", "50%"],
        legend: d.title,
        legendShow: false,
        seriesname:na,
        seriesData: []
      };
      d.title.map(function(it, idx) {
        option.seriesData.push({ name: it, value: d.total[idx] });
      });
      $(ele).echartsSetDataForPie(option);
    },
    wordCloud(dt,ele,na){
      var t = this;
      var option = {
        title: {text:"热词云",show:false},
        tooltip: {show: false},
        animation:false,
        toolbox: { show: true,right:20, feature: { saveAsImage: {name:na} } },
        series: [
          {
            name: "热词云",
            type: "wordCloud",
            width: '100%',
            height: '100%',
            left: 'right',
            rotationRange: [-45, 90],
            sizeRange: [12, 25],
            textPadding:0,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
              },
              emphasis: {shadowBlur: 10,shadowColor: '#333'}
            },
            autoSize: { enable: true, minSize: 6 },
            data: []
          }
        ]
      };
      var opt=[]
      dt.map(function(item, index) {opt.push({name: item.key,value: item.count});});
      option.series[0].data = opt;
      t.loading=false;
      var myChart = echarts.init($(ele)[0]);
      myChart.setOption(option);
      // myChart.on('click',function(params){
      //   t.sh.keywords=params.name;
      // })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getResult();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = this.pageSize * (val - 1);
      this.getResult();
      // $(document).scrollTop(0)
    },
    changeWid(val){
      this.loading1=true;
      if(typeof(val)=="object"){
        this.sh.words=this.idlist.dt[val].ids
        this.idwords=this.idlist.dt[val].ids
      }else{
        this.sh.words=val==""?this.idlist.all:val.split('&')[0];
        this.idwords=val==""?this.idlist.all:val;
      }
      this.artlistChange();
    },
    anchor(val){
      this.sh.words=val==""?this.idlist.all:val.split('&')[0];
      this.idwords=val==""?this.idlist.all:val;
      $(document).scrollTop($('.robotart').offset().top-100)//-$(window).scrollTop()
      this.artlistChange();
    },
    artlistChange() {
      this.currentPage = 0;
      //this.getResult();
    },
    getResult() {
      var t=this;
      var url='/client/explore/get_uarticle_lists',d={params:{
        classes:t.sh.words,
        param:'',
        limit:t.pageSize,
        offset:t.offset,
        date_range: t.drange}}
      t.enter(url,d,function(d){
        t.loading1=false;
        d.code==1?(t.artlist=d.data.data,t.pageCount=d.data.hits):''
      })
    },
    follow(d, t) {
      var $t = this,url = "",da = {};
      $(t.target).hasClass("ifa-heart-s")
        ? ((url = "/client/api/delete_collect"),
          (da = {params: {id: $(t.target).attr("data-unid"),media_type: d.media_type}
          }))
        : ((url = "/client/api/add_collect"), (da = { params: d }));
      this.enter(url, da, function(d) {
        d.code == 1
          ? $(t.target).hasClass("ifa-heart-s")
            ? ($(t.target).removeClass("ifa-heart-s").addClass("ifa-heart-o"),
              $t.$message({
                message: "已为您取消收藏！",
                type: "success"
              }))
            : ($(t.target).removeClass("ifa-heart-o").addClass("ifa-heart-s"),
              $(t.target).attr("data-unid", d.data),
              $t.$message({
                message: "收藏成功！",
                type: "success"
              }))
          : $t.$message.error("操作失败！");
      });
    },
    modalfollow(d, t) {
      var $t = this,
        url = "",
        da = {};
      $(t.target).hasClass("ifa-heart-s")
        ? ((url = "/client/api/delete_collect"),
          (da = {params: {  id: $(t.target).attr("data-unid"),media_type: d.media_type}}))
        : ((url = "/client/api/add_collect"), (da = { params: d }));
      this.enter(url, da, function(d) {
        d.code == 1
          ? $(t.target).hasClass("ifa-heart-s")
            ? ($(t.target).removeClass("ifa-heart-s").addClass("ifa-heart-o"),
              $t.$message({
                message: "已为您取消收藏！",
                type: "success"
              }))
            : ($(t.target).removeClass("ifa-heart-o").addClass("ifa-heart-s"),
              $(t.target).attr("data-unid", d.data),
              $t.$message({
                message: "收藏成功！",
                type: "success"
              }))
          : $t.$message.error("操作失败！");
          $t.getResult()
      });
    },
    exportshow(v, obj) {
      var t = this;
      this.sh.exportall = v;
      v == 0
        ? ((this.sh.exportobj = obj),
          (this.sh.exportname = obj.name),
          $("#exportModel").modal("show"))
        : (function() {
            if (t.sh.batch.length == 0) {
              bootbox.confirm({
                message: "您将导出全部文章",
                size: "small",
                buttons: {
                  confirm: {
                    label: "确定",
                    className: "btn-info"
                  },
                  cancel: {
                    label: "取消",
                    className: "btn-default"
                  }
                },
                callback: function(result) {
                  if (result) {
                    t.sh.exportname = "全部文章导出";
                    $("#exportModel").modal("show");
                  }
                }
              });
            } else {
              t.sh.exportname = "批量文章导出";
              $("#exportModel").modal("show");
            }
          })();
    },
    artExport(uid, med) {
      var t = this,
        url = "/client/api/exporting",
        d = {
          params: {
            uuid: t.sh.exportobj.uuid,
            type: t.sh.exporttype
          }
        };
      t.enter(url, d, function(d) {
        $("#exportModel").modal("hide");
        d.code == 1
          ? (function() {
              var a = document.createElement("a");
              var url = t.dataurl + d.data;
              var filename = t.sh.exportname;
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            })()
          : d.code == 2
            ? t.openMsg("请到设置我到导出下载文档！", "warning")
            : t.$message.error("导出失败！");
      });
    },
    adduser() {
      var t = this;
      this.sh.newuser != ""
        ? (function() {
            var html =
              '<label><input value="' +
              t.sh.newuser +
              '" type="checkbox" name="receive" />' +
              t.sh.newuser +
              "</label>";
            t.sh.receive.push(t.sh.newuser);
            $(".userbox").append(html);
            t.sh.newuser = "";
          })()
        : "";
    },
    changewtitle($e) {
      var tp = this.sh.wprogramme,
        t = this;
      this.sendtitle = $($e.target).find("option:selected").text();
      this.wprogramme.map(function(item,index){
        console.log(item)
          if(tp == item.id){
            t.sh.sendWTitle =item.name
          }
      })
      t.users == undefined ? (t.users = []) : "";
      t.users.map(function(it) {
        it.id == tp ? (t.userlist = it.receive) : "";
      });
      t.sh.receive = [];
      t.userlist.map(function(it) {
        t.sh.receive.push(it.email);
      });
    },
    getWarnType(us) {
      var t = this;
      this.sh.wprogramme.length == 0
        ? (function() {
            t.openMsg("请到到预警-->预警设置-->新增预警！", "warning");
          })()
        : (function() {
            $("#warnModel").modal("show");
            t.sendWTitle = us.title;
            t.sh.sendUuid = us.uid + "_" + us.created + "_" + us.media_type;
            t.sh.sendWArticle = us.name + us.url;
            t.sh.sendWTitle = t.sendtitle + "-" + us.title;
          })();
    },
    sendWarning() {
      var url = "/client/api/send_warning",
        t = this,
        d = {
          params: {
            setting_id: this.sh.wprogramme,
            receive: this.sh.receive.join("|"),
            uuid: this.sh.sendUuid,
            level: this.sh.sendWLevel,
            send_type: this.sh.sendType,
            subject: this.sh.sendWTitle
          }
        };
      if (d.params.receive == "" || d.params.subject == "") {
        this.openMsg("发送预警表单不能为空！", "warning");
        return;
      }
      this.enter(url, d, function(d) {
        d.code != 1
          ? t.$message.error("发送失败！")
          : ($("#warnModel").modal("hide"), t.openMsg("发送成功！", "success"));
      });
    },
    changeSide(sd) {
      var url = "/client/api/side",
        t = this;
      bootbox.dialog({
        message: "修改媒体属性",
        size: "small",
        buttons: {
          ok: {
            label: "正面",
            className: "btn-success ",
            callback: function() {
              var d = {
                params: {
                  uuid: sd.uuid,
                  sdate: sd.sdate,
                  side: "3",
                  media_type: sd.media_type
                }
              };
              t.enter(url, d, function(d) {
                d.code != -1 ? t.artlistChange() : t.$message.error("修改失败！");
              });
            }
          },
          noclose: {
            label: "中立",
            className: "btn-warning",
            callback: function(e) {
              var d = {
                params: {
                  uuid: sd.uuid,
                  sdate: sd.sdate,
                  side: "1",
                  media_type: sd.media_type
                }
              };
              t.enter(url, d, function(d) {
                d.code != -1 ? t.artlistChange() : t.$message.error("修改失败！");
              });
            }
          },
          cancel: {
            label: "负面",
            className: "btn-danger",
            callback: function(e) {
              var d = {
                params: {
                  uuid: sd.uuid,
                  sdate: sd.sdate,
                  side: "-3",
                  media_type: sd.media_type
                }
              };
              t.enter(url, d, function(d) {
                d.code != -1 ? t.artlistChange() : t.$message.error("修改失败！");
              });
            }
          }
        }
      });
    },
    artDel(s, t) {
      var $t = this;
      bootbox.confirm({
        message: "您确定要删除吗？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-info"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            var url = "/client/api/delete",
              d = {
                params: {
                  uuid: s.uuid,
                  sdate: s.sdate,
                  media_type: s.media_type
                }
              };
            $t.enter(url, d, function(d) {
              d.code == 1
                ? $(t.target)
                    .parentsUntil("ul")[1]
                    .remove()
                : $t.$message.error("删除失败!");
            });
          }
        }
      });
    },
    changeValue(tp) {
      this.sh.sendType = tp;
    },
    checkedAll() {
      var _this = this;
      if (this.sh.checked == false) {
        //实现反选
        _this.sh.batch = [];
      } else {
        //实现全选
        _this.sh.batch = [];
        _this.artlist.forEach(function(item) {
          _this.sh.batch.push(item.uuid);
        });
      }
    },
    allChange() {
      var t = this,url = "/client/api/side";
      if (t.sh.batch.length == 0) {
        t.openMsg("请选择您需要收藏的文章！", "warning");
      } else {
        bootbox.dialog({
          message: "修改媒体属性",
          size: "small",
          buttons: {
            ok: {
              label: "正面",
              className: "btn-success ",
              callback: function() {
                var warr = [];
                t.sh.batch.map(function(item) {
                  t.artlist.map(function(it) {
                    it.uuid == item
                      ? (function() {
                          var obj = {
                            uuid: it.uuid,
                            sdate: it.created,
                            media_type: it.media_type,
                            side: "3",
                          };
                          warr.push(obj);
                        })()
                      : "";
                  });
                });
                t.enter(url, {params:{data:warr}}, function(d) {
                  d.code != -1 ? (t.openMsg(d.msg,"success"),t.artlistChange()) : t.$message.error("修改失败！");
                });
              }
            },
            noclose: {
              label: "中立",
              className: "btn-warning",
              callback: function(e) {
                var warr = [];
                t.sh.batch.map(function(item) {
                  t.artlist.map(function(it) {
                    it.uuid == item
                      ? (function() {
                          var obj = {
                            uuid: it.uuid,
                            sdate: it.created,
                            media_type: it.media_type,
                            side: "1",
                          };
                          warr.push(obj);
                        })()
                      : "";
                  });
                });
                t.enter(url, {params:{data:warr}}, function(d) {
                  d.code != -1 ? (t.openMsg(d.msg,"success"),t.artlistChange()) : t.$message.error("修改失败！");
                });
              }
            },
            cancel: {
              label: "负面",
              className: "btn-danger",
              callback: function(e) {
                var warr = [];
                t.sh.batch.map(function(item) {
                  t.artlist.map(function(it) {
                    it.uuid == item
                      ? (function() {
                          var obj = {
                            uuid: it.uuid,
                            sdate: it.created,
                            media_type: it.media_type,
                            side: "-3",
                          };
                          warr.push(obj);
                        })()
                      : "";
                  });
                });
                t.enter(url, {params:{data:warr}}, function(d) {
                  d.code != -1 ? (t.openMsg(d.msg,"success"),t.artlistChange()): t.$message.error("修改失败！");
                });
              }
            }
          }
        });
      }
    },
    allCollect() {
      var t = this;
      if (t.sh.batch.length == 0) {
        t.openMsg("请选择您需要收藏的文章！", "warning");
      } else {
        var warr = [];
        t.sh.batch.map(function(item) {
          t.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  var obj = {
                    uuid: it.uuid,
                    article_date: it.created,
                    type: "1",
                    media_type: it.media_type,
                    side: it.side
                  };
                  warr.push(obj);
                })()
              : "";
          });
        });
        t.enter("/client/api/add_collect", { params: { data: warr } }, function(
          d
        ) {
          d.code == 1
            ? (t.$message(d.msg), t.artlistChange())
            : t.$message.error("收藏失败！");
        });
      }
    },
    allWarn() {
      var t = this;
      this.sh.wprogramme.length == 0
        ? (function() {
            t.openMsg("请到到预警-->预警设置-->新增预警！", "warning");
          })()
        : (function() {
            if (t.sh.batch.length == 0) {
              t.openMsg("请选择您需要发送预警的文章！", "warning");
              return;
            }
            var warr = [],
              text = "",
              title = "";
            t.sh.batch.map(function(item) {
              t.artlist.map(function(it) {
                it.uuid == item
                  ? (function() {
                      warr.push(
                        it.uuid + "_" + it.created + "_" + it.media_type
                      );
                      text += it.title + "-" + it.url + "\n";
                      title += "-" + it.title;
                    })()
                  : "";
              });
            });
            t.sh.sendUuid = warr.join("|");
            t.sh.sendWArticle = text;
            t.sendWTitle = title;
            t.wprogramme.map(function(item,index){
              console.log(item)
                if(t.sh.wprogramme == item.id){
                  t.sh.sendWTitle =item.name
                }
            })
            // t.sh.sendWTitle = t.sendtitle + title;
            $("#warnModel").modal("show");
          })();
    },
    allExport() {
      var ulist = [],
        t = this;
      t.sh.batch.map(function(item) {
        t.artlist.map(function(it) {
          it.uuid == item
            ? (function() {
                ulist.push(it.uuid);
              })()
            : "";
        });
      });
      var url = "/client/api/exporting",
        d = {
          params: {
            uuid: ulist,
            type: t.sh.exporttype
          }
        };
      ulist.length == 0
        ? (d = {
            params: {
              type: this.sh.exporttype,
              date_range: this.sh.mtime == -1 ? this.sh.etime : this.sh.mtime,
              wid: this.sh.words,
              dimension: this.sh.dimension,
              media_type: this.sh.mediaType,
              region_type: this.sh.region,
              side: this.sh.side,
              search_type: this.sh.search_type,
              property_type: this.sh.mediaPro,
              search_txt: this.sh.keywords,
              order: this.sh.sortWay,
              offset: this.offset,
              limit: this.pageSize
            }
          })
        : "";
      t.enter(url, d, function(d) {
        $("#exportModel").modal("hide");
        d.code == 1
          ? (function() {
              var a = document.createElement("a");
              var url = t.dataurl + d.data;
              var filename = t.sh.exportname;
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            })()
          : d.code == 2
            ? t.openMsg("请到设置我到导出下载文档！", "warning")
            : t.$message.error("导出失败！");
      });
    },
    allArtdel() {
      var t = this;
      if (t.sh.batch.length == 0) {
        t.openMsg("请选择您需要删除的文章！", "warning");
      } else {
        bootbox.confirm({
          message: "您确定要删除吗？",
          size: "small",
          buttons: {
            confirm: {
              label: "确定",
              className: "btn-info"
            },
            cancel: {
              label: "取消",
              className: "btn-default"
            }
          },
          callback: function(result) {
            if (result) {
              var warr = [];
              t.sh.batch.map(function(item) {
                t.artlist.map(function(it) {
                  it.uuid == item
                    ? (function() {
                        var obj = {
                          uuid: it.uuid,
                          sdate: it.created,
                          media_type: it.media_type
                        };
                        warr.push(obj);
                      })()
                    : "";
                });
              });
              t.enter(
                "/client/api/delete",
                { params: { data: warr } },
                function(d) {
                  d.code == 1
                    ? ((t.sh.batch = []), t.artlistChange())
                    : t.$message.error("删除失败!");
                }
              );
            }
          }
        });
      }
    },
    snapview(it){
      var t=this;
      var url='/client/article/get_articles_info';
      t.enter(url,{params:{uuid:it.uuid,sdate:it.created,media_type:it.media_type}},function(d){
        t.snap=d.data;
        $('#snapModal').modal("show");
      })
    }
  }
};
</script>
<style scoped>
.row h3 {
  margin: 0;
  height: 18px;
  display: inline-block;
  line-height: 18px;
  font-weight: 500 !important;
}
.row h3 i {
  vertical-align: top;
  margin-right: 10px;
}
.row h5{
  margin-bottom: 0;
}
.robtbox {
  width: 100%;
  height: 100%;
}
.select-robot{
  position: absolute;
  right: 0;
  height: 35px;
  width: 100px;
}
.timetime {
  width: 100%;
  height: 300px;
}
.view-time {
  width: 100%;
  height: 50px;
  text-align: center;
}
.view-timeline {
  width: 100%;
  height: 100px;
}
.chart-view-no{
  width: 100%;
  height: 280px;
}
.cloud-view-no{
  width: 100%;
  height: 200px;
}
.view-chart {
  width: 100%;
  height: 150px;
}
.view-chart-65 {
  width: 65%;
  min-height: 180px;
  float: left;
}
.view-chart-30 {
  width: 30%;
  min-height: 180px;
  float: right;
}
.view-chart-25 {
  width: 25%;
  min-height: 180px;
  float: left;
}
.view-chart-5 {
  width: 10%;
  min-height: 180px;
  float: right;
}
.view-show {
  width: 100%;
  height: 100%;
}
.view-show-85 {
  width: 85%;
  height: 100%;
  float: left;
}
.text-view-10 {
  width: 10%;
  height: 280px;
  float: left;
}
.view-simple {
  width: 100%;
  height: 40px;
  float: left;
}
.view-big-chart {
  width: 100%;
  height: 300px;
}
.well {
  margin-bottom: 15px;
}
table {
  width: 100%;
}
.table > thead > tr > td{
  vertical-align: middle;
}
table.table1 tr td {
  /*width: 33.33%; */
  line-height: 40px;
}
table.table1 tr td:not(:first-child) {
  text-align: right;
}
table.table1 tr td .progress {
  width: 80%;
  margin-top: 10px;
  float: left;
}
table.table1 tr td label {
  float: right;
  margin-bottom: 0;
}
table.table1 tr td .progress {
  margin-bottom: 10px;
}
table.table1 tr td .progress .progress-bar {
  float: left;
}
.table1 tr td:first-child{
  width: 200px;
}
.view-time input {
  width: 100%;
  display: none;
}
.well-nopading{
  padding-left: 0;
  padding-top: 42px;
}
.artfooter a {
  display: inline-block;
  padding: 2px 6px;
  margin: 3 5px;
  border-radius: 5px;
  background-color: #cfcfcf;
}
a.atitle {
  display: inline-block;
  padding: 3px 6px;
  margin: 3px 5px;
  font-size: 12px;
  border: 1px solid #199ed8;
  border-radius: 2px;
  text-decoration: none;
}
.robotart .widget-header a{
  display: inline-block;
  padding: 8px 10px;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f3f3f3;
}
.robotbtn{
  display: inline-block;
  margin-right: 5px;
}
.robotart .widget-header a:hover,.robotart .widget-header a.active{
  background-color: #fff;
  color: #2dc3e8;
  border-bottom: 2px solid #2dc3e8;
}
input[type="checkbox"],
input[type="radio"] {
  opacity: 1;
  position: relative;
  left: 0;
  z-index: 12;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.pro-lt-1 {
  background-color: #fe5155;
}
.pro-lt-2 {
  background-color: #f4b400;
}
.pro-lt-3 {
  background-color: #ff6677;
}
.pro-lt-4 {
  background-color: #5cb85c;
}
.pro-lt-5 {
  background-color: #2dc3e8;
}
.pro-lt-6 {
  background-color: #e75b8d;
}
.pro-dk-1 {
  background-color: #4374e0;
}
.pro-dk-2 {
  background-color: #6f85bf;
}
.pro-dk-3 {
  background-color: #bc5679;
}
.pro-dk-4 {
  background-color: #7e3794;
}
.pro-dk-5 {
  background-color: #981b48;
}
.pro-dk-6 {
  background-color: #cc324b;
}
</style>
