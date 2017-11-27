<template>
  <div>
    <div class="container-fluid">
      <div class="xftdei"><h3 class="myh3"> <i class="ifa ifa-option"></i>数据概况</h3></div>
      <hr/>
      <div class="row well survey  padding-right-5 padding-left-5">
        <div class="col-md-12 col-lg-12 padding-right-5 padding-left-5">
          <div class="seuvey-list">
            <p class="p1 text-color-sky">{{homelist.total}}</p>
            <p class="p2"><i class="ifa ifa-user"></i>数据量</p>
            <p class="p3">{{today}}</p>
          </div>
          <div class="seuvey-list">
            <p class="p1">{{homelist.warning_total}}</p>
            <p class="p2"><i class="ifa ifa-warning"></i>预警量</p>
            <p class="p3">{{today}}</p>
          </div>
          <div class="seuvey-list">
            <p class="p1">{{homelist.report_total}}</p>
            <p class="p2"><i class="ifa ifa-report"></i>生成报告数</p>
            <p class="p3">{{today}}</p>
          </div>
          <div class="seuvey-list">
            <p class="p1">{{homelist.opinion_total}}</p>
            <p class="p2"><i class="ifa ifa-option"></i>智能观点完成</p>
            <p class="p3">{{today}}</p>
          </div>
          <div class="seuvey-list">
            <p class="p1 text-color-sky">{{homelist.message_total}}</p>
            <p class="p2"><i class="ifa ifa-msg"></i>系统消息</p>
            <p class="p3">{{today}}</p>
          </div>
        </div>
      </div>
      <div class="flex-parent row"></div>
      <div class="row">
        <div id="main" class="main-body">
          <p class="modual"><a class="btn addModel">新增模块</a></p>
        </div>
      </div>
    </div>
     <div id="addModel" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">模块选择</h4>
                </div>
                <div class="modal-body">
                  <div class="theme-box row">
                    <div class="theme col-lg-4 col-sm-4"><div class="thimg" data-id="3" ><img src="./../static/img/artp.png" /></div><p>文章推送</p></div>
                    <div class="theme col-lg-4 col-sm-4"><div class="thimg" data-id="4" ><img src="./../static/img/medd.png" /></div><p>媒体分布图</p></div>
                    <div class="theme col-lg-4 col-sm-4"><div class="thimg" data-id="7" ><img src="./../static/img/aread.png" /></div><p>地域分布</p></div>
                    <div class="theme col-lg-4 col-sm-4"><div class="thimg" data-id="2" ><img src="./../static/img/infod.png" /></div><p>信息趋势</p></div>
                    <div class="theme col-lg-4 col-sm-4"><div class="thimg" data-id="6" ><img src="./../static/img/emod.png" /></div><p>情绪分布</p></div>
                    <div class="theme col-lg-4 col-sm-4"><div class="thimg" data-id="1" ><img src="./../static/img/shld.png" /></div><p>声量统计</p></div>
                 </div>
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
                        <!-- <i class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" @click="changeSide({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type})"></i>
                        <i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-coll-g':'ifa ifa-coll-b'" @click="modalfollow({uuid:snap.uuid,article_date:snap.created,type:'1',side:snap.side,media_type:snap.media_type},$event)" :data-unid="snap.is_collect" ></i>
                        <i data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-exp-g" @click="exportshow(0,{uuid:snap.uuid,medtype:snap.media_type,name:snap.title})"></i>
                        <i data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-warn-g" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i>
                        <i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-g" @click="artDel({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},$event)"></i> -->
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
<script>
import {getCookie} from './../static/js/globle.js';
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
          mid:'',
          tid:'',
          srtid:0,
          mdata:'',
          tidname:'',
          befochoose:[],
          choose:[],
          newChoose:[],
          infoModule:[{name:'声量统计',id:1},{name:'媒体趋势图',id:2},{name:'媒体分布',id:4},{name:'情绪分布',id:6},{name:'地域分布',id:7},{name:'文章推送',id:3}],
          words:[],
          mediaType:[],
          dimension:[],
          region:[],
          side:[],
          mediaPro:[],
          loadidx:'',
          homelist:'',
          today:new Date().Format('yyyy/MM/dd'),
          sh:{
            mtype:'',
            mname:'',
            words:'',
            mtime:'6',
            dimension:'',
            mediaType:'',
            region:'',
            side:'',
            mediaPro:'',
            search_type:'0',
          },
          snap:{
            name:'傻逼文章快照'
          },
        }
    },
    created(){
      getCookie('user')==""?this.$router.replace({ path: '/login' }):''
      $('.loading-container').removeClass('loading-inactive');
      var html='<li id class="active">Home</li>';
      $('.breadcrumb').html(html);
      var url='/client/home/get_data_screen',t=this;
      t.enter(url,{params:{}},function(d){
        d.code!=1?'':t.homelist=d.data["今日"];
      })
    },
    mounted(){
        let vt=this;

        (function() {
            function created(){
                cs.init();
                var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
                html+='<li id class="active">概况</li>';
                $('#Crumbs').html(html)
                $('.su').addClass('active');
            }
            let cs=function (d) {
                var bootbox=require('bootbox');
                function e() {}
                return e.prototype={
                    init:function () {
                        this.$el=$('.flex-parent'),
                        this.tem=$('.addModel'),
                        this.gridly=$('.gridly'),
                        this.info=('#infoModule'),
                        this.name=('#nameModule'),
                        this.words=('input[name=words]:checked'),
                        this.mtime=('input[name=mtime]:checked'),
                        this.slide=('input[name=slide]:checked'),
                        this.dimension=('input[name=dimension]:checked'),
                        this.property_type=('input[name=property_type]:checked'),
                        this.media_type=('input[name=media_type]:checked'),
                        this.region=('#region'),
                        this.srcdiv = null,
                        this.hrefdiv='',
                        this.addEvent(),
                        this.getResult(d);
                    },
                    addEvent:function(){
                        var t=this;
                        this.tem.on('click',function(){
                            t.addTheme();
                        }),
                        $('.thimg').on('click',function(){
                            $('.thimg').removeClass('active');
                            $(this).toggleClass('active');
                            $(this).hasClass('active')?(vt.mid=$(this).attr("data-id"),vt.tidname=$(this).parent().find('p').html()):''
                            t.setTheme();
                        })
                    },
                    dataEntry:function (url,data,_fn) {
                        vt.ajaxEnter(url,data,_fn)
                    },
                    getResult:function (d) {
                        var t=this;
                        t.drowHtml();
                    },
                    addTheme:function(){
                        var t=this;
                        vt.choose=[];
                        $('.thimg').removeClass('active');
                        $('#addModel').modal('show');
                        //$('#queryModel').modal('show');
                    },
                    setTheme:function(){
                      var t=this;
                      $('#addModel').modal('hide');
                      $("input[name=radio_name]:checked").val()
                      var url='/client/api/get_lists',data={params:{}};
                      cs.dataEntry(url,data,function(data){
                        var html=cs.setQueryList(data.data,vt.mid,vt.tidname);
                        bootbox.dialog({
                            title: '模块设置',
                            message: html,
                            buttons: {
                                cancel: {
                                    label: "取消",
                                    className: 'btn-default'
                                },
                                ok: {
                                    label: "确定",
                                    className: 'btn-info',
                                    callback: function(e){
                                      if($(cs.words).length==0){
                                        vt.openMsg('主题选择不能为空！',"warning")
                                        return false;
                                      }
                                      var arr=[],pname=$(cs.name).val();
                                      var url='/client/home/setting_module',
                                          data={params:{
                                              name:pname,
                                              module_id:$(cs.info).val(),
                                              mtime:$(cs.mtime).val(),
                                              wid:$(cs.words).length==0&&vt.mid!=1?"":$(cs.words)[0].value==""&&vt.mid!=1?"":function(){var arr=[];$(cs.words).map(function(t,i){vt.mid==1&&t==0&&this.value==""?'':arr.push(this.value)}); return arr}(),
                                              side:$(cs.slide).length==0||$(cs.slide)[0].value==""?"":function(){var arr=[]; $(cs.slide).map(function(){arr.push(this.value)}); return arr}(),
                                              media_type:$(cs.media_type).length==0||$(cs.media_type)[0].value==""?"":function(){var arr=[]; $(cs.media_type).map(function(){arr.push(this.value)}); return arr}(),
                                              property_type:$(cs.property_type).length==0||$(cs.property_type)[0].value==""?"":function(){var arr=[]; $(cs.property_type).map(function(){arr.push(this.value)}); return arr}(),
                                              dimension:$(cs.dimension).val(),
                                              region_type:$(cs.region).val(),
                                              sort_order:$('.flex-child').length+1
                                      }}
                                      vt.newChoose=JSON.stringify(data.params);
                                      vt.mid=$(cs.info).val();
                                      cs.dataEntry(url,data,function(d){
                                          var id=("x_box_"+d.data);
                                          var html='',icon='';
                                          vt.mid==2?(html+='<div class="col-md-12 col-lg-12 col-sm-12 dd-item" data-sort="'+d.data+'">'):vt.mid==7?(html+='<div class="col-md-8 col-lg-8 col-sm-6 dd-item" data-sort="'+d.data+'">'):(html+='<div class="col-md-4 col-lg-4 col-sm-6 dd-item" data-sort="'+d.data+'">')
                                          vt.mid==1?icon='ifa-shl':vt.mid==2?icon='ifa-trend':vt.mid==3?icon='ifa-art':vt.mid==4?icon='ifa-med':vt.mid==6?icon='ifa-emo':vt.mid==7?icon='ifa-area':''
                                          html+='<div id="flexC'+d.data+'" class="flex-child widget"><div class="v-box widget-header"><span class="fl-left"><i class="ifa '+icon+'"></i><label class="medName">'+pname+'</label></span><a class="fl-right qedit" data-condition='+vt.newChoose+' data-target="'+(d.data+'♪'+vt.mid+'♪'+$('.flex-child').length+1)+'♪'+pname+'"><i class="ifa ifa-edit"></i></a></div><div class="widget-body">';
                                          vt.mid==7?html+='<div class="row"><div class="col-md-6 col-lg-6"><div id="'+id+'" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div><div class="col-md-6 col-lg-6"><div id="'+id+
                                          '_line" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div></div></div></div></div>':html+='<div id="'+id+'" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div></div></div></div>'
                                          $(t.$el).append(html);
                                          $('#flexC'+d.data+' .qedit').on('click',t.setScreen);
                                          var url='/client/module',data={params:{id:d.data}}
                                          t.dataEntry(url,data,function(d){
                                              d=d.data;
                                              id='#'+id;
                                              vt.mid==2?t.drowLineOrBarView(d,id,vt):vt.mid==6?t.drowPieView(d,id,vt.newChoose):vt.mid==4?t.drowRingPieView(d,id,vt.newChoose):vt.mid==7?(t.drowMapView(d,id,vt),t.drowTable3(d,id+'_line')):vt.mid==1?t.drowTable2(d,id):vt.mid==3?t.drowTable1(d,id):'';
                                          });
                                      })
                                    }
                                }
                            }
                        })
                        $('.dy').show(),$('.qx').show(),$('.mt').show(),$('.sj').show();
                        vt.mid==7?$('.dy').hide():vt.mid==6?$('.qx').hide():vt.mid==4?$('.mt').hide():vt.mid==1?$('.sj').hide():''
                        $('#infoModule').on('change',function(){
                          $('.dy').show(),$('.qx').show(),$('.mt').show(),$('.sj').show();
                          vt.mid=$(this).val();
                          $(this).val()==7?$('.dy').hide():$(this).val()==6?$('.qx').hide():$(this).val()==4?$('.mt').hide():vt.mid==1?$('.sj').hide():''
                          $('#nameModule').val($(this).find("option:selected").text())
                        })
                        $('.chk_all').on('click',function(){
                          if($(this).is(':checked')){
                            $(this).parents('td').find('input[name!=chk_all]').map(function(it){
                              it!=0?this.checked=true:''
                            })
                          }else{
                            $(this).parents('td').find('input[name!=chk_all]').map(function(it){
                              it!=0?this.checked=false:''
                            })
                          }
                        })
                        $('.chk_list').on('click',function(){
                          if($(this).is(':checked')){
                            var k=0,l=$(this).parents('td').find('.chk_list').length;
                            $(this).parents('td').find('.chk_list').map(function(){
                              this.checked?k++:''
                            })
                            k==l?$(this).parents('tr').find('.chk_all')[0].checked=true:$(this).parents('tr').find('.chk_all')[0].checked=false;
                          }else{
                            $(this).parents('tr').find('.chk_all')[0].checked=false;
                          }
                        })
                        $('#widname').on('click',function(){
                          var a=$('#nameModule').val();
                          if(!$('#widname').is(':checked')){
                            a.indexOf('-')==-1?"":$('#nameModule').val(a.substring(a.indexOf('-'),-1));
                          }else {
                            a.indexOf('-')==-1?"":a=a.substring(a.indexOf('-'),-1);
                            var b=function(){var arr='';$(cs.words).map(function(){this.nextSibling.data=="全选"?'':arr+=(this.nextSibling.data+'&')}); return arr}()
                            $('#nameModule').val(a+(b==""?b:'-'+b));
                          }
                        })
                        $('input[name=words]').on('click',function(){
                          var a=$('#nameModule').val();
                          a=a.indexOf('-')==-1?a:a.substring(a.indexOf('-'),-1)
                          if($('#widname').is(':checked')){
                            var b=function(){var arr='';$(cs.words).map(function(){this.nextSibling.data=="全选"?'':arr+=(this.nextSibling.data+'&')}); return arr}()
                            $('#nameModule').val(a+(b==""?b:'-'+b));
                          }
                        })
                      });
                    },
                    drowHtml:function(d){
                        var t=this;
                        var url='/client/home/get_module_list',data={params:{}};
                        t.dataEntry(url,data,function(d){
                            d=d.data;var flag=true,k=0;
                            var k=0;
                            var idx=setInterval(function(){
                              if(d==undefined){
                                clearInterval(idx);
                                $('.loading-container').addClass('loading-inactive');
                                return
                              }
                              if(k>d.length-1){
                                clearInterval(idx);
                                $('.qedit').on('click',t.setScreen),
                                $('.loading-container').addClass('loading-inactive');
                                // $(".flex-parent").sortable({
                                //   revert: true,
                                //   containment: "parent",
                                //   dropOnEmpty:true,
                                //   stop:cs.reordered
                                // });
                                // $(".flex-parent").disableSelection();
                                return
                              }
                              var item=d[k];
                              var id=("x_box_"+item.id);
                              item.condition.mtime=item.mtime;
                              var html='',icon='';
                              item.module_id==2?(html+='<div class="col-md-12 col-lg-12 col-sm-12 dd-item" data-sort="'+item.id+'">'):item.module_id==7?(html+='<div class="col-md-8 col-lg-8 col-sm-6 dd-item" data-sort="'+item.id+'">'):(html+='<div class="col-md-4 col-lg-4 col-sm-6 dd-item" data-sort="'+item.id+'">')
                              item.module_id==1?icon='ifa-shl':item.module_id==2?icon='ifa-trend':item.module_id==3?icon='ifa-art':item.module_id==4?icon='ifa-med':item.module_id==6?icon='ifa-emo':item.module_id==7?icon='ifa-area':''
                              html+='<div class="flex-child widget"><div class="v-box widget-header"><span class="fl-left"><i class="ifa '+icon+'"></i><label class="medName">'+item.name+'</label></span><a class="fl-right qedit" data-condition='+JSON.stringify(item.condition)+
                              ' data-target="'+(item.id+'♪'+item.module_id+'♪'+item.sort_order+'♪'+item.name)+'"><i class="ifa ifa-edit"></i></a></div><div class="widget-body">';
                              item.module_id==7?
                              html+='<div class="row"><div class="col-md-6 col-lg-6"><div id="'+id+'" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div><div class="col-md-6 col-lg-6"><div id="'+id+'_line" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div></div></div></div></div>':
                              html+='<div id="'+id+'" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div></div></div></div>'
                              item.module_id!=5?t.$el.append(html):'';
                              url='/client/module',data={params:{id:item.id}}
                              t.dataEntry(url,data,function(d){
                                d=d.data;
                                id='#'+id;
                                item.module_id==2?t.drowLineOrBarView(d,id,item):item.module_id==6?t.drowPieView(d,id,item):item.module_id==4?t.drowRingPieView(d,id,item):item.module_id==7?(t.drowMapView(d,id,item),t.drowTable3(d,id+'_line')):item.module_id==1?t.drowTable2(d,id):item.module_id==3?t.drowTable1(d,id):'';
                              });
                              k++;
                            },50)
                        })
                    },
                    drowTable1:function (dt,ele) {
                        if(dt.hits==0){
                          html='<table class="table2"><tr><td>暂无数据</td></tr></table>'
                          $(ele).html(html);
                          return;
                        }
                        var html='<table class="table2">';
                        dt.data.map(function (t2) {
                          // var href='#/Mdetail?id='+t2.uuid+'&sdate='+t2.created+'&media_type='+t2.media_type;
                          var target=t2.uuid+'&'+t2.created+'&'+t2.media_type;
                          // html+='<tr><td><div class="t-artview"><div class="t-iview"><i class="ifa ifa-circle"></i></div><div class="t-artdetail"><h5><a class="artsnap" data-target="'+target+'">'+t2.title+'</a><i class="ifa ifa-del delart" data-value="'+t2.uuid+'&'+t2.created+'&'+t2.media_type+'"></i></h5><p>'+(t2.txt.substr(0,80))+'</p></div></div></td></tr>'
                          html+='<tr><td><div class="t-artview"><div class="t-iview"><i class="ifa ifa-circle"></i></div><div class="t-artdetail"><h5><a class="artsnap" target="_blank" href="'+t2.url+'">'+t2.title+'</a><i class="ifa ifa-del delart" data-value="'+t2.uuid+'&'+t2.created+'&'+t2.media_type+'"></i></h5><p>'+(t2.txt.substr(0,80))+'</p></div></div></td></tr>'
                        })
                        html+='</table>';
                        $(ele).html(html);
                        $(ele+' .delart').on('click',cs.delarticle)
                        // $(ele+' .artsnap').on('click',cs.snapview)
                        $(ele+' .table2').liMarquee({
                          scrollamount:30,
                          direction: 'up'
                        });
                    },
                    drowTable2:function (dt,ele) {
                        var html='<table class="table1">';
                        html+='<thead><tr><td>数据来源</td><td>今天</td><td>近7天</td><td>近30天</td><td>全部</td></tr></thead><tbody>';
                        for(var it in dt.total){
                            html+='<tr><td>'+it+'</td>';
                            dt.total[it].map(function(i){
                                html+='<td>'+i+'</td>'
                            })
                            html+='</tr>';
                        }
                        html+='</tbody></table>';
                        $(ele).html(html);
                    },
                    drowTable3:function (dt,ele) {
                        var html='<table class="table3"><tbody>',d=[];
                        dt.title.map(function(it,id){
                            d.push({name:it,value:dt.total[id]})
                        })
                        d=d.sort(function(a,b){return b.value-a.value});
                        var max=d[0].value;
                        d.map(function(it){
                            var w=it.value/max*100
                            html+='<tr><td>'+it.name+'</td><td><div class="progress"><div class="progress-bar progress-bar-info" style="width:'+w+'px" ></div></div></td>';
                            html+='<td>'+it.value+'</td></tr>';
                        })
                        html+='</tbody></table>';
                        $(ele).html(html);
                    },
                    changeView:function(dt,ele){
                        // var t=this,url=''
                    },
                    drowLineOrBarView:function (d,ele,item) {
                        var option={
                            seriesTypes:[],
                            title:'',
                            legend:[],
                            //dataZoom:[{type: 'slider',show: true,xAxisIndex: [0],start: 1,end: 15}],
                            axisDirec:'x',
                            axis:d.title,
                            imgname:item.name,
                            seriesname:"",
                            seriesData:[]
                        };
                        var obj=d.total;
                        for(var na in d.total){
                            option.legend.push(na);
                            option.seriesTypes.push('line');
                            option.seriesData.push({name:na,value:obj[na]})
                        }
                        $(ele).echartsSetDataForLineBar(option);
                    },
                    drowPieView:function (d,ele,item) {
                      typeof(item)=="string"?item=JSON.parse(item):''
                        var option={
                            title:'',
                            seriesRadius:'55%',
                            legend:d.title,
                            imgname:item.name,
                            seriesname:item.name,
                            seriesData:[]
                        };
                        d.title.map(function(it,idx){
                            option.seriesData.push({name:it,value:d.total[idx]})
                        })
                        $(ele).echartsSetDataForPie(option);
                    },
                    drowRingPieView:function (d,ele,item) {
                      typeof(item)=="string"?item=JSON.parse(item):''
                        var option={
                            title:'',
                            seriesRadius:["30%","50%"],
                            legend:d.title,
                            imgname:item.name,
                            seriesname:item.name,
                            seriesData:[]
                        };
                        d.title.map(function(it,idx){
                            option.seriesData.push({name:it,value:d.total[idx]})
                        })
                        $(ele).echartsSetDataForPie(option);
                    },
                    drowMapView:function (d,ele,item) {
                        var option={
                            title:'地域分布',
                            visualMapMin:0,
                            visualMapMax:100,
                            imgname:item.name,
                            series:[{
                              seriesMapName:'地域分布',
                              seriesMapType:'china',
                              seriesLabel:false,
                              seriesMapData:[]
                            }]
                        }
                        var arr=[];
                        d.title.map(function(it,id){
                            arr.push({name:it,value:d.total[id]})
                        })
                        option.visualMapMax=arr.sort(function(a,b){return b.value-a.value})[0].value;
                        option.series[0].seriesMapData=arr;
                        $(ele).echartsSetDataForMap(option);
                    },
                    delarticle:function(e){
                      var t=this;
                      bootbox.confirm({
                          message: "您确定要删除吗？",
                          size:'small',
                          buttons: {
                              confirm: {
                                  label: '确定',
                                  className: 'btn-info'
                              },
                              cancel: {
                                  label: '取消',
                                  className: 'btn-default'
                              }
                          },
                          callback: function (result) {
                              if(result){
                                var d=$(t).attr('data-value').split('&');
                                cs.dataEntry('/client/api/delete',{params:{
                                    uuid:d[0],
                                    sdate:d[1],
                                    media_type:d[2]
                                    }},function(d){
                                    d.code!=-1?($(e.target).parents('tr').remove(),vt.openMsg('删除成功！',"success")):(vt.$message.error('删除失败！'))
                                })
                              }
                          }
                      });
                    },
                    delModel:function(idx) {
                        var t=this;
                        bootbox.confirm({
                            message: "您确定要删除吗？",
                            size:'small',
                            buttons: {
                                confirm: {
                                    label: '确定',
                                    className: 'btn-info'
                                },
                                cancel: {
                                    label: '取消',
                                    className: 'btn-default'
                                }
                            },
                            callback: function (result) {
                                if(result){
                                    var url='/client/home/delete_module',
                                        data={params:{id:vt.tid}};
                                    t.dataEntry(url,data,function(d) {
                                        bootbox.hideAll();
                                        d.code!=-1?($('#x_box_'+vt.tid).parents('.dd-item').remove()):vt.$message.error('删除失败')
                                    })
                                }
                            }
                        });
                    },
                    reordered:function($el) {
                        var arr=[];
                        $el.target.childNodes.forEach(function(it,ix){
                          arr.push([$(it).attr('data-sort'),ix])
                        })
                        var url='/client/home/move_module',d={params:{data:arr}}
                        cs.dataEntry(url,d,function(d){})
                    },//弹出条件框
                    setScreen:function(){
                        var t=this;
                        vt.tid=$(t).attr("data-target").split('♪')[0];
                        vt.mid=$(t).attr("data-target").split('♪')[1];
                        vt.srtid=$(t).attr("data-target").split('♪')[2];
                        var name=$(t).attr("data-target").split('♪')[3];
                        vt.choose=JSON.parse($(t).attr("data-condition"));
                        $('.loading-container').removeClass('loading-inactive');
                        var url='/client/api/get_lists',data={params:{}};
                        cs.dataEntry(url,data,function(data){
                          $('.loading-container').addClass('loading-inactive');
                            var d=data.data;
                            var html=cs.setQueryList(d,vt.mid,name);
                            bootbox.dialog({
                                title: '模块设置',
                                message: html,
                                buttons: {
                                    noclose: {
                                        label: "删除",
                                        className: 'btn-info',
                                        callback: function(){
                                            cs.delModel(vt.mid);
                                            return false;
                                        }
                                    },
                                    cancel: {
                                        label: "取消",
                                        className: 'btn-default'
                                    },
                                    ok: {
                                        label: "确定",
                                        className: 'btn-info',
                                        callback: function(e){
                                          if($(cs.words).length==0){
                                            vt.openMsg('主题选择不能为空！',"warning")
                                            return false;
                                          }
                                          var arr=[];vt.tidname=$(cs.name).val();
                                          var url='/client/home/setting_module',
                                              data={params:{
                                                  module_id:$(cs.info).val(),
                                                  name:$(cs.name).val(),
                                                  id:vt.tid,
                                                  mtime:$(cs.mtime).val(),
                                                  wid:$(cs.words).length==0&&vt.mid!=1?"":$(cs.words)[0].value==""&&vt.mid!=1?"":function(){var arr=[];$(cs.words).map(function(t,i){vt.mid==1&&t==0&&this.value==""?'':arr.push(this.value)}); return arr}(),
                                                  side:$(cs.slide).length==0||$(cs.slide)[0].value==""?"":function(){var arr=[]; $(cs.slide).map(function(){arr.push(this.value)}); return arr}(),
                                                  media_type:$(cs.media_type).length==0||$(cs.media_type)[0].value==""?"":function(){var arr=[]; $(cs.media_type).map(function(){arr.push(this.value)}); return arr}(),
                                                  property_type:$(cs.property_type).length==0||$(cs.property_type)[0].value==""?"":function(){var arr=[]; $(cs.property_type).map(function(){arr.push(this.value)}); return arr}(),
                                                  dimension:$(cs.dimension).val(),
                                                  region_type:$(cs.region).val(),
                                                  sort_order:vt.srtid
                                          }}
                                          vt.befochoose=JSON.stringify(data.params);
                                          cs.dataEntry(url,data,function(d){
                                              if(d.code!='-1'){
                                                vt.mid==7?$('#x_box_' + vt.tid).parents('.widget').find('.qedit').attr('data-condition',vt.befochoose):$('#x_box_'+vt.tid).parent().prev().find('.qedit').attr('data-condition',vt.befochoose);
                                                vt.mid==7?$('#x_box_'+vt.tid).parents('.widget').find('.qedit').attr('data-target',vt.tid+'♪'+vt.mid+'♪'+vt.srtid+'♪'+vt.tidname):$('#x_box_'+vt.tid).parent().prev().find('.qedit').attr('data-target',vt.tid+'♪'+vt.mid+'♪'+vt.srtid+'♪'+vt.tidname);
                                                  var id=("x_box_"+vt.tid);
                                                  vt.mid!=7?$('#x_box_'+vt.tid).parents('.dd-item').find('#x_box_'+vt.tid).addClass('remove'):$('.widget-body').parents('.dd-item').find('#x_box_'+vt.tid).addClass('remove');
                                                  vt.mid!=7?$('#x_box_'+vt.tid).parents('.dd-item .widget-body').append('<div id="'+id+'" class="chart-view"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div>'):
                                                  $('#x_box_'+vt.tid).parents('.dd-item .widget-body').html('<div class="row"><div class="col-md-6 col-lg-6"><div id="'+id+'" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div><div class="col-md-6 col-lg-6"><div id="'+id+'_line" class="chart-view" ><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div></div></div></div>');
                                                  $('#x_box_'+vt.tid).parents('.dd-item').find('.remove').remove();
                                                  vt.mid==7?$('#'+id).parents('.widget').find('.medName').html(vt.tidname):$('#'+id).parent().prev().find('.medName').html(vt.tidname);
                                                  var url='/client/module',data={params:{id:vt.tid}}
                                                  cs.dataEntry(url,data,function(d){
                                                      d=d.data;
                                                      id='#'+id;
                                                      vt.mid==2?cs.drowLineOrBarView(d,id,vt):vt.mid==6?cs.drowPieView(d,id,vt.befochoose):vt.mid==4?cs.drowRingPieView(d,id,vt.befochoose):vt.mid==7?(cs.drowMapView(d,id,vt),cs.drowTable3(d,id+'_line')):vt.mid==1?cs.drowTable2(d,id):vt.mid==3?cs.drowTable1(d,id):'';
                                                      //cs.gridly.gridly('layout');
                                                  });
                                              }else {
                                                  vt.$message.error('修改失败！');
                                              }
                                          })
                                        }
                                    }
                                }
                            })
                            $('.dy').show(),$('.qx').show(),$('.mt').show(),$('.sj').show();
                            vt.mid==7?$('.dy').hide():vt.mid==6?$('.qx').hide():vt.mid==4?$('.mt').hide():vt.mid==1?$('.sj').hide():''
                            $('#infoModule').on('change',function(){
                              $('.dy').show(),$('.qx').show(),$('.mt').show(),$('.sj').show();
                              vt.mid=$(this).val();
                              $(this).val()==7?$('.dy').hide():$(this).val()==6?$('.qx').hide():$(this).val()==4?$('.mt').hide():vt.mid==1?$('.sj').hide():''
                              $('#nameModule').val($(this).find("option:selected").text())
                            })
                            $('.chk_all').on('click',function(){
                              if($(this).is(':checked')){
                                $(this).parents('td').find('input[name!=chk_all]').map(function(it){
                                  it!=0?this.checked=true:''
                                })
                              }else{
                                $(this).parents('td').find('input[name!=chk_all]').map(function(it){
                                  it!=0?this.checked=false:''
                                })
                              }
                            })
                            $('.chk_list').on('click',function(){
                              if($(this).is(':checked')){
                                var k=0,l=$(this).parents('td').find('.chk_list').length;
                                $(this).parents('td').find('.chk_list').map(function(){
                                  this.checked?k++:''
                                })
                                k==l?$(this).parents('tr').find('.chk_all')[0].checked=true:$(this).parents('tr').find('.chk_all')[0].checked=false;
                              }else{
                                $(this).parents('tr').find('.chk_all')[0].checked=false;
                              }
                            })
                            $('#widname').on('click',function(){
                              var a=$('#nameModule').val();
                              if(!$('#widname').is(':checked')){
                                a.indexOf('-')==-1?"":$('#nameModule').val(a.substring(a.indexOf('-'),-1));
                              }else {
                                a.indexOf('-')==-1?"":a=a.substring(a.indexOf('-'),-1);
                                var b=function(){var arr='';$(cs.words).map(function(){this.nextSibling.data=="全选"?'':arr+=(this.nextSibling.data+'&')}); return arr}()
                                $('#nameModule').val(a+(b==""?b:'-'+b.substring(b.lastIndexOf('&'),-1)));
                              }
                            })
                            $('input[name=words]').on('click',function(){
                              var a=$('#nameModule').val();
                              a=a.indexOf('-')==-1?a:a.substring(a.indexOf('-'),-1)
                              if($('#widname').is(':checked')){
                                var b=function(){var arr='';$(cs.words).map(function(){this.nextSibling.data=="全选"?'':arr+=(this.nextSibling.data+'&')}); return arr}()
                                $('#nameModule').val(a+(b==""?b:'-'+b.substring(b.lastIndexOf('&'),-1)));
                              }
                            })
                        });

                    },
                    snapview:function(){
                      var p=$(this).attr('data-target').split('&');
                      var url='/client/article/get_articles_info';
                      cs.dataEntry(url,{params:{uuid:p[0],sdate:p[1],media_type:p[2]}},function(d){
                        vt.snap=d.data;
                        $('#snapModal').modal("show");
                      })
                    },//设置查询列表
                    setQueryList:function (d,chk,n) {
                        var html='',s=vt.choose;
                        html='<table class="table table-striped table-bordered table-hover trem"><tbody>';
                        html+='<tr><td class="text-align-center">类型</td><td><select v-model="infoModule" id="infoModule">‘'+vt.infoModule.map(function(item) {
                            return '<option value='+item.id+' '+(item.id==chk?"selected":"")+' >'+item.name+'</option>'
                        })+'’</select></td></tr>';
                        html+='<tr><td class="text-align-center">名称</td><td><input v-model="nameModule" id="nameModule" type="text" value="'+(n?n:'')+'" /><label><input id="widname" type="checkbox" '+(n.indexOf('-')!=-1?"checked":"")+' />加主题词后缀</label></td></tr>';
                        html+='<tr><td class="text-align-center">主题</td><td><label><input class="chk_all" name="words" type="checkbox" value="" '+(s.wid==""||s.length==0||s.wid.length==d.words.length?"checked":'')+' >全选</label>'+d.words.map(function(item,idx) {
                            return '<label><input class="chk_list" name="words" value="'+item.id+'" type="checkbox" '+(s.length==0||s.wid==""?"checked":s.wid?(s.wid.indexOf(item.id+'')<0?"":"checked"):"")+'>'+item.name+'</label>'
                        })+'</td></tr>';
                        html+='<tr class="sj"><td class="text-align-center">时间轴</td><td><label><input v-model="mtime" name="mtime" value="1" type="radio" '+(s.mtime==1?"checked":"")+'>今天</label><label><input v-model="mtime" name="mtime" value="6" type="radio" '+(s.mtime==6||s.length==0?"checked":"")+'>7天内</label><label><input v-model="mtime" name="mtime" value="29" type="radio" '+(s.mtime==29?"checked":"")+'>30天内</label></td></tr>';
                        html+='<tr class="qx"><td class="text-align-center">属性</td><td><label><input class="chk_all" name="slide" type="checkbox" value="" '+(s.side==""||s.length==0||s.side.length==d.side.length?"checked":'')+'>全选</label>'+d.side.map(function(item) {
                            return '<label><input class="chk_list" name="slide" value="'+item.id+'" type="checkbox" '+(s.length==0||s.side==""?"checked":s.side?(s.side.indexOf(item.id)<0?"":"checked"):"")+'>'+item.name+'</label>'
                        })+'</td></tr>';
                        html+='<tr><td class="text-align-center">媒体属性</td><td><label><input class="chk_all" name="property_type" type="checkbox" value="" '+(s.property_type==""||s.length==0||s.property_type.length==d.property_type.length?"checked":'')+'>全选</label>'+d.property_type.map(function(item) {
                            return '<label><input class="chk_list" name="property_type" value="'+item.id+'" type="checkbox" '+(s.length==0||s.property_type==""?"checked":s.property_type?(s.property_type.indexOf(item.id+'')<0?"":"checked"):"")+'>'+item.name+'</label>'
                        })+'</td></tr>';
                        html+='<tr><td class="text-align-center">维度</td><td><label><input name="dimension" type="radio" value="" '+(s.dimension==undefined||s.dimension==""||s.length==0?"checked":'')+'>不设定</label>'+d.dimension.map(function(item) {
                            return '<label><input name="dimension" value="'+item.id+'" type="radio" '+(s.dimension?(s.dimension.indexOf(item.id+'')<0?"":"checked"):"")+'>'+item.name+'</label>'
                        })+'</td></tr>';
                        html+='<tr class="mt"><td class="text-align-center">媒体平台</td><td><label><input class="chk_all" name="media_type" type="checkbox" value="" '+(s.media_type==undefined||s.media_type==""||s.length==0||s.media_type.length==d.media_type.length?"checked":'')+'>全选</label>'+d.media_type.map(function(item) {
                            return '<label><input class="chk_list" name="media_type" value="'+item.id+'" type="checkbox" '+(s.length==0||s.media_type==""?"checked":s.media_type?(s.media_type.indexOf(item.id+'')<0?"":"checked"):"")+' />'+item.name+'</label>'
                        })+'</td></tr>';
                        html+='<tr class="dy"><td class="text-align-center">地域</td><td><label><select v-model="region" id="region" ><option value="">全国</option>'+d.region_type.map(function(item) {
                            return '<option value="'+item.id+'" '+(s.region_type?(parseInt(s.region_type)!=item.id?"":"selected"):"")+' >'+item.name+'</option>'
                        })+'</select></label></td></tr>';
                        html+='</tbody></table>';
                        return html.replace(/,/g,"");
                    }

                }
            }()
            created();
        })();
    }
}
</script>
<style>
.modual{
    text-align: center;
}
.flex-parent{
    position: relative;
    display: block;
}
.flex-parent .flex-child{
    width:100%;
    height: 330px;
    /*float: left;
    margin-left: 15px;
    display: inline-block;
    z-index: 0;
    background-color: #fff;*/
}
.flex-child table{
    width: 100%;
    height: 100%;
    text-align: center;
    border-collapse: collapse;
}
.flex-child .table1 td{
    border: 1px solid #e9e9e9;
}
table.trem td:first-child{
  width: 100px;
  vertical-align: middle;
}
table.trem td:last-child{
  width: 500px;
}
.table1 td{
  height: 25px;
}
.table2{
  /*margin-left: 8px;*/
  height: 280px;
}
.table2 td{
  border-left: 1px solid #dad7d7;
}
.table2 td .t-artview{
  height:128px;
  width:100%;
  position:relative;
  left:-10px;
  border-bottom:1px solid #ccc;
}
.table2 td .t-iview{
  width:20px;
  height:100%;
  float:left;
}
.table2 .t-artdetail h5{
  text-align: left;
  width: 88%;
}
.table2 .t-artdetail h5 a{
  position: relative;
  font-size: 14px;
  top:1px;
  color: #000;
  text-decoration: none;
}
.table2 .t-artdetail h5 i{
  position: absolute;
  top:2px;
  right: 10px;
}
.table2 .t-artdetail p{
  font-size: 12px;
  text-align: left;
  color:#939393;
  word-wrap: break-word;
  word-break: break-all;
}
.table3 tr td:first-child{
  min-width: 70px;
}
.table3 tr td:last-child{
  width: 70px;
}
.table3 tr td .progress{
  max-width: 200px;
  min-width: 100px;
}
.chart-view{
    width: 100%;
    height: 280px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}
