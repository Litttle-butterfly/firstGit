<template>
    <div class='right_'>
        <div class="">
              <h4><span>{{this.$route.query.id?'修改维度':'新增维度'}}</span> <span style="font-size:14px">可创建主题10个，目前剩余{{dimensioncount}}个</span></h4>
            <hr/>

            <div class="form-group">
                <label for="theme_name" class="col-sm-2">维度名称：</label>
                <div class="col-sm-9">
                <input type="text" v-model="head.name" class="form-control"  @blur="blur" id="theme_name" placeholder="请输入15字以内维度名称（必填）">
                </div>
            </div>
            <div class="form-group">
                <label  class="col-sm-2"> 系统维度库：  </label>
                 <div class="col-sm-9">
                    <p>下面是一些最常见维度。您可以添加选用。</p>
                    布尔表达式：<span class='tag-item' draggable='true' @dragstart='dragboo($event)'  v-for="tag in boo"  :key="tag" ><span>{{tag.word}}</span> </span>
                    <br/>
                    <span class='tag-item' draggable='true' @dragstart='drag($event,tag)'  v-for="tag in dynamicTags"  :key="tag" ><span>{{tag.word}}</span>
                    <i @click="handleClose(tag,$event)">×</i></span>
                    <div>
                    <div  @drop='drop($event)' @dragover='allowDrop($event)'>
                        <textarea v-model = "head.textword" value ="" id="texthere" class="form-control" rows="3" ></textarea>
                    </div>
                    </div>

                 </div>
                   <div class="col-sm-1">
 
                   </div>
                </div>
                <div class="form-group">
                    <label  class="col-sm-2 control-label">
                    </label>
                    <div class="col-sm-9">
                        
                    </div>
                    <div  class="col-sm-1">   <button @click="sub"  class="btn btn-sm btn-sky btn-default">提交</button></div>
                </div>  
        </div>
 
        <div id="mysbalert" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
          <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content ">
              <i class="ifa ifa-error-e"></i><span class="xftsbalert"></span>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { getCookie } from "../../static/js/globle.js";
