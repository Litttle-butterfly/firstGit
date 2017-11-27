<template>
     <div class="right_">
          <el-radio-group v-model="radio3" @change="ecoll(radio3)">
                <el-radio-button label="监测收藏"></el-radio-button>
                <el-radio-button label="预警收藏"></el-radio-button>
                <el-radio-button label="探索收藏"></el-radio-button>
                <el-radio-button label="搜索收藏"></el-radio-button>
            </el-radio-group>
            <!--下面的收藏-->
                 <div class="artdetail" v-loading="loadcoll">
                    <ul >
                      <li v-for="it in artlist" class="checklist widget-body art_list"  :key="it.id">
                            <h5>
                                <input type="checkbox" name="" v-model="artsort.batch" :value="it.is_collect"/>
                                <a href="javascript:void(0);" :class="it.is_focus==0?'atitle':'atitle imp-red'" @mouseup="mymouse($event)"
                                :data-value="it.media_type" data-container="body" data-titleclass="bordered-purple"
                                data-toggle="popover" data-trigger="focus" data-placement="bottom" data-title="" :data-content="it.is_focus" >{{it.site_name}}</a>
                                 <!-- <label> <router-link :to="{name:'Mdetail',query:{id:it.uuid,sdate:it.created,media_type:it.media_type}}" class="mysize">{{it.title}}</router-link></label> -->
                                 <label v-if="it.media_type==6"><img src="http://v4.unotice.cn/static/images/sina.gif" /><a href="javascript:void(0)" @click="snapview(it)" v-html="'@'+it.title">{{it.title}}</a></label>
                                 <label v-else><a href="javascript:void(0)" @click="snapview(it)" v-html="it.title">{{it.title}}</a></label>
                            </h5>
                                <div> <p class="myp"> {{it.txt}}</p>    </div>
                                <span v-show="it.sim_count !=0 && radio3 !='搜索收藏'">相似文章:{{it.sim_count}}条</span>
                            <p class="myright grey">
                                <span>发布时间：{{it.pubdate}} </span><span> 阅读数：{{it.view}}</span>

                                <span v-show="radio3 !='搜索收藏'">
                                <span>属性:</span>
                                <span @click="changeside({uuid:it.uuid,article_date:it.created,media_type:it.media_type})" :class="it.side==1?'neutral':it.side==3?'positive':it.side==-3?'opposite':'opposite'">{{it.side==1?"中立":it.side==-3?"负面":it.side==3?"正面":"未定义"}}</span>
                                <span class="pull-right">
                                  <!-- <i class="ifa ifa-del-o ifa-b" title="修改属性" data-toggle="tooltip" data-placement="bottom"></i> -->
                                  <i @click="artDelbootbox({is_collect:it.is_collect},$event)" data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" ></i>
                                </span><!-- 删除 -->
                                </span>
                            </p>
                        </li>
                        <li v-show="this.pagetotal>0" class="widget-body ">
                            <div class="artfooter" v-show="this.pagetotal>0">
                                <label><input type="checkbox" name="" @click="checkedAll($event)" v-model='checked'/>全选</label>
                                 <a :class="this.artsort.batch.length>0?'btn btn-sm btn-info':'btn btn-info btn-sm disabled'" @click="artDel">删除<i class="glyphicon glyphicon-trash right"></i></a>

                            <!-- <select v-model="limit"><option value="20">每页20条</option><option  value="50">每页50条</option></select>{{limit}}-->
                            </div>
                            <div  v-show="this.pagetotal>0" style="float:right">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[20, 50, 100]"
                                    :page-size="limit"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pagetotal">
                                </el-pagination>
                            </div>
                        </li>
                    </ul>
                    <span v-show="pagetotal==0">这里还没有收藏的文章(;´༎ຶД༎ຶ`) <a @click="pushlink(radio3)">去收藏</a></span>
                </div>
            <!--修改正负面模态框-->
            <div class="modal fade bs-example-modal-lg" id="gun">
                <div class="modal-sm modal-dialog">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">您要将词条信息改为？</h4>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" @click="myside(3)">正面</button>
                      <button type="button" class="btn btn-warning" @click="myside(1)">中立</button>
                      <button type="button" class="btn btn-danger" @click="myside(-3)">负面</button>
                      <!-- <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> -->
                  </div>
                </div>
            </div>
            <!--修改正负面模态框结束-->
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
                                  <td><span @click="scrollP" class="art-similar">相似文章数：{{snap.sim_count}}</span></td>
                                  <td></td><!-- <i data-toggle="tooltip" data-placement="bottom" title="导出" class="ifa ifa-down-o ifa-b" @click="exportshow(0,{uuid:snap.uuid,medtype:snap.media_type,name:snap.title})"></i><span>导出</span> -->
                                  <td><i data-toggle="tooltip" data-placement="bottom" title="删除" class="ifa ifa-del-o ifa-b" @click="artDelbootbox({is_collect:snap.is_collect},$event)"></i><span>删除</span></td>
                                </tr>
                                <tr>
                                  <td>文章属性：<span @click="changeside({uuid:snap.uuid,sdate:snap.created,media_type:snap.media_type})" :class="snap.side==1?'neutral':snap.side==3?'positive':snap.side==-3?'opposite':'opposite'">{{snap.side==1?"中立":snap.side==-3?"负面":snap.side==3?"正面":""}}</span></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                            </table>
                          </div>
                        </div>
                        <p v-html="snap.txt">{{snap.txt}}</p>
                      </div>
                  </div>
                </div>
            </div>
            <!-- 结束 -->
    </div>
</template>
<script>
let NProgress = require("NProgress");
let bootbox = require("bootbox");
import { getCookie } from "../../../static/js/globle.js";
export default {
  data() {
    return {
      loadcoll:false,
      openMsg: function(msg, type) {
        this.$message({
          message: msg,
          type: type
        });
      },
      radio3: "监测收藏",
      enter: function(url, d, _fn) {
        this.ajaxEnter(url, d, _fn);
      },
      op: [
        {
          uuid: "",
          article_date: ""
        }
      ],
      pagetotal: "",
      limit: "20", //每页10条
      offset: "0",
      artlist: [],
      artsort: {
        batch: [],
        level: "1",
        mediaType: "1",
        side: "1",
        stime: "",
        etime: ""
      },
      snap: {
        name: "傻逼文章快照"
      },
      mytype: "",
      checked: ""
    };
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li><li class="active">我的收藏</li>';
    $("#Crumbs").html(html);
    NProgress.done()
  },
  methods: {
    pushlink(c){
      // console.log(c)
      if (c == "监测收藏") {
           this.$router.push({path: '/monitor'});
      } else if (c == "预警收藏") {
        this.$router.push({path: '/waring/profileW'});
      } else if (c == "探索收藏") {
         this.$router.push({path: '/InitRobot'});
      } else if (c == "搜索收藏") {
          $(".searchinput").focus();
      }

    },
    handleSizeChange(val) {
      debugger
      this.limit = val;
      this.ecoll(this.radio3);

    },
    handleCurrentChange(val) {
        console.log(val)
      this.currentPage = val;
      this.offset = this.limit * (val - 1);
      // console.log(this.offset);
      this.ecoll(this.radio3);
       $(document).scrollTop(0);
    },
    artDelbootbox(s, t) {
      var $t = this;
      bootbox.confirm({
        message: "您确定要删除吗？",
        size: "small",
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-sky"
          },
          cancel: {
            label: "取消",
            className: "btn-default"
          }
        },
        callback: function(result) {
          if (result) {
            var url = "/client/api/delete_collect",
              d = {
                params: {
                  id: s.is_collect
                }
              };
            $t.enter(url, d, function(d) {
              d.code == 1
                ? ($t.openMsg("删除成功！", "success"),
                  ($t.artsort.batch = []),
                  $t.ecoll($t.radio3))
                : $t.$message.error("删除失败!");
            });
          }
        }
      });
    },
    artDel() {
      if (this.artsort.batch.length > 0) {
              var $t = this;
              bootbox.confirm({
                message: "您确定要删除吗？",
                size: "small",
                buttons: {
                  confirm: {
                    label: "确定",
                    className: "btn-sky"
                  },
                  cancel: {
                    label: "取消",
                    className: "btn-default"
                  }
                },
                callback: function(result) {
                  if (result) {
                    var url = "/client/api/delete_collect",
                      d = {
                        params: {
                          token: getCookie("user"),
                          id: $t.artsort.batch
                        }
                      };
                    $t.enter(url, d, function(d) {
                      d.code == 1
                        ? ($t.openMsg("删除成功！", "success"),
                          ($t.artsort.batch = []),
                          $t.ecoll($t.radio3))
                        : $t.$message.error("删除失败!");
                    });
                  }
                }
              });

      }
    },
    choose(e, uid) {
    },
    checkedAll(e) {
      var _this = this;

      if (this.checked == false) {
        //实现反选
        _this.artsort.batch = [];
      } else {
        //实现全选
        _this.artsort.batch = [];
        _this.artlist.forEach(function(item) {
          _this.artsort.batch.push(item.is_collect);
        });
      }
      //  console.log(_this.artsort.batch);
    },
    mymouse(ev) {
      $(ev.target).focus();
    },
    ecoll(c) {
      // console.log(c)
      // NProgress.start();
      //   $(".loading-container").removeClass("loading-inactive");
      if (c == "监测收藏") {
        this.coll(1);
      } else if (c == "预警收藏") {
        this.coll(2);
      } else if (c == "探索收藏") {
        this.coll(3);
      } else if (c == "搜索收藏") {
        this.coll(4);
      }
      this.checked == false;

      // NProgress.done();
      //   $(".loading-container").addClass("loading-inactive");
    },
    coll(types) {
      this.loadcoll = true;
      var t = this;

      var url = "/admin/collect/index";
      t.enter(
        url,
        {
          params: {
            token: getCookie("user"),
            type: types,
            offset: t.offset,
            limit: t.limit
          }
        },
        function(res) {
          t.loadcoll = false;
          if (res.data.total > 0) {
            t.artlist = res.data.data;
            t.pagetotal = res.data.total;
          } else {
            t.artlist = [];
            t.pagetotal = 0;
          }
        }
      );
    },
    changeside(side) {
      $("#gun").modal("show");
      this.op.uuid = side.uuid;
      this.op.article_date = side.article_date;
      this.op.media_type = side.media_type;
    },
    myside(s) {
      var t = this;
      var url = "/client/api/side";
      t.enter(
        url,
        {
          params: {
            token: getCookie("user"),
            uuid: this.op.uuid,
            sdate: this.op.article_date,
            media_type: this.op.media_type,
            side: s
          }
        },
        function(res) {
          if (res.code == "1") {
            t.ecoll(t.radio3);
            // t.coll(t.mytype)
            $("#gun").modal("hide");
          } else {
            t.$message.error('系统繁忙，请重试');
          }
        }
      );
    },
    snapview(it) {
      var t = this;
      var url = "/client/article/get_articles_info";
      t.enter(
        url,
        {
          params: {
            token: getCookie("user"),
            uuid: it.uuid,
            sdate: it.created,
            media_type: it.media_type
          }
        },
        function(d) {
          t.snap = d.data;
          $("#snapModal").modal("show");
        }
      );
    }
  },
  created() {
    NProgress.start()
    this.ecoll("监测收藏");
    // this.coll(1)
  },
  watch: {
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
                  (d = {
                    params: {
                      id: isf,
                      media_type: e.data.medtype
                    }
                  }));
              t.enter(url, d, function(d) {
                d.code == 1 ? t.ecoll(t.radio3) : "";
                // isf==0?(d.code==1?$t.addClass('imp-red'):$t.removeClass('imp-red'),$t.attr('data-content',d.data)):(d.code==1?$t.removeClass('imp-red'):$t.addClass('imp-red'),$t.attr('data-content',d.data))
                $("[data-toggle=popover]").popover("hide");
              });
            }
          );
        });
      });
    },
    "artsort.batch": {
      handler: function(val, oldVal) {
        if (this.artsort.batch.length === this.artlist.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.widget-body {
  overflow: hidden;
}
.artfooter {
  float: left;
}
.artlist {
  width: 100%;
  margin-top: 10px;
}
.artdetail {
  width: 100%;
  margin-top: 10px;
  min-height: 200px;
}

a.atitle {
  display: inline-block;
  padding: 5px 10px;
  margin: 3px 5px;
  font-size: 12px;
  border: 1px solid #199ed8;
  border-radius: 5px;
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
.texthidden {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.imp-red {
  color: #ff0000 !important;
}
li input[type="checkbox"],
li input[type="radio"] {
  opacity: 1;
  position: relative;
  left: 0;
  z-index: 12;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
</style>
