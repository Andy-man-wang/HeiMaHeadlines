$(function() {
    var layer = layui.layer
    var form = layui.form
        // 初始化富文本编辑器
    initEditor()
    initCate()
        //
        // $('#pic').on('click', function() {
        //     layer.open({
        //         type: 1,
        //         area: ['800px', '800px'],
        //         title: false,
        //         shadeClose: true,
        //         content: $('#dialog-add').html()
        //     })
        // })
    var query = {
            type: 1,
            images: []
        }
        // $('body').on('click', '#chooseFirst', function() {
        //         $('#file').click()
        //     })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件  
    // $('body').on('change', '#file', function(e) {
    //         e.preventDefault()
    //         var imgFiles = e.target.files[0]
    //         var imgfd = new FormData()
    //         imgfd.append('image', imgFiles)
    //         $.ajax({
    //             method: 'POST',
    //             url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
    //             contentType: false,
    //             processData: false,
    //             data: imgfd,
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('token')
    //             },
    //             success: function(res) {
    //                 if (res.message !== 'OK') {
    //                     return layer.msg('上传失败')
    //                 }
    //                 query.images.push(res.data.url)
    //             }
    //         })
    //     })



    //不加弹出层
    $('#test1').on('click', function() {
        $('#filter').click()
    })
    $('#filter').on('change', function(e) {
            // e.preventDefault()
            console.log(e.target);

            var imgFiles = e.target.files[0]
            var imgfd = new FormData()
            imgfd.append('image', imgFiles)
            $.ajax({
                method: 'POST',
                url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
                contentType: false,
                processData: false,
                data: imgfd,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
                },
                success: function(res) {
                    console.log(res);

                    if (res.message !== 'OK') {
                        return layer.msg('上传失败')
                    }
                    layer.msg('上传成功')
                        // console.log(123);
                        // query.images.push(res.data.url)
                    $('.cover').prop('src', res.data.url)
                }
            })
        })
        // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 获取下拉频道 渲染数据
    function initCate() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/channels',
            type: 'get',
            success: function(res) {
                // console.log(res);
                if (res.message !== 'OK') {
                    return layer.msg(res.message)
                }
                var strHtml = template('tpl-cate', res)
                    // console.log(strHtml);

                $('[name=cate_id]').html(strHtml)
                form.render()
            }
        })
    }
    //定义发布按钮 渲染数据

    //定义文章发布状态
    var art_draft = 'ture'
        //为草稿绑定点击事件
    $('#btnSave2').on('click', function() {
            art_draft = 'false'
        })
        //为表单定义一个submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            //准备数据
        var content = tinyMCE.activeEditor.getContent()
        var fd = {
            //接口要的值 我们手动添加上
            title: $('[name=title]').val(),
            content: content,
            channel_id: $('[name=cate_id]').val() - 0,
            //文章状态
            draft: art_draft,
            cover: {
                type: 1,
                images: [$('.cover').prop('src')],
            }
        }
        console.log(fd);

        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/articles',
            type: 'post',
            headers: {
                //将返回过来色数据拼接一个'Bearer '
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            //后端的数据类型是JASON数据
            contentType: 'application/json',
            data: JSON.stringify(fd), //向服务器传数据 但是服务器需要的是json数据
            success: function(res) {
                if (res.message !== 'OK') {
                    return layer.msg(res.message)
                }
                layer.msg('文章发表成功')
                    // location.href = '/'
            }
        })
    })
})