export default {
  data() {
    return {
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
      dimensioncount: "",
      nameexist: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      head: {
        name: "",
        notwords:'',
        textword: ""
      },
      currenttag:{},
      targetword: ""
    };
  },
  methods: {
    handleClose(tag,ev) {
            if (ev) {
        var current = ev.target.previousElementSibling.innerText;
        console.log(ev.target.previousElementSibling.innerText);

        this.head.notwords = current;
        this.anls();
      }

      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    anls(){
      var t = this;
              $.ajax({
          type: "post",
          url: this.dataurl + "/client/api/word_analysis",
          data: {
            token: getCookie("user"),
            words: this.head.name,
            notwords:this.head.notwords
          },
          dataType: "json",
          success: function(res) {
            // console.log(res)

            t.dynamicTags = res.data;
            if (res.code == "-1") {
              t.dynamicTags = [
                {
                  word: t.head.name
                }
              ];
            }
          }
        });
    },
    blur() {
      var t = this;
      if ($.trim(this.head.name) != "") {
        if (this.$route.query.id) {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/dimension/get_count",
            data: {
              token: getCookie("user"),
              name: this.head.name,
              id: this.$route.query.id
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.nameexist = false;
                //   alert(res.msg)
              } else {
                t.$message({
                  type: "warning",
                  message: "维度名称重复！"
                });
                t.nameexist = true;
              }
            }
          });
        } else {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/dimension/get_count",
            data: {
              token: getCookie("user"),
              name: this.head.name
            },
            dataType: "json",
            success: function(res) {
              if (res.code == "1") {
                t.nameexist = false;
                //   alert(res.msg)
              } else {
                t.$message.error(res.msg);
                t.nameexist = true;
              }
            }
          });
        }

        // console.log(this.head.name)
        $.ajax({
          type: "post",
          url: this.dataurl + "/client/api/word_analysis",
          data: {
            token: getCookie("user"),
            words: this.head.name
          },
          dataType: "json",
          success: function(res) {
            // console.log(res)

            t.dynamicTags = res.data;
            if (res.code == "-1") {
              t.dynamicTags = [
                {
                  word: t.head.name
                }
              ];
            }
          }
        });
      } else {
        this.$message.error("维度名称不能为空");
      }
    },
    dragboo(){
        this.targetword = event.target.childNodes[0].innerHTML;
          event.dataTransfer.setData("text", this.targetword);
    },
    drag(event,tag) {
      this.targetword = event.target.childNodes[0].innerHTML;
      event.dataTransfer.setData("text", this.targetword);
      this.currenttag = tag
    },
    drop(event) {
      event.preventDefault();
      debugger
      if (event.target.value == "") {
        event.target.value += this.targetword;
        this.head.textword = event.target.value;
      } else {
        // event.target.value  +=  '|'+  this.targetword
        event.target.value += this.targetword;
        this.head.textword = event.target.value;
      }


      if(this.dynamicTags.indexOf(this.currenttag) != '-1'){
        this.head.notwords = this.targetword;
        this.dynamicTags.splice(this.dynamicTags.indexOf(this.currenttag), 1);
        this.anls();
      }



    },
    allowDrop(event) {
      event.preventDefault();
    },
    open3() {
      this.$notify({
        //   title: '成功',
        message: "这是一条成功的提示消息",
        type: "success"
      });
    },
    sub() {
      let a = $("#texthere")
        .val()
        .replace(/AND/g, " " + "AND" + " ");
      let b = a.replace(/OR/g, " " + "OR" + " ");
      let text = b.replace(/NOT/g, " " + "NOT" + " ");
      // console.log(text)

      var t = this;

      if (this.head.name && this.nameexist == false) {
        if (this.$route.query.id) {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/dimension/update",
            data: {
              token: getCookie("user"),
              name: this.head.name,
              condition: text,
              id: this.$route.query.id
            },
            dataType: "json",
            success: function(res) {
              // console.log(res);
              if (res.code == 1) {
                t.$message({
                  message: "修改成功！",
                  type: "success"
                });
                t.$router.replace("/setup/dimensionSet");
              } else if (res.code == -3) {
                  const h = t.$createElement;
                  t.$message({
                    type:'warning',
                    message: h('p', null, [
                      h('span', null, '出错啦 '),
                    ])
                  });
                  $(".el-message__group").html(res.msg)
              // $(".el-notification__content").html(res.msg)
                // $('#mysbalert').modal('show')
                // $(".xftsbalert").html(res.msg)
                // t.$message.error("请检查您的布尔表达式！");
              } else {
                t.$message.error("修改失败！");
              }
            }
          });
        } else {
          $.ajax({
            type: "post",
            url: this.dataurl + "/admin/dimension/save",
            data: {
              token: getCookie("user"),
              name: this.head.name,
              condition: text
            },
            dataType: "json",
            success: function(res) {
              console.log(res);
              if (res.code == 1) {
                t.$router.replace("/setup/dimensionSet");
              } else if (res.code == "-3") {
                  const h = t.$createElement;
                  t.$message({
                    type:'warning',
                    message: h('p', null, [
                      h('span', null, '出错啦 '),
                    ])
                  });
                  $(".el-message__group").html(res.msg)

              } else if (res.code == "-2") {
                t.$message.error("条件不能为空");
              }
            }
          });
        }
      } else {
        t.$message.error("请检查您的名称 重复或者为空！");
      }
    }
  },
  mounted() {
    var html = '<li><i class="fa fa-home"></i><a href="#/home">Home</a></li>';
    html += '<li>设置</li> <li class="active"> 新增维度</li>';
    $("#Crumbs").html(html);
    $(".loading-container").addClass("loading-inactive");
  },
  created() {
      this.$ajax.post('/admin/dimension/get_total',{})
      .then(res=>{
        //  console.log(res.data);
        this.dimensioncount = 10 - res.data.data;
      })
      .catch(err=>{
          console.log(err)
      })


    if (this.$route.query.id) {
      // 组件创建时通过id获取到编辑的那条数据的值
       this.$ajax.post('/admin/dimension/index',{params:{id:this.$route.query.id}})
       .then(res=>{
          //  console.log(res.data);
          this.head.name = res.data.data.data[0].name;
          this.head.textword = res.data.data.data[0].condition.replace(/\"/g, " ");
           this.blur();
       })
       .catch(err=>{
           console.log(err)
       })

    } else {
    }
  }
};
</script>
<style scoped>

#texthere {
  padding: 20px;
}
.tagcontent {
  border: 1px solid black;
  width: 600px;
  height: 400px;
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
  cursor: pointer;
}
.form-group {
    margin:20px;
    overflow: hidden;
}
</style>
