<template>
    <div class="">
      <div class="widget-body">
        <table class="table table-striped table-bordered table-hover">
            <tbody>
                <tr>
                    <td class="text-align-center">监测时间</td>
                    <td>
                      <label><input @click="listajax" type="radio" :value="1" v-model="sh.mtime" /><span>24小时</span></label>
                      <label><input @click="listajax" type="radio" :value="2" v-model="sh.mtime" /><span>3天</span></label>
                      <label><input @click="listajax" type="radio" :value="6" v-model="sh.mtime" checked /><span>7天</span></label>
                      <label><input @click="listajax" type="radio" :value="29" v-model="sh.mtime" /><span>30天</span></label>
                      <label><input type="radio" :value="-1" v-model="sh.mtime" /><span>自定义</span></label>
                      <div class="custom" v-show="sh.mtime==-1">
                        <el-date-picker
                          v-model="sh.stime"
                          type="daterange"
                          format="yyyy/MM/dd"
                          @change="changeDate"
                          align="right"
                          placeholder="选择日期范围"
                          :picker-options="pickerOptions2">
                        </el-date-picker>
                      </div>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      <div class="widget">
          <div class="widget-header bordered-bottom text-align-left">
            <label><input type="checkbox" name="" v-model="sh.checked" @click="checkedAll" />全选</label>
            <a class="btn btn-default btn-sm artsort cur" @click="setsort('created',$event)">时间降序</a>
            <a class="btn btn-default btn-sm artsort" @click="setsort('weight',$event)">权重降序</a>
            <a class="btn btn-default btn-sm artsort" @click="setsort('sim_count',$event)">转载降序</a>
            <!--1029 zjn say -->
            <select v-model="sh.param"><option value='' >文章形式</option><option value='1' >推荐</option><option value='2' >人工添加</option></select>

            <select v-model="sh.search_type"><option value='0' >搜索方式</option><option value='1' >搜内容</option><option value='2' >搜媒体</option><option value='3' >搜标题</option></select>
            <input type="text" class="keywords"  v-model="sh.keywords" value="" />
            <a class='btn btn-sm' @click="listajax">搜索</a>
            <label class="pagedetail">共{{pageCount}}篇文章</label>
          </div><!--Widget Header-->
          <div class="">
            <ul>
              <li v-for="it in artlist">
                <div class="widget-body">
                  <h5>
                    <input type="checkbox" name="" v-model="sh.batch" :value="it.uuid" />
                    <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" :data-value="it.media_type" data-container="body"
                    data-trigger="focus" data-titleclass="bordered-purple" data-toggle="popover" data-placement="bottom"
                    data-title="" :data-content="it.is_focus" >{{it.site_name}}</a>
                    <label style="  font-size:20px;">
                      <!-- <router-link :to="{name:'Mdetail',query:{id:it.uuid,sdate:it.created,media_type:it.media_type}}">{{it.title}}</router-link> -->
                      <a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a>
                    </label>
                    <span>{{it.is_add==0?"(推荐)":"(人工添加)"}}</span></h5>
                    <p>{{it.txt}}</p>
                    <p class="grey">
                      <span>发布时间：{{it.pubdate}}  阅读数：{{it.view}}</span>  <!--   维度：{{it.dimension}}  -->
                      <!-- <span v-if="sh.mediaType==6" >粉丝数:{{it.followers_count}}条</span>
                      <span v-if="sh.mediaType==6" >点赞数:{{it.attitudes_count}}条</span> -->
                      属性:<span :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">
                        {{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}} </span>
                      <router-link v-if="it.sim_count!=0" :to="{name:'similar',query:{id:it.sim_id,type:4}}">相似文章{{it.sim_count}}</router-link>
                      <span class="pull-right xftdei">
                        <i class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type})"></i> <!-- 更改 -->
                        <i data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-exp-g" @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})"></i>  <!-- 导出 -->
                      </span>
                    </p>
                </div>
              </li>
            </ul>
            <div class="artfooter widget-body" v-show="this.pageCount>0">
              <div>
                  <el-pagination
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[20, 50, 100]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageCount">
                   </el-pagination>
               </div>
              <label><input type="checkbox" name="" v-model="sh.checked" @click="checkedAll" />全选</label>
              <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="exportshow(1)">导出<i class="glyphicon glyphicon-download right"></i></a>
            </div>
            <div class="pagination">
              <div class="tcdPageCode"></div>
            </div>
          </div><!--Widget Body-->
      </div>

      <div id="exportModel" class="modal fade" tabindex="-1" role="dialog">
         <div class="modal-dialog" role="document">
             <div class="modal-content">
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                     <h4 class="modal-title">导出文章</h4>
                 </div>
                 <div class="modal-body">
                   <div class="row">
                     <div class="col-md-10">
                       <input type="text" class="form-control input-sm" v-model="sh.exportname"  />
                     </div>
                     <div class="col-md-2">
                       <select class="dowtype" v-model="sh.exporttype"><option value="2" >WORLD</option><option value="3" >PDF</option><option value="1" >EXCEL</option></select>
                     </div>
                   </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                     <button type="button" class="btn btn-primary" v-if="sh.exportall==0" @click="artExport">导出</button>
                     <button type="button" class="btn btn-primary" v-else @click="allExport">导出</button>
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
                   <table class="table table-hover">
                       <tr><td>来源</td><td><span>{{snap.website_name}}</span></td><td>发布时间</td><td><span>{{snap.pubdate}}</span></td>
                         <td class="text-align-right">
                           <i class="ifa ifa-book-g" title="修改属性" @click="changeSide({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type})"></i> <!-- 更改 -->
                           <i  title="导出" class="ifa ifa-exp-g" @click="exportshow(0,{uuid:snap.uuid,medtype:snap.media_type,name:snap.title})"></i>  <!-- 导出 -->
                         </td>
                       </tr>
                       <tr><td>作者</td><td><span>{{snap.author}}</span></td><td>文章属性</td><td><span>{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>

                       </tr>
                       <tr><td>评论数</td><td><span>{{snap.reply}}</span></td><td>相似文章数</td><td><span>{{snap.sim_count}}</span></td>
                       </tr>
                       <tr><td>阅读数</td><td><span>{{snap.view}}</span></td><td>权重</td><td><span>{{snap.weight}}</span></td><td></td></tr>
                   </table>
                   <p v-html="snap.txt">{{snap.txt}}</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
</template>
<script scoped>
import {getCookie} from '../../../static/js/globle.js';
import '../../../static/js/globle.js'
let bootbox=require('bootbox');
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
          openMsg: function(msg, type) {
            this.$message({
              message: msg,
              type: type
            });
          },
          artlist:[],
          optid:'',
          optname:'',
          pageCount:'',
          offset:0,
          pageSize:'20',
          sh:{
            param:'',//zjn say
            opinion_id:'',
            wid:'',
            media_type:'',
            region_id:'',
            side:'',
            search_type:'',
            media_property:'',
            search_txt:'',
            order:'',
            limit:20,
            offset:0,
            batch:[],
            checked:'',
            sortWay:'',
            words:'',
            dimension:'',
            mediaType:'',
            region:'',
            mediaPro:'',
            mtime:'29',//zjn say
            stime:'',
            etime:'',
            search_type:'0',
            keywords:'',
            userlist:[],
            sendWLevel:'1',
            sendWArticle:'',
            sendWTitle:'',
            receive:[],
            wprogramme:'',
            newuser:'',
            sendType:'1',
            sendUuid:'',
            exportobj:'',
            exportname:'',
            exporttype:'1',
            exportall:'0',
          },
          pickerOptions2:{
            disabledDate(time){
                return time.getTime() > Date.now()
            },
          },
          snap:{
            name:'傻逼文章快照'
          },
        }
    },
    watch:{
      'sh.batch':{
        handler:function(){
          if (this.sh.batch.length === this.artlist.length) {
              this.sh.checked=true;
          }else{
              this.sh.checked=false;
          }
        }
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
    created(){
        getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
        var t=this;
        // 如果后台返回给我了ID
        t.sh.stime=t.Update(new Date(),-6);
        t.optid=this.$route.query.id;
        t.optpid=this.$route.query.pid;
        t.optname=this.$route.query.pname;
        var url='/client/explore/get_uarticle_lists',d={params:{classes:t.optid,limit:t.limit,offset:t.offset,param:t.sh.param}}
        t.enter(url,d,function(d){
          d.code==1?(t.artlist=d.data.data,t.pageCount=d.data.hits):''
        })
    },
    mounted(){
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>探索</li><li><a href="#/InitRobot">智能观点</a></li><li><a href="#/explore/robotana?id='+this.optpid+'&name='+this.optname+'">观点分析</a></li><li class="active">'+this.optname+'文章列表</li>';
      $('#Crumbs').html(html)
      $('.loading-container').addClass('loading-inactive');
    },
    methods:{
      changeDate(val){
        this.sh.etime=val;
        this.listajax();
      },
      handleSizeChange(val){
        this.pageSize =val;
        this.listajax()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.offset= this.pageSize * (val-1);
        this.listajax();
      },
      listajax(){
          var t=this;
          var url='/client/explore/get_uarticle_lists',d={params:{
            classes:t.optid,
            param:t.sh.param,
            limit:t.pageSize,
            offset:t.offset,
            order:t.sh.sortWay,search_txt:t.sh.keywords,search_type:t.sh.search_type,
            date_range:(this.sh.mtime==-1?this.sh.etime:this.sh.mtime),}}
          t.enter(url,d,function(d){
            d.code==1?(t.artlist=d.data.data,t.pageCount=d.data.hits):''
          })
      },
      setsort(str,t){
        $('.artsort').removeClass('cur'),$(t.target).addClass('cur');
        this.sh.sortWay=str;
        this.listajax();
      },
      follow(d,t){
        var $t=this,url='',da={};
        $(t.target).hasClass('imp-red')?(url='/client/api/delete_collect',da={params:{uuid:d.uuid}}):(url='/client/api/add_collect',da={params:d})
        this.enter(url,da,function(d){
          d.code==1?($(t.target).hasClass('imp-red')?($(t.target).removeClass('imp-red'),$(t.target).html('收藏')):($(t.target).addClass('imp-red'),$(t.target).html('取消收藏'))):''
        })
      },
      changeSide(sd){
        var url='/client/api/side',t=this;
        bootbox.dialog({
            message: "修改媒体属性",
            size:'small',
            buttons: {
                ok: {
                    label: '正面',
                    className: 'btn-info ',
                    callback: function(){
                      var d={params:{uuid:sd.uuid,sdate:sd.sdate,side:'3',media_type:sd.media_type}};
                      t.enter(url,d,function(d){
                        d.code!=-1?t.listajax():alert('修改失败！')
                      })
                    }
                },
                noclose: {
                    label: '中立',
                    className: 'btn-warning',
                    callback: function(e){
                      var d={params:{uuid:sd.uuid,sdate:sd.sdate,side:'1',media_type:sd.media_type}};
                      t.enter(url,d,function(d){
                        d.code!=-1?t.listajax():alert('修改失败！')
                      })
                    }
                },
                cancel: {
                    label: '负面',
                    className: 'btn-danger',
                    callback: function(e){
                      var d={params:{uuid:sd.uuid,sdate:sd.sdate,side:'-3',media_type:sd.media_type,}};
                      t.enter(url,d,function(d){
                        d.code!=-1?t.listajax():alert('修改失败！')
                      })
                    }
                }
            }
        });
      },
      checkedAll(){
        var _this = this;
            if (this.sh.checked==false) {//实现反选
                 _this.sh.batch = [];
            }else{//实现全选
                _this.sh.batch = [];
                _this.artlist.forEach(function(item) {
                _this.sh.batch.push(item.uuid);
            });
          }
      },
      artExport(uid,med){
        var t=this,url='/client/api/exporting',d={params:{
          uuid:t.sh.exportobj.uuid,
          type:t.sh.exporttype,
          classes:t.optid,
        }}
        t.enter(url,d,function(d){
          $('#exportModel').modal('hide');
          d.code==1?function(){
            var a = document.createElement('a');
            var url = t.dataurl+ d.data;
            var filename = t.sh.exportname;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          }():d.code==2?alert('请到设置我到导出下载文档！'):alert('导出失败！');
        })
      },
      allExport(){
        var ulist=[],t=this;
        t.sh.batch.map(function(item){
          t.artlist.map(function(it){
            it.uuid==item?function(){
              ulist.push(it.uuid)
            }():''
          })
        })
        var url='/client/api/exporting',d={params:{
          uuid:ulist,
          type:t.sh.exporttype,
        }}
        t.enter(url,d,function(d){
          $('#exportModel').modal('hide');
          d.code==1?function(){
            var a = document.createElement('a');
            var url = t.dataurl+ d.data;
            var filename = t.sh.exportname;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          }():d.code==2?alert('请到设置我到导出下载文档！'):alert('导出失败！');
        })
      },
      artDel(s){
        var t=this;
        bootbox.confirm({
            message: "您确定要删除吗？",
            size:'small',
            buttons: {
                confirm: {
                    label: '确定',
                    className: 'btn-success'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if(result){debugger
                  var url='/client/explore/delete_category_article',
                  d={params:{
                    category_id:t.optid,
                    uuid:s.uuid+'_'+s.sdate+'_'+s.media_type
                  }}
                  t.enter(url,d,function(d){
                    d.code==1?t.listajax():(alert('删除失败!'))
                  })
                }
            }
        });
      },
      Update(day,aday){
        var a = new Date(day)
        a = a.valueOf()
        a = a + aday * 24 * 60 * 60 * 1000
        a = new Date(a).Format('yyyy/MM/dd');
        return a;
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
                      className: "btn-success"
                    },
                    cancel: {
                      label: "取消",
                      className: "btn-danger"
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
      snapview(it){
        var t=this;
        var url='/client/article/get_articles_info';
        t.enter(url,{params:{uuid:it.uuid,sdate:it.created,media_type:it.media_type}},function(d){
          t.snap=d.data;
          $('#snapModal').modal("show");
        })
      }
    }
}
</script>
<style scoped>
ul, ol {
    margin-top: 0;
    margin-bottom: 0px;
}

.widget-header {
  line-height:35px;
}
input[type=checkbox],input[type=radio] {
	opacity: 1;
	position: relative;
	left: 0;
	z-index: 12;
	width: 15px;
	height: 15px;
	cursor: pointer;
}
.artdetail{
  width: 100%;
  margin-top: 10px;
}
.artdetail ul li {
  border: 1px solid #ccc;
  padding-left: 10px;
}
a.atitle{
  display: inline-block;
  padding: 5px 10px;
  margin: 3px 5px;
  border:1px solid #199ed8;
  border-radius: 5px;
}
a.artsort{
  display: inline-block;
  padding: 3px 6px;
  margin: 0 3px;
  text-decoration: none;
}
a.cur,a.artsort:hover{
  border: 1px solid #199ed8;
}
.artfooter{
  /* height: 35px; */
}
.artfooter a{
  display: inline-block;
  padding: 2px 6px;
  margin: 3 5px;
  border-radius: 5px;
  background-color: #cfcfcf;
}
.custom{
  display: inline-block;
}
.imp-red{
  color: #ff0000!important;
}
.pagedetail{
  position: absolute;
  right: 10px;
  top: 10px;
}
.dowtype{
  height: 30px;
}
</style>
