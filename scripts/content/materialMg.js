$(function () {
    var layer = layui.layer
    var laypage = layui.laypage;
    var query
    var pic = []
    var q = {
        page: 1, //当前的页码值 默认的的初始页面
        per_page: 12, //每页显示的条数 设置默认为2
        total_count: '' //	图片总数
    }
    getMaterial()

    /**
     *点击上传图片模拟点击上传ipt框
     */
    $('#upload-pic-btn').on('click', function () {
        $('#file-pic-ipt').click()
        
    })

    /**
     * 绑定上传图片事件
     */
    $('#file-pic-ipt').on('change', function (e) {
        // console.log(e.target.files[0]);
        var fileList = e.target.files[0]
        var fileImg = new FormData()
        fileImg.append('image', fileList)
        if (fileList.length === 0) {
            return layer.msg('请上传图片')
        }

        $.ajax({
            url: '/mp/v1_0/user/images',
            method: 'POST',
            contentType: false,
            processData: false,
            data: fileImg,
            success: function (res) {
                console.log(res);
                if (res.message !== 'OK') {
                    return layer.msg(res.message)
                }
                layer.msg('上传成功')
                getMaterial() // 获取后台数据 并渲染

            }
        })
    })

    /**
     * 
     */
    function getMaterial() {
         // 获取后台数据
        $.ajax({
            url: '/mp/v1_0/user/images',
            method: 'GET',
            data: q,
            success: function (res) {
                // console.log(res.data.results.url);
                // console.log(res.data);
                
                //使用模板渲染
                var materialHtml = template('material-pic', res.data)
                // console.log(materialHtml);
                $('#material-cont').html(materialHtml)
                $('.operate [collect=true]').attr('src', '/images/redstar.png')
                $('.operate [collect=false]').attr('src', '/images/blackstar.png')
                renderPage(res.data.total_count)
            }

        })       
    }

    /**
     * 给收藏绑定点击事件
     */
    $('#collect-btn').on('click', function () {
        // //调取collect为true的 id
        // var collectId = $('.operate [collect=true]').parents('.layui-col-md2-box').attr('data-id')
        // console.log(collectId);
        
        //给自己添加类
        $(this).removeClass('layui-btn-primary')
        $(this).addClass('layui-btn-normal')
        $(this).siblings().removeClass('layui-btn-normal')
        $(this).prev().addClass('layui-btn-primary')

        $.ajax({
            url: '/mp/v1_0/user/images',
            method: 'GET',
            data: {
                collect: true
            },
            success: function (res) {
                // console.log(res); 已获取
                var collectHtml = template('collect-pic', res.data)
                $('#material-cont').html(collectHtml)
                renderPage(res.data.total_count)
            }
        })

        /**
         * 给全部按钮点击绑定事件
         */
        $('#allPicBtn').on('click', function () {
            getMaterial()
            $(this).removeClass('layui-btn-primary')
            $(this).addClass('layui-btn-normal')
            $(this).siblings().removeClass('layui-btn-normal')
            $(this).next().addClass('layui-btn-primary')
        })
    })

    /**
     * 添加分页  注册一个分页渲染函数
     */
    function renderPage(total) {
        laypage.render({
            elem: 'renderPage', //注意，这里是 ID，不用加 # 号
            count: total,
            limit: q.per_page, // 每页显示几条数据
            curr: q.page, // 设置默认被选中的分页
            layout: ['page', 'skip'],//数据总数，从服务端得到
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                q.page = obj.curr
                q.per_page = obj.limit
                //首次不执行
                if(!first){
                    getMaterial()
                }
              }
          });
    }

    /**
     * 给点击星星绑定事件委托
     */
    $('body').on('click', '.operate-left', function () {
        
        // console.log($(this).attr('collect')); //获取collect的值
        if ($(this).attr('collect') === 'true') {
            $(this).attr('collect', 'false')
        } else {
            $(this).attr('collect', 'true')
        }
        // console.log($('.operate [collect="true"]') 报错
        
        $('.operate [collect=true]').attr('src', '/images/redstar.png')
        $('.operate [collect=false]').attr('src', '/images/blackstar.png')
        // getMaterial()

        // 获取所有 collect='true'的所有 图片的id
        // console.log($(this).parents('.layui-col-md2-box').attr('data-id'));  // 获取点击的当前的data-id
        // console.log($('[collect=true]'));
        // $('[collect=true]').each(function (index, domele) {
        //     console.log(index);
        //     console.log(domele.dataset.id);
        //     pic.push(domele.dataset.id)
        //     console.log(pic);
            
        // })
        var collect = $(this).attr('collect')     
        // console.log($(this).attr('data-id'));
        var target = $(this).attr('data-id')
        // var objp={
        //     collect: $(this).attr('collect') 
            
        // }
        // console.log(objp);
        
        /**
         * 点击星星触发 请求 
         */
        $.ajax({
            url: `/mp/v1_0/user/images/${target}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                collect: $(this).attr('collect')
            }),
            success: function (res) {
                console.log(res);

                getMaterial()
            }

        })
    })

    /**
     * 点击删除图标 绑定事件
     */
    $('body').on('click', '.operate-right', function () {
        console.log($(this).attr('data-id'));
        var deletePicId = $(this).attr('data-id')
        $.ajax({
            url: `/mp/v1_0/user/images/${deletePicId}`,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (res) {
                getMaterial()
            }
        })
    })

})