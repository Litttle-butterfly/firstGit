<template>
<div>
  <div class="widget">
      <div class="widget-header xftbar bordered-bottom bordered-sky text-align-left">
        <label><input type="checkbox" v-model="sh.checked" @click="checkedAll"/>全选</label>
        <a class="btn btn-default btn-sm artsort" @click="setsort('created',$event)">时间降序</a>
        <!-- <a class="btn btn-default btn-sm artsort" @click="setsort('weight',$event)">权重降序</a> -->
        <!-- <a class="artsort" @click="setsort('sim_count',$event)">转载降序</a> -->
        <select v-model="sh.search_type"><option value='1' >搜内容</option><option value='2' >搜媒体</option><option value='3' >搜标题</option></select>
        <input type="text" class="keywords"  v-model="sh.keywords" value="" />
        <a class='btn btn-sm' @click="artlistChange">搜索</a>
        <label class="pagedetail">共{{pageCount}}篇文章</label>
      </div><!--Widget Header-->
      <div class="art_total" v-loading="loading">
        <ul>
          <li v-for="it in artlist">
            <div class="widget-body art_list">
              <h5><input type="checkbox" name="" v-model="sh.batch" :value="it.uuid" />
                <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple" data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title="" :data-content="it.is_focus" >{{it.website_name}}</a>
                <label>
                  <!-- <router-link :to="{name:'Mdetail',query:{id:it.uuid,sdate:it.created,media_type:it.media_type}}">{{it.title}}</router-link> -->
                  <a href="javascript:void(0)" v-if="it.media_type==6" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a>
                  <a href="javascript:void(0)" v-else @click="snapview(it)" v-html="it.title">{{it.title}}</a>
                </label>
              </h5>
              <p class="art_p_content" v-html="it.txt">{{it.txt}}</p>
              <p class="art_p_detail">
                <span>发布时间：{{it.pubdate}}  阅读数：{{it.view}} </span>  <!--   维度：{{it.dimension}}  -->
                <span v-if="sh.mediaType==6" >粉丝数:{{it.followers_count}}条</span>
                <span v-if="sh.mediaType==6" >点赞数:{{it.attitudes_count}}条</span>
                <span>属性:</span><span @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type})" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
                <!-- <a href="javascript:void(0)" v-if="it.sim_count!=0" @click="">相似文章:{{it.sim_count}}条</a> -->
              </p>
              <p class="art_p_edit">
                <!-- <i class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" ></i> 更改 -->
                <i @click="follow({uuid:it.uuid,article_date:it.created,type:'1',side:it.side,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" :data-unid="it.is_collect" ></i><!-- 收藏 -->
                <i @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})" data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" ></i><!-- 导出 -->
                <i @click="getWarnType({uid:it.uuid,url:it.site_url,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o ifa-b" ></i> <!-- 发送预警 -->
                <i @click="artDel({uuid:it.uuid,sdate:it.created,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" ></i><!-- 删除 -->
              </p>
            </div>
          </li>
        </ul>
        <div class="artfooter " v-show="this.pageCount>0">
          <div   >
              <el-pagination
                   style="float:right"
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
          <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allChange">修改<i class="fa fa-eraser right"></i></a>
          <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allWarn">预警<i class="glyphicon glyphicon-warning-sign right"></i></a>
          <a class="btn btn-info" @click="exportshow(1)">导出<i class="glyphicon glyphicon-download right"></i></a>
          <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allCollect">收藏<i class="glyphicon glyphicon-heart right"></i></a>
          <a :class='sh.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allArtdel">删除<i class="glyphicon glyphicon-trash right"></i></a>
        </div>
      </div><!--Widget Body-->
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
                          <select v-model="sh.exporttype"><option value="2" >WORLD</option><option value="3" >PDF</option><option value="1" >EXCEL</option></select>
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
                        <td>来源</td><td><span>{{snap.website_name}}</span></td><td>发布时间</td><td><span>{{snap.pubdate}}</span></td><td>评论数</td><td><span>{{snap.reply}}</span></td>
                      </tr>
                      <tr>
                        <td>作者</td><td><span>{{snap.media_type==6?'@'+snap.author:snap.author}}</span></td><td>权重</td><td><span>{{snap.weight}}</span></td><td>阅读数</td><td><span>{{snap.view}}</span></td>
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
                        <td><i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="modalfollow({uuid:snap.uuid,article_date:snap.created,type:'1',side:snap.side,media_type:snap.media_type},$event)" :data-unid="snap.is_collect" ></i><span>收藏</span></td>
                        <td><i data-toggle="tooltip" data-placement="bottom" title="预警" :class="snap.is_warning==0?'ifa ifa-clock-o ifa-b':'ifa ifa-clock-s ifa-b'" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i><span>预警</span></td>
                      </tr>
                  </table>
                </div>
              </div>
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
                            <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a></label>
                            <label v-else><a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a></label>
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
        <div class="modal-content" v-else>
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <!-- <h4 class="modal-title" v-if="snap.media_type==6" v-html="'@'+snap.title">{{snap.title}}</h4>
                <h4 class="modal-title" v-else v-html="snap.title">{{snap.title}}</h4>
                <a :href="snap.url" target="_blank">查看原文</a> -->
                <h4 class="modal-title"><i class="ifa ifa-datatotal"></i>相似文章列表</h4>
            </div>
            <div class="modal-body">
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
                        <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a></label>
                        <label v-else><a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a></label>
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
</template>
<script>
import {getCookie} from '../../static/js/globle.js';
import {delCookie} from '../../static/js/globle.js';
import '../../static/js/globle.js'
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
          words:[],
          mediaType:[],
          dimension:[],
          region:[],
          side:[],
          mediaPro:[],
          artlist:[],
          pageCount:'',
          offset:0,
          pageSize:'20',
          isshow:false,
          userlist:[],
          users:[],
          wprogramme:[],
          sendtitle:'',
          sendwtitle:'',
          sh:{
            sim_id:'',
            fotype:'',
            batch:[],
            checked:'',
            sortWay:'',
            words:'',
            mtime:'6',
            stime:'',
            etime:new Date().Format('yyyy/MM/dd'),
            dimension:'',
            mediaType:'',
            region:'',
            side:'',
            mediaPro:'',
            search_type:'1',
            keywords:'',
            userlist:[],
            sendWLevel:'1',
            sendWArticle:'',
            sendWTitle:'',
            receive:[],
            wprogramme:'',
            newuser:'',
            sendType:'email',
            sendUuid:'',
            exportobj:'',
            exportname:'',
            exporttype:'1',
            exportall:'0',
          },
          loading:true,
          snap:{
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
            pageSize: 20,
            onlyView:false,
          },
          artsort:{
            content:'',
            keywords:''
          },
        }
    },
    created(){
      getCookie('user')==""?(this.$router.replace({ name: '/app' })):''
      this.sh.sim_id=this.$route.query.id;
      this.sh.fotype=this.$route.query.type;
      var url='',t=this;
      url='/client/article/index';
      t.enter(url,{params:{sim_id:this.sh.sim_id}},function(d){
        t.loading=false;
        d.code==1?(t.artlist=d.data.data,t.pageCount=d.data.hits):
        (t.artlist=[],t.pageCount=0)
      })
      url='/client/api/warning';
      t.enter(url,{params:{}},function(d){
        var d=d.data==undefined?[]:d.data;
        t.wprogramme=d;
        t.sh.wprogramme=d.length==0?'':d[0].id
        t.users=d;
      })
    },
    mounted(){
      var t=this;
      var html='<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
      html+='<li class="active">相似文章列表</li>';
      $('#Crumbs').html(html)
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
                  d.code==1?t.artlistChange():''
                  // isf==0?(d.code==1?$t.addClass('imp-red'):$t.removeClass('imp-red'),$t.attr('data-content',d.data)):(d.code==1?$t.removeClass('imp-red'):$t.addClass('imp-red'),$t.attr('data-content',d.data))
                  $("[data-toggle=popover]").popover('hide');
                })
              })
          });
        })
      }
    },
    methods:{
      mymouse(ev){
        $(ev.target).focus()
      },
      handleSizeChange(val){
        this.pageSize =val;
        this.getResult()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.offset= this.pageSize * (val-1);
        this.getResult();
      },
      changeWid(wid,$e){
        this.sh.words=wid;
        this.offset=0;
        $('.nav-tabs li a').removeClass('cur'),$($e.target).addClass('cur');
        this.artlistChange();
      },
      setwords(id){
        this.sh.words=id;
        this.artlistChange();
      },
      setsort(str,t){
        $('.artsort').removeClass('cur'),$(t.target).addClass('cur');
        this.sh.sortWay=str;
        this.artlistChange();
      },
      changePageSize(){
        this.offset=0;
        this.artlistChange();
      },
      artlistChange(){
        this.offset=0;
        this.getResult();
      },
      getResult(){
        var t=this;
        var url='/client/article/index',
        d={params:{
          sim_id:this.sh.sim_id,
          // date_range:(this.sh.mtime==-1?(this.sh.stime+'-'+this.sh.etime):this.sh.mtime),
          // wid:this.sh.words,
          // dimension:this.sh.dimension,
          // media_type:this.sh.mediaType,
          // region_type:this.sh.region,
          // side:this.sh.side,
          // property_type:this.sh.mediaPro,
          search_type:this.sh.search_type,
          search_txt:this.sh.keywords,
          order:this.sh.sortWay,
          offset:this.offset,
          limit:this.pageSize
        }}
        this.enter(url,d,function(d){
          if(d.code==1){
            t.artlist=d.data.data;
            t.offset==0?t.pageCount=d.data.hits:''
          }
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
      exportshow(v,obj){
        var t=this;
        this.sh.exportall=v;
        v==0?(this.sh.exportobj=obj,this.sh.exportname=obj.name,$('#exportModel').modal('show')):function(){
          if(t.sh.batch.length == 0){
            bootbox.confirm({
                message: "您将导出全部文章",
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
                      t.sh.exportname="全部文章导出";
                      $('#exportModel').modal('show');
                    }
                }
            });
          }else{
            t.sh.exportname="批量文章导出";
            $('#exportModel').modal('show');
          }
        }();
      },
      artExport(uid,med){
        var t=this,url='/client/api/exporting',d={params:{
          uuid:t.sh.exportobj.uuid,
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
          }():d.code==2?t.openMsg('请到设置我到导出下载文档！',"warning"):t.$message.error('导出失败！');
        })
      },
      adduser(){
        var t=this;
        this.sh.newuser!=""?function(){
          var html='<label><input value="'+t.sh.newuser+'" type="checkbox" name="receive" />'+t.sh.newuser+'</label>'
          t.sh.receive.push(t.sh.newuser);
          $('.userbox').append(html);t.sh.newuser='';
        }():''
      },
      changewtitle($e){
          var tp=this.sh.wprogramme,t=this;
          this.sendtitle=$($e.target).find('option:selected').text();

          // this.sh.sendWTitle=this.sendtitle+'-'+this.sendWTitle==undefined?'':this.sendWTitle;

            t.wprogramme.map(function(item,index){
                if(tp == item.id){
                  t.sh.sendWTitle =item.name
                }
            })

          t.users==undefined?t.users=[]:''
          t.users.map(function(it){
            it.id==tp?(t.userlist=it.receive):''
          })
          t.sh.receive=[];
          t.userlist.map(function(it){
            t.sh.receive.push(it.email);
          })
      },
      getWarnType(us){
        var t=this;
        this.sh.wprogramme.length==0?function(){
          t.openMsg('请到到预警-->预警设置-->新增预警！',"warning")
        }():function(){
          $('#warnModel').modal('show');
          t.sendWTitle=us.title;
          t.sh.sendUuid=us.uid+'_'+us.created+'_'+us.media_type;
          t.sh.sendWArticle=us.name+us.url;
          t.sh.sendWTitle=t.sendtitle+'-'+us.title;
        }()
      },
      sendWarning(){
        var url='/client/api/send_warning',t=this,
        d={params:{
          setting_id:this.sh.wprogramme,
          receive:this.sh.receive.join('|'),
          uuid:this.sh.sendUuid,
          level:this.sh.sendWLevel,
          send_type:this.sh.sendType,
          subject:this.sh.sendWTitle
        }};
        if(d.params.receive==""||d.params.subject==""){
          this.openMsg('发送预警表单不能为空！',"warning")
          return
        }
        this.enter(url,d,function(d){
            d.code!=1?t.$message.error('发送失败！'):($('#warnModel').modal('hide'),t.openMsg('发送成功！',"success"))
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
                    className: 'btn-success ',
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
                    d.code==1?($(t.target).parentsUntil('ul')[1].remove()):(t.$message.error('删除失败!'))
                  })
                }
            }
        });
      },
      changeValue(tp){
        this.sh.sendType=tp;
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
                className: "btn-info ",
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
      allCollect(){
        var t=this;
        if(t.sh.batch.length == 0){
          t.openMsg("请选择您需要收藏的文章！","warning");
        }else{
        var warr=[];
        t.sh.batch.map(function(item){
          t.artlist.map(function(it){
            it.uuid==item?function(){
              var obj={
                uuid:it.uuid,
                article_date:it.created,
                type:t.sh.fotype,
                media_type:it.media_type,
                side:it.side,
              }
              warr.push(obj)
            }():''
          })
        })
        t.enter('/client/api/add_collect',{params:{data:warr}},function(d){
          d.code==1?t.artlistChange():t.$message.error('收藏失败！')
        })

        }
      },
      allWarn(){
        var t=this;
        this.sh.wprogramme.length==0?function(){
          t.openMsg('请到到预警-->预警设置-->新增预警！',"warning")
        }():function(){
          if(t.sh.batch.length == 0){
            t.openMsg("请选择您需要发送预警的文章！","warning")
             return;
          }
          var warr=[],text='',title='';
          t.sh.batch.map(function(item){
            t.artlist.map(function(it){
              it.uuid==item?function(){
                warr.push(it.uuid+'_'+it.created+'_'+it.media_type)
                text+=it.title+'-'+it.url+'\n';
                title+='-'+it.title
              }():''
            })
          })
          t.sh.sendUuid=warr.join('|');
          t.sh.sendWArticle=text;
          t.sendWTitle=title
          // t.sh.sendWTitle=t.sendtitle+title;
          t.wprogramme.map(function(item,index){
                if(t.sh.wprogramme == item.id){
                  t.sh.sendWTitle =item.name
                }
            })
          $('#warnModel').modal('show');
        }()
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
          }():d.code==2?t.openMsg('请到设置我到导出下载文档！',"warning"):t.$message.error('导出失败！');
        })
      },
      allArtdel(){
        var t=this;
        if(t.sh.batch.length == 0){
          t.openMsg('请选择您需要删除的文章！',"warning")
        }else{
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
                    var warr=[];
                    t.sh.batch.map(function(item){
                      t.artlist.map(function(it){
                        it.uuid==item?function(){
                          var obj={
                            uuid:it.uuid,
                            sdate:it.created,
                            media_type:it.media_type,
                          }
                          warr.push(obj)
                        }():''
                      })
                    })
                    t.enter('/client/api/delete',{params:{data:warr}},function(d){
                      d.code==1?t.artlistChange():t.$message.error('删除失败!')
                    })
                  }
              }
          });
        }
      },
      snapview(it,v){
        this.snapart.onlyView=true;
        var t=this;t.snap={};
        var url='/client/article/get_articles_info';
        t.enter(url,{params:{
          uuid:it.uuid,
          sdate:it.created,
          media_type:it.media_type,
        }},function(d){
          t.snap=d.data;
          $('#snapModal').modal("show");
        })
        if(v==1){this.snapart.onlyView=false;}
        t.snapart.artlist=[],t.snapart.uuid=it.uuid;
        it.sim_count!=0?this.getsnapResult(it):'';
      },
    }
}
</script>
<style scoped>
label span{
  position: relative;
  top:-1px;
}
.buttons-preview .btn{
  margin-left: 2px;
  margin-right: 2px;
}
a.atitle{
  display: inline-block;
  padding: 3px 6px;
  margin: 3px 5px;
  font-size: 12px;
  border:1px solid #199ed8;
  border-radius: 5px;
  text-decoration: none;
}
a.artsort{
  display: inline-block;
  margin: 3px;
  text-decoration: none;
}
a.cur,a.artsort:hover{
  border: 1px solid #199ed8;
}
.artfooter{
  height: 35px;
  padding:0 10px;
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
.modal-title i{
  position: relative;
  top: 5px;
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
.input-search{
  height:24px;
  width:128px;
  top: 3px;
  position: relative;
  box-sizing: border-box;
}
.pagedetail{
  position: absolute;
  right: 10px;
  top: 10px;
}
textarea{
  width: 100%;
  resize: none;
}
.form-group{
  display: flex;
}
.dowtype{
  height: 30px;
}
.art_total{
  min-height: 100px;
}
.art_total li:nth-last-child(2n){
  border-bottom: none;
}
</style>
