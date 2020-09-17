$(function() {
    // 最新图文后台获取数据 渲染
    newArt()

    function newArt() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/articles',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                console.log(res);
                var temp = template('newArt', res)
                $('.article').html(temp)
            }
        })
    }
    // 粉丝数据图表

    var myChart = echarts.init(document.getElementById('main'));
    option = {
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            indicator: [
                { name: '引用' },
                { name: '产量' },
                { name: '贡献' },
                { name: '热度' },
                { name: '口碑' },
            ]
        },
        series: [{
            type: 'radar',
            data: [{
                    value: [4300, 1000, 2800, 3500, 5000, 1900],
                },
                {
                    value: [5000, 1400, 2800, 3100, 4200, 2100],
                }
            ]
        }]
    };
    myChart.setOption(option);

    // 图文数据图表
    var myChart1 = echarts.init(document.getElementById('record'));
    option1 = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },

        series: [{
            name: '图文数据',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 23, name: '平均阅读进度' },
                { value: 283, name: '跳出率' },
                { value: 123, name: '平均阅读速度' },

            ]
        }]
    };
    myChart1.setOption(option1);

})