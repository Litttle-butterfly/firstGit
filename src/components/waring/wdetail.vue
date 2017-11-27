
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
                  <i class="glyphicon glyphicon-heart" :class="artdetail.is_collect==1?'imp-red':''" @click="follow({uuid:artdetail.uuid,article_date:artdetail.created,type:'2',side:artdetail.side,media_type:artdetail.media_type},$event)"  :data-unid="artdetail.is_collect" ></i>  <!-- 收藏 -->
                  <!-- <a :class="artdetail.is_collect==1?'imp-red':''" >{{artdetail.is_collect==1?"取消收藏":"收藏"}}</a> -->
                </td></tr>
              <tr><td>作者</td><td>{{artdetail.author}}</td><td>文章属性</td><td>{{artdetail.side==1?"中立":artdetail.side==-3?"负面":artdetail.side==3?"正面":"其他"}}</td>
                <td></td>
              </tr>
              <tr><td>评论数</td><td>{{artdetail.reply}}</td><td>相似文章数</td><td>{{artdetail.sim_count}}</td>
                <td></td></tr>
              <tr><td>阅读数</td><td>{{artdetail.view}}</td><td>权重</td><td>{{artdetail.weight}}</td><td></td></tr>
          </table>
          <p>{{artdetail.txt}}</p>
        </div>
      </div>
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
          params:{
            uuid:'',
            sdate:'',
            media_type:''
          },
          artdetail:''
        }
    },created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
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
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li>预警</li><li><a href="#/waring/profileW">预警分析</a></li><li class="active">文章快照</li>';
      $('#Crumbs').html(html)
      $('.loading-container').addClass('loading-inactive');
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
      }
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
</style>
