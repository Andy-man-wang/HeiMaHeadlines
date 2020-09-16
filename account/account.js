$(function() {
    var layer = layui.layer
    var form = layui.form
    $('#w_click').on('click', function() {
        $('#w_td').hide()
        $('#w_form').show()
    })
    $('#W_ck').on('click', function() {
        $('#W_bl').hide()
        $('#w_form2').show()
    })
    $('#cancel').on('click', function() {
        $('#w_td').show()
        $('#w_form').hide()
    })
    $('#w_ei').on('click', function() {
        $('#W_bl').show()
        $('#w_form2').hide()
    })
    $('#picture').on('click', function() {
        layer.open({
            title: '上传头像',
            type: 1,
            content: $('#w_icon').html(),
            area: ['800px', '370px'],
            btn: ['确认', '取消'],
            yes: function(index, layero) {
                $.ajax({
                    method: 'PATCH',
                    url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/photo',
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('hmtoken')
                    },
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        console.log(res);
                        xuanran()
                    }
                })
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });

    })
    $('body').on('click', '.w_ic', function(e) {
        $('#w_file').click()
    })
    xuanran()

    function xuanran() {
        $.ajax({
            method: 'GET',
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            contentType: 'application/json',
            success: function(res) {
                console.log(res);
                $('#w_td dt').html(res.data.name)
                $('#w_td dd').html(res.data.intro)
                $('.w_nl').html(res.data.id)
                $('.w_tb').html(res.data.mobile)
                $('#W_bl span').html(res.data.email)
                $('.w_tx').attr('src', res.data.photo)
                $('#ipt').val(res.data.name)
                $('#put').val(res.data.intro)
                $('.ppt').val(res.data.email)
            }
        })
    }
    $('body').on('change', '#w_file', function(e) {
        var files = e.target.files
        console.log(files);
        if (files.length === 0) {
            return
        }
        fd = new FormData()
        fd.append('photo', files[0])
        var newImgURL = URL.createObjectURL(files[0])
        $('.w_pp img').attr('src', newImgURL)
        $('.w_pp').show()
    })


    $('#w_name').on('submit', function(e) {
        e.preventDefault()
        acconet()
    })

    function acconet() {
        var jps = JSON.stringify(form.val('formUserInfo'))
        console.log(jps);
        $.ajax({
            method: 'PATCH',
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            contentType: 'application/json',
            data: jps,
            success: function(res) {
                console.log(res);
                $('#cancel').click()
                xuanran()
            }
        })
    }
    $('#hls').on('submit', function(e) {
        e.preventDefault()
        var jpt = JSON.stringify(form.val('ltgb'))
        console.log(jpt);
        $.ajax({
            method: 'PATCH',
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            contentType: 'application/json',
            data: jpt,
            success: function(res) {
                console.log(res);
                $('#w_ei').click()
                xuanran()
            }
        })
    })
})