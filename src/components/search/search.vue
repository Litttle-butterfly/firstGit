<template>

        <div class="setAuto" id="top">
            <div><!--搜索键入模块-->
                <el-radio-group v-model="radio3" @change= "searchsm">
                    <el-radio-button label="站内搜索"></el-radio-button>
                    <el-radio-button label="全库搜索"></el-radio-button>
                </el-radio-group>

                <span>媒体类型：</span>
                <el-select v-model="library.media_type" placeholder="请选择" clearable @change="mediachange(library.media_type)">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                <span>时间范围：</span>
                <el-date-picker @change="datechange"
                    v-model="dateval"
                    type="daterange"
                    align="right"
                    format="yyyy/MM/dd"
                    placeholder="选择日期范围"
                    :picker-options="pickerOptions2">
                </el-date-picker>

                <br/>
                <el-input class="searchipt"
                    placeholder="请输入搜索内容"
                    icon="search" v-show='!show'
                    v-model="library.search_txt"
                    @keyup.enter.native="searchsm"
                    :on-icon-click="searchsm">
                </el-input>

                <el-tooltip :disabled="show" content="高级搜索功能" placement="bottom" effect="light">
                    <el-button @click="show = !show">点击{{show ? '关闭' : '开启'}} 高级搜索 功能</el-button>
                </el-tooltip>


                <div  v-show="show" >
                <!--3中模式开始-->
                  <transition name="el-fade-in-linear">
                    <div  v-show="show" class="transition-box">

                        <!-- Nav tabs -->
                        <ul class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">快捷模式</a></li>
                            <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">高级模式</a></li>
                            <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">语义模式</a></li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content">
                            <div class="tab-pane active" id="home">
                                <!-- <i class="ifa ifa-new-g" @click="areamore"></i> -->
                                <div class="form-group">
                                    <label for="theme_name" class="col-sm-2 control-label">主题名称:</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" v-model="head.name" id="theme_name" placeholder="请输入15字以内主题名称（必填）"
                                    @blur="checkname">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="robot_help" class="col-sm-2 control-label">智能辅助:</label>
                                    <div class="col-sm-9">
                                        <input type="text" v-model="head1.words" class="form-control" id="robot_help" placeholder="输入关键词">
                                    </div>
                                    <div class="col-sm-1">
                                        <button  class="btn btn-default  btn-sm btn-sm btn-sky"  @click="anls">分析</button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">小提示:</label>
                                    <div class="col-sm-9">
                                    <p>您可将分析出来的<关键词><用力拖拽>至下面任意搜索框内或者<手动输入>并<以回车结束>关键词</p>
                                    <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags"  :key="tag" ><span>{{tag.word}}</span>
                                    <i @click="handleClose(tag,$event)" class="xx">×</i></span>
                                    </div>
                                </div>

                                <div class="form-group">

                                    <div class="col-sm-11">
                                        <div id="sbbox">
                                            <div class="pp">
                                              <h5>匹配类型：</h5>
                                              <div v-for="(item,index)  in type1" :class="'pp'+index" class="ppx" :key="index">
                                                <select class="jcselect">
                                                    <option value='1'>标题和内容</option>
                                                    <option value='2'>标题</option>
                                                    <option value='3'>内容</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div   @drop='dropjc($event)' @dragover='allowDrop($event)' class ="jc">
                                                <h5>监测词</h5>
                                                <div v-for="(item,index)  in type1" class="jcx" :class="'jcx'+index" :key="index">
                                                <input type="text" class="jctext"/>
                                                <!--<textarea rows="6" cols="20" class="jctext"></textarea>-->
                                                </div>
                                            </div>
                                            <div   @drop='drop($event,1)' @dragover='allowDrop($event)' class ="bh">
                                                <h5>包含词</h5>
                                                <div v-for="(item,index) in type1" class="bhx" :class="'bhx'+index" :key="index">
                                                <!--<el-input
                                                    type="textarea" class="bhtext" //类名冲突
                                                    :rows="2"
                                                    placeholder="请输入内容"
                                                    v-model="textarea">
                                                    </el-input>-->
                                                <textarea rows="2" cols="20" class="bhtext" style="resize:none;" @focus="myresize($event)"  @input="myresize($event)" @propertychange="myresize($event)" ></textarea>
                                                </div>
                                            </div>
                                            <div  @drop='drop($event,1)' @dragover='allowDrop($event)'  class ="pc">
                                                <h5> 排除词</h5>
                                                <div v-for="(item,index)  in type1" class="pcx" :class="'pcx'+index" :key="index">
                                                    <textarea rows="2" cols="20" class="pctext" style="resize:none;" @focus="myresize($event)"  @input="myresize($event)" @propertychange="myresize($event)"></textarea>
                                                    <div id="PlusAndMinus">
                                                      <span class="glyphicon glyphicon-plus"  @click="areamore(index)" title="在此新增一条"></span>
                                                      <span class="glyphicon glyphicon-minus" @click="delline(index,$event)" title="立刻删除该条数据"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-1">

                                    </div>
                                </div>
                              <div class="form-group">
                                  <label  class="col-sm-2 control-label">
                                  </label>
                                  <div class="col-sm-9 xftgroup" style="margin-top:50px;">
                                <button @click="highsearch(1)" class="btn btn-sm btn-default  btn-sm btn-sky">更新搜索结果</button>
                                <button @click="sub1"  class="btn btn-sm btn-default  btn-sm btn-sky">保存到监测主题</button>
                                  </div>
                                  <div  class="col-sm-1">  </div>
                              </div>

                            </div>

                            <div role="tabpanel" class="tab-pane" id="profile">
                                <div class="form-group">
                                    <label for="theme_name" class="col-sm-2 control-label">主题名称:</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control"  v-model="head.name" id="theme_name"
                                    @blur="checkname" placeholder="请输入15字以内主题名称（必填）">
                                    </div>
                                </div>
                                <div class="form-group">
                                  <label for="robot_help" class="col-sm-2 control-label">  匹配类型:</label>
                                    <div class="col-sm-4">

                                      <select v-model="type2.match_type">
                                          <option value='1'>标题和内容</option>
                                          <option value='2'>标题</option>
                                          <option value='3'>内容</option>
                                      </select>
                                    </div>
                                      <div class="col-sm-1">
                                      </div>
                                </div>
                                <div class="form-group">
                                    <label for="robot_help" class="col-sm-2 control-label">智能辅助:</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="robot_help" placeholder="输入关键词"  v-model="head1.words">

                                </div>
                                <div class="col-sm-1">
                                        <button  @click="anls"  class="btn btn-default  btn-sm btn-sm btn-sky" >分析</button>
                                </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">小提示：</label>
                                    <div class="col-sm-10">
                                        <p class="form-control-static">下面是一些最常见关键词。您可以编辑表达式时选用。

                                        <br/>      布尔表达式：
                                        <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in boo"  :key="tag" ><span>{{tag.word}}</span>
                                        </span>
                                        <br/>
                                        <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags"  :key="tag" ><span>{{tag.word}}</span>
                                        <i @click="handleClose(tag,$event)" class="xx">×</i></span>

                                        </p>
                                </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label"></label>
                                    <div class="col-sm-9">
                                        <div id="tagmovehere" >
                                            <div class="taggroup"  @drop='dropboo($event)' @dragover='allowDrop($event)'  >
                                              <textarea class="form-control booval" rows="3" v-model="type2.condition" ></textarea>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                              <div class="form-group">
                                  <label  class="col-sm-2 control-label">
                                  </label>
                                  <div class="col-sm-9 xftgroup2">
                                        <button @click="highsearch(2)" class="btn btn-sm btn-defult btn-sky">更新搜索结果</button>
                                        <button @click="sub2"  class="btn btn-sm btn-default  btn-sm btn-sky">保存到监测主题</button>
                                  </div>
                                  <div  class="col-sm-1">  </div>
                              </div>

                            </div>
                            <div role="tabpanel" class="tab-pane" id="messages">
                                <div class="form-group">
                                    <label for="theme_name" class="col-sm-2 control-label">主题名称：</label>
                                    <div class="col-sm-9">
                                    <input type="text" class="form-control" id="theme_name" @blur="checkname"
                                    v-model="head.name" placeholder="请输入15字以内主题名称（必填）">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="robot_help" class="col-sm-2 control-label">智能辅助:</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="robot_help" v-model="head1.words"  placeholder="输入关键词">
                                    </div>
                                    <div class="col-sm-1">
                                        <button  @click="anls3"  class="btn btn-sm btn-default  btn-sm btn-sky" >分析</button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">小提示：</label>

                                    <div class=" col-sm-9" >
                                        <p class="form-control-static">下面是一些最常见关键词。您可以编辑表达式时选用。  </p>

                                        <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags33"  :key="tag" ><span>{{tag.word}}</span>
                                        <i @click="handleClose33(tag,$event)"class="xx">×</i></span>


                                    </div>
                                    <div class="col-sm-1">

                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="robot_help" class="col-sm-2 control-label"></label>
                                    <div class="col-sm-9 taggroup">
                                        <div>
                                            <h5>相关词
                                                <input
                                                class="input-new-tag"
                                                v-if="inputVisible"
                                                v-model="inputValue"
                                                ref="saveTagInput"
                                                size="mini"
                                                @keyup.13="handleInputConfirm"
                                                @blur="handleInputConfirm"
                                                >
                                            </input>
                                            <button v-else class="btn btn-xft" size="small" @click="showInput">+ 新增</button></h5>
                                            <textarea rows="6" cols="20" class="relevant" @drop='drop($event,3)'></textarea>
                                        </div>
                                        <div>
                                            <h5>不相关词
                                                <input
                                                class="input-new-tag"
                                                v-if="inputVisible2"
                                                v-model="inputValue2"
                                                ref="saveTagInput2"
                                                size="mini"
                                                @keyup.13="handleInputConfirm2"
                                                @blur="handleInputConfirm2"
                                                >
                                                </input>
                                                <button v-else class="btn btn-xft" size="small" @click="showInput2">+ 新增</button></h5>
                                            <textarea rows="6" cols="20" class="disrelated" @drop='drop($event,3)'></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-1">

                                    </div>
                                </div>
                                        <div class="form-group">
                                  <label  class="col-sm-2 control-label">
                                  </label>
                                  <div class="col-sm-9 xftgroup2">
                                        <button @click="highsearch(3)" class="btn btn-sm btn-default  btn-sm btn-sky">更新搜索结果</button>
                                        <button @click="sub" class="btn btn-sm btn-default  btn-sm btn-sky">保存到监测主题</button>
                                  </div>
                                  <div  class="col-sm-1">  </div>
                              </div>

                            </div>
                        </div>
                    </div>
                  </transition>
                <!--3中模式结束-->
                </div>

            </div>
            <br />
            <span v-show="this.pagetotal">已为您找到{{pagetotal}}条相关信息</span>
            <div class="media widget-body"  v-for="it in artlist" :key="it.id"> <!-- 媒体搜索出内容模块-->
                <div class="media-body">
                    <div class="artdetail">
                        <ul>
                            <li class="checklist">
                              <div class="art_list">
                                <h5>
                                   <input type="checkbox" name="" class="myipt" v-model="artsort.batch" :value="it"/>
                                   <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" :data-value="it.media_type"
                                  data-container="body" data-trigger="focus" @mouseup="mymouse($event)"
                                  data-titleclass="bordered-purple" data-toggle="popover" data-placement="bottom" data-title=""
                                  :data-content="it.is_focus" >{{it.site_name}}</a>
                                    <label>
                                           <a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a>
                                        <!-- <a href="javascript:void(0)"  @click="addTab(editableTabsValue2,it)">{{it.title}}</a> -->
                                    </label>
                                </h5>
                                <div><p class="myp" v-html="it.txt"> {{it.txt}}</p></div>
                                <!-- <router-link target="_blank" v-show="it.sim_count!=0&&radio3 == '站内搜索'" :to="{name:'similar',query:{id:it.sim_id,type:4}}">相似文章{{it.sim_count}}</router-link> -->
                                <p class="grey myright">
                                    <span>发布时间：{{it.pubdate}} </span> <span>阅读数：{{it.view}}</span>
                                    <span v-show="radio3 =='站内搜索'">属性:</span>
                                    <span v-show="radio3 == '站内搜索'" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":""}}</span>
                                    <span class="xftdei pull-right ">
                                    <i title="收藏" :class="it.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" data-toggle="tooltip" data-placement="bottom" @click="myscoll(it,$event)"></i>
                                        <!-- <i  v-show="it.is_collect==0" title="收藏" :class="it.is_collect==0?'ifa ifa-coll-g':'ifa ifa-coll-b'"  @click="scoll(it)"></i>  收藏 -->
                                        <!-- <i v-show="it.is_collect!=0"  title="收藏" :class="it.is_collect==0?'ifa ifa-coll-g':'ifa ifa-coll-b'"  @click="unscoll(it)"></i> -->
                                    <i class="ifa ifa-down-o ifa-b"  @click="sout2(it)" title="导出" data-toggle="tooltip" data-placement="bottom"></i>
                                    </span>
                                </p>
                              </div>
                            </li>
                        </ul>
                  </div>
                </div>
            </div>
            <div class="artfooter widget-body form-group" v-show="this.artlist.length>0">
                <label class=""><input type="checkbox" name="" @click="checkedAll($event)" v-model='checked'/>全选</label>

                 <!--  <button class="btn btn-sm btn-default  btn-sm" @click="swarn"  v-show="this.artsort.batch.length>0">预警</button>
                <button class="btn btn-sm disabled btn-default  btn-sm"  v-show="this.artsort.batch.length<=0">预警</button>-->

                <button class="btn btn-sm disabled btn-default  btn-sm"   v-show="this.artsort.batch.length<=0" >全部收藏</button>
                <button class="btn btn-sm  btn-default  btn-sm" @click="scoll()" v-show="this.artsort.batch.length>0" >全部收藏</button>

                <button class="btn btn-sm btn-default  btn-sm" @click="sout" v-show="this.artsort.batch.length>0">全部导出</i></button>
                <button class="btn btn-sm disabled btn-default  btn-sm"  v-show="this.artsort.batch.length<=0">全部导出</button>

                <!-- <select v-model="limit"><option value="20">每页20条</option><option  value="50">每页50条</option></select>{{limit}}-->

            <!-- <div v-show="this.pagetotal>0"> -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[ 10, 20, 50]"
                    :page-size="library.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagetotal">
                </el-pagination>
            </div>
            <!-- </div> -->

            <!--模态框以下-->
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
                                  <input type="text" class="form-control"  v-model="sh.name"  />
                            </div>
                            <div class="col-sm-2">
                                <select v-model="sh.type"  class="form-control" >
                                    <option value="2">word</option>
                                    <option value="3" >pdf</option>
                                    <option value="1" >excel</option>
                                </select>
                            </div>
                          </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default  btn-sm" data-dismiss="modal">取消</button>
                         <!--   <button type="button" class="btn btn-info  btn-sm" v-if="sh.exportall==0" @click="artExport">导出</button>-->
                            <button type="button" class="btn btn-info  btn-sm" @click="allExport">导出</button>

                        </div>
                    </div>
                </div>
            </div>
          <!-- 文章快照开始 -->
          <div id="snapModal" class="modal fade bs-example-modal-lg snapmodal in" tabindex="-1" role="dialog">
             <div class="modal-dialog modal-lg" role="document">
                 <div class="modal-content">
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
                                 <td v-show="radio3 == '站内搜索'"><span @click="scrollP" class="art-similar">相似文章数：{{snap.sim_count}}</span></td>
                                 <td><i class="ifa ifa-down-o ifa-b"  @click="sout2(snap)" title="导出" data-toggle="tooltip" data-placement="bottom"></i><span>导出</span></td>
                                 <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDel({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type},$event)"></i><span>删除</span> -->
                               </tr>
                               <tr>
                                 <td v-show="radio3 == '站内搜索'" >文章属性：<span :class="snap.side==1?'neutral':snap.side==3?'positive':snap.side==-3?'opposite':'opposite'">{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>
                                 <td><i data-toggle="tooltip" data-placement="bottom" title="收藏" :class="snap.is_collect==0?'ifa ifa-heart-o ifa-b':'ifa ifa-heart-s ifa-b'" @click="myscoll(snap,$event)" :data-unid="snap.is_collect" ></i><span>收藏</span></td>
                                 <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="预警" :class="snap.is_warning==0?'ifa ifa-clock-o ifa-b':'ifa ifa-clock-s ifa-b'" @click="getWarnType({uid:snap.uuid,url:snap.site_url,name:snap.website_name,title:snap.title,created:snap.created,media_type:snap.media_type})"></i><span>预警</span> -->
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
            <!-- 结束 -->
            <!--发送预警的模态框-->
            <div id="warnModel" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                         <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">发送预警</h4>
                        </div>
                        <div class="modal-body">
                            <div class="warning">
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1">预警方案</span>
                                    <select class="form-control" v-model="wr.setting_id" @change="changereceive(wr.setting_id,$event)">

                                        <option v-for="it in wprogramme" :value="it.id" :key="it.id">{{it.name}}</option>
                                    </select>
                                </div>
                                <div>
                                    <ul class="nav nav-tabs" role="tablist">
                                        <!-- <li role="presentation" class="active" ><a href="#home" aria-controls="home" role="tab" data-toggle="tab" @click="changeValue(1)">微信</a></li> -->
                                        <li role="presentation" ><a href="#memail"  data-toggle="tab" @click="changeValue(email)">邮件</a></li>
                                    </ul>
                                    <div class="tab-content">
                                        <div role="tabpanel" class="tab-pane active" id="memail">
                                            <div class="input-group">
                                                <span class="input-group-addon" id="basic-addon1">预警级别</span>
                                                <select class="form-control"  v-model="wr.level">
                                                    <option value='1'>常规预警</option>
                                                    <option value='2'>重要预警</option>
                                                    <option value="3">非常重要</option>
                                                </select>
                                            </div>
                                            <div class="input-group">
                                                <span class="input-group-addon" id="basic-addon1">收件人</span>
                                                <div class="userbox">
                                                    <label v-for="it in userlist" :key="it.id">
                                                        <input v-model="wr.receive" :value="it.email" type="checkbox" name="receive" />
                                                        {{it.name}}
                                                    </label>
                                                </div>

                                            </div>
                                            <div class="input-group">
                                                <span class="input-group-addon" id="basic-addon1">主题</span>
                                                <input v-model="wr.subject" class="form-control" type="text"/>
                                            </div>
                                            <div class="input-group">
                                                <span class="input-group-addon" id="basic-addon1">正文</span>
                                                <textarea v-model="wr.arictle"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default  btn-sm" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-info  btn-sm" @click="sendWarning">提交</button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
</template>
<script>
import global_ from "../GLOBAL.vue";
import { getCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
      myload: false,
      isnull: false,
      //tab
      editableTabsValue2: "2",
      editableTabs2: [
        {
          title: "信息",
          name: "1",
          content: "Tab 1 content"
        }
      ],
      tabIndex: 2,
      //tab over
      snap: {
        name: "文章快照"
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
      dynamicTags33: [],
      options: [],
      dateval: "",
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      visible2: false,
      enter: function(url, d, _fn) {
        d.params.token = getCookie("user");
        (url = this.dataurl + url), (d = d.params);
        var t = this;
        $.ajax({
          type: "post",
          url: url,
          data: d,
          dataType: "json",
          success: function(d) {
            d.code == "-100"
              ? (function() {
                  delCookie("user");
                  t.$router.replace({ path: "/app" });
                })()
              : _fn(d);
          }
        });
      },
      emailreceive: "",
      selectedOption: "",
      wprogramme: [],
      userlist: [],
      wr: {
        token: getCookie("user"),
        level: "1",
        send_type: "2",
        subject: "我是标题",
        uuid: "",
        receive: [],
        arictle: "我是正文",
        setting_id: ""
      },
      scol: [],
      sh: {
        token: getCookie("user"),
        name: "download",
        type: "2",
        // date_range:'',
        uuid: []
        // media_type:'',
        // region_type:'',
        // dimension:'',
        // side:'',
        // property_type:''
      },
      show: false,
      checked: "",
      artsort: {
        batch: []
      },
      radio3: "站内搜索",
      artlist: [],
      currentPage4: 1,
      pagetotal: "",
      library: {
        // search_type:'',
        token: getCookie("user"),
        search_type: "1",
        search_txt: "百度",
        offset: "0",
        limit: "10",
        type: "",
        param: "",
        condition: "",
        media_type: "",
        date_range: ""
      },
      subjecttitle: "",
      li: "",
      epli: "",
      //从主题里粘过来 开始
      resthemecount: "",
      dom: global_.dom,
      dynamicTags: [],
      boo: [
        {
          word: " AND "
        },
        {
          word: " OR "
        },
        {
          word: " NOT "
        }
      ],
      dynamicTags3: [],
      dynamicTags4: [],
      inputVisible: false,
      inputValue: "",
      inputVisible2: false,
      inputValue2: "",
      head: {
        name: ""
      },
      head1: {
        words: "",
        notwords: "",
        token: getCookie("user")
      },
      condition: {
        keyword: [],
        andword: [],
        orword: [],
        notword: []
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      type1: [
        {
          keyword: [],
          andword: [],
          // orword:[],
          notword: []
        }
      ],
      index: "",
      type2: {
        match_type: "1",
        condition: ""
      },
      type3: {
        orword: [],
        notword: []
      },
      currenttag: {},
      currentword: "",
      currentwordtype: "",
      currentbox: "",
      nameexist: false
      // 从主题站过来结束
    };
  },
  created() {
    var t = this;
    $.ajax({
      type: "post",
      url: this.dataurl + "/client/api/get_lists",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        t.options = res.data.media_type;
      },
      error: function(res) {}
    });

    if (this.$route.query.kw) {
      this.library.search_txt = this.$route.query.kw;
      this.myload = true;
      this.getinstation();
    } else {
      // this.library.search_txt = ''
    }
    //   /client/api/warning
    var t = this;
    $.ajax({
      type: "post",
      url: this.dataurl + "/client/api/warning",
      data: { token: getCookie("user") },
      dataType: "json",
      success: function(res) {
        t.wprogramme = res.data;
        // console.log(t.wprogramme);
      },
      error: function() {
        // alert("INTERNET ERROR!")
      }
    });
    var url = "/admin/user";
    this.enter(url, { params: {} }, function(d) {
      t.emailreceive = d.data;
    });
  },
  watch: {
    show: {
      handler: function(val, oldVal) {
        if (val == false) {
          this.library.type = "";
          this.library.param = "";
          this.library.condition = "";
          this.library.search_type = 1;
        }
      },
      deep: true
    },
    "artsort.batch": {
      handler: function(val, oldVal) {
        if (this.artsort.batch.length == this.artlist.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      },
      deep: true
    },
    artlist: function() {
      var t = this;
      $('[data-toggle="tooltip"]').tooltip();
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
                  (d = { params: { id: isf, media_type: e.data.medtype } }));
              t.enter(url, d, function(d) {
                d.code == 1 ? t.searchsm() : "";
                // isf==0?(d.code==1?$t.addClass('imp-red'):$t.removeClass('imp-red'),$t.attr('data-content',d.data)):(d.code==1?$t.removeClass('imp-red'):$t.addClass('imp-red'),$t.attr('data-content',d.data))
                $("[data-toggle=popover]").popover("hide");
              });
            }
          );
        });
      });
    }
  },
  methods: {
    myresize(ev) {
      // debugger;
      let rowindex = ev.target.parentNode.className.substring(7, 10);
      // console.log(rowindex);
      let myrow = ev.target.value.split("\n").length;
      if (myrow > 4) {
        $(".bhx.bhx" + rowindex)
          .children(".bhtext")
          .css({ height: "110px" });
        $(".pcx.pcx" + rowindex)
          .children(".pctext")
          .css({ height: "110px" });
        $(".jcx.jcx" + rowindex)
          .children(".jctext")
          .css({ margin: "0 0 94px" });
        $(".pp" + rowindex)
          .children(".jcselect")
          .css({ margin: "0 0 58px" });
        $(".pcx" + rowindex)
          .children(".ifa-del-g")
          .css({ "margin-top": "87px" });
      } else if (myrow < 3) {
        $(".bhx.bhx" + rowindex)
          .children(".bhtext")
          .css({ height: "52px" });
        $(".pcx.pcx" + rowindex)
          .children(".pctext")
          .css({ height: "52px" });
        $(".jcx.jcx" + rowindex)
          .children(".jctext")
          .css({ margin: "0 0 35px" });
        $(".pp" + rowindex)
          .children(".jcselect")
          .css({ margin: "0" });
        $(".pcx" + rowindex)
          .children(".ifa-del-g")
          .css({ "margin-top": "33px" });
      }
    },
    mymouse(ev) {
      $(ev.target).focus();
    },
    addTab(targetName, it) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs2.push({
        title: it.title,
        name: newTabName,
        content: it.site_name
      });
      this.editableTabsValue2 = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs2;
      let activeName = this.editableTabsValue2;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue2 = activeName;
      this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
    },
    snapview(it,v){
      this.snapart.onlyView=true;
      var t=this;t.snap={};
      if(this.radio3=="站内搜索"){
        var url='/client/article/get_articles_info';
      }else{
        var url='/client/search/get_articles_info';
      }
      t.enter(url,{params:{
        uuid:it.uuid,
        sdate:it.created,
        media_type:it.media_type,
        search_txt: t.library.search_txt,
        date_range: t.library.date_range,
        search_type: t.library.search_type,
        condition:t.library.condition,
        param:t.library.param
      }},function(d){
        t.snap=d.data;
        $('#snapModal').modal("show");
      })
      if(v==1){this.snapart.onlyView=false;}
      t.snapart.artlist=[],t.snapart.uuid=it.uuid;
      //it.sim_count!=0?t.getsnapResult(it):'';
    },
    datechange(val) {
      this.library.date_range = val;
      this.searchsm();
    },
    mediachange(item) {
      // console.log(item)
      this.searchsm();
      // 改变值的状态
    },
    checkname() {
      if ($.trim(this.head.name) != "") {
        this.head1.words = this.head.name;
        var t = this;
        if (this.$route.query.id) {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/get_count",
            data: {
              token: getCookie("user"),
              name: $.trim(this.head.name),
              id: this.$route.query.id
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.nameexist = false;
                t.$message("提示：主题名称可用");
                //   this.$message(res.msg)
              } else {
                t.nameexist = true;
                t.$message({
                  type: "warning",
                  message: "主题名称重复！"
                });
              }
            }
          });
        } else {
          $(".jctext")[0].value = this.head.name;
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/get_count",
            data: {
              token: getCookie("user"),
              name: $.trim(this.head.name)
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.nameexist = false;
                t.$message("提示：主题名称可用");
              } else {
                t.nameexist = true;
                t.$message.error("主题名称重复！");
              }
            }
          });
        }
      } else {
        this.$message("提示：主题名称为空");
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.library.limit = val;
      // console.log(this.library);
      this.searchsm();

    },
    handleCurrentChange(val) {
      this.$nextTick(function() {
        this.currentPage4 = val;
        this.library.offset = this.library.limit * (val - 1);
        // console.log(this.library.offset);
        this.searchsm();
              $(document).scrollTop(0);
      });
    },
    changereceive(ids, e) {
      this.selectedOption = e.target.selectedOptions[0].innerHTML;
      this.wr.subject = this.selectedOption + "-" + this.subjecttitle;
      // console.log(ids)
      var people = [];
      // console.log(this.wprogramme)

      this.wprogramme.forEach(function(item, index) {
        if (item.id == ids) {
          people = item.receive.split("|");
        }
      });
      var t = this;
      let abc = [];
      people.forEach(function(item, index) {
        abc.push({
          //需要给个名字字段，后台给了一邮箱字符串
          name: item,
          email: item
        });
      });
      this.userlist = abc;

      //  判断是全部预警还是单个预警
    },
    myscoll(i, ev) {
      if ($(ev.currentTarget).hasClass("ifa-heart-o")) {
        this.scoll(i, ev);
      } else if ($(ev.currentTarget).hasClass("ifa-heart-s")) {
        this.unscoll(i);
      }
    },
    myscoll2(i, ev) {
      if ($(ev.currentTarget).hasClass("ifa-coll-g")) {
        this.scoll2(i, ev);
      } else if ($(ev.currentTarget).hasClass("ifa-coll-b")) {
        this.unscoll(i);
      }
    },
    unscoll(i) {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/api/delete_collect",
        data: { id: i.is_collect, token: getCookie("user") },
        dataType: "json",
        success: function(res) {
          if (res.code == 1) {
            // t.$message({
            //   type: "success",
            //   message: "已为您取消收藏！"
            // });
            t.searchsm(9);
            t.snap.is_collect = 0;
          } else {
            t.$message("取消收藏失败！");
          }
        },
        error: function() {}
      });
    },
    scoll(i, e) {
      var t = this;
      let list = [];
      // debugger
      if (i) {
        list.push({
          uuid: i.uuid,
          article_date: i.snatch_time,
          type: 4,
          media_type: i.media_type,
          side: i.side
        });
      } else {
        this.artsort.batch.forEach(function(item, index) {
          list.push({
            uuid: item.uuid,
            article_date: item.snatch_time,
            type: 4,
            media_type: item.media_type,
            side: item.side
          });
        });
      }
      // this.scol = list;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/api/add_collect",
        data: { data: list, token: getCookie("user") },
        dataType: "json",
        success: function(res) {
          if (res.code == "1") {
            // t.$message({
            //   type: "success",
            //   message: "收藏成功！"
            // });
            // if ($(e.target).hasClass("ifa-coll-g")) {
            //   $(e.target)
            //     .removeClass("ifa-coll-g")
            //     .addClass("ifa-coll-b");
            // }
            t.searchsm(9);
          } else {
            t.$message("收藏失败！");
          }
        },
        error: function() {
          // alert("INTERNET ERROR!")
        }
      });

      // const h = this.$createElement;

      // this.$notify({
      // title: '还没有绑接口',
      // message: h('i', { style: 'color: teal'}, '收藏没有成功2017/9/29')
      // });
    },
    unscoll2() {},
    scoll2(i, e) {
      let list = {};
      list = {
        uuid: i.uuid,
        article_date: i.snatch_time,
        type: 4,
        media_type: i.media_type,
        side: i.side,
        token: getCookie("user")
      };
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/api/add_collect",
        data: list,
        dataType: "json",
        success: function(res) {
          if (res.code == "1") {
            t.snap.is_collect = res.data;
            // t.$message({
            //   type: "success",
            //   message: "收藏成功！"
            // });
            if ($(e.target).hasClass("ifa-coll-g")) {
              $(e.target)
                .removeClass("ifa-coll-g")
                .addClass("ifa-coll-b");
            }
            t.searchsm(9);
          } else {
            t.$message("收藏失败！");
          }
        },
        error: function() {
          // alert("INTERNET ERROR!")
        }
      });
    },
    swarn() {
      // 多条预警

      // console.log(this.wprogramme[0].receive.split('|'))
      var t = this;
      t.wr.arictle = "";

      this.artsort.batch.forEach(function(item, index) {
        t.wr.arictle += item.website_name + "-" + item.site_url;
        t.subjecttitle += item.title + "-";
      });
      this.wr.subject = this.subjecttitle;
      this.wr.setting_id = this.wprogramme[0].id;
      // this.changereceive(this.wr.setting_id,1);

      let people = [];
      this.wprogramme[0].receive.split("|").forEach(function(item, index) {
        people.push({
          //需要给个名字字段，后台给了一邮箱字符串
          name: item,
          email: item
        });
      });
      this.userlist = people;

      //  this.userlist = []
      // this.wr.subject=this.userlist+'-'+item.title
      // this.wr.arictle=item.title+'-'+item.url
      $("#warnModel").modal("show");

      //   let li = (item.uuid+'_'+item.created+"_"+item.media_type)
      //   console.log(this.wr.setting_id)
      //   uuid_created_media_type
      this.li = "";
    },
    swarn2(item) {
      // 单个预警

      this.wr.receive = [];
      let people = [];
      var arr = [];
      this.wprogramme[0].receive.split("|").forEach(function(item, index) {
        people.push({
          //需要给个名字字段，后台给了一邮箱字符串
          name: item,
          email: item
        });
      });
      this.userlist = people;

      this.wr.setting_id = this.wprogramme[0].id;
      this.wr.arictle = item.title + "-" + item.site_url;

      // this.changereceive(this.wr.setting_id,1);

      // this.userlist = []
      // debugger
      this.subjecttitle = item.title;
      this.wr.subject = this.wprogramme[0].name + "-" + item.title;
      this.wr.arictle = item.title + "-" + item.url;
      $("#warnModel").modal("show");
      let i = item;
      this.li = i.uuid + "_" + i.snatch_time + "_" + i.media_type;
    },
    sendWarning() {
      if (this.li) {
        this.wr.uuid = this.li;
      } else {
        let list = [];
        this.artsort.batch.forEach(function(item, index) {
          list.push(item.uuid + "_" + item.snatch_time + "_" + item.media_type);
        });
        this.wr.uuid = list.join("|");
      }

      // this.wr.receive = this.wr.receive.join('|')

      let lis = this.wr;
      lis.receive = this.wr.receive.join("|");
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/api/send_warning",
        data: lis,
        dataType: "json",
        success: function(res) {
          if (res.code == "1") {
            t.$message("发送成功！");
          } else {
            t.$message("发送失败！");
          }
          $("#warnModel").modal("hide");
        },
        error: function() {
          // alert("INTERNET ERROR!")
        }
      });
    },
    changeValue(tp) {
      this.wr.send_type = tp;
    },
    sout() {
      let list = [];
      this.artsort.batch.forEach(function(item, index) {
        list.push(item.uuid);
      });
      this.sh.uuid = list;

      $("#exportModel").modal("show");
    },
    sout2(i) {
      let s = i;
      this.epli = s;
      console.log(this.epli);
      this.sh.uuid = this.epli.uuid;
      // $("#exportModel").modal("show");
      this.allExport();
    },
    allExport() {
      if (this.radio3 == "全库搜索") {
        this.sh.param = "1";
        this.sh.date_range = this.library.date_range;
      }
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/api/exporting",
        data: this.sh,
        dataType: "json",
        success: function(res) {
          $("#exportModel").modal("hide");
          if (res.code == "1") {
            var a = document.createElement("a");
            var url = t.dataurl + res.data;
            var filename = t.sh.name;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          } else if (res.code == "2") {
            t.$message("请到设置我到导出下载文档！");
          } else {
            t.$message("导出失败！");
          }
        },
        error: function() {
          // alert("INTERNET ERROR!")
        }
      });
    },
    checkedAll() {
      var _this = this;
      if (this.checked == false) {
        //实现反选
        _this.artsort.batch = [];
        //  _this.scol =[]
      } else {
        //实现全选
        _this.artsort.batch = [];
        _this.artlist.forEach(function(item) {
          _this.artsort.batch.push(item);
        });
      }
    },
    searchsm(ev) {
      this.myload = true;
      ev==9?'':this.artlist=[];
      if (this.radio3 == "全库搜索") {
        this.getlibrarylist();
      } else if (this.radio3 == "站内搜索") {
        this.getinstation();
      }
    },
    highsearch(p) {
      var t = this;
      // 高级搜索新添
      this.library.type = "1";
      this.library.param = p;
      this.library.search_type = "";
      this.library.search_txt = "";

      if (p == "1") {
        // 每次提交的时候才获取的type123--将就重复写一次吧。。。
        var i = 0;
        $(".jcselect option:selected").each(function(index, item) {
          t.type1[index].match_type = item.value;
        });
        $(".bhtext").each(function(index, item) {
          t.type1[index].andword = item.value.split("\n");
        });
        $(".pctext").each(function(index, item) {
          t.type1[index].notword = item.value.split("\n");
          i++;
        });
        // 如果监测词为空就要跳出不执行！
        var myisnull = 0;
        $(".jctext").each(function(index, item) {
          if ($.trim(item.value) == "") {
            myisnull++;
            // t.isnull = true;//永久标记？
            t.$message.error("监测词不能为空！");
          }
          t.type1[index].keyword = item.value;
        });

        if (myisnull > 0) {
          //记录为空的次数，大于0就是有空值了
          this.isnull = true;
        } else if (myisnull == 0) {
          //防止二次标记错误
          this.isnull = false;
        }

        if (t.isnull == false) {
          this.type1 = this.type1.slice(0, i);
          // type1将就结束
          this.library.condition = this.type1;
          if (this.radio3 == "全库搜索") {
            this.getlibrarylist();
          } else if (this.radio3 == "站内搜索") {
            this.getinstation();
          }
        }
      } else if (p == "2") {
        this.type2.condition = $.trim($(".booval").val());
        this.library.condition = this.type2; //1116

        if ($.trim($(".booval").val()) != "") {
          if (this.radio3 == "全库搜索") {
            this.getlibrarylist();
          } else if (this.radio3 == "站内搜索") {
            this.getinstation();
          }
        } else {
          this.$message.error("条件不能为空！");
        }
      } else if (p == 3) {
        // 修改
        // var or = [],
        //   not = [];
        // this.dynamicTags3.map(function(item, index) {
        //   // console.log(item.word)
        //   or.push(item.word);
        // });
        // // 将字符串变成数组
        // // console.log(or)
        // // 之前变成字符串了现在改掉。
        // this.type3.orword = or;
        // // t.type3.andword = or.join("\n");
        // // console.log(this.type3.notword)

        // this.dynamicTags4.map(function(item, index) {
        //   // console.log(item.word)
        //   not.push(item.word);
        // });
        // console.log(not);

        if (
          $.trim($(".relevant").val()) == "" &&
          $.trim($(".disrelated").val()) == ""
        ) {
          this.$message.error("条件不能为空！");
        } else if (this.nameexist == true) {
          this.$message.error("主题名称已存在！");
        } else {
          // else if ($.trim(this.head.name) == "") {
          //   this.$message.error("主题名称不能为空！");
          // }
          this.type3.orword = $(".relevant")
            .val()
            .split("\n");
          this.type3.notword = $(".disrelated")
            .val()
            .split("\n");
          this.library.condition = this.type3;

          if (this.radio3 == "全库搜索") {
            this.getlibrarylist();
          } else if (this.radio3 == "站内搜索") {
            this.getinstation();
          }
        }
      }
    },
    getlibrarylist() {
      var t = this;
      // console.log(this.library);
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/search/get_full_articles",
        data: this.library,
        dataType: "json",
        success: function(res) {
          t.myload = false;
          if (res.data.hits > 0) {
            t.$message({
              type: "success",
              message: "数据已更新"
            });
          }
          if (res.code == "1") {
            t.artlist = res.data.data == null ? [] : res.data.data;
            t.pagetotal = res.data.hits;
            t.artsort.batch = [];
          } else if (res.code == "-3") {
            t.artlist = [];
            t.pagetotal = 0;
            const h = t.$createElement;
            t.$message({
              type: "warning",
              message: h("p", null, [h("span", null, "出错啦 ")])
            });
            $(".el-message__group").html(res.msg);
          }
        },
        error: function() {
          t.myload = false;
        }
      });
    },
    get() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/search/index",
        data: this.library,
        dataType: "json",
        success: function(res) {
          if (res.code == "1") {
            t.artlist = res.data.data == null ? [] : res.data.data;
          } else {
            t.artlist = [];
            t.$message("暂无数据！");
          }
        },
        error: function() {
          //alert("INTERNET ERROR!")
        }
      });
    },
    getinstation() {
      var t = this;
      $.ajax({
        type: "post",
        url: this.dataurl + "/client/search/index",
        data: this.library,
        dataType: "json",
        success: function(res) {
          t.myload = false;
          if (res.data.hits > 0) {
            t.$message({
              type: "success",
              message: "数据已更新"
            });
          }
          if (res.code == 1) {
            t.artlist = res.data.data == null ? [] : res.data.data;
            t.pagetotal = res.data.hits;
            t.artsort.batch = [];
          } else if (res.code == "-3") {
            t.artlist = [];
            t.pagetotal = 0;
            const h = t.$createElement;
            t.$message({
              type: "warning",
              message: h("p", null, [h("span", null, "出错啦 ")])
            });
            $(".el-message__group").html(res.msg);
          }
        },
        error: function() {
          t.myload = false;
        }
      });
    },
    getelementlist() {
      3;
    },
    // 以下从新增主题搬过来的额
    domessage() {
      var t = this;
      this.$nextTick(function() {
        //由多行文本改成单行input框
        $(".jctext").each(function(index, item) {
          // item.value = t.type1[index].keyword.join("\n")
          if (t.type1[index].andword) {
            item.value = t.type1[index].keyword;
          }
        });

        $(".bhtext").each(function(index, item) {
          if (t.type1[index].andword) {
            item.value = t.type1[index].andword.join("\n");
          }
        });
        $(".pctext").each(function(index, item) {
          if (t.type1[index].notword) {
            item.value = t.type1[index].notword.join("\n");
          }
        });
      });
    },
    delline(index, e) {
      let one = $.trim($($(".jcx" + index).find("input")[0]).val()),
        two = $.trim($($(".bhx" + index).find("textarea")[0]).val()),
        three = $.trim($($(".pcx" + index).find("textarea")[0]).val());

      if ($(".glyphicon-minus").length == 1) {
        this.$message("请至少保留一条");
      } else {
        $(".jcx" + index).remove();
        $(".bhx" + index).remove();
        $(".pcx" + index).remove();
        $(".pp" + index).remove();
        $(e.target).remove();
      }
    },
    areamore(i) {
      this.yourtype1(); //拿到type1
      this.type1.splice(i + 1, 0, {
        keyword: "",
        andword: [],
        notword: [],
        match_type: 1
      }); //此时内存中的type1是正确的，页面上是错误的，重新给页面上的框框派发值
      this.domessage(); //分发给每个框type1
    },
    areadrop(event) {
      // debugger;
      // console.log(event)
      // console.log(event.path[0].innerText)
      // event.path[0].innerText += this.currentword;
    },
    areaallowDrop(event) {
      // console.log(event)
    },
    anls() {
      // console.log(this.head1);
      if ($.trim(this.head1.words) != "") {
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/client/api/word_analysis",
          data: this.head1,
          dataType: "json",
          success: function(res) {
            // console.log(res);
            t.dynamicTags = res.data;
            if (res.code == "-1") {
              t.dynamicTags = [{ word: t.head1.words }];
            }
          },
          error: function() {
            // alert("INTERNET ERROR!!")
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "您还没有填分析词"
        });
      }
    },
    anls3() {
      if($.trim(this.head1.words)!=''){
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/client/api/word_analysis",
          data: this.head1,
          dataType: "json",
          success: function(res) {
            t.dynamicTags33 = res.data;
            if (res.code == "-1") {
              t.dynamicTags33 = [{ word: t.head1.words }];
            }
          }
        });
      }else{
        this.$message({
          type: "warning",
          message: "您还没有填分析词"
        });
      }
    },
    yourtype1() {
      var t = this;
      var i = 0;

      var mynull =0

      $(".jctext").each(function(index, item) {
        if ($.trim(item.value) == "") {
          mynull++;
          //t.isnull = true;//有一个监测词为空就标记。
        }
        t.type1[index].keyword = item.value;
      });

      if (mynull > 0) {
        this.isnull = true;
      } else if (mynull == 0) {
        this.isnull = false;
      }

      $(".bhtext").each(function(index, item) {
        //    console.log(item.value.split("\n"))
        t.type1[index].andword = item.value.split("\n");
      });
      $(".pctext").each(function(index, item) {
        //    console.log(item.value.split("\n"))
        t.type1[index].notword = item.value.split("\n");
        i++;
      });

      $(".jcselect option:selected").each(function(index, item) {
        t.type1[index].match_type = item.value;
      });
      // console.log(i);
      this.type1 = this.type1.slice(0, i);
    },
    sub1() {
      this.yourtype1(); //此时拿到了标记isnull的值
      if (this.nameexist == true) {
        this.$message.error("主题名称重复！");
      } else if ($.trim(this.head.name) == "") {
        this.$message.error(" 请输入名称！");
      } else if (this.isnull == true) {
        this.$message.error(" 监测词不能为空！");
      } else {
        var t = this;

        if (this.$route.query.id) {
          // console.log(JSON.stringify(this.type1))
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "1",
              token: getCookie("user"),
              id: this.$route.query.id,
              name: this.head.name,
              condition: this.type1
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.$router.replace("/setup/themeset");
              } else {
                t.$message(res.msg);
              }
            },
            error: function() {
              // alert("INTERNET ERROR!!")
            }
          });
        } else {
          // console.log(JSON.stringify(this.type1));
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "1",
              token: getCookie("user"),
              id: this.$route.query.id,
              name: this.head.name,
              condition: this.type1
            },
            dataType: "json",
            success: function(res) {
              // debugger
              if (res.code == "1") {
                t.$message("保存成功！可到设置里面查看您的主题！");
                // t.$router.replace("/setup/themeset")
              } else if (res.code == "-2") {
                t.$message("监测词不能为空！");
              } else if (res.code == "-1") {
                t.$message("您的主题词数量已达上限！");
              }
            },
            error: function() {
              // alert("INTERNET ERROR!!")
            }
          });
        }
      }
    },
    sub2() {
      // debugger
      this.type2.condition = $(".booval").val();
      if (this.nameexist == false && this.head.name) {
        var t = this;
        if (this.$route.query.id) {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "2",
              token: getCookie("user"),
              id: this.$route.query.id,
              name: this.head.name,
              match_type: this.type2.match_type,
              condition: this.type2.condition
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.$router.replace("/setup/themeset");
              } else if (res.code == -3) {
                const h = t.$createElement;
                t.$message({
                  type: "warning",
                  message: h("p", null, [h("span", null, "出错啦 ")])
                });
                $(".el-message__group").html(res.msg);
              }
            },
            error: function() {
              // alert("INTERNET ERROR!!")
            }
          });
        } else if (!this.head.name) {
          this.$message("请输入新增主题！");
        } else {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "2",
              token: getCookie("user"),
              id: this.$route.query.id,
              name: this.head.name,
              condition: this.type2.condition
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.$message("保存成功！可到设置里面查看您的主题！");
                // t.$router.replace("/setup/themeset")
              } else if (res.code == -3) {
                const h = t.$createElement;
                t.$message({
                  type: "warning",
                  message: h("p", null, [h("span", null, "出错啦 ")])
                });
                $(".el-message__group").html(res.msg);
              }
            },
            error: function() {
              // alert("INTERNET ERROR!!")
            }
          });
        }
      } else {
        this.$message("请输入名称或名称重复！");
      }
    },
    sub() {
      // // 修改
      // var or=[],not=[];
      // this.dynamicTags3.map(function(item,index){
      //     // console.log(item.word)
      //     or.push(item.word);
      // })
      // // 将字符串变成数组
      // // console.log(or)
      // // 之前变成字符串了现在改掉。
      // this.type3.orword = or;
      // // t.type3.andword = or.join("\n");
      // // console.log(this.type3.notword)

      // this.dynamicTags4.map(function(item,index){
      //     // console.log(item.word)
      //     not.push(item.word);
      // })
      // console.log(not)
      // this.type3.notword = not

      if (
        $.trim($(".relevant").val()) == "" &&
        $.trim($(".disrelated").val()) == ""
      ) {
        this.$message.error("条件不能为空！");
      } else if (this.nameexist == true) {
        this.$message.error("主题名称已存在！");
      } else {
        // else if ($.trim(this.head.name) == "") {
        //   this.$message.error("主题名称不能为空！");
        // }
        this.type3.orword = $(".relevant")
          .val()
          .split("\n");
        this.type3.notword = $(".disrelated")
          .val()
          .split("\n");

        var t = this;
        if (this.$route.query.id) {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "3",
              token: getCookie("user"),
              id: this.$route.query.id,
              name: this.head.name,
              condition: this.type3
            },
            dataType: "json",
            success: function(res) {
              if ((res.code = "1")) {
                t.$message("保存成功！");
                t.$router.replace("/setup/themeset");
              } else {
                t.$message(res.msg);
              }
            },
            error: function() {
              t.$message("系统繁忙，请稍后");
            }
          });
        } else {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "3",
              token: getCookie("user"),
              name: this.head.name,
              condition: this.type3
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.$message("保存成功！可到设置里面查看您的主题！");
                // t.$router.replace("/setup/themeset")
              } else {
                t.$message.error("操作繁忙，请稍后...");
              }
            },
            error: function() {
              t.$message.error("操作繁忙，请稍后...");
            }
          });
        }
      }
    },
    handleClose(tag, ev) {
      if (ev) {
        var current = ev.target.previousElementSibling.innerText;
        // console.log(ev.target.previousElementSibling.innerText);

        this.head1.notwords = current;
        this.anls();
      }
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    handleClose33(tag, ev) {
      if (ev) {
        var current = ev.target.previousElementSibling.innerText;
        // console.log(ev.target.previousElementSibling.innerText);

        this.head1.notwords = current;
        this.anls3();
      }
    },
    handleClose4(tag) {
      this.dynamicTags4.splice(this.dynamicTags4.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    showInput2() {
      this.inputVisible2 = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = $.trim(this.inputValue);
      if (inputValue) {
        let val = $(".relevant").val();
        if (val == "") {
          val += inputValue;
        } else {
          let arr = val.split("\n");
          if (arr.indexOf(inputValue) == -1) {
            arr.push(inputValue);
            val += "\n" + inputValue;
          }
        }

        // this.dynamicTags3.push({word:inputValue});
        $(".relevant").val(val);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleInputConfirm2() {
      let inputValue = $.trim(this.inputValue2);
      if (inputValue) {
        let val = $(".disrelated").val();
        if (val == "") {
          val += inputValue;
        } else {
          let arr = val.split("\n");
          if (arr.indexOf(inputValue) == -1) {
            arr.push(inputValue);
            val += "\n" + inputValue;
          }
        }
        $(".disrelated").val(val);
        // this.dynamicTags4.push({word:inputValue});
      }
      this.inputVisible2 = false;
      this.inputValue2 = "";
    },
    drag(event, tag) {
      var event = event || window.event,
        target = event.target || event.srcElement;
      event.dataTransfer.setData("text", tag);
      this.dom = event.currentTarget;
      this.currentbox = event.target.parentNode.className;
      this.currentword = tag.word;
      this.currenttag = tag;
    },
    dropjc(e) {
      e.target.value = this.currentword;
    },
    drop(event, type) {
      event.preventDefault();
      //阻止默认事件

      var arr = event.target.value.split("\n");

      if (event.target.value == "") {
        event.target.value += this.currentword;
        arr.push(this.currentword);
      } else {
        if (arr.indexOf(this.currentword) == -1) {
          arr.push(this.currentword);
          event.target.value += "\n" + this.currentword;
        }
      }

      this.head1.notwords = this.currentword;
      if (type == 1) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(this.currenttag), 1);
        this.anls();
      } else if (type == 3) {
        this.dynamicTags33.splice(
          this.dynamicTags33.indexOf(this.currenttag),
          1
        );
        this.anls3();
      }
    },
    allowDrop(event) {
      event.preventDefault();
      //阻止默认事件
    },
    dropboo(e) {
      e.preventDefault();
      // e.target.value += this.currentword;
      this.type2.condition += this.currentword;
      if (this.dynamicTags.indexOf(this.currenttag) != "-1") {
        this.dynamicTags.splice(this.dynamicTags.indexOf(this.currenttag), 1);
        this.head1.notwords = this.currentword;
        this.anls();
      }
    },
    drop3(e) {
      e.preventDefault();

      if (this.currentbox !== e.target.className) {
        if (e.target.className == "relevant") {
          var i = 0;
          var t = this;
          this.dynamicTags4.map(function(item, index) {
            if (item.word == t.currentword) {
              i = index;
            }
          });
          t.dynamicTags4.splice(i, 1);
          this.dynamicTags3.push({ word: this.currentword });
        } else if (e.target.className == "disrelated") {
          // 移除dynamicTags3的单词
          // 还要去重
          var i = 0;
          var t = this;
          this.dynamicTags3.map(function(item, index) {
            if (item.word == t.currentword) {
              i = index;
            }
          });
          t.dynamicTags3.splice(i, 1);

          this.dynamicTags4.push({ word: this.currentword });
        }
      }
    },
    allowDrop3(e) {
      e.preventDefault();
    }
    // 以上
  },
  updated() {},
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += "<li>搜索</li>";
    $("#Crumbs").html(html);
    var t = this;
    $(".loading-container").addClass("loading-inactive");
  }
};
</script>
<style scoped>
.booval {
  padding: 20px;
}
input.myipt {
  position: static;
}
.btn-xft,
.input-new-tag {
  width: 60px;
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 4px;
  padding: 0;
}
.form-group {
  overflow: hidden;
}
.nav-tabs > li.active > a {
  border-top: 2px solid #58b7ff !important;
}
.nav-tabs {
  /* background-color:white!important; */
  box-shadow: none;
}
.tab-content {
  overflow: hidden;

  box-shadow: none !important;
}
.taggroup {
  margin: 0 auto;
}
.taggroup > div {
  display: inline-block;
  width: 47%;
}
.tab-content {
  overflow: hidden;
}
.setAuto {
  /* width:800px; */
  /*padding: 30px;*/
  margin: 0 auto;
}
.searchipt {
  width: 500px;
}
ul.nav {
  display: flex;
}
li {
  list-style: none;
}
.thetag.over {
  border: 3px dashed #000;
}
.column {
  height: 200px;
  width: 200px;
  float: left;
  border: 2px solid black;

  margin-right: 5px;
  text-align: center;
}

