<template>
    <div class="childbox">
      <!-- <h5 class="row-title before-palegreen"><i class="fa fa-align-justify palegreen"></i>预警概况</h5> -->
         <div class="view-box">
         <div class="bs-tabs">
           <ul>
           <li><a class="wdate cur" @click="dateView(1,$event)">今日预警:{{dateArt.day}}</a></li>
           <li><a class="wdate" @click="dateView(6,$event)">7日内预警:{{dateArt.seven}}</a></li>
           <li><a class="wdate" @click="dateView(29,$event)">30日内预警:{{dateArt.thirty}}</a></li>
         </ul>
         </div>
         <div class="tab-content"><div id="wmain" class="view-w" v-loading="loading1"></div></div>
       </div>
       <div class="widget">
         <div class="widget-header   bordered-bottom bordered-sky text-align-left">
           <label><input type="checkbox" name="" v-model="artsort.checked" @click="checkedAll"  />全选</label>
           <a class="btn btn-sm artsort cur" @click="setType('created',$event)">发布时间</a>
           <a class="btn btn-sm artsort" @click="setType('sim_count',$event)">转载量</a>
           预警程度：
           <select id='querylevel' v-model="artsort.level"><option value='' >不限</option><option v-for="it in level" :value='it.id' >{{it.name}}</option></select>
           媒体：<select id='querymedtype' v-model="artsort.mediaType"><option value='' >不限</option><option v-for="it in mediaType" :value='it.id'>{{it.name}}</option></select>
           正负面：<select id='queryside' v-model="artsort.side" ><option value='' >不限</option><option v-for="it in side" :value='it.id'>{{it.name}}</option></select>
           <el-date-picker
             class="warndate"
             v-model="artsort.stime"
             type="daterange"
             format="yyyy/MM/dd"
             @change="changeDate"
             align="right"
             placeholder="选择日期范围"
             :picker-options="pickerOptions2">
           </el-date-picker>
           <label class="pagedetail">共{{pageCount}}篇文章</label>
         </div>
         <div class="widget-body art_total">
           <ul>
             <li v-for="it in artlist">
             <div class="widget-body art_list">
               <h5><input type="checkbox" name="" v-model="artsort.batch" :value="it.uuid" /><a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple" data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title="" :data-focus="it.is_focus" data-content="  " >{{it.site_name}}</a>
                 <!-- <label><router-link :to="{name:'wdetail',query:{id:it.uuid,sdate:it.created,media_type:it.media_type}}">{{it.title}}</router-link></label> -->
                 <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a></label>
                 <label v-else><a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a></label>
               </h5>
               <p  class="art_p_content">{{it.txt}}</p>
               <p class="art_p_detail grey">
                 <span>发布时间：{{it.pubdate}}  阅读数：{{it.view}}  权重:{{it.weight}}  {{it.warn_level==1?'常规预警':it.warn_level==2?'重要预警':it.warn_level==3?'':'非常重要预警'}}
                 <span>属性:</span><span :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":""}}</span></span>  <!--   主题：{{it.wid}} 维度：{{it.dimension}}  -->
                  <!-- <router-link v-if="it.sim_count!=0" :to="{name:'similar',query:{id:it.sim_id,type:2}}">相似文章{{it.sim_count}}</router-link> -->
                  <a v-if="it.sim_count!=0" href="javascript:void(0)" @click="snapview(it,1)">相似文章:{{it.sim_count}}</a>
               </p>
               <p class="art_p_edit xftdei">
                 <i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'"  @click="follow({uuid:it.uuid,article_date:it.created,type:'2',side:it.side,media_type:it.media_type},$event)" :data-unid="it.is_collect" ></i>
                 <i data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})"></i>
               </p>
             </div>
             </li>
           </ul>
           <div class="artfooter"  v-show="this.artlist.length>0">
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
             <label><input type="checkbox" name="" v-model="artsort.checked" @click="checkedAll"  />全选</label>
             <a class="btn btn-info" @click="exportshow(1)">导出<i class="glyphicon glyphicon-download right"></i></a>
             <a :class='artsort.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allCollect">收藏<i class="glyphicon glyphicon-heart right"></i></a>
             <a :class='artsort.batch.length>0?"btn btn-info":"btn btn-info disabled"' @click="allArtdel">删除<i class="glyphicon glyphicon-trash right"></i></a>
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
                    <button type="button" class="btn btn-info" v-if="snapart.batch!=0" @click="allExport(1)">导出</button>
                    <button type="button" class="btn btn-primary" v-else @click="allExport">导出</button>
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
                              <td><i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDel({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},$event)"></i><span>删除</span></td>
                            </tr>
                            <tr>
                              <td>文章属性：<span :class="snap.side==1?'neutral':snap.side==3?'positive':snap.side==-3?'opposite':'opposite'">{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>
                              <td><i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="modalfollow({uuid:snap.uuid,article_date:snap.created,type:'1',side:snap.side,media_type:snap.media_type},$event)" :data-unid="snap.is_collect" ></i><span>收藏</span></td>
                              <td><i data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o ifa-b" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i><span>预警</span></td>
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
                                    <span>属性:</span><span :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
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
                                <span>属性:</span><span :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
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
</template>
<script>
import { formatDate } from "../../static/js/globle.js";
import { getCookie } from "../../static/js/globle.js";
import { delCookie } from "../../static/js/globle.js";
let bootbox = require("bootbox");
let np=require("NProgress");
export default {
  data() {
    return {
      loading1:false,
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      artlist: [],
      pageCount: "",
      offset: 0,
      pageSize: 20,
      currentPage: 1,
      dateArt: {
        day: "",
        seven: "",
        thirty: ""
      },
      artsort: {
        type: "created",
        batch: [],
        checked: "",
        level: "",
        mediaType: "",
        side: "",
        stime: "",
        etime: "",
        batch: []
      },
      sh: {
        exportobj: "",
        exportname: "",
        exporttype: "1",
        exportall: "0"
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      level: [],
      mediaType: [],
      side: [],
      snap: {
        name: "傻逼文章快照"
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
    };
  },
  created() {
    this.loading1=true;
    getCookie("user") == "" ? this.$router.replace({ name: "/app" }) : "";
    np.start()
    let t = this;
    var url = "/client/warning/index/";
    t.enter(url, { params: {} }, function(d) {
      d.code == 1
        ? ((t.artlist = d.data.data), (t.pageCount = d.data.hits))
        : "";
        t.loading1 =false;
    });

    var url = "/client/api/get_lists";
    this.enter(url, { params: {} }, function(d) {
      t.level = d.data.warn_level;
      t.side = d.data.side;
      t.mediaType = d.data.media_type;
    });

    url = "/client/warning/get_gddata/";
    t.enter(url, { params: { gd_type: "today_total" } }, function(d) {
      t.dateArt.day = d.data;
    });
    url = "/client/warning/get_gddata/";
    t.enter(url, { params: { gd_type: "seven_total" } }, function(d) {
      t.dateArt.seven = d.data;
    });
    url = "/client/warning/get_gddata/";
    t.enter(url, { params: { gd_type: "thirty_total" } }, function(d) {
      t.dateArt.thirty = d.data;
    });

    var url = "/client/warning/get_gddata/",
      d = { params: { date_range: "1", gd_type: "level_total" } };
    t.enter(url, d, function(d) {
      t.drowview(d);
      $(".loading-container").addClass("loading-inactive");
    });
  },
  watch: {
    level: function() {
      this.$nextTick(function() {
        $("#querylevel").on("change", this.artlistChange);
      });
    },
    side: function() {
      this.$nextTick(function() {
        $("#queryside").on("change", this.artlistChange);
      });
    },
    mediaType: function() {
      this.$nextTick(function() {
        $("#querymedtype").on("change", this.artlistChange);
      });
    },
    "artsort.batch": {
      handler: function() {
        if (this.artlist.length == 0) {
        } else if (this.artsort.batch.length === this.artlist.length) {
          this.artsort.checked = true;
        } else {
          this.artsort.checked = false;
        }
      }
    },
    artlist: function() {
      var t = this;
      this.$nextTick(function() {
        $('[data-toggle="tooltip"]').tooltip();
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
          var isf = $(e.target).attr("data-focus");
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
                d.code == 1 ? t.artlistChange() : "";
                // isf==0?(d.code==1?$t.addClass('imp-red'):$t.removeClass('imp-red'),$t.attr('data-focus',d.data)):(d.code==1?$t.removeClass('imp-red'):$t.addClass('imp-red'),$t.attr('data-focus',d.data))
                $("[data-toggle=popover]").popover("hide");
              });
            }
          );
        });
      });
    }
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>预警</li><li class="active">预警概况</li>';
    $("#Crumbs").html(html);
    np.done()
  },
  methods: {
    changeDate(val) {
      this.artsort.etime = val;
      this.artlistChange();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.artlistChange();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = this.pageSize * (val - 1);
      this.getResult();
      $(document).scrollTop(0)
    },
    changePageSize() {
      this.offset = 0;
      this.artlistChange();
    },
    setType(str, t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.artsort.type = str;
      this.artlistChange();
    },
    artlistChange() {
      this.currentPage = 0;
      // this.getResult();
    },
    getResult() {
      var t = this;
      var url = "/client/warning/index/",
        d = {
          params: {
            date_range: this.artsort.etime,
            order_by: this.artsort.type,
            offset: this.offset,
            limit: this.pageSize,
            media_type: this.artsort.mediaType,
            side: this.artsort.side,
            warn_level: this.artsort.level
          }
        };
      this.enter(url, d, function(d) {
        t.artlist = d.data.data;
        t.offset == 0 ? (t.pageCount = d.data.hits) : "";
      });
    },
    dateView(day, $e) {
      this.loading1 =true;
      $(".wdate").removeClass("cur");
      $($e.target).addClass("cur");
      var t = this;
      this.artsort.etime = day;
      this.artlistChange();
      var url = "/client/warning/get_gddata/",
        d = { params: { date_range: day, gd_type: "level_total" } };
      this.enter(url, d, function(d) {
        t.drowview(d);
        t.loading1=false;
      });
    },
    drowview(d) {
      var option = {
        seriesTypes: ["line", "line", "line"],
        title: "",
        legend: ["常规预警", "重要预警", "非常重要预警"],
        //dataZoom:[{type: 'slider',show: true,xAxisIndex: [0],start: 1,end: 100}],
        axisDirec: "x",
        axis: d.data.title,
        imgname:'预警走势图',
        seriesData: [
          { name: "常规预警", value: d.data.total["常规预警"] },
          { name: "重要预警", value: d.data.total["重要预警"] },
          { name: "非常重要预警", value: d.data.total["非常重要预警"] }
        ]
      };
      $("#wmain").echartsSetDataForLineBar(option);
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
                  t.sh.exportname = "预警-"+"-"+new Date().Format('yyyy-MM-dd')
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
              if (t.artsort.batch.length == 0) {
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
                  t.sh.exportname = "预警-"+"-"+new Date().Format('yyyy-MM-dd')
                // t.sh.exportname = "批量文章导出";
                $("#exportModel").modal("show");
              }
            })();
      }
    },
    artExport(uid, med) {
      var t = this,
        url = "/client/api/exporting",
        d = {
          params: {
            uuid: t.sh.exportobj.uuid,
            type: t.sh.exportname
          }
        };
      t.enter(url, d, function(d) {
        d.code == 1
          ? (function() {
              $("#exportModel").modal("hide");
              var a = document.createElement("a");
              var url = t.dataurl + d.data;
              var filename = t.sh.exportname;
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            })()
          : d.code == 2 ? t.$message("请到设置我到导出下载文档！") : t.$message("导出失败！");
      });
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
        if (this.artsort.checked == false) {
          //实现反选
          _this.artsort.batch = [];
        } else {
          //实现全选
          _this.artsort.batch = [];
          _this.artlist.forEach(function(item) {
            _this.artsort.batch.push(item.uuid);
          });
        }
      }
    },
    allExport(v) {
      var ulist = [],t = this;
      if(v==1){
        t.snapart.batch.map(function(item) {
          t.snapart.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  ulist.push(it.uuid);
                })()
              : "";
          });
        });
      }else {
        t.artsort.batch.map(function(item) {
          t.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  ulist.push(it.uuid);
                })()
              : "";
          });
        });
      }
      var url = "/client/api/exporting",
        d = {
          params: {
            uuid: ulist,
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
          : d.code == 2 ? t.$message("请到设置我到导出下载文档！") : t.$message("导出失败！");
      });
    },
    allCollect(v) {
      var t = this,warr=[];
      if(v==1){
        t.snapart.batch.map(function(item) {
          t.snapart.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  var obj = {
                    uuid: it.uuid,
                    article_date: it.created,
                    type: "2",
                    media_type: it.media_type,
                    side: it.side
                  };
                  warr.push(obj);
                })()
              : "";
          });
        });
      }else {
        t.artsort.batch.map(function(item) {
          t.artlist.map(function(it) {
            it.uuid == item
              ? (function() {
                  var obj = {
                    uuid: it.uuid,
                    article_date: it.created,
                    type: "2",
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
          d.code == 1? (t.$message(d.msg),t.artlistChange()):t.$message(d.msg);
        }
      });
    },
    allArtdel() {
      var t = this;
      if (t.artsort.batch.length == 0) {
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
              t.artsort.batch.map(function(item) {
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
                  d.code == 1 ? t.artlistChange() : t.$message("删除失败!");
                }
              );
            }
          }
        });
      }
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
    }
  }
};
</script>
<style scoped>
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
.view-box {
  width: 100%;
}
.view-w {
  width: 100%;
  height: 100%;
}
.bs-tabs {
  width: 200px;
  float: left;
}
.bs-tabs ul{
  margin-bottom: 0;
}
.bs-tabs ul li {
  background-color: #fff;
  text-align: center;
  height: 76px;
  line-height: 70px;
}
.bs-tabs ul li a {
  display: block;
  cursor: pointer;
  text-decoration: none;
}
.tab-content {
  margin-left: 200px;
  height: 228px;
}
.artlist {
  width: 100%;
  margin-top: 10px;
}
.artdetail {
  width: 100%;
  margin-top: 10px;
}
.artdetail ul li {
  border: 1px solid #ccc;
}
.artdetail ul li p {
  word-break: break-word;
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
  margin: 3px;
  text-decoration: none;
  color:black;
}
a.cur,
a.artsort:hover {
  color: #199ed8;
  /* border: 1px solid #199ed8; */
}
.artfooter {
  height: 35px;
}
.artfooter a {
  display: inline-block;
  padding: 2px 6px;
  margin: 3 5px;
  border-radius: 2px;
  background-color: #cfcfcf;
}
.imp-red {
  color: #ff0000 !important;
}
.modal-title i{
  position: relative;
  top: 5px;
}
.dowtype {
  height: 30px;
}
.pagedetail {
  position: absolute;
  right: 10px;
  top: 10px;
}
.widget {
  margin: 0;
}
.wdate{
  color:black;
}
.wdate.cur{
  border: 1px solid #199ed8;
}

.xftbar  input[type="text"]{
    width:220px!important;
}
</style>
