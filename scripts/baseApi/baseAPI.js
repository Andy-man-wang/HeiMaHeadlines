// 将所有公共部分的代码 或者 资源地址之类的 抽离出来 方便以后统一更改
$.ajaxPrefilter(function (options) {
    // 这函数的调用是 只要我们的js中调用了ajax get post等方法
    // 就会在调用之前先运行这个ajaxPrefilter函数
    options.url = 'http://ttapi.research.itcast.cn' + options.url

    // 因为很接口的权限需设置headers的请求头  前提是有权限判断的时候
    // 所以判断options.url 这个路径里面是否存在/my/ 需要权限的字眼
    options.headers = {
        Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
    }   
})