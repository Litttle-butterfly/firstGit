<template>
<div>
  <div class="xftcrumb widget-body">
    <label>全部结果<span>&gt;</span></label>
    <label>{{choose.chwid}}<span>&gt;</span></label>
    <div style="display:inline-block" v-for="it in choose.chlist">
      <div class="menu-drop" >{{it.na}}<span @click="ab(1,it.tg,it.val,it.na)">&times;</span></div>
      <!-- <span>&gt;</span> -->
    </div>
    <label class="menu-drop" v-if="choose.chlist.length!=0" @click="ab(2)">清除筛选条件</label>
  </div>
  <div class="widget-body fathbox" >
    <table class="table table-striped table-hover">
        <tbody>
            <tr>
                <td class="text-align-center">主题</td>
                <td class="buttons-preview">
                  <a v-for="it in qlist.words" :class="it.id==sh.words?'btn btn-default btn-xs btn-sky':'btn btn-default btn-xs'" @click="changeWid(it.id,$event)">{{it.name}}</a>
                  <!-- <div v-if="it.id==sh.words" v-for="it in qlist.words">
                    <label v-for="i in it.condition.orword"><input type="radio" :value="i" v-model="sh.orwid" /><span>{{i}}</span></label>
                  </div> -->
                </td>
            </tr>
            <tr>
                <td class="text-align-center">监测时间</td>
                <td>
                  <label><input @click="artlistChange" type="radio" value="1" name="mtime" v-model="sh.mtime" /><span>今天</span></label>
                  <label><input @click="artlistChange" type="radio" value="2" name="mtime" v-model="sh.mtime" /><span>3天</span></label>
                  <label><input @click="artlistChange" type="radio" value="6" name="mtime" v-model="sh.mtime" /><span>7天</span></label>
                  <label><input @click="artlistChange" type="radio" value="29" name="mtime" v-model="sh.mtime" /><span>30天</span></label>
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
            <tr>
                <td class="text-align-center">媒体平台</td>
                <td>
                    <label> <input type="checkbox"  v-model='checked' @click="checkedAllmedia()" value="" />全部</label>
                    <label v-for="it in qlist.media_type"><input @click="artlistChange" type="checkbox" :value="it.id"  name="mediaType" v-model="sh.mediaType"  /><span>{{it.name}}</span></label>
                  <!--<label><input @click="artlistChange" type="radio" value="" name="mediaType" v-model="sh.mediaType"  /><span>不限</span></label>
                  <label v-for="it in qlist.media_type"><input @click="artlistChange" type="radio" :value="it.id" name="mediaType" v-model="sh.mediaType"  /><span>{{it.name}}</span></label>
                 -->
                </td>
            </tr>
            <tr class="qlisttoggle">
                <td class="text-align-center">维度</td>
                <td>
                  <label><input @click="artlistChange" type="radio" value="" name="dimension" v-model="sh.dimension"  /><span>不限</span></label>
                  <label v-for="it in qlist.dimension"><input type="radio" :value="it.id" name="dimension" @click="artlistChange" v-model="sh.dimension"  /><span>{{it.name}}</span></label>
                </td>
            </tr>
            <tr class="qlisttoggle">
                <td class="text-align-center">地域</td>
                <td>
                  <select @change="artlistChange" id="region" v-model="sh.region"><option value="">全国</option><option v-for="it in qlist.region_type" :value="it.id" >{{it.name}}</option></select>
                </td>
            </tr>
            <tr class="qlisttoggle">
                <td class="text-align-center">属性</td>
                <td>
                  <label><input @click="artlistChange" type="radio" value="" name="side" v-model="sh.side"  /><span>不限</span></label>
                  <label v-for="it in qlist.side"><input type="radio" @click="artlistChange" :value="it.id" name="side" v-model="sh.side"  /><span>{{it.name}}</span></label>
                </td>
            </tr>
            <tr class="qlisttoggle">
                <td class="text-align-center">媒体属性</td>
                <td>
                  <label><input @click="artlistChange" type="radio" value="" name="mediaPro" v-model="sh.mediaPro"  />不限</label>
                  <label v-for="it in qlist.property_type"><input type="radio" @click="artlistChange" :value="it.id" name="mediaPro" v-model="sh.mediaPro" /><span>{{it.name}}</span></label>
                </td>
            </tr>
        </tbody>
        <tfoot>
          <!-- <tr><td colspan="2"><i :class="this.tbmore==false?'ifa ifa-table-more-g ifacenter':'ifa ifa-table-less-g ifacenter'"></i></td></tr> -->
          <tr><td colspan="2" style="padding:10px 0;">
            <div class="mydiv">
            <span  class=" myspan"  @click="tablemore">{{ tbmore==false?'更多选项(维度、地域、属性、媒体属性)': '收起' }}
              <i :class="this.tbmore==false?'xftifa ifa-table-more-g':'xftifa ifa-table-less-g'"></i></span>
            </div>
          </td></tr>
        </tfoot>
    </table>
  </div>
  <div v-show="cloudshow" class="cloud widget-body">
    <div id="worldcloud" class="cloud-chart"></div>
  </div>
  <div class="widget">
      <div class="widget-header bordered-bottom text-align-left xftbar" style="background-color:white">
        <label><input type="checkbox" v-model="sh.checked" @click="checkedAll"/><span>全选</span></label>
        <a class="btn  btn-sm artsort cur" @click="setsort('created',$event)">时间降序</a>
        <a class="btn  btn-sm artsort" @click="setsort('weight',$event)">权重降序</a>
        <a class="btn  btn-sm artsort" @click="setsort('sim_count',$event)">转载降序</a>
        <select @change="artlistChange" v-model="sh.filter"><option value='0' >不过滤</option><option value='1' >过滤</option></select>
        <select v-model="sh.search_type"><option value='1' >搜内容</option><option value='2' >搜媒体</option><option value='3' >搜标题</option></select>
        <input type="text" class="keywords input-search"  v-model="sh.keywords" value="" />
        <a class='btn btn-sm' @click="artlistChange">搜索</a>
        <label class="pagedetail">共{{pageCount}}篇文章</label>
      </div><!--Widget Header-->
      <div class="art_total" v-loading="loading">
        <ul>
          <li v-for="it in artlist">
            <div class="widget-body art_list">
              <h5>
                <input type="checkbox" name="" v-model="sh.batch" :value="it.uuid" />
                <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple"
                data-trigger="focus" data-toggle="popover" data-placement="bottom" data-title=""
                 :data-content="it.is_focus" >{{it.site_name}}</a>
                 <!-- <div class="test" data-toggle="tooltip" :title="it.site_name" data-placement="right">
                   <i class="fa fa-check" v-if="it.is_focus!=0"></i>
                   <img src="../../static/img/test.jpg" style="width:40px;height:40px;border-radius:20px;" />
                 </div> -->
                <!-- <label><router-link :to="{name:'Mdetail',query:{id:it.uuid,sdate:it.created,media_type:it.media_type}}">{{it.title}}</router-link></label> -->
                <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a></label>
                <label v-else><a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a></label>
              </h5>
              <p class="art_p_content" v-html="it.txt">{{it.txt}}</p>
              <p class="art_p_detail grey">
                <span>发布时间：{{it.pubdate}} </span><span> 阅读数:{{it.view}}</span>  <!--   维度：{{it.dimension}}  -->
                <span>权重:{{it.weight}}&nbsp;</span>
                <span v-if="it.media_type==6" >粉丝数:{{it.followers_count}}条</span>
                <span v-if="it.media_type==6" >点赞数:{{it.attitudes_count}}条</span>
                <span>属性:</span><span @click="changeSide({uuid:it.uuid,sdate:it.created,media_type:it.media_type})" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"其他"}}</span>
                <!-- <router-link  :to="{name:'similar',query:{id:it.sim_id,type:1}}"></router-link> -->
                <a v-if="it.sim_count!=0" href="javascript:void(0)" @click="snapview(it,1)">相似文章:{{it.sim_count}}</a>
              </p>
              <p class="art_p_edit">
                <!-- <i  class="ifa ifa-book-g" data-toggle="tooltip" data-placement="bottom" title="修改属性" ></i> 更改 -->
                <!-- <label><i @click="follow({uuid:it.uuid,article_date:it.created,type:'1',side:it.side,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" :data-unid="it.is_collect" ></i>收藏</label>
                <label><i @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})" data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" ></i>导出</label>
                <label v-if="it.is_warning==0"><i @click="getWarnType({uid:it.uuid,url:it.site_url,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o ifa-b" ></i>预警</label>
                <label v-else><i data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-s ifa-b"></i>预警</label>
                <label><i @click="setfeedback(it)" class="ifa ifa-exp-g" data-toggle="tooltip" data-placement="bottom" title="错误反馈" ></i>反馈</label>
                <label><i @click="artDel({uuid:it.uuid,sdate:it.created,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" ></i>删除</label> -->
                <i @click="follow({uuid:it.uuid,article_date:it.created,type:'1',side:it.side,media_type:it.media_type},$event)" data-toggle="tooltip" data-placement="bottom" title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" :data-unid="it.is_collect" ></i><!-- 收藏 -->
                <i @click="exportshow(0,{uuid:it.uuid,medtype:it.media_type,name:it.title})" data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" ></i><!-- 导出 -->
                <i @click="getWarnType({uid:it.uuid,url:it.site_url,name:it.website_name,title:it.title,created:it.created,media_type:it.media_type})" v-if="it.is_warning==0" data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-o ifa-b" ></i> <!-- 发送预警 -->
                <i v-else data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-s ifa-b"></i>
                <i @click="setfeedback(it)" class="fa fa-commenting-o" data-toggle="tooltip" data-placement="bottom" title="错误反馈" ></i>
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
                 <button type="button" class="btn btn-info" v-if="snapart.itart!=''" @click="sendWarning(1)">提交</button>
                 <button type="button" class="btn btn-info" v-else @click="sendWarning">提交</button>
             </div>
         </div><!-- /.modal-content -->
     </div><!-- /.modal-dialog -->
 </div><!-- /.modal -->
 <div id="feedbackModel" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">错误反馈</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">反馈文章</label>
                      <div class="col-sm-10">
                          <label>{{feedb.title}}</label>
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">错误类型</label>
                      <div class="col-sm-10">
                          <select class="form-control"  v-model="feedb.type"><option value='1'>来源错误</option><option value='2'>情绪错误</option><option value="3">解析错误</option><option value="3">其他</option></select>
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="inputEmail3" class="col-sm-2 control-label no-padding-right">错误详情</label>
                      <div class="col-sm-10">
                          <textarea v-model="feedb.remarks" class="form-control" rows="6"></textarea>
                      </div>
                  </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-info" @click="sendfeedback">提交</button>
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
                <button type="button" class="btn btn-primary" v-if="sh.exportall==0" @click="artExport">导出</button>
                <button type="button" class="btn btn-info" v-if="snapart.batch!=0" @click="allExport(1)">导出</button>
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
                        <td><i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDel({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},$event)"></i><span>删除</span></td>
                      </tr>
                      <tr>
                        <td>文章属性：<span @click="changeSide({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},1,snap)" :class="snap.side==1?'neutral':snap.side==3?'positive':snap.side==-3?'opposite':'opposite'">{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>
                        <td><i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="modalfollow({uuid:snap.uuid,article_date:snap.created,type:'1',side:snap.side,media_type:snap.media_type},$event)" :data-unid="snap.is_collect" ></i><span>收藏</span></td>
                        <td v-if="snap.is_warning==0"><i data-toggle="tooltip" data-placement="bottom" title="预警" :class="snap.is_warning==0?'ifa ifa-clock-o ifa-b':'ifa ifa-clock-s ifa-b'" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i><span>预警</span></td>
                        <td v-else><i  data-toggle="tooltip" data-placement="bottom" title="预警" class="ifa ifa-clock-s ifa-b"></i><span>预警</span></td>
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
                <h4 class="modal-title" v-else v-html="snap.title">{{snap.title}}</h4> -->
                <h4 class="modal-title"><i class="ifa ifa-datatotal"></i>相似文章列表</h4>
                <!-- <a :href="snap.url" target="_blank">查看原文</a> -->
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
</template>
<script>
import { getCookie } from "../../static/js/globle.js";
import "../../static/js/globle.js";
let bootbox = require("bootbox");
let echarts = require("echarts");
let np=require("NProgress");
require("echarts-wordcloud");
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
      qlist: [],
      words: [],
      mediaType: [],
      dimension: [],
      region: [],
      side: [],
      mediaPro: [],
      artlist: [],
      pageCount: "",
      offset: 0,
      currentPage: 1,
      pageSize: 20,
      cloudshow: false,
      userlist: [],
      users: [],
      wprogramme: [],
      sendtitle: "",
      sendwtitle: "",
      sh: {
        batch: [],
        checked: "",
        sortWay: "",
        words: "",
        orwid:'',
        mtime: "-1",
        stime: [new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() - 6),
          new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
        ],
        etime: "",
        dimension: "",
        mediaType: [],
        region: "",
        side: "",
        mediaPro: "",
        filter:'0',
        search_type: "1",
        keywords: "",
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
      artsort: {
        content: "",
        keywords: ""
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
        itart:'',
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tbmore:false,
      loading:true,
      choose:{
        chwid:'',
        chlist:[]
      },
      feedb:{
        title:'',
        onelist:'',
        type:'1',
        remarks:'',

      }
    };
  },
  created() {
    getCookie("user") == "" ? this.$router.replace({ name: "/login" }) : "";
    $('.mo').addClass('active');
    this.sh.etime=new Date(this.sh.stime[0]).Format('yyyy/MM/dd')+'-'+new Date(this.sh.stime[1]).Format('yyyy/MM/dd')
    np.start();
    this.$ajax.post("/client/api/get_lists",{}).then((d)=>{
      $('.mo').addClass('active');
      this.qlist = d.data.data;
      if(d.data.data){
        d.data.data.media_type.map((item,index)=>{
          this.sh.mediaType.push(item.id)
        })
        this.sh.words = d.data.data.words[0].id;
        this.choose.chwid = d.data.data.words[0].name;
        this.choose.chlist.push({na:'全部媒体',tg:'mediaType',val:''})
        // t.qlist.media_type.map(function(it){t.choose.chlist.push({val:it.id,na:it.name,tg:'mediaType'})})
        this.artlistChange();
      }
    })
    this.$ajax.post("/client/api/warning",{}).then((d)=>{
      var d = d.data.data == undefined ? [] : d.data.data;
      this.wprogramme = d;
      this.sh.wprogramme = d.length == 0 ? "" : d[0].id;
      this.users = d;
    })
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li class="active">监测</li>';
    $("#Crumbs").html(html);
    $(".qlisttoggle").hide();
    $('.mo').addClass('active');
    //this.wordCloud()
    np.done();
  },
  watch: {
    "sh.batch": {
      handler: function() {
        if (this.artlist.length == 0) {
        } else if (this.sh.batch.length === this.artlist.length) {
          this.sh.checked = true;
        } else {
          this.sh.checked = false;
        }
      }
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
              if($('input[name=mediaType]:checked').length==t.qlist.media_type.length){
                t.choose.chlist.push({na:'全部媒体',tg:'mediaType',val:it.value})
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
              if($('input[name=mediaType]:checked').length==t.qlist.media_type.length){
                t.choose.chlist.push({na:'全部媒体',tg:'mediaType',val:''})
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
            template:'<div class="popover pop ' +$(this).data("class") +'"><div class="arrow"></div><h3 class="popover-title ' +
              $(this).data("titleclass") +'">Popover right</h3><div class="popover-content"></div></div>'
          });
        }).on("shown.bs.popover", function(e) {
          var isf = $(e.target).attr("data-content");
          isf == 0
            ? $(".popover-content").html('<a class="focusSite" data-target="' + isf + '">关注</a>')
            : $(".popover-content").html('<a  class="focusSite" data-target="' + isf + '">取消关注</a>');
          $(".focusSite").on("click",{
              sitename: $(this).text(),
              medtype: $(this).attr("data-value"),
              $ht: $(e.target)
            },function(e) {
              var isf = $(this).attr("data-target"),url = "",d = {},$t = e.data.$ht;
              isf == 0? ((url = "/client/api/media_collect"),
                  (d = {params: {website_name: e.data.sitename,media_type: e.data.medtype}}))
                : ((url = "/client/api/media_uncollect"),(d = { params: { id: isf, media_type: e.data.medtype } }));
              t.enter(url, d, function(d) {
                d.code == 1 ? t.artlistChange() : "";
                $("[data-toggle=popover]").popover("hide");
              });
            }
          );
        });
      });
    },
    "sh.mediaType": {
      handler: function(val, oldVal) {
        if (this.sh.mediaType.length === this.qlist.media_type.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      },
      deep: true
    }
  },
  methods: {
    checkedAllmedia(e) {
      var _this = this;
      if (this.checked == false) {// 如果要实现全部不选
        //实现反选
        _this.sh.mediaType = [];
      } else { //实现全选
        _this.sh.mediaType = [];
        _this.qlist.media_type.forEach(function(item) {
          _this.sh.mediaType.push(item.id);
        });
      }
      this.wordCloud();
      this.getResult();
    },
    mymouse(ev){
       $(ev.target).focus()
    },
    ab(v,a,b,c){
      if(v==1){
        a=="mediaType"?(c=="全部媒体"?this.sh.mediaType=[]:this.sh[a].splice(this.sh[a].indexOf(parseInt(b)),1)):
        a!="mtime"?this.sh[a]="":(this.sh[a]="-1",this.sh.etime=new Date(this.sh.stime[0]).Format('yyyy/MM/dd')+'-'+new Date(this.sh.stime[1]).Format('yyyy/MM/dd'));
        this.choose.chlist=this.choose.chlist.filter(function(t){return t.na!=c})
      }else if(v==2){
        this.sh.mtime="-1"
        this.sh.dimension=""
        this.sh.mediaType=[]
        this.sh.region=""
        this.sh.side=""
        this.sh.mediaPro=""
        this.choose.chlist=[]
      }
      this.artlistChange();
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
    s() {
      $(".fathbox").stop().animate({ height: "360px" });
      $(".qlisttoggle").stop().show();
            $(".myspan")
        .stop()
        .animate({ width: "124px" });
    },
    h() {
      $(".fathbox").stop().animate({ height: "202px" });
      $(".qlisttoggle").stop().hide();
            $(".myspan")
        .stop()
        .animate({ width: "400px" });
    },
    wordCloud(){
      var url = "/client/article/get_hotwords",t = this;
      t.cloudshow=false;
      var option = {
        title: { text: "热词云" },
        tooltip: { show: false },
        animation:false,
        series: [
          {
            name: "热词云",
            type: "wordCloud",
            width: '90%',
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
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            autoSize: { enable: true, minSize: 6 },
            data: []
          }
        ]
      };
      let opt = [];
      var idx=setInterval(function(){
        t.sh.words!=""?function(){
          clearInterval(idx)
          t.enter(url, { params: {
            wid:t.sh.words,
            date_range: t.sh.mtime == -1 ? t.sh.etime : t.sh.mtime,
            dimension: t.sh.dimension,
            media_type: t.sh.mediaType.length==t.qlist.media_type?"":t.sh.mediaType,
            region_type: t.sh.region,
            side: t.sh.side,
            search_type: t.sh.search_type,
            property_type: t.sh.mediaPro,
            search_txt: t.sh.keywords,
            limit: 100
          }}, function(d) {
          // d.data==0?$('#worldcloud').html('<p class="text-align-center">暂无数据</p>'):'';
          $('.cloud-chart').width($('body').width()-250)
          d.data.length==0?t.cloudshow=false:t.cloudshow=true;//liguohua say
          d.data.map(function(item, index) {
            opt.push({
              name: item.key,
              value: item.count
            });
          });
          option.series[0].data = opt;
          var myChart = echarts.init($("#worldcloud")[0]);
          myChart.setOption(option);
          myChart.on('click',function(params){
            t.sh.keywords=params.name;
            t.getResult();
          })
          });
        }():''
      },50)
    },
    changeDate(val) {
      this.sh.etime = val;
      this.artlistChange();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.artlistChange();
      this.getResult();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = this.pageSize * (val - 1);
      this.getResult();
      $(document).scrollTop(0)
    },
    changeWid(wid, $e) {
      this.sh.words = wid;
      this.offset = 0;
      this.currentPage=1;
      this.sh.keywords="";
      this.choose.chwid=$e.target.text;
      this.sh.orwid="";
      // $(".buttons-preview a").removeClass("cur"), $($e.target).addClass("cur");
      this.artlistChange();
    },
    setwords(id) {
      this.sh.words = id;
      this.artlistChange();
    },
    setsort(str, t) {
      $(".artsort").removeClass("cur"), $(t.target).addClass("cur");
      this.sh.sortWay = str;
      this.getResult();
    },
    artlistChange() {
      this.currentPage = 0;
      // this.getResult();
      this.wordCloud();
    },
    getResult() {
      this.loading=true;
      $('.mo').addClass('active');
      //this.artlist=[];
      this.$ajax.post("/client/article/index",{
        date_range: this.sh.mtime == -1 ? this.sh.etime : this.sh.mtime,
        wid: this.sh.words,
        dimension: this.sh.dimension,
        media_type: this.sh.mediaType.length==this.qlist.media_type?"":this.sh.mediaType,
        region_type: this.sh.region,
        side: this.sh.side,
        filter:this.sh.filter,
        search_type: this.sh.search_type,
        property_type: this.sh.mediaPro,
        search_txt: this.sh.keywords,
        order: this.sh.sortWay,
        offset: this.offset,
        limit: this.pageSize
      }).then((d)=>{
        this.loading=false;
        if (d.data.code == 1) {
          this.artlist = d.data.data.data;
          this.pageCount = d.data.data.hits
        } else {
          this.$message.error("数据载入失败，请稍后重刷新进入");
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
                  t.sh.exportname = "监测-"+t.choose.chwid+"-"+new Date().Format('yyyy-MM-dd')
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
                  t.sh.exportname = "监测-"+t.choose.chwid+"-"+new Date().Format('yyyy-MM-dd')
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
      this.sendtitle = $($e.target)
        .find("option:selected")
        .text();
      // this.sh.sendWTitle =
      //   this.sendtitle + "-" + this.sendWTitle == undefined
      //     ? ""
      //     : this.sendWTitle;

      this.wprogramme.map(function(item,index){
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
    setfeedback(fb){
      this.feedb.onelist=fb;
      var a=new RegExp('[<font color="red">/]','gmi')
      this.feedb.title=fb.title.replace(a,'');
      this.feedb.type="1";
      this.feedb.remarks="";
      $("#feedbackModel").modal("show");
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
            t.sh.sendWArticle = us.name + (us.url==undefined?'':us.url);
            var a=new RegExp('[<font color="red">/]','gmi')
            t.sh.sendWTitle = t.sendtitle + "-" + us.title.replace(a,'');
          })();
    },
    sendWarning(v) {
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
        if(v==1){
          d.code != 1 ? t.$message.error("发送失败！"):($("#warnModel").modal("hide"),t.getResult(),t.snapview(t.snapart.itart),t.openMsg("发送成功！", "success"));
        }else {
          d.code != 1 ? t.$message.error("发送失败！"):($("#warnModel").modal("hide"),t.getResult(),t.openMsg("发送成功！", "success"));
        }
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
                  d.code != -1 ? (t.getResult(),t.snapview(val)) : t.$message.error("修改失败！");
                } else if(v==2){
                  d.code != -1 ? (t.getsnapResult()) : t.$message.error("修改失败！");
                } else {
                  d.code != -1 ? t.getResult() : t.$message.error("修改失败！");
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
                  d.code != -1 ? (t.getResult(),t.snapview(val)) : t.$message.error("修改失败！");
                }else if(v==2){
                  d.code != -1 ? (t.getsnapResult()) : t.$message.error("修改失败！");
                }else {
                  d.code != -1 ? t.getResult() : t.$message.error("修改失败！");
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
                  d.code != -1 ? (t.getResult(),t.snapview(val)) : t.$message.error("修改失败！");
                } else if(v==2){
                  d.code != -1 ? (t.getsnapResult()) : t.$message.error("修改失败！");
                } else {
                  d.code != -1 ? t.getResult() : t.$message.error("修改失败！");
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
    sendfeedback(){
      var t=this;
      t.enter('/client/error_info/add',{params:{
        uuid:this.feedb.onelist.uuid,
        media_type:this.feedb.onelist.media_type,
        article_date:this.feedb.onelist.created,
        err_type:this.feedb.type,
        err_txt:this.feedb.remarks,
      }},function(d){
        // t.getResult(),
        d.data==1?($("#feedbackModel").modal("hide"),t.openMsg('信息反馈成功！',"success")):t.openMsg('信息反馈失败！',"warning");
      })
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
    allChange(v) {
      var t = this,url = "/client/api/side";
      bootbox.dialog({
        message: "修改属性",
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
                    type: "1",
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
                    type: "1",
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
    allWarn(v) {
      var t = this;
      this.sh.wprogramme.length == 0
        ? (function() {
            t.openMsg("请到到预警-->预警设置-->新增预警！", "warning");
          })()
        : (function() {
            var warr = [],
              text = "",
              title = "";
            if(v==1){
              t.snapart.batch.map(function(item) {
                t.snapart.artlist.map(function(it) {
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
            }else {
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
            }
            t.sh.sendUuid = warr.join("|");
            t.sh.sendWArticle = text;
            t.sendWTitle = title;
            t.wprogramme.map(function(item,index){
                if(t.sh.wprogramme == item.id){
                  t.sh.sendWTitle =item.name
                }
            })
            // t.sh.sendWTitle = t.sendtitle + title;
            $("#warnModel").modal("show");
          })();
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
        t.sh.batch.map(function(item) {
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
    allArtdel(v) {
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
            var warr = [];
            if(v==1){
              t.snapart.batch.map(function(item) {
                t.snapart.artlist.map(function(it) {
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
            }else {
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
            }
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
label span {
  position: relative;
  top: -1px;
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
a.artsort {
  display: inline-block;
  margin: 3px;
  text-decoration: none;
  box-shadow: none;
}
a.cur,a.artsort:hover {
  color:#199ed8;
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
.custom {
  display: inline-block;
}
.imp-red {
  color: #ff0000 !important;
}
.modal-title i{
  position: relative;
  top: 5px;
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
.input-search {
  padding:14px 5px;
  height: 24px;
  width: 128px;
  position: relative;
  box-sizing: border-box;
}
.pagedetail {
  position: absolute;
  right: 10px;
  top: 10px;
}
textarea {
  width: 100%;
  resize: none;
}
.form-group {
  display: flex;
}
.dowtype {
  height: 30px;
}
.cloud-chart {
  width: 100%;
  height: 80px;
}
.cloud{
  padding:10px;
}
.art_total{
  min-height: 300px;
}
.art_total li {
  border: none;
}
.art_total li:nth-last-child(2n) {
  border-bottom: none;
}
.widget-body, .widget-header {
    box-shadow: none;
    border: 1px solid #eee;
    margin-top: -1px;
    border-left: 0;
    border-right: 0;
}
.test{
  width: 40px;
  height: 40px;
  display: inline-block;
  background-color: #cfcfcf;
  border-radius: 20px;
  margin-right: 0;
  position: relative;
}
.test i{
  position: absolute;
  right: -5px;
  top: 24px;
  color: #ff0;
}
.fa.fa-commenting-o{
  color: #b2b2b2;
  font-weight: 900;
  font-size: 18px;
}
</style>
