<template>
    <div>
    <div>
        生成进度：
        <select>
            <option>进行中</option>
            <option>已完成</option>
        </select>
         <button @click="modeltoggle">创建用户画像</button>
      <div class="modal fade bs-example-modal-sm" tabindex="-1" id="pig">
        <div class="modal-dialog modal-sm" >
          <div class="modal-content">
               <h4>创建对比品牌</h4>
                <select>
                    <option>请选择主题</option>
                    <option>小米</option>
                </select>
                <select>
                    <option>请选择画像时间</option>
                    <option>1天</option><option>3天</option><option>5天</option>
                </select>
                <div class="modal-foot">
                  <button size="small"  >提交</button>
                  <button size="small" data-dismiss="modal">取消</button>
                </div>
          </div>

        </div>
      </div>
    </div>
    <el-table :data="tableData3"  height="250" border style="width: 700">
        <el-table-column  prop="date" label="日期"  width="180"> </el-table-column>
        <el-table-column  prop="name"  label="姓名"  width="180"> </el-table-column>
        <el-table-column  prop="address" label="地址"></el-table-column>
         <el-table-column label="操作" fixed="right">
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    </div>
</template>
<script>
 export default {
    data() {
      return {
        isShow:false,
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    },
      methods: {
        modeltoggle(){
            $("#pig").modal('show');
        },
        modelfalse(){
            this.isShow=false;
        },
        handleEdit(index, row) {
          console.log(index, row);
        },
        handleDelete(index, row) {
          console.log(index, row);
        }
    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
    },
  }
</script>
<style scoped>

.modal-content{
  padding:30px;
}
</style>