.tag-item {
  margin: 6px;
  display: inline-block;
  background-color: #e4e8f1;
  border-color: #e4e8f1;
  color: #48576a;
  padding: 3px 3px;
  font-size: 12px;
  border-radius: 4px;
}
.tag-item i {
  padding: 0 3px;
}
.ifa-new-g {
  width: 93px;
  height: 89px;
  position: absolute;
  bottom: 96px;
  left: 395px;
}
/* .ifa-del-g {
  margin-top: 142px;
} */
#home {
  position: relative;
}
#sbbox textarea {
  margin-bottom: 10px;
  padding: 5px 10px;
}
#sbbox .jctext {
  width: 180px;
  padding: 5px 10px;
}
#sbbox > div {
  float: left;
  width: 200px;
}
.relevant,
.disrelated {
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 6px;
}
#sbbox .pcx {
  width: 250px;
  position: relative;
  /* padding-right: 20px; */
}

.relevant,
.disrelated {
  width: 250px;
  height: 200px;
  padding: 20px;
  /* border: 1px solid grey; */
}
.jctext {
  margin: 0 0 35px;
}
.trashdiv {
  height: 180px;
}
.trashdiv span {
  display: block;
  padding: 40px;
}

.transition-box {
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 20px 10px 10px;
  box-sizing: border-box;
  /* display: block; */
}
.media {
  margin-top: 0;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  justify-content: flex-start;
}
.imp-red {
  color: #ff0000 !important;
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
  padding: 6px 12px;
  margin: 0 3px;
}
a.cur,
a.artsort:hover {
  border: 1px solid #199ed8;
}
.artfooter {
  /* float: left; */
  /* height: 35px; */
}
.artfooter a {
  display: inline-block;
  padding: 2px 6px;
  margin: 3 5px;
  border-radius: 2px;
  background-color: #cfcfcf;
}
.artdetail {
  width: 100%;
  margin-top: 10px;
}
.nav > li > a,
.nav-tabs > li > a,
.nav-tabs > li > a:focus {
  position: static;
}

/* 1116 */
@media (max-width: 1180px) {
  #sbbox > div {
    width: 150px;
  }
  #sbbox > div textarea,
  #sbbox > div input {
    width: 130px;
  }

  #sbbox .jctext {
    width: 130px;
    padding: 5px 10px;
    margin: 0 0 35px;
  }
  .ifa-new-g {
    left: 310px;
  }
}
#sbbox div.ppx {
  margin: 0 0 35px;
}
#sbbox select {
  appearance: none !important;
  -webkit-appearance: none !important;
}
.glyphicon-plus:before {
  color: green;
}
.glyphicon-minus:before {
  color: red;
}
.glyphicon-plus:before,
.glyphicon-minus:before {
  font-size: 20px;
  cursor: pointer;
}
#PlusAndMinus {
  /* display: inline-block; */
  position: absolute;
  top: 13px;
  right: 0;
}
.tab-content {
  background-color: white;
}
ul.nav-tabs > li > a:active {
  background-color: white !important;
}
#myloadbox {
  min-height: 100px;
}
</style>
