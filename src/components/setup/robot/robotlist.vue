<template>
  <div>
    <div class="row">
      <div class="col-lg-3 col-sm-3">
        <div class="widget wleft">
          <div class="widget-body w-left">
            <a v-if="robotstart" @click="Intelligent"  class="btn btn-default btn-sm" ><span>运行智能观点</span></a><!-- :to="{name:'explore',query:{id:sh.opinion_id}}" &&filecount==0 -->
            <a class="btn btn-default btn-sm"  href="javascript:void(0)" v-else disabled>运行智能观点</a>
            <div>
                <p>{{robotname}}——总体进度</p>
                <el-progress type="circle" :percentage="percent"></el-progress>
            </div>

            <div class="panel panel-default">
                <!-- 获取分类接口-->
                <div class="panel-body" v-for="item in category" >
                    <span v-on:dblclick="a(item.name,$event)">{{item.name}}</span>
                    <input class="catename" style='display:none' v-model="viewpoint.cateName" v-on:blur="changename(2,{id:item.id,name:item.name},$event)" />
                    <!-- <span class="glyphicon glyphicon-pencil" @click="changename(1,{id:item.id,name:item.name},$event)"></span> -->
                    <span class="glyphicon glyphicon-plus-sign" @click='smcate(item.id,$event)'></span>
                    <span class="glyphicon glyphicon-remove" @click="delcate(2,item.id,$event)"></span>
                    <hr class="hrr"/>
                    <div class="progress-parent" v-for="i in item.child" @dragover='dragover($event)' >
                        <div class="progress" @click="changename(1,{id:i.id,name:i.name},$event)"  draggable="true" :data-count="i.num"  @drop='drop($event,i.id)' >
                          <div :class="i.num>=10?'progress-bar cur':'progress-bar'" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style='"width:"+(i.num>10?10:i.num)*18.6+"px"'></div>
                        </div>
                        <!-- <router-link :to="{name:'rdetail',query:{id:i.id,name:i.name}}" target="_blank"><span>{{i.name}}</span></router-link> -->
                        <span v-on:dblclick="a(i.name,$event)" >{{i.name}}</span>
                        <input class="catename" style='display:none' v-model="viewpoint.cateName" v-on:blur="changename(2,{id:i.id,name:i.name},$event)" />
                        <!-- <i @click="changename(1,{id:i.id,name:i.name},$event)" class="glyphicon glyphicon-pencil" ></i> -->
                        <span class="glyphicon glyphicon-remove" @click='delcate(3,i.id,$event)'></span>
                        阀值:<span class="cate_count">{{i.num}}</span>/10
                    </div>
                </div>
            </div>
          </div>
          <div class="panel-footer">
              <h5 class="panel-title">新增类别
                  <span class="glyphicon glyphicon-plus-sign" @click='newcate()'></span>
              </h5>
          </div>
        </div>
      </div>
      <div class="col-lg-9 col-sm-9">
        <!-- @mouseenter="s" @mouseleave="h" -->
        <div class="xftcrumb widget-body">
          <label>全部结果<span>&gt;</span></label>
          <label>{{choose.chwid}}<span>&gt;</span></label>
          <div style="display:inline-block" v-for="it in choose.chlist">
            <div class="menu-drop" >{{it.na}}<span @click="ab(1,it.tg,it.val,it.na)">&times;</span></div>
            <!-- <span>&gt;</span> -->
          </div>
          <label class="menu-drop" v-if="choose.chlist.length!=0" style="margin-bottom: 5px;" @click="ab(2)">清除筛选条件</label>
        </div>
        <div class="widget-body fathbox">
          <table class="table table-striped  table-hover">
            <tbody>
              <tr><td class="text-align-center">维度</td><td><label><input @click="searchdult" type="radio" value="" name="dimension" v-model="sh.dimension"  />不限</label><label v-for="it in qlist.dimension"><input @click="searchdult" type="radio" :value="it.id" name="dimension" v-model="sh.dimension"  /><span>{{it.name}}</span></label></td></tr>
              <tr><td class="text-align-center">属性</td><td><label><input @click="searchdult" type="radio" value="" name="side" v-model="sh.side"  />不限</label><label v-for="it in qlist.side"><input @click="searchdult" type="radio" :value="it.id" name="side" v-model="sh.side"  /><span>{{it.name}}</span></label></td></tr>
              <tr class="qlisttoggle"><td class="text-align-center">媒体平台</td><td><label><input @click="checkedAllmedia($event)" type="checkbox" value="" v-model="checked"  />全选</label><label v-for="it in qlist.media_type"><input @click="searchdult" type="checkbox" :value="it.id" name="media_type" v-model="sh.media_type"  /><span>{{it.name}}</span></label></td></tr>
              <tr class="qlisttoggle"><td class="text-align-center">地域</td><td><select @change="searchdult" id="region" v-model="sh.region_type"><option v-model="sh.region_type" value="">全国</option><option v-for="it in qlist.region_type" :value="it.id" v-model="sh.region_type">{{it.name}}</option></select></td></tr>
              <tr class="qlisttoggle"><td class="text-align-center">媒体属性</td><td><label><input @click="searchdult" type="radio" value="" name="property_type" v-model="sh.property_type"  />不限</label><label v-for="it in qlist.property_type"><input @click="searchdult" type="radio" :value="it.id" name="property_type"  v-model="sh.property_type" /><span>{{it.name}}</span></label></td></tr>
            </tbody>
            <tfoot>
              <!-- <tr><td colspan="2"><i :class="this.tbmore==false?'ifa ifa-table-more-g ifacenter':'ifa ifa-table-less-g ifacenter'"></i></td></tr> -->
              <tr><td colspan="2" style="padding:10px 0;">
                <div class="mydiv">
                <span  class=" myspan"  @click="tablemore">{{ tbmore==false?'更多选项(媒体平台、地域、媒体属性)': '收起' }}
                  <i :class="this.tbmore==false?'xftifa ifa-table-more-g':'xftifa ifa-table-less-g'"></i></span>
                </div>
              </td></tr>
            </tfoot>
          </table>
        </div>
        <div class="widget">
          <div class="widget-header text-align-left xftbar">
            <label><input type="checkbox" name="" v-model="sh.checked" @click="checkedAll" /><span>全选</span></label>
            <a class="btn btn-sm artsort cur" @click="createdtime($event)">时间降序</a>
            <a class="btn btn-sm artsort" @click="localtionweight($event)">权重降序</a>
            <a class="btn btn-sm artsort" @click="simcout($event)">转载降序</a>
            <a class="btn btn-sm artsort" @click="view($event)">阅读数</a>
            <a class="btn btn-sm artsort" @click="reply($event)">评论数</a>
            <select @change="listajax" v-model="sh.filter"><option value='0' >不过滤</option><option value='1' >过滤</option></select>
            <select v-model="sh.search_type"><option value='1' >搜内容</option><option value='2' >搜媒体</option><option value='3' >搜标题</option></select>
            <input type ="text" class="keywords input-search" placeholder ="在结果中搜索" v-model="sh.search_txt"/>
            <a class="btn btn-sm" @click = "searchdult">搜索</a>
            <label class="pagedetail">共{{pageCount}}篇文章</label>
          </div><!--Widget Header-->
          <div class=" art_total">
            <ul class="abc">
              <li v-for="it in artlist" class="article_lis" draggable='true' @dragstart="dragstart($event)" :id="it.uuid+'_'+it.created+'_'+it.media_type" :key="it.id">
                <div class="widget-body artp art_list">
                  <h5><input type="checkbox" name="" v-model="sh.batch" :value="it.uuid" />
                    <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                    :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple" data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title="" :data-content="it.is_focus" >{{it.site_name}}</a>
                    <!-- <label><router-link :to="{name:'Mdetail',query:{id:it.uuid,sdate:it.created,media_type:it.media_type,dtype:3}}">{{it.title}}</router-link></label> -->
                    <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a></label>
                    <label v-else><a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a></label>
                  </h5>
                  <p class="art_p_content" v-html="it.txt"><span>{{it.txt}}</span></p>
                  <p class="art_p_detail grey">
                    <span>发布时间：{{it.pubdate}} </span><span> 阅读数：{{it.view}}  </span><span>维度：{{it.dimension}}  </span>
                    <span>属性:</span>
                    <span @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type})" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
                    <!-- <router-link v-if="it.sim_count!=0" :to="{name:'similar',query:{id:it.sim_id,type:3}}">相似文章{{it.sim_count}}</router-link> -->
                    <a v-if="it.sim_count!=0" href="javascript:void(0)" @click="snapview(it,1)">相似文章:{{it.sim_count}}</a>
                  </p>
                  <p class="art_p_edit">
                  <!-- <i class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" ></i> 更改 -->
                  <i  title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="follow({uuid:it.uuid,article_date:it.created,type:'3',side:it.side,media_type:it.media_type},$event)" :data-unid="it.is_collect" ></i><!--   --> <!-- 收藏 -->
                  <i class="ifa ifa-coll-g" data-toggle="tooltip" data-placement="bottom" title="加入分类" @click='intocate(1,{uuid:it.uuid,created:it.created,media_type:it.media_type})'></i>
                  <!-- <i @click="artDel({uuid:it.uuid,sdate:it.article_date},$event)">删除</i> -->
                  </p>
                </div>
              </li>
            </ul>
            <div class="artfooter widget-body " v-show="this.artlist">
              <div style="display:inline-block">
                <label><input type="checkbox" name="" v-model="sh.checked" @click="checkedAll" />全选</label>
                <a :class="sh.batch.length>0?'btn btn-info':'btn btn-info disabled'" @click="intocate(2)">加入分类<i class="fa fa-sign-in right"></i></a>
                <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allCollect">收藏<i class="glyphicon glyphicon-heart right"></i></a>
                <a :class="sh.batch.length>0?'btn btn-info':'btn btn-info disabled'" @click="artDel">删除<i class="glyphicon glyphicon-trash right"></i></a>
              </div>
              <div  v-show="this.pageCount>0"style="float:right">
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
            </div>
          </div>
        </div>
      </div>
      <div id="cate" class="modal bs-example-modal-sm fade" tabindex="-1" role="dialog" aria-hidden="true">
         <div class="modal-dialog" role="document">
             <div class="modal-content">
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                     <h4 class="modal-title">请选择对比主题</h4>
                 </div>
                 <div class="modal-body">
                   <ul v-for="item in category">
                       <li>
                         <h5>{{item.name}}</h5>
                       </li>
                       <li>
                         <label v-for="i in item.child"> <input type="radio" :key="i.id" :value="i.id" name="cate" v-model="listparam.category_id"/>{{i.name}}</label>
                       </li>
                   </ul>
                 </div>
                 <div class="modal-footer">
                   <button type="button" class="btn btn-default" @click="suretocate">确定</button>
                   <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                 </div>
             </div>
         </div>
      </div>
      <div id="viewpoint" class="modal fade snapmodal" tabindex="-1" role="dialog" aria-hidden="true">
         <div class="modal-dialog" role="document">
             <div class="modal-content">
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                     <h4 class="modal-title">修改观点列表</h4>
                 </div>
                 <div class="modal-body">
                      <!-- <input id="cateName" v-model="viewpoint.cateName" placeholder="观点名称" />
                      <button class="btn btn-default" @click="changename(2)">修改</button> -->
                      <table class="table table-striped table-bordered table-hover" v-if="viewpoint.viewlist">
                        <thead>
                          <tr>
                            <td>标题</td><td>网站名称</td><td>操作</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="vl in viewpoint.viewlist">
                            <td>
                              <a href="javascript:void(0)" @click="snapview(vl)">{{vl.title}}</a>
                              <!-- <router-link :to="{name:'Mdetail',query:{id:vl.uuid,sdate:vl.created,media_type:vl.media_type}}">{{vl.title}}</router-link> -->
                            </td>
                            <td>{{vl.site_name}}</td>
                            <td><a class="btn btn-default btn-xs" href="javascript:void(0)" @click="changename(3,{id:vl.uuid,cad:vl.created,mdp:vl.media_type},$event)">删除</a></td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="subpagination">
                        <div class="subPageCode"></div>
                      </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                 </div>
             </div>
         </div>
      </div>
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
             <div class="modal-content" v-if="snapart.onlyView">
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                     <h4 class="modal-title" v-if="snap.media_type==6" v-html="'@'+snap.title">{{snap.title}}</h4>
                     <h4 class="modal-title" v-else v-html="snap.title">{{snap.title}}</h4>
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
                             <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDel({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},$event)"></i><span>删除</span> -->
                           </tr>
                           <tr>
                             <td>文章属性：<span @click="changeSide({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},1,snap)" :class="snap.side==1?'neutral':snap.side==3?'positive':snap.side==-3?'opposite':'opposite'">{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>
                             <td><i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="modalfollow({uuid:snap.uuid,article_date:snap.created,type:'3',side:snap.side,media_type:snap.media_type},$event)" :data-unid="snap.is_collect" ></i><span>收藏</span></td>
                             <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="预警" :class="snap.is_warning==0?'ifa ifa-clock-o ifa-b':'ifa ifa-clock-s ifa-b'" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i><span>预警</span> -->
                           </tr>
                       </table>
                     </div>
                   </div>
                   <div class="snapsblist">
                     <p v-html="snap.txt">{{snap.txt}}</p>
                     <div class="well with-header arttop" v-show="this.snapart.artlist.length !=0">
                         <div class="header bordered-gray">
                           <div class="ptitle xftdei "><i class="ifa ifa-datatotal"></i><label class="myh4">相似文章</label></div>
                         </div>
                         <div class="art_total" v-loading="loading">
                           <ul>
                             <li v-for="it in snapart.artlist">
                               <div class="widget-body art_list">
                                 <h5>
                                   <input type="checkbox" name="" v-model="snapart.batch" :value="it.uuid" />
                                   <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                                   :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple"
                                   data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title=""
                                    :data-content="it.is_focus" >{{it.site_name}}</a>
                                   <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it,2)" v-html="'@'+it.title">{{it.title}}</a></label>
                                   <label v-else><a href="javascript:void(0)" @click="snapview(it,2)" v-html="it.title">{{it.title}}</a></label>
                                 </h5>
                                 <p class="art_p_content" v-html="it.txt">{{it.txt}}</p>
                                 <p class="art_p_detail grey">
                                   <span>发布时间：{{it.pubdate}} </span><span> 阅读数:{{it.view}}</span>  <!--   维度：{{it.dimension}}  -->
                                   <span>权重:{{it.weight}}&nbsp;</span>
                                   <span v-if="sh.mediaType==6" >粉丝数:{{it.followers_count}}条</span>
                                   <span v-if="sh.mediaType==6" >点赞数:{{it.attitudes_count}}条</span>
                                   <span>属性:</span><span @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type},2)" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
                                   <!-- <router-link v-if="it.sim_count!=0" :to="{name:'similar',query:{id:it.sim_id,type:1}}">相似文章:{{it.sim_count}}</router-link> -->
                                 </p>
                                 <p class="art_p_edit">
                                   <!-- <i @click="setfeedback({uid:it.uuid,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="错误反馈" ></i> -->
                                   <!-- <i  class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" ></i> 更改 -->
                                   <!-- <i @click="follow({uuid:it.uuid,article_date:it.created,type:'1',side:it.side,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o':'ifa ifa-heart-s'" :data-unid="it.is_collect" ></i> 收藏 -->
                                   <i @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})" data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o" ></i><!-- 导出 -->
                                   <!-- <i @click="getWarnType({uid:it.uuid,url:it.site_url,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o" ></i> 发送预警 -->
                                   <!-- <i @click="artDel({uuid:it.uuid,sdate:it.created,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o" ></i> 删除 -->
                                 </p>
                               </div>
                             </li>
                           </ul>
                           <div class="artfooter">
                             <div  v-show="this.snapart.pageCount>0">
                                 <el-pagination
                                      style="float:right"
                                      @size-change="handleSnapSizeChange"
                                      @current-change="handleSnapCurrentChange"
                                      :current-page="snapart.currentPage"
                                      :page-sizes="[5,10, 20, 50, 100]"
                                      :page-size="snapart.pageSize"
                                      layout="total, sizes, prev, pager, next, jumper"
                                      :total="snapart.pageCount">
                                  </el-pagination>
                              </div>
                             <label><input type="checkbox" name="" v-model="snapart.checked" @click="checkedAll(1)" />全选</label>
                             <!-- <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allChange(1)">修改<i class="fa fa-eraser right"></i></a>
                             <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allWarn(1)">预警<i class="glyphicon glyphicon-warning-sign right"></i></a> -->
                             <a class="btn btn-info" @click="exportshow(6)">导出<i class="glyphicon glyphicon-download right"></i></a>
                             <!-- <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allCollect(1)">收藏<i class="glyphicon glyphicon-heart right"></i></a>
                             <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allArtdel(1)">删除<i class="glyphicon glyphicon-trash right"></i></a> -->
                           </div>
                         </div>
                     </div>
                   </div>
                 </div>
             </div>
             <div class="modal-content" v-else>
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                     <!-- <h4 class="modal-title" v-if="snap.media_type==6" v-html="'@'+snap.title">{{snap.title}}</h4>
                     <h4 class="modal-title" v-else v-html="snap.title">{{snap.title}}</h4>
                     <a :href="snap.url" target="_blank">查看原文</a> -->
                     <h4 class="modal-title"><i class="ifa ifa-datatotal"></i>相似文章列表</h4>
                 </div>
                 <div class="modal-body" style="padding:0 10px;">
                   <div class="snapsblistsb">
                     <div class="art_total" v-loading="loading">
                       <ul>
                         <li v-for="it in snapart.artlist">
                           <div class="widget-body art_list">
                             <h5>
                               <input type="checkbox" name="" v-model="snapart.batch" :value="it.uuid" />
                               <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                               :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple"
                               data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title=""
                                :data-content="it.is_focus" >{{it.site_name}}</a>
                               <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it,2)" v-html="'@'+it.title">{{it.title}}</a></label>
                               <label v-else><a href="javascript:void(0)" @click="snapview(it,2)" v-html="it.title">{{it.title}}</a></label>
                             </h5>
                             <p class="art_p_content" v-html="it.txt">{{it.txt}}</p>
                             <p class="art_p_detail grey">
                               <span>发布时间：{{it.pubdate}} </span><span> 阅读数:{{it.view}}</span>  <!--   维度：{{it.dimension}}  -->
                               <span>权重:{{it.weight}}&nbsp;</span>
                               <span v-if="sh.mediaType==6" >粉丝数:{{it.followers_count}}条</span>
                               <span v-if="sh.mediaType==6" >点赞数:{{it.attitudes_count}}条</span>
                               <span>属性:</span><span @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type},2)" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
                               <!-- <router-link v-if="it.sim_count!=0" :to="{name:'similar',query:{id:it.sim_id,type:1}}">相似文章:{{it.sim_count}}</router-link> -->
                             </p>
                             <p class="art_p_edit">
                               <!-- <i @click="setfeedback({uid:it.uuid,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="错误反馈" ></i> -->
                               <!-- <i  class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" ></i> 更改 -->
                               <!-- <i @click="follow({uuid:it.uuid,article_date:it.created,type:'1',side:it.side,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o':'ifa ifa-heart-s'" :data-unid="it.is_collect" ></i> 收藏 -->
                               <i @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})" data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o" ></i><!-- 导出 -->
                               <!-- <i @click="getWarnType({uid:it.uuid,url:it.site_url,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o" ></i> 发送预警 -->
                               <!-- <i @click="artDel({uuid:it.uuid,sdate:it.created,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o" ></i> 删除 -->
                             </p>
                           </div>
                         </li>
                       </ul>
                       <div class="artfooter">
                         <div  v-show="this.snapart.pageCount>0">
                             <el-pagination
                                  style="float:right"
                                  @size-change="handleSnapSizeChange"
                                  @current-change="handleSnapCurrentChange"
                                  :current-page="snapart.currentPage"
                                  :page-sizes="[5,10, 20, 50, 100]"
                                  :page-size="snapart.pageSize"
                                  layout="total, sizes, prev, pager, next, jumper"
                                  :total="snapart.pageCount">
                              </el-pagination>
                          </div>
                         <label><input type="checkbox" name="" v-model="snapart.checked" @click="checkedAll(1)" />全选</label>
                         <!-- <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allChange(1)">修改<i class="fa fa-eraser right"></i></a>
                         <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allWarn(1)">预警<i class="glyphicon glyphicon-warning-sign right"></i></a> -->
                         <a class="btn btn-info" @click="exportshow(6)">导出<i class="glyphicon glyphicon-download right"></i></a>
                         <!-- <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allCollect(1)">收藏<i class="glyphicon glyphicon-heart right"></i></a>
                         <a :class='snapart.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allArtdel(1)">删除<i class="glyphicon glyphicon-trash right"></i></a> -->
                       </div>
                     </div>
                   </div>
                 </div>
             </div>
         </div>
      </div>
      <div id="similarModal" class="modal fade bs-example-modal-lg snapmodal samemodal in" tabindex="-1" role="dialog">
         <div class="modal-dialog modal-lg" role="document">
             <div class="modal-content">
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                     <h4 class="modal-title" v-if="snap.media_type==6" v-html="'@'+snapSame.title">{{snapSame.title}}</h4>
                     <h4 class="modal-title" v-else v-html="snapSame.title">{{snapSame.title}}</h4>
                     <a :href="snapSame.url" target="_blank">查看原文</a>
                 </div>
                 <div class="modal-body">
                   <div class="row">
                     <div class="col-sm-7">
                       <table class="table table-hover">
                           <tr>
                             <td>来源：<span>{{snapSame.website_name}}</span></td><td>发布时间：<span>{{snapSame.pubdate}}</span></td><td>评论数：<span>{{snapSame.reply}}</span></td>
                           </tr>
                           <tr>
                             <td>作者：<span>{{snapSame.media_type==6?'@'+snapSame.author:snapSame.author}}</span></td><td>权重：<span>{{snapSame.weight}}</span></td><td>阅读数：<span>{{snapSame.view}}</span></td>
                           </tr>
                       </table>
                     </div>
                     <div class="col-sm-5">
                       <table class="table table-hover text-align-center" style="border-left:1px solid #e7e7e7">
                           <tr>
                             <td><span @click="scrollP" class="art-similar">相似文章数：{{snapSame.sim_count}}</span></td>
                             <td><i data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" @click="exportshow(0,{uuid:snapSame.uuid,medtype:snapSame.media_type,name:snapSame.title})"></i><span>导出</span></td>
                             <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDel({uuid:snapSame.uuid,sdate:snapSame.created,media_type:snapSame.media_type},$event)"></i><span>删除</span> -->
                           </tr>
                           <tr>
                             <td>文章属性：<span :class="snapSame.side==1?'neutral':snapSame.side==3?'positive':snapSame.side==-3?'opposite':'opposite'">{{snapSame.side==1?"中立":snapSame.side==-3?"负面":snapSame.side==3?"正面":""}}</span></td><!-- @click="changeSide({uuid:snapSame.uuid,sdate:snapSame.created,media_type:snapSame.media_type},1,snap)" -->
                             <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snapSame.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="modalfollow({uuid:snapSame.uuid,article_date:snapSame.created,type:'1',side:snapSame.side,media_type:snapSame.media_type},$event)" :data-unid="snapSame.is_collect" ></i><span>收藏</span> -->
                             <td></td>
                             <!-- <td v-if="snapSame.is_warning==0"><i data-toggle="tooltip" data-placement="bottom" title="预警" :class="snapSame.is_warning==0?'ifa ifa-clock-o ifa-b':'ifa ifa-clock-s ifa-b'" @click="getWarnType({uid:snapSame.uuid,url:snapSame.site_url,name:snapSame.website_name,title:snapSame.title,created:snapSame.created,media_type:snapSame.media_type})"></i><span>预警</span></td>
                             <td v-else><i  data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-s ifa-b"></i><span>预警</span></td> -->
                           </tr>
                       </table>
                     </div>
                   </div>
                   <p v-html="snapSame.txt">{{snapSame.txt}}</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  </div>
