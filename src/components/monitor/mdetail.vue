
<template>
    <div class="outer-content">
      <div class=“widget”>
      	<div class="widget-header bordered-bottom bordered-sky text-align-left">
          <label>{{artdetail.title}}</label>
          <a :href="artdetail.url" target="_blank">查看原文</a>
        </div>
        <div class="widget-body">
          <table class="table table-hover">
              <tr><td>来源</td><td>{{artdetail.website_name}}</td><td>发布时间</td><td>{{artdetail.pubdate}}</td>
                <td>
                  <i class="glyphicon glyphicon-heart" :class="artdetail.is_collect==1?'imp-red':''" @click="follow({uuid:artdetail.uuid,article_date:artdetail.created,type:'1',side:artdetail.side,media_type:artdetail.media_type},$event)" :data-unid="artdetail.is_collect" ></i>  <!-- 收藏 -->
                  <i class="glyphicon glyphicon-warning-sign" @click="getWarnType({uid:artdetail.uuid,url:artdetail.site_url,name:artdetail.website_name,title:artdetail.title,media_type:artdetail.media_type})"></i>  <!-- 发送预警 -->
                  <!-- <a class="glyphicon glyphicon-info-sign" >发送预警</a> -->
                </td>
              </tr>
              <tr><td>作者</td><td>{{artdetail.author}}</td><td>文章属性</td><td>{{artdetail.side==1?"中立":artdetail.side==-3?"负面":artdetail.side==3?"正面":""}}</td>
                <td>
                  <i class="glyphicon glyphicon-pencil" @click="changeSide({uuid:artdetail.uuid,sdate:artdetail.created,media_type:artdetail.media_type})"></i>
                </td>
              </tr>
              <tr><td>评论数</td><td>{{artdetail.reply}}</td><td>相似文章数</td><td>{{artdetail.sim_count}}</td>
                <td>
                <i class="glyphicon glyphicon-trash" @click="artDel({uuid:artdetail.uuid,sdate:artdetail.created,media_type:artdetail.media_type},$event)"></i>
              </td></tr>
              <tr><td>阅读数</td><td>{{artdetail.view}}</td><td>权重</td><td>{{artdetail.weight}}</td><td></td></tr>
          </table>
          <p>{{artdetail.txt}}</p>
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
                               <select class="form-control" v-model="sh.wprogramme" @change="changewtitle($event)" ><option v-for="it in wprogramme" :value="it.id">{{it.name}}</option></select>
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
                               <textarea v-model="sh.sendWArticle"></textarea>
                           </div>
                       </div>
                     </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                     <button type="button" class="btn btn-primary" @click="sendWarning">提交</button>
                 </div>
             </div><!-- /.modal-content -->
         </div><!-- /.modal-dialog -->
     </div><!-- /.modal -->
    </div>
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
let bootbox=require('bootbox');
export default {
    data() {
        return {
          enter:function (url,d,_fn) {
            this.ajaxEnter(url,d,_fn)
          },
          openMsg:function(msg,type){
            this.$message({
              message: msg,
              type: type
            });
          },
          params:{
            uuid:'',
            sdate:'',
            media_type:''
          },
          sh:{
            sendWLevel:'1',
            sendWArticle:'',
            sendWTitle:'',
            receive:[],
            wprogramme:'',
            newuser:'',
            sendType:'2',
            sendUuid:''
          },
          artdetail:''
        }
    },created(){
      //getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
      var t=this;
      t.params.uuid=this.$route.query.id;
      t.params.sdate=this.$route.query.sdate;
      t.params.media_type=this.$route.query.media_type;
      t.artlistChange();
      var url='/client/api/warning';
      t.enter(url,{params:{}},function(d){
        t.wprogramme=d.data;
        t.sh.wprogramme=d.data[0].id
        t.users=d.data;
      })
    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      this.$route.query.dtype==3?html+='<li><a href="#/InitRobot">观点分析</a></li><li class="active">文章快照</li>':html+='<li><a href="#/monitor">监测</a></li><li class="active">文章快照</li>';
      $('#Crumbs').html(html)
    },
    methods:{
      artlistChange(){
        var t=this;
        var url='/client/article/get_articles_info';
        t.enter(url,{params:t.params},function(d){
          t.artdetail=d.data;
        })
      },
      follow(d,t){
        var $t=this,url='',da={};
        $(t.target).hasClass('imp-red')?(url='/client/api/delete_collect',da={params:{id:$(t.target).attr('data-unid'),media_type:d.media_type}}):(url='/client/api/add_collect',da={params:d})
        this.enter(url,da,function(d){
          d.code==1?($(t.target).hasClass('imp-red')?($(t.target).removeClass('imp-red')):($(t.target).addClass('imp-red'),$(t.target).attr('data-unid',d.data))):''
        })
      },
      getWarnType(us){
        $('#warnModel').modal('show');
        this.sendWTitle=us.title;
        this.sh.sendUuid=us.uid;
        this.sh.sendWArticle=us.name+us.url;
        this.sh.sendWTitle=this.sendtitle+'-'+us.title;
      },
      sendWarning(){
        var url='/client/api/send_warning',t=this,
        d={params:{
          setting_id:this.sh.wprogramme,
          receive:this.sh.receive.join('|'),
          media_type:this.params.media_type,
          uuid_arr:this.params.uuid,
          level:this.sh.sendWLevel,
          send_type:this.sh.sendType,
          subject:this.sh.sendWTitle
        }};
        if(d.params.receive==""||d.params.subject==""){
          t.openMsg('发送预警表单不能为空！','warning')
          return
        }
        this.enter(url,d,function(d){
            d.code!=1?t.$message.error('发送失败！',):($('#warnModel').modal('hide'),t.openMsg('发送成功！',"success"))
        })
      },
      changewtitle($e){
          var tp=this.sh.wprogramme,t=this;
          this.sendtitle=$($e.target).find('option:selected').text();
          this.sh.sendWTitle=this.sendtitle+'-'+this.sendWTitle;
          t.users.map(function(it){
            it.id==tp?t.userlist=it.receive:''
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
                        d.code!=-1?t.artlistChange():t.$message.error('修改失败！')
                      })
                    }
                },
                noclose: {
                    label: '中立',
                    className: 'btn-warning',
                    callback: function(e){
                      var d={params:{uuid:sd.uuid,sdate:sd.sdate,side:'1',media_type:sd.media_type}};
                      t.enter(url,d,function(d){
                        d.code!=-1?t.artlistChange():t.$message.error('修改失败！')
                      })
                    }
                },
                cancel: {
                    label: '负面',
                    className: 'btn-danger',
                    callback: function(e){
                      var d={params:{uuid:sd.uuid,sdate:sd.sdate,side:'-3',media_type:sd.media_type,}};
                      t.enter(url,d,function(d){
                        d.code!=-1?t.artlistChange():t.$message.error('修改失败！')
                      })
                    }
                }
            }
        });
      },
      artDel(s,t){
        var $t=this;
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
                if(result){
                  var url='/client/api/delete',
                  d={params:{uuid:s.uuid,sdate:s.sdate,media_type:s.media_type}};
                  $t.enter(url,d,function(d){
                    d.code==1?($t.$router.go(-1)):($t.$message.error('删除失败!'))
                  })
                }
            }
        });
      },
    }
}
</script>
<style scoped>
.router-link>a{
    display:inline-block;
    padding:10px;
}
.imp-red{
  color: #ff0000!important;
}
.widget-header{
  line-height: 35px;
}
.widget-header a{
  position: absolute;
  right: 10px;
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
textarea{
  width: 100%;
  resize: none;
}
.form-group{
  display: flex;
}
</style>
