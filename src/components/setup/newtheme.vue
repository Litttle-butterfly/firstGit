<template>
    <div class='right_'>
        <div>
        <h4><span>{{this.$route.query.id?'修改主题':'新增主题'}}</span> <span style="font-size:14px">可创建主题10个，目前剩余{{resthemecount}}个</span></h4>
            <hr/>
        </div>
        <div class="">

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
                 <!--        <div class="form-group">
                        <label for="robot_help" class="col-sm-2 control-label">  匹配类型:</label>
                      <div class="col-sm-4">

                        <select v-model="mytype1.match_type">
                            <option value='1'>标题和内容</option>
                            <option value='2'>标题</option>
                            <option value='3'>内容</option>
                        </select>
                      </div>
                    <div class="col-sm-4">
                                  最小词频：<input type="number" max="5" min="1" v-model="type2.weight"/>

                        </div>
                        <div class="col-sm-1">

                        </div>
                    </div>     -->
                    <div class="form-group">
                        <label for="robot_help" class="col-sm-2 control-label">智能辅助:</label>
                         <div class="col-sm-9">
                            <input type="text" v-model="head1.words" @blur="anls" class="form-control" id="robot_help" placeholder="输入关键词" onpaste="return false" ondragenter="return false" >
                         </div>
                         <div class="col-sm-1">
                          <!-- <button  class="btn btn-default btn-sky btn-sm"  @click="anls">分析</button> -->
                         </div>
                    </div>
                    <div class="form-group">
                         <label  class="col-sm-2 control-label">小提示:</label>
                        <div class="col-sm-9">
                         <p>您可将分析出来的&lt;关键词&gt;&lt;用力拖拽&gt;至下面任意搜索框内或者&lt;手动输入&gt;并&lt;以回车结束&gt;关键词</p>
                        <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags"  :key="tag" ><span>{{tag.word}}</span>
                        <i @click="handleClose(tag,$event)" class="xx">×</i></span>
                        </div>
                        <div class="col-sm-1">
                         <!-- <button  class="btn btn-default btn-sky btn-sm"  @click="fiverows">{{fiveplus==true?'回到2行':"适应5行"}}</button> -->
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
                                    <input type="text" class="jctext" />
                                    <!-- <br/>匹配类型：
                                      <select class="jcselect">
                                          <option value='1'>标题和内容</option>
                                          <option value='2'>标题</option>
                                          <option value='3'>内容</option>
                                      </select> -->
                                    </div>
                                </div>
                                <div   @drop='drop($event,1)' @dragover='allowDrop($event)' class ="bh">
                                    <h5>包含词</h5>
                                    <div v-for="(item,index) in type1" class="bhx" :class="'bhx'+index" :key="index">
                                    <textarea rows="2" cols="20" class="bhtext"  style="resize:none;" @focus="myresize($event)" @input="myresize($event)" @propertychange="myresize($event)"></textarea>
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
                        <div class="col-sm-9 xftgroup">
                            <button @click="sub1"  class="btn btn-sm  btn-sky btn-default">提交</button>
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
                    <!-- <div class="form-group">
                        <label for="robot_help" class="col-sm-2 control-label">媒体类型:</label>
                      <div class="col-sm-9">
                          <label><input type="checkbox" value="" data-model="media_type" v-model="type2.mcheck" class="chk_all" @click="checkedmAll" />全选&nbsp;&nbsp;</label>
                          <label v-for="item in options" >
                              <input type="checkbox" :key="item.id" :value="item.id" name="media_type"
                              v-model="type2.media_type" />{{item.name}}&nbsp;&nbsp;</label>
                        </div>
                        <div class="col-sm-1">

                        </div>
                    </div> -->
                    <div class="form-group">
                        <label for="robot_help" class="col-sm-2 control-label">  匹配类型:</label>
                      <div class="col-sm-4">

                        <select v-model="type2.match_type">
                            <option value='1'>标题和内容</option>
                            <option value='2'>标题</option>
                            <option value='3'>内容</option>
                        </select>
                      </div>
                        <!-- <div class="col-sm-4">
                                  最小词频：<input type="number" max="5" min="1" v-model="type2.weight"/>

                        </div> -->
                        <div class="col-sm-1">

                        </div>
                    </div>
                    <div class="form-group">
                        <label for="robot_help" class="col-sm-2 control-label">智能辅助:</label>
                     <div class="col-sm-9">
                        <input type="text" class="form-control" @blur="anls" id="robot_help" placeholder="输入关键词"  v-model="head1.words">
                      </div>
                      <div class="col-sm-1">
                        <!-- <button @click="anls" class="btn btn-default btn-sky btn-sm" >分析</button> -->
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
                            <i @click="handleClose(tag,$event)"class="xx">×</i></span>

                            </p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"></label>
                        <div class="col-sm-9">

                            <div id="tagmovehere" >
                                <div class="taggroup"  @drop='dropboo($event)' @dragover='allowDrop($event)'  >
                                  <textarea class="form-control booval" rows="3" v-model="type2.condition"  style="resize:none" ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                      <div class="form-group xftgroup2">
                          <label  class="col-sm-2 control-label">
                          </label>
                          <div class="col-sm-9">
                              <button @click="sub2"  class="btn btn-sm btn-sky btn-default">提交</button>
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
                            <input type="text" @blur="anls3" class="form-control" id="robot_help" v-model="head1.words"  placeholder="输入关键词">
                        </div>
                        <div class="col-sm-1">
                            <!-- <button  @click="anls3"  class="btn btn-sm btn-sky btn-default" >分析</button> -->
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">小提示：</label>
                        <div class=" col-sm-9" >
                            <p class="form-control-static">下面是一些最常见关键词。您可以编辑表达式时选用。  </p>
                            <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags33"  :key="tag" ><span>{{tag.word}}</span>
                            <i @click="handleClose33(tag,$event)"class="xx">×</i></span>
                        </div>

                    <!--  大佬瞎改不要删
                            <div>
                                <h5>相关词</h5>
                                <div class="relevant"  @drop='drop3($event)'  @dragover='allowDrop3($event)' >
                                    <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags3"  :key="tag" ><span>{{tag.word}}</span>
                                    <i @click="handleClose3(tag)" class="xx">×</i></span>

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
                                    <button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</button>
                                </div>

                            </div>
                            <div>
                                <h5 >不相关词</h5>
                                <div class="disrelated"  @drop='drop3($event)'  @dragover='allowDrop3($event)' >
                                    <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags4"  :key="tag" ><span>{{tag.word}}</span>
                                    <i @click="handleClose4(tag)" class="xx">×</i></span>


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
                                    <button v-else class="button-new-tag" size="small" @click="showInput2">+ 新增</button>
                                </div>
                            </div> -->
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
                    <div class="form-group xftgroup2">
                      <label  class="col-sm-2 control-label">
                      </label>
                      <div class="col-sm-9">
                         <button @click="sub" class="btn btn-sm btn-sky btn-default">提交</button>
                      </div>
                      <div class="col-sm-1"></div>
                    </div>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>


