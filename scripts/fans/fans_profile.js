document.addEventListener('DOMContentLoaded',function(){
  var myChart = echarts.init(document.getElementById('main'));
  option = {
    // 为表格添加标题
    title: {
      text: '头条粉丝'
  },
  // 鼠标移动出现水平垂直两条辅助线
  tooltip: {
    trigger: 'axis',
    axisPointer: {
        type: 'cross',
        label: {
            
        }
    }
},

  xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      // 修改线的颜色
      itemStyle : {
        normal : {
          color:'skyblue', //改变折线点的颜色
          lineStyle:{
            color:'skyblue' //改变折线颜色
          }
        }  
       },
      
  }]
};
myChart.setOption(option);
})