.fl-right{
  position: absolute;
  right: 10px;
  top:5px;
  text-decoration: none;
  cursor: pointer;
}
table input[type=checkbox],table input[type=radio] {
	opacity: 1;
	position: relative;
	left: 0;
	z-index: 12;
	width: 15px;
	height: 15px;
	cursor: pointer;
}
.widget-header {
    /* line-height: 35px; */
    padding: 8px;
    margin: 0;
}
.widget-body:hover{
  background-color: white;
}
.fl-left{
  float: left;
}
.fl-left .medName{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  font-size: 16px;
  width: 250px;
  text-align: left;
}
.fl-left i{
  position: relative;
  top:0px;
  margin-right: 12px;
}
.theme{
    text-align: center;
}
.theme .thimg{
    width: 100%;
    height: 96px;
    background-color: #c4e3f3;
}
.theme .thimg img{
  width: 100%;
}
.theme .thimg.active{
  background-color: #3f45ff!important;
}
.bootbox-body table td:last-child label{
  display: inline-block;
  margin: 0 5px;
}
.addModel{
  font-size: 24px;
  color: #000;
  border:1px dashed #ccc;
}
.survey{
  text-align: center;
}
.survey .seuvey-list{
  width: 1%;
  display: table-cell;
  text-align: center;
  border-right: 1px solid #d4d4d4;
}
.survey .seuvey-list .p1{
    font-size: 35px;
    font-weight: 800;
    line-height: 36px;
}
.survey .seuvey-list .p2{
  font-size: 16px;
  line-height:16px;
}
.survey .seuvey-list .p2 i{
  position: relative;
  top:0px;
  margin-right: 3px;
}
.survey .seuvey-list .p3{
  font-size: 12px;
  color: #494949;
}
.survey .seuvey-list:last-child{
  border-right: none;
}
.text-color-sky{
  color: #2cc3e8;
}
.page-body,.widget-body,.well{
  background-color: white;
}
.widget-body{
border-bottom:none;
} .widget-header{
  border-top:none;
}
.myh3{
      line-height: 18px;
    font-weight: 400!important;
    font-size: 20px;
}
</style>
