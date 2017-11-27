<template>
    <div class="right_">
               文案在此！

    </div>
</template>
<script>
export default {

    data() {
        return {

            head:{
                name:''
            },
        tableData3: [{
          last_snatch_time: "",
          name: "",
          key_word: "",
          status:"",
          condition:''
        }]
      }

    },
    methods:{

    },
    created(){


        // this.$ajax.get('/admin/words/index')
        // .then(res=>{
        //     console.log(res.data);
        //     this.tableData3=res.data.data

        // })
        // .catch(err=>{
        //     console.log(err)
        // })

    },
    mounted(){
      $('.loading-container').addClass('loading-inactive');
    }
}
</script>
<style scoped>

</style>