</template>
<script scoped>
import { getCookie } from "../../../static/js/globle.js";
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
      tbmore:false,
      robotname: "",
      qlist:[],
      words: [],
      artlist: [],
      pageCount: "",
      offset: 0,
      pageSize: 20,
      currentPage: 1,
      isshow: false,
      userlist: [],
      users: [],
      wprogramme: [],
      robotstart: false,
      filecount: 0,
      checked:true,
      sh: {
        opinion_id: "",
        wid: "",
        media_type: [],
        side: "",
        dimension: "",
        search_type: "1",
        property_type: "",
        search_txt: "",
        filter:'0',
        region_type: "",
        keywords: "",
        order: "",
        limit: 20,
        offset: 0,
        batch: [],
        checked: "",
        sortWay: "",
        words: "",
        userlist: [],
        sendWLevel: "1",
        sendWArticle: "",
        sendWTitle: "",
        receive: [],
        wprogramme: "",
        newuser: "",
        sendType: "1",
        sendUuid: "",
        exportobj: "",
        exportname: "",
        exporttype: "1",
        exportall: "0"
      },
      artsort: {
        content: "",
        keywords: ""
      },
      op: [
        {
          uuid: "",
          sdate: "",
          medyp: ""
        }
      ],
      viewpoint: {
        id: "",
        target: "",
        cateName: "",
        viewlist: []
      },
      categoryparams: [],
      category: [],
      listparam: {
        opinion_id: "",
        uuid_arr: [],
        category_id: ""
      },
      snap:{
        name:'傻逼文章快照'
      },
      snapSame:{
        name:'傻逼文章快照'
      },
      snapart:{
        uuid:'',
        batch: [],
        checked: "",
        artlist:[],
        pageCount: "",
        offset: 0,
        currentPage: 1,
        pageSize: 10,
        onlyView:false,
      },
      fullCount: 0,
      childList: 0,
      percent: 0,
      ddrop: "",
      bookuuid: [],
      mycount: 5,
      percent: 0,
      cateflag: 0,
      catemax: 0,
      choose:{
        chwid:'',
        chlist:[]
      }
    };
  },
  computed: {
    mywidth() {
      return this.mycount * 5;
    },
    mypercentage() {
      return 100 * this.cateflag / this.catemax;
    }
  },
  watch: {
    "sh.batch": {
      handler: function() {
        if (this.sh.batch.length === this.artlist.length) {
          this.sh.checked = true;
        } else {
          this.sh.checked = false;
        }
      }
    },
    "sh.media_type": {
      handler: function(val, oldVal) {
        if (this.sh.media_type.length === this.qlist.media_type.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      },
      deep: true
    },
    qlist:function(){
      var t=this;
      this.$nextTick(function(){
        $('table :input').on('click',function(){
          t.choose.chlist=[];var k=0;
          $('table :input').map(function(){
            var it=this;
            this.type=="radio"?function(){
              it.checked?it.value=="-1"?"":it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
            }():this.type=="select-one"?this.selectedOptions[0].value!=""?t.choose.chlist.push({na:this.selectedOptions[0].text,tg:"region_type",val:this.selectedOptions[0].value}):'':this.type=="checkbox"?function(){
              if(k>0){
                return;
              }
              if($('input[name=media_type]:checked').length==t.qlist.media_type.length){
                t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:it.value})
                k++;
              }else {
                it.checked?it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
              }
            }():''
          })
        })
        $('#region').on('change',function(){
          t.choose.chlist=[];var k=0;
          $('table :input').map(function(){
            var it=this;
            this.type=="radio"?function(){
              it.checked?it.value=="-1"?"":it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
            }():this.type=="select-one"?this.selectedOptions[0].value!=""?t.choose.chlist.push({na:this.selectedOptions[0].text,tg:"region_type",val:this.selectedOptions[0].value}):'':this.type=="checkbox"?function(){
              if(k>0){
                return;
              }
              if($('input[name=media_type]:checked').length==t.qlist.media_type.length){
                t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:it.value})
                k++;
              }else {
                it.checked?it.value!=""?t.choose.chlist.push({na:it.nextSibling.innerText,tg:it.name,val:it.value}):'':''
              }
            }():''
          })
        })
      })
    },
    artlist: function() {
      var t = this;
      this.$nextTick(function() {
        $('[data-toggle="tooltip"]').tooltip()
        var popovers = $("[data-toggle=popover]");
        $.each(popovers, function() {
          $(this).popover({
            html: !0,
            template:
              '<div class="popover pop ' +
              $(this).data("class") +
              '"><div class="arrow"></div><h3 class="popover-title ' +
              $(this).data("titleclass") +
              '">Popover right</h3><div class="popover-content"></div></div>'
          });
        }).on("shown.bs.popover", function(e) {
          var isf = $(e.target).attr("data-content");
          isf == 0
            ? $(".popover-content").html(
                '<a class="focusSite" data-target="' + isf + '">关注</a>'
              )
            : $(".popover-content").html(
                '<a  class="focusSite" data-target="' + isf + '">取消关注</a>'
              );
          $(".focusSite").on(
            "click",
            {
              sitename: $(this).text(),
              medtype: $(this).attr("data-value"),
              $ht: $(e.target)
            },
            function(e) {
              var isf = $(this).attr("data-target"),
                url = "",
                d = {},
                $t = e.data.$ht;
              isf == 0
                ? ((url = "/client/api/media_collect"),
                  (d = {
                    params: {
                      website_name: e.data.sitename,
                      media_type: e.data.medtype
                    }
                  }))
                : ((url = "/client/api/media_uncollect"),
                  (d = { params: { id: isf } }));
              t.enter(url, d, function(d) {
                d.code == 1 ? t.listajax() : "";
                // isf==0?(d.code==1?$t.addClass('imp-red'):$t.removeClass('imp-red'),$t.attr('data-content',d.data)):(d.code==1?$t.removeClass('imp-red'):$t.addClass('imp-red'),$t.attr('data-content',d.data))
                $("[data-toggle=popover]").popover("hide");
              });
            }
          );
        });
      });
    },
    fullCount: function() {
      var p = Math.round(100 * (this.fullCount / this.childList));
      this.percent = p >= 100 ? 100 : p;
      this.percent == 100
        ? (this.robotstart = true)
        : (this.robotstart = false);
    },
    childList: function() {
      this.percent = Math.round(100 * (this.fullCount / this.childList));
    },
    percent:function(){
      this.percent == 100? (this.robotstart = true): (this.robotstart = false);
    },
    category:function(){
      this.$nextTick(function(){
        // $(".w-left").scrollTop($(".w-left").height()+252)
        $(".panel-default").scrollTop($(".panel-default").height()+504)
      })
    }
  },
  created() {
    getCookie("user") == "" ? this.$router.replace({ name: "/app" }) : "";
    //  获取分类信息
    var t = this;
    t.robotname = this.$route.query.name;
    t.filecount = this.$route.query.fdct ? this.$route.query.fdct : 0;
    t.sh.opinion_id = this.$route.query.id ? this.$route.query.id : "";
    t.enter(
      "/client/explore/get_category_lists",
      { params: { opinion_id: this.$route.query.id } },
      function(d) {
        d.code != -1
          ? ((t.category = d.data), t.percentage(d.data))
          : t.newcate();
      }
    );

    t.enter("/client/api/get_lists", { params: {} }, function(d) {
      t.qlist=d.data;
      t.choose.chwid = t.robotname
      d.data.media_type.map(function(item,index){t.sh.media_type.push(item.id)})
      t.choose.chlist.push({na:'全部媒体',tg:'media_type',val:''})
    });
    // 如果后台返回给我了ID
    t.enter("/client/explore/get_uarticle_lists", { params: this.sh }, function(
      d
    ) {
      d.code == 1
        ? ((t.artlist = d.data.data), (t.pageCount = d.data.hits))
        : "";
    });
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html +='<li>探索</li><li><a href="#/InitRobot">智能观点</a></li><li class="active">观点探索</li>';
    $("#Crumbs").html(html);
    $(".qlisttoggle").hide();
  },
  methods: {
    mymouse(ev){
       $(ev.target).focus()
    },
    checkedAllmedia(e) {
     var _this = this;
     if (this.checked == false) {// 如果要实现全部不选
       //实现反选
       _this.sh.media_type = [];
     } else { //实现全选
       _this.sh.media_type = [];
       _this.qlist.media_type.forEach(function(item) {
         _this.sh.media_type.push(item.id);
       });
     }
    },
    ab(v,a,b,c){
      if(v==1){
        a=="media_type"?this.sh[a].splice(this.sh[a].indexOf(parseInt(b)),1):
        this.sh[a]="";
        this.choose.chlist=this.choose.chlist.filter(function(t){return t.na!=c})
      }else if(v==2){
        this.sh.dimension=""
        this.sh.region_type=""
        this.sh.side=""
        this.sh.property_type=""
        this.sh.media_type=[]
        this.choose.chlist=[];
      }
    },
    tablemore(){
      if(this.tbmore == false){
        this.s()
        this.tbmore = true
      }else{
        this.h();
        this.tbmore = false
      }
    },
    a(val, e) {
      this.viewpoint.cateName = val;
      e.target.style.display = "none";
      e.target.nextElementSibling.style.display = "inline";
      e.target.nextElementSibling.focus();
    },
    s() {
      $(".fathbox").stop().animate({ height: "280px" });
      $(".qlisttoggle").stop().show();
            $(".myspan")
        .stop()
        .animate({ width: "124px" });
    },
    h() {
      $(".fathbox").stop().animate({ height: "160px" });
      $(".qlisttoggle").stop().hide();
            $(".myspan")
        .stop()
        .animate({ width: "400px" });
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.sh.limit = val;
      this.listajax();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.sh.offset = this.pageSize * (val - 1);
      this.listajax();
    },
    Intelligent() {
      var url = "/client/explore/add_queue_classes",
        t = this;
      t.enter(url, { params: { opinion_id: t.sh.opinion_id } }, function(d) {
        d.code == 1 ? t.$router.replace({ path: "/InitRobot" }) : t.$message.error(d.msg);
      });
    },
    percentage(d) {
      var count = 0,
        t = this;
      this.fullCount = 0;
      d.map(function(it) {
        count += it.child.length;
        it.child.map(function(itt) {
          itt.num >= 10 ? (t.fullCount += 10) : (t.fullCount += itt.num);
        });
      });
      t.childList = count * 10;
      t.percent =
        t.childList == 0 ? 0 : Math.round(100 * (t.fullCount / t.childList));
    },
    resetClass() {
      var t = this;
      t.enter(
        "/client/explore/get_category_lists",
        { params: { opinion_id: t.sh.opinion_id } },
        function(d) {
          d.code != -1 ? t.percentage(d.data) : "";
        }
      );
    },
    smcate(pid) {
      var t = this;
          t.enter(
            "/client/explore/add_category",
            {
              params: {
                name: '分类',
                p_id: pid,
                opinion_id: t.sh.opinion_id
              }
            },
            function(d) {
              d.code == 1
                ? (function() {
                    t.enter(
                      "/client/explore/get_category_lists",
                      { params: { opinion_id: t.sh.opinion_id } },
                      function(d) {
                        d.code != -1 ? (t.category = d.data) : "";
                        t.percentage(d.data);
                      }
                    );
                  })()
                : t.$message.error("添加失败！");
            }
          );
    },
    changename(kid, pid, $e) {
      var t = this;
      kid == 1
        ? (function() {
            t.viewpoint.id = pid.id;
            t.viewpoint.cateName = pid.name;
            t.viewpoint.target = $e;
            t.viewpoint.viewlist = [];
            var url = "/client/explore/get_category_article",
              d = { params: { classes: pid.id } };
            t.enter(url, d, function(d) {
              d.code == 1
                ? (t.viewpoint.viewlist = d.data.data)
                : (t.viewpoint.viewlist = []);
              $("#viewpoint").modal("show");
            });
          })()
        : kid == 2
          ? (function() {
              t.enter(
                "/client/explore/update_category",
                {
                  params: {
                    name: t.viewpoint.cateName,
                    id: pid.id,
                    opinion_id: t.sh.opinion_id
                  }
                },
                function(d) {
                  d.code == 1
                    ? (function() {
                        t.enter(
                          "/client/explore/get_category_lists",
                          { params: { opinion_id: t.sh.opinion_id } },
                          function(d) {
                            d.code != -1
                              ? (function() {
                                  (t.category = d.data), t.percentage(d.data);
                                })()
                              : t.$message.error(d.msg);
                          }
                        );
                      })()
                    : t.$message.error("修改失败！");
                  $e.target.style.display = "none";
                  $e.target.previousElementSibling.style.display = "inline";
                  //d.code==1?$($e.target).prev().html(t.viewpoint.cateName):alert('修改失败！');
                }
              );
            })()
          : kid == 3
            ? (function() {
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
                      var d = {
                        params: {
                          category_id: t.viewpoint.id,
                          uuid: pid.id + "_" + pid.cad + "_" + pid.mdp
                        }
                      };
                      t.enter(
                        "/client/explore/delete_category_article",
                        d,
                        function(d) {
                          d.code == 1
                            ? (function() {
                                $($e.target)
                                  .parents("tr")
                                  .children()
                                  .remove();
                                var count = $(t.viewpoint.target.target)
                                  .parents(".progress-parent")
                                  .find(".progress")
                                  .attr("data-count");
                                $(t.viewpoint.target.target)
                                  .parents(".progress-parent")
                                  .find(".progress-bar")
                                  .width(
                                    (count - 1 > 10 ? 10 : count - 1) * 18.6
                                  );
                                count - 1 >= 10
                                  ? ""
                                  : $(t.viewpoint.target.target)
                                      .parents(".progress-parent")
                                      .find(".progress-bar")
                                      .removeClass("cur");
                                $(t.viewpoint.target.target)
                                  .parents(".progress-parent")
                                  .find(".progress")
                                  .attr("data-count", count - 1);
                                $(t.viewpoint.target.target)
                                  .parent()
                                  .find(".cate_count")
                                  .html(count - 1);
                                count - 1 < 10 ? (t.fullCount -= 1) : "";
                                t.listajax();
                              })()
                            : t.$message.error("删除失败！");
                        }
                      );
                    }
                  }
                });
              })()
            : "";
    },
    delcate(vt, id, $e) {
      var t = this;
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
            t.enter(
              "/client/explore/update_category",
              { params: { id: id, status: "-2", type: vt } },
              function(d) {
                d.code == 1
                  ? (function() {
                      t.enter(
                        "/client/explore/get_category_lists",
                        { params: { opinion_id: t.sh.opinion_id } },
                        function(d) {
                          d.code != -1
                            ? ((t.category = d.data), t.percentage(d.data))
                            : (t.category = []),
                            (t.percent = 0);
                        }
                      );
                    })()
                  : t.$message.error("删除失败！");
                // d.code==1?$e.target.parentElement.remove():''
                // t.childList-=1;
              }
            );
          }
        }
      });
    },
    catelist() {
      //获取分类信息
      var t = this;
      t.enter(
        "/client/explore/get_category_lists",
        { params: { opinion_id: t.sh.opinion_id } },
        function(d) {
          d.code != -1 ? (t.category = d.data) : this.newcate();
          t.percentage(d.data);
        }
      );
    },
    searchdult() {
      this.currentPage = 1;
      this.listajax();
    },
    dragstart(e) {
      this.ddrop = e.target;
    },
    drop(e, id) {
      var t = this;
      var uuid = this.ddrop.id;
      var count = $(e.target)
        .parents(".progress-parent")
        .find(".progress")
        .attr("data-count"); //==""||$(e.target).attr('data-count')==undefined?0:parseInt($(e.target).attr('data-count'));
      t.enter(
        "/client/explore/add_article_category",
        {
          params: {
            opinion_id: this.$route.query.id,
            uuid: uuid,
            category_id: id
          }
        },
        function(d) {
          if (d.code == "1") {
            $(t.ddrop)
              .find(".artp")
              .remove();
            $(e.target)
              .parents(".progress-parent")
              .find(".progress")
              .attr("data-count", ++count);
            var nowwidth = (count > 10 ? 10 : count) * 18.6 + "px";
            $(e.target)
              .parents(".progress-parent")
              .find(".progress-bar")[0].style.width = nowwidth;
            $(e.target)
              .parents(".progress-parent")
              .find(".progress")
              .attr("data-count") == 10
              ? ($(e.target)
                  .parents(".progress-parent")
                  .find(".progress-bar")
                  .addClass("cur"),
                (t.fullCount += 1))
              : $(e.target)
                  .parents(".progress-parent")
                  .find(".progress")
                  .attr("data-count") > 10
                ? (t.fullCount += 0)
                : (t.fullCount += 1);
            $(e.target)
              .parents(".progress-parent")
              .find(".cate_count")
              .html(
                $(e.target)
                  .parents(".progress-parent")
                  .find(".progress")
                  .attr("data-count")
              );
            t.listajax();
          }
        }
      );
    },
    dragover(e) {
      event.preventDefault();
    },
    del() {
      // 传文章日期和uuid
      var t = this;
      t.enter(
        "/client/api/delete",
        { params: { uuid: this.selectArr } },
        function(d) {}
      );
    },
    suretocate() {
      var t = this,
        d = {
          params: {
            opinion_id: this.$route.query.id,
            uuid: this.listparam.uuid_arr,
            category_id: this.listparam.category_id
          }
        };
      t.enter("/client/explore/add_article_category", d, function(d) {
        $("#cate").modal("hide");
        if (d.code == "1") {
          t.catelist();
          t.listajax();
        }
      });
    },
    intocate(tp, obj) {
      $("#cate").modal("show");
      var t = this;
      tp == 1
        ? (function() {
            t.listparam.uuid_arr =
              obj.uuid + "_" + obj.created + "_" + obj.media_type;
            t.count = obj.count;
          })()
        : (function() {
            var warr = [];
            t.sh.batch.map(function(item) {
              t.artlist.map(function(it) {
                it.uuid == item
                  ? (function() {
                      warr.push(
                        it.uuid + "_" + it.created + "_" + it.media_type
                      );
                    })()
                  : "";
              });
            });
            t.listparam.uuid_arr = warr.join("|");
          })();
    },
    newcate() {
      let fatherpid = "",childid = [];
      var t = this;
      t.enter(
        "/client/explore/add_category",
        { params: { name: "父分类", opinion_id: t.$route.query.id } },
        function(d) {
          if (d.code == "1") {
            fatherpid = d.data;
            t.enter(
              "/client/explore/add_category",
              {
                params: {
                  name: "子分类一",
                  opinion_id: t.$route.query.id,
                  p_id: d.data
                }
              },
              function(d) {
                if (d.code == "1") {
                  childid.push(d.data);
                }
              }
            );
            t.enter(
              "/client/explore/add_category",
              {
                params: {
                  name: "子分类二",
                  opinion_id: t.$route.query.id,
                  p_id: d.data
                }
              },
              function(d) {
                if (d.code == "1") {
                  childid.push(d.data);
                }
              }
            );
          }
        }
      );

      var fc = setInterval(function() {
        if (fatherpid && childid.length > 1) {
          clearInterval(fc);
          t.fullCount += 0;
          t.childList += 2 * 10;
          t.percent = Math.round(100 * (t.fullCount / t.childList));
          // $('.w-left').scrollTop=$('.w-left').offset().top-50 跳转
          // 点击新增一个分类盒子
          t.category.push({
            id: fatherpid,
            client_id: "",
            p_id: "",
            opinion_id: t.$route.query.id,
            name: "父分类",
            count: "",
            created: "",
            status: "",
            child: [
              {
                id: childid[0],
                client_id: "",
                p_id: fatherpid,
                opinion_id: t.$route.query.id,
                name: "子分类一",
                num: "0",
                created: "",
                status: ""
              },
              {
                id: childid[1],
                client_id: "",
                p_id: fatherpid,
                opinion_id: t.$route.query.id,
                name: "子分类二",
                num: "0",
                created: "",
                status: ""
              }
            ]
          });
        }
      }, 50);
    },
    pagelimit() {
      this.listajax();
    },
    checkedAll(v) {
      var _this = this;
      if(v==1){
        if (this.snapart.checked == false) {
          //实现反选
          _this.snapart.batch = [];
        } else {
          //实现全选
          _this.snapart.batch = [];
          _this.snapart.artlist.forEach(function(item) {
            _this.snapart.batch.push(item.uuid);
          });
        }
      }else {
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
      }
    },
    searchform() {
      this.listajax();
    },
    createdtime(t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.order = "created";
      this.listajax();
    },
    localtionweight(t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.order = "weight";
      this.listajax();
    },
    simcout(t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.order = "sim_count";
      this.listajax();
    },
    view(t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.order = "view";
      this.listajax();
    },
    hot(t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.order = "hot";
      this.listajax();
    },
    reply(t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.order = "reply";
      this.listajax();
    },
    changePageSize() {
      this.listajax();
    },
    listajax() {
      var t = this;
      t.enter("/client/explore/get_uarticle_lists", { params: t.sh }, function(d){
        d.code == 1?((t.artlist = d.data.data), (t.pageCount = d.data.hits)):''
      });
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
          $t.listajax()
      });
    },
    snapview(it,v){
      if(v!=2){
        this.snapart.onlyView=true;
        this.snap={};
        this.snapart.itart=it;
      }
      var t=this;
      var url='/client/article/get_articles_info';
      t.enter(url,{params:{
        uuid:it.uuid,
        sdate:it.created,
        media_type:it.media_type,
        search_txt: t.sh.keywords,
        date_range: t.sh.mtime == -1 ? t.sh.etime : t.sh.mtime,
        wid: t.sh.words,
        dimension: t.sh.dimension,
        region_type: t.sh.region,
        side: t.sh.side,
        search_type: t.sh.search_type,
        property_type: t.sh.mediaPro,
      }},function(d){
        if(v==2){
          t.snapSame=d.data;
          $('#similarModal').modal("show");
          $('.modal-backdrop:last-child').css('z-index','1042')
        }else {
          t.snap=d.data;
          $('#snapModal').modal("show");
        }
      })
      if(v==1){this.snapart.onlyView=false;}
      if(v!=2){
        t.snapart.artlist=[],t.snapart.uuid=it.uuid;
        it.sim_count!=0?this.getsnapResult(it):'';
      }
    },
    getsnapResult(it){
      var t=this;
      var url='/client/article/index';
      t.enter(url,{params:{sim_id:this.snapart.uuid,offset:this.snapart.offset,limit:this.snapart.pageSize}},function(d){
        t.loading=false;
        d.code==1?(t.snapart.artlist=d.data.data,t.snapart.pageCount=d.data.hits):
        (t.snapart.artlist=[],t.snapart.pageCount=0)
      })
    },
    handleSnapSizeChange(val) {
      this.snapart.pageSize = val;
      this.getsnapResult();
    },
    handleSnapCurrentChange(val) {
      this.snapart.currentPage = val;
      this.snapart.offset = this.snapart.pageSize * (val - 1);
      this.getsnapResult();
    },
    scrollP(){
      this.snapart.artlist.length==0?'':$('.snapmodal .snapsblist').scrollTop($('.arttop').offset().top-250)
    },
    allCollect(v) {
      var t = this;
      var warr = [];
      if(v==1){
        t.snapart.batch.map(function(item) {
          t.snapart.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  var obj = {
                    uuid: it.uuid,
                    article_date: it.created,
                    type: "3",
                    media_type: it.media_type,
                    side: it.side
                  };
                  warr.push(obj);
                })()
              : "";
          });
        });
      }else {
        t.sh.batch.map(function(item) {
          t.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  var obj = {
                    uuid: it.uuid,
                    article_date: it.created,
                    type: "3",
                    media_type: it.media_type,
                    side: it.side
                  };
                  warr.push(obj);
                })()
              : "";
          });
        });
      }
      t.enter("/client/api/add_collect", { params: { data: warr } }, function(d) {
        if(v==1){
          d.code == 1? (t.$message(d.msg),t.getsnapResult()):t.$message(d.msg);
        }else {
          d.code == 1? (t.$message(d.msg),t.listajax()):t.$message(d.msg);
        }
      });
    },
    allChange(v) {
      var t = this,url = "/client/api/side";
      bootbox.dialog({
        message: "修改媒体属性",
        size: "small",
        buttons: {
          ok: {
            label: "正面",
            className: "btn-success ",
            callback: function() {
              var warr = [];
              if(v==1){
                t.snapart.batch.map(function(item) {
                  t.snapart.artlist.map(function(it) {
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
              }else {
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
              }
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
              if(v==1){
                t.snapart.batch.map(function(item) {
                  t.snapart.artlist.map(function(it) {
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
              }else {
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
              }
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
              if(v==1){
                t.snapart.batch.map(function(item) {
                  t.snapart.artlist.map(function(it) {
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
              }else {
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
              }
              t.enter(url, {params:{data:warr}}, function(d) {
                d.code != -1 ? (t.openMsg(d.msg,"success"),t.artlistChange()): t.$message.error("修改失败！");
              });
            }
          }
        }
      });
    },
    exportshow(v, obj) {
      var t = this;
      this.sh.exportall = v;
      if(v==6){
        v == 0
          ? ((this.sh.exportobj = obj),
            (this.sh.exportname = obj.name),
            // $("#exportModel").modal("show")
            this.artExport())
          : (function() {
              if (t.snapart.batch.length == 0) {
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
                  t.sh.exportname = "观点分析-"+t.choose.chwid+"-"+new Date().Format('yyyy-MM-dd')
                // t.sh.exportname = "批量文章导出";
                $("#exportModel").modal("show");
              }
            })();
      }else {
        v == 0
          ? ((this.sh.exportobj = obj),
            (this.sh.exportname = obj.name),
            // $("#exportModel").modal("show")
            this.artExport())
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
                  t.sh.exportname = "观点分析-"+t.choose.chwid+"-"+new Date().Format('yyyy-MM-dd')
                // t.sh.exportname = "批量文章导出";
                $("#exportModel").modal("show");
              }
            })();
      }
    },
    allExport() {
      var ulist = [],
        t = this;
      t.snapart.batch.map(function(item) {
        t.snapart.artlist.map(function(it) {
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
    changeSide(sd,v,val) {
      var url = "/client/api/side",t = this;
      bootbox.dialog({
        message: "修改属性",
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
                if(v==1){
                  d.code != -1 ? (t.listajax(),t.snapview(val)) : t.$message.error("修改失败！");
                } else if(v==2){
                  d.code != -1 ? (t.getsnapResult()) : t.$message.error("修改失败！");
                } else {
                  d.code != -1 ? t.listajax() : t.$message.error("修改失败！");
                }
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
                if(v==1){
                  d.code != -1 ? (t.listajax(),t.snapview(val)) : t.$message.error("修改失败！");
                }else if(v==2){
                  d.code != -1 ? (t.getsnapResult()) : t.$message.error("修改失败！");
                }else {
                  d.code != -1 ? t.listajax() : t.$message.error("修改失败！");
                }
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
                if(v==1){
                  d.code != -1 ? (t.listajax(),t.snapview(val)) : t.$message.error("修改失败！");
                } else if(v==2){
                  d.code != -1 ? (t.getsnapResult()) : t.$message.error("修改失败！");
                } else {
                  d.code != -1 ? t.listajax() : t.$message.error("修改失败！");
                }
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
            t.enter("/client/api/delete", { params: { data: warr } }, function(
              d
            ) {
              d.code == 1 ? t.listajax() : t.$message.error("删除失败!");
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.wleft{
  width: 284px;
  position: fixed;
  overflow-x: hidden;
  overflow-y: auto;
}
.active {
  background: white;
  color: red;
  border: 1px solid red;
}
.unactive {
  background: white;
  color: black;
  border: none;
}
.w-left,.widget-header{
  border: none;
}
.article_lis {
  /*padding:5px 0;*/
  cursor: move;
}
div.el-checkbox-group.x2 {
  display: inline-block;
}
.x2 li {
  float: left;
}
.father {
  background-color: white;
  display: flex;
}
.theme {
  margin: 0px 10px 0 0;
  width: 300px;
  height: 400px;
}
.panel-body {
  padding: 10px 0;
  text-align: center;
}
.plane {
  width: 100%;
}
.hrr {
  margin-top: 0;
}
.progds {
  margin-bottom: 10px;
}
.setLeft {
  width: 100px;
  flex-grow: 0;
  float: left;
  text-align: center;
  flex-flow: row nowrap;
  background: #cdcdcd;
}
.setLeft ul li {
  border-bottom: 1px solid #fff;
}
.setleft h3 {
  border-bottom: 1px solid #000;
}
.artdetail {
  width: 100%;
  margin-top: 10px;
}
.artdetail ul li {
  border: 1px solid #ccc;
  padding-left: 10px;
}
a.atitle {
  display: inline-block;
  padding: 3px 6px;
  margin: 3px 5px;
  font-size: 12px;
  border: 1px solid #199ed8;
  border-radius: 2px;
}
a.artsort {
  display: inline-block;
  margin: 0 3px;
  text-decoration: none;
  color:black;
  border: 1px solid #ccc;
}
.art_list label{
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
}
a.cur,
a.artsort:hover {
  color:#199ed8;
  /* border: 1px solid #199ed8; */
}
.artfooter {
  height: 60px;
}
.artfooter a {
  display: inline-block;
  padding: 2px 6px;
  margin: 3 5px;
  border-radius: 2px;
  background-color: #cfcfcf;
}
.custom {
  float: right;
}
.imp-red {
  color: #ff0000 !important;
}
.modal-title i{
  position: relative;
  top: 5px;
}
.progress-parent {
  padding-bottom: 20px;
  font-size: 12px;
  width: 186px;
  margin: 0 auto;
}
.progress {
  border-radius: 30px;
  margin-bottom: 2px;
}
.progress-bar {
  background-color: #a7a7b7;
}
.progress-bar.cur {
  background-color: #337ab7;
}
table {
  width: 100%;
}
table tbody tr td:first-child span {
  width: 150px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.w-left {
  text-align: center;
  padding-top: 5px;
}
.panel-default{
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.pagedetail {
  position: absolute;
  right: 22px;
  top: 10px;
}
.input-search {
  padding:14px;
  height: 24px;
  width: 128px;
  position: relative;
  box-sizing: border-box;
}
.catename {
  width: 70px;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
}
table td:first-child a {
  width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
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
.fathbox .text-align-center{
  width: 100px;
  max-width: 100px;
}
.panel-footer{
  width: 261px;
  margin: 0 auto;
  text-align: center;
}
</style>