<script>
// 放下时将数据push到数组里面去
// <ul class="nav nav-tabs">
//     <li> <router-link :to="{name:'quickm'}">快捷模式</router-link></li>
//     <li><router-link :to="{name:'superm'}">高级模式</router-link></li>
//     <li><router-link :to="{name:'langm'}">语义模式</router-link></li>
// </ul>
import global_ from "../GLOBAL.vue";
import { getCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
      isnull: false,
      fiveplus: false,
      mytype1: {
        match_type: "1"
      },
      options: [],
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
      dynamicTags33: [],
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
        // weight: "1",
        // media_type: [2, 3, 4, 5, 1, 6, 7, 8, 9, 10],
        condition: "",
        mcheck: true
      },
      type3: {
        orword: [],
        notword: []
      },
      currenttag: "",
      currentword: "",
      currentwordtype: "",
      currentbox: "",
      nameexist: false
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

        // console.log(res);
      },
      error: function(res) {}
    });

    // console.log(this.$route.query.id)
    var iddata = this.$route.query.id;
    $.ajax({
      //拿到数量 的接口
      type: "post",
      url: this.dataurl + "/admin/words/get_total",
      data: {
        token: getCookie("user")
      },
      dataType: "json",
      success: function(res) {
        // console.log(res);
        t.resthemecount = 10 - res.data;
      }
    });
    if (this.$route.query.id) {
      $.ajax({
        type: "post",
        url: this.dataurl + "/admin/words/get_words_info",
        data: {
          token: getCookie("user"),
          id: iddata
        },
        dataType: "json",
        success: function(res) {
          // console.log(res);
          if (res.data.word_type == "1") {
            $(".nav-tabs > li").removeClass("active");
            $(".tab-content>div").removeClass("active");
            $(".nav-tabs > li:nth-child(1)").addClass("active");
            $(".tab-content>div:nth-child(1)").addClass("active");
            t.head.name = res.data.name;
            t.type1 = res.data.condition;
            // t.mytype1.match_type = res.data.match_type;
            t.domessage();
          } else if (res.data.word_type == "2") {
            $(".nav-tabs > li").removeClass("active");
            $(".tab-content>div").removeClass("active");
            $(".nav-tabs > li:nth-child(2)").addClass("active");
            $(".tab-content>div:nth-child(2)").addClass("active");
            t.head.name = res.data.name;
            t.type2.condition = res.data.condition;
            t.type2.weight = res.data.weight;
            t.type2.match_type = res.data.match_type;
            t.type2.media_type = res.data.media_type.split("|");
            res.data.media_type.split("|").length == t.options.length
              ? (t.type2.mcheck = true)
              : (t.type2.mcheck = false);
          } else if (res.data.word_type == "3") {
            $(".nav-tabs > li").removeClass("active");
            $(".tab-content>div").removeClass("active");
            $(".nav-tabs > li:nth-child(3)").addClass("active");
            $(".tab-content>div:nth-child(3)").addClass("active");
            t.head.name = res.data.name;

            let not = "",
              or = "";

            if (res.data.condition.orword) {
              res.data.condition.orword.map(function(item, index) {
                //  t.dynamicTags3.push({word:item})
                or += "\n" + item;
              });
            }
            if (res.data.condition.notword) {
              res.data.condition.notword.map(function(item, index) {
                //  t.dynamicTags4.push({word:item})
                not += "\n" + item;
              });
            }
            $(".relevant").val($.trim(or));
            $(".disrelated").val($.trim(not));
          }
        }
      });
    }
  },
  watch: {
    type1: {
      handler: function(val, oldVal) {
        // console.log(val);
        // console.log(oldVal);
        // this.domessage();
      },
      immediate: true
    },
    "type2.media_type": {
      handler: function() {
        if (this.options.length == 0) {
        } else if (this.type2.media_type.length === this.options.length) {
          this.type2.mcheck = true;
        } else {
          this.type2.mcheck = false;
        }
      }
    }
  },
  methods: {
    myresize(ev) {
      // debugger;
      console.log(ev.target.value.split("\n").length);
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
    fiverows() {
      if ($(".bhtext").css("height") !== "110px") {
        $(".bhtext").css({ height: "110px" });
        $(".pctext").css({ height: "110px" });
        $(".jctext").css({ margin: "0 0 94px" });
        $(".pcx")
          .find(".ifa-del-g")
          .css({ "margin-top": "87px" });
        this.fiveplus = true;
      } else {
        $(".bhtext").css({ height: "52px" });
        $(".pctext").css({ height: "52px" });
        $(".jctext").css({ margin: "0 0 35px" });
        $(".pcx")
          .find(".ifa-del-g")
          .css({ "margin-top": "33px" });
        this.fiveplus = false;
      }
    },
    checkedmAll() {
      var _this = this;
      if (this.type2.mcheck == false) {
        //实现反选
        _this.type2.media_type = [];
      } else {
        //实现全选
        _this.type2.media_type = [];
        _this.options.forEach(function(item) {
          _this.type2.media_type.push(item.id);
        });
      }
    },
    checkname() {
      if ($.trim(this.head.name) != "") {
        this.head1.words = this.head.name;
        this.anls();
        this.anls3();
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

                //   this.$message(res.msg)
              } else {
                t.nameexist = true;
                t.$message.erroe("提示：主题名称重复");
              }
            }
          });
        } else {
          $(".jctext")[0].value = this.head.name;
          this.anls();
          this.anls3();
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
              } else {
                t.nameexist = true;
                t.$message.erroe("提示：主题名称重复");
              }
            }
          });
        }
      } else {
        this.$message("提示：主题名称为空");
      }
    },
    domessage() {
      var t = this;
      this.$nextTick(function() {
        //由多行文本改成单行input框
        $(".jctext").each(function(index, item) {
          // item.value = t.type1[index].keyword.join("\n")
          console.log(index);
          if (t.type1[index].keyword) {
            item.value = t.type1[index].keyword;
          } else {
            item.value = "";
          }
        });

        $(".bhtext").each(function(index, item) {
          if (t.type1[index].andword) {
            item.value = t.type1[index].andword.join("\n");
          } else {
            item.value = "";
          }
        });
        $(".pctext").each(function(index, item) {
          if (t.type1[index].notword) {
            item.value = t.type1[index].notword.join("\n");
          } else {
            item.value = "";
          }
        });
        $(".jcselect").each(function(index, item) {
          $(item)
            .find("option[value=" + t.type1[index].match_type + "]")
            .attr("selected", true);
        });
      });

      //  $("#theme_name").focus()
      // mmp
    },
    delline(index, e) {
      //  console.log($.trim($($(".jcx" + index).find('input')[0]).val()))
      //  console.log($.trim($($(".bhx" + index).find('textarea')[0]).val()))
      //  console.log($.trim($($(".pcx" + index).find('textarea')[0]).val()))

      let one = $.trim($($(".jcx" + index).find("input")[0]).val()),
        two = $.trim($($(".bhx" + index).find("textarea")[0]).val()),
        three = $.trim($($(".pcx" + index).find("textarea")[0]).val());

      if ($(".glyphicon-minus").length == 1) {
        this.$message("请至少保留一条");
      } else {
        // console.log(index);
        $(".jcx" + index).remove();
        $(".bhx" + index).remove();
        $(".pcx" + index).remove();
        $(".pp" + index).remove();
        $(e.target).remove();
      }
    },
    areamore(i) {
      this.yourtype1(); //拿到type1
      // 继续添加this.splice(index, 0, item);
      // this.$nextTick(function() {
      this.type1.splice(i + 1, 0, {
        keyword: "",
        andword: [],
        notword: [],
        match_type: 1
      }); //此时内存中的type1是正确的，页面上是错误的，重新给页面上的框框派发值
      // })

      //如果用户在页面上填入了值，需要一并获取到

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
      if($.trim(this.head1.words)!=''){
        var t = this;
        $.ajax({
          type: "post",
          url: this.dataurl + "/client/api/word_analysis",
          data: this.head1,
          dataType: "json",
          success: function(res) {
            // console.log(res);
            t.dynamicTags = res.data;
            // 关键词是监测词的第一个词
            // if( $(".jctext")[0].value == ''){
            //       $(".jctext")[0].value  +=  t.head1.words
            // }else{
            //     $(".jctext")[0].value  +=  t.head1.words
            // }
            //   $(".jctext")[0].value  =  t.head1.words

            if (res.code == "-1") {
              t.dynamicTags = [{ word: t.head1.words }];
            }
          },
          error: function() {
            // this.$message("INTERNET ERROR!!")
          }
        });
      }else{
        this.$message({
          type:'warning',
          message:'您还没有填分析词'
        })
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
          if (res.code == "1") {
            t.dynamicTags33 = res.data;
          } else {
            t.dynamicTags33 = [{ word: t.head1.words }];
          }
        }
      });
      }else{
        this.$message({
          type:'warning',
          message:'您还没有填分析词'
        })
      }
    },
    yourtype1() {
      var t = this;
      var i = 0;
      var mynull = 0;
      $(".jctext").each(function(index, item) {
        if ($.trim(item.value) == "") {
          mynull++;
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
      console.log(i);
      this.type1 = this.type1.slice(0, i);
    },
    sub1() {
      this.yourtype1();
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
              condition: this.type1,
              match_type: this.mytype1.match_type
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.$message("保存成功！");
                t.$router.replace("/setup/themeset");
              } else if (res.code == "-2") {
                t.$message("条件不能为空！");
              } else if (res.code == "-1") {
                t.$message("您的主题词数量已达上限！");
              }
            },
            error: function() {
              // this.$message("INTERNET ERROR!!")
            }
          });
        } else {
          console.log(JSON.stringify(this.type1));
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/words/save",
            data: {
              param: "1",
              token: getCookie("user"),
              id: this.$route.query.id,
              name: this.head.name,
              condition: this.type1,
              match_type: this.mytype1.match_type
            },
            dataType: "json",
            success: function(res) {
              // debugger
              if (res.code == "1") {
                t.$message("保存成功！");
                t.$router.replace("/setup/themeset");
              } else if (res.code == "-2") {
                t.$message("条件不能为空！");
              } else if (res.code == "-1") {
                t.$message("您的主题词数量已达上限！");
              }
            },
            error: function() {
              // this.$message("INTERNET ERROR!!")
            }
          });
        }
      }
    },
    sub2() {
      if ($.trim($(".booval").val()) == "") {
        this.$message("条件不能为空！");
      } else {
        this.type2.condition = $.trim($(".booval").val());
        let a = $(".booval")
          .val()
          .replace(/AND/g, " " + "AND" + " ");
        let b = a.replace(/OR/g, " " + "OR" + " ");
        let text = b.replace(/NOT/g, " " + "NOT" + " ");
        // console.log(text);

        if (this.nameexist == false && $.trim(this.head.name) != "") {
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
                condition: text,
                media_type:
                  this.type2.media_type.length == this.options
                    ? ""
                    : this.type2.media_type,
                match_type: this.type2.match_type,
                weight: this.type2.weight
              },
              dataType: "json",
              success: function(res) {
                if (res.code == "1") {
                  t.$message("保存成功！");
                  t.$router.replace("/setup/themeset");
                } else if (res.code == "-3") {
                  const h = t.$createElement;
                  t.$message({
                    type: "warning",
                    message: h("p", null, [h("span", null, "出错啦 ")])
                  });
                  $(".el-message__group").html(res.msg);
                  // t.$message("请确认您的条件格式！");
                } else {
                  t.$message(res.msg);
                }
              },
              error: function() {
                // this.$message("INTERNET ERROR!!")
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
                condition: text,
                media_type: this.type2.media_type,
                match_type: this.type2.match_type,
                weight: this.type2.weight
              },
              dataType: "json",
              success: function(res) {
                if (res.code == "1") {
                  t.$message("保存成功！");
                  t.$router.replace("/setup/themeset");
                } else if (res.code == "-3") {
                  const h = t.$createElement;
                  t.$message({
                    type: "warning",
                    message: h("p", null, [h("span", null, "出错啦 ")])
                  });
                  $(".el-message__group").html(res.msg);
                } else {
                  t.$message(res.msg);
                }
              },
              error: function() {
                // this.$message("INTERNET ERROR!!")
              }
            });
          }
        } else {
          this.$message("请输入名称或名称重复！");
        }
      }
    },
    sub() {
      if (
        $.trim($(".relevant").val()) == "" &&
        $.trim($(".disrelated").val()) == ""
      ) {
        this.$message.error("条件不能为空！");
      } else if (this.nameexist == true) {
        this.$message.error("主题名称已存在！");
      } else if ($.trim(this.head.name) == "") {
        this.$message.error("主题名称不能为空！");
      } else {
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
                t.$message("保存成功！");
                t.$router.replace("/setup/themeset");
              } else {
                t.$message(res.msg);
              }
            },
            error: function() {
              t.$message("INTERNET ERROR!!");
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
      this.dynamicTags33.splice(this.dynamicTags33.indexOf(tag), 1);
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
      // console.log(this.currentword);
      this.currenttag = tag;
    },
    dropjc(e) {
      // console.log(e);
      e.target.value = this.currentword;
      this.head1.notwords = this.currentword;
      this.anls();
    },
    drop(event, type) {
      event.preventDefault();
      //阻止默认事件
      // console.log(event);
      // console.log(event.target.value);

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

      // console.log(event.target.value);
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
      //  e.target.value += this.currentword;
      this.type2.condition += this.currentword;
      if (this.dynamicTags.indexOf(this.currenttag) != "-1") {
        this.dynamicTags.splice(this.dynamicTags.indexOf(this.currenttag), 1);
        this.head1.notwords = this.currentword;
        this.anls();
      }

      e.preventDefault();
    },
    drop3(e) {
      // event.target.parentNode.className
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
      // console.log(e)
    }
  },

  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li> <li class="active"> 新增设置</li>';
    $("#Crumbs").html(html);

    var t = this;
    $(".loading-container").addClass("loading-inactive");
  }
};
</script>
<style scoped>
.ifa-del-g {
  /* margin-top: 142px; */
  margin-top: 33px;
  cursor: pointer;
}
input[type="text"] {
  color: #000;
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
.nav-tabs > li {
  /* background-color:#EFF2F7; */
}
.tab-content {
  overflow: hidden;
  background-color: transparent !important;
  box-shadow: none !important;
}
.taggroup {
  margin: 0 auto;
}
.taggroup > div {
  display: inline-block;
  width: 47%;
}
.right_ {
  width: 100%;
  background-color: white;
  /*padding: 30px;*/
}
.xftbar {
  width: 100%;
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
  cursor: move;
}
.tag-item i {
  padding: 0 3px;
}
.ifa-new-g {
  width: 93px;
  height: 89px;
  position: absolute;
  bottom: 39px;
  /* bottom: 138px; */
  left: 405px;
}
#home {
  position: relative;
  margin-bottom: 40px;
}
#sbbox textarea {
  /* padding: 10px; */
  padding: 5px 10px;
  margin-bottom: 10px;
}
#sbbox .jctext {
  width: 180px;
  /* padding:10px; */
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
#sbbox > div.bh {
  /* margin-right: 20px; */
}
.relevant,
.disrelated {
  width: 250px;
  height: 200px;
  padding: 20px;
  /* border: 1px solid grey; */
}
#sbbox select {
  appearance: none !important;
  -webkit-appearance: none !important;
}
#sbbox div.ppx {
  margin: 0 0 35px;
}
.jctext {
  margin: 0 0 35px;
}
.jcx select {
  margin: 0 0 12px;
}
.trashdiv {
  height: 180px;
}
.trashdiv span {
  display: block;
  padding: 40px;
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
input[type="number"] {
  width: 40px;
  border-radius: 5px !important;
  padding-left: 3px;
}
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
ul.nav-tabs > li > a:active {
  background-color: white !important;
}
</style>
