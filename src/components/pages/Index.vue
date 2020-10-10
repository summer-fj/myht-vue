<template>
  <div class="box" ref="box"></div>
</template>
<script>
export default {
    mounted(){
        this.drawEcharts()
    },
    methods:{
        drawEcharts(){
            let myCharts = this.$echarts.init(this.$refs.box);
            var option = {
                title:{
                    text:"近一周订单数量"
                },
                tooltip:{},
                xAxis: {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [240, 390, 100, 500, 400, 700, 830],
                    type: 'line'
                }]
            };

            myCharts.setOption(option)
        }
    }
}
</script>
<style scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>