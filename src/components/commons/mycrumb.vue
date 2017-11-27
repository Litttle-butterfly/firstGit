
<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{message}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props: ['message'],
    created(){

    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
    }
}
</script>
<style>
</style>
