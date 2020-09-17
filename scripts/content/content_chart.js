$(function () {
  var layer = layui.layer;
  var laypage = layui.laypage;

  //定义查询参数
  var query = {
    // status: null, //文章状态
    // channel_id: null, //频道
    // begin_pubdate: null,//文章发布起始时间
    // end_pubdate: null,//文章发布结束时间
    page: 1, //页数，默认是 1
    per_page: 10, //每页数量，默认每页 10 条
    response_type: "comment", //返回数据字符串
  };

  //渲染页面
  initReview();
  function initReview() {
    $.ajax({
      url: "http://ttapi.research.itcast.cn/mp/v1_0/articles",
      method: "GET",
      data: query,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("hmtoken") || "",
      },
      dataFilter: function (res) {
        // dataFilter 也接收一个参数，是指后台返回的真正的数据
        // 在这个方法内部，默认会将 返回的 res return 给 success
        // 如果程序员自己声明了这个函数，就需要 手动 return res,
        // 数据才能传递给 success

        // 在 res 中全局找 id: 之后的数字，然后进行替换，，增加 ""，使之成为字符串。
        // 使用正则转换以后，那么 id 就变成了 字符串，就不会产生大数字问题
        res = res.replace(/\"id\": (\d+)/g, '"id":"$1"');
        // console.log(res);
        return res;
      },
      success: function (res) {
        // console.log(res);
        // console.log(res.data.results);
        var strhtml = template("text_chart", res.data);
        $("tbody").html(strhtml);
        //调用分页处理函数
        layPage(res.data.total_count);
      },
    });
  }

  //定义评论状态过滤器
  template.defaults.imports.zhuangtai = function (status) {
    if (status === true) {
      return "正常";
    }
    return "关闭";
  };

  //分页处理函数
  function layPage(total) {
    laypage.render({
      elem: "fenBox", //此处不需要加#
      count: total, //数据总条数
      limit: query.per_page, //每页的条数
      curr: query.page, //起始页面
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [10, 15, 25, 40, 50],
      //触发jump的方式有两种
      //1.初始化的时候，调用laypage.render
      //2.切换页码值得时候，会触发
      jump: function (obj, first) {
        query.page = obj.curr;
        // zai jump 回调函数中，可以去到所有配置项的值
        // 所有可以使用 obj.limit 获取到最新的每页显示条数
        query.per_page = obj.limit;
        // console.log(q.pagenum);

        // initTable()  不能直接调用会造成递归，造成死循环

        if (!first) {
          initReview();
        }
      },
    });
  }

  //注册评论按钮切换事件
  $("tbody").on("click", "#btnDiscuss", function () {
    //定义一个空的q对象
    var q = {};
    //获取对应的id值
    var id = $(this).attr("data-id");

    var deleteBtnLen = $("#btnDiscuss").length;

    // console.log($(this).parents('td').siblings('.zt').find('span').html())
    if ($(this).parents("td").siblings(".zt").find("span").html() === "正常") {
      q.allow_comment = false;
    } else if (
      $(this).parents("td").siblings(".zt").find("span").html() === "关闭"
    ) {
      q.allow_comment = true;
    }

    var str = null;
    if (q.allow_comment) {
      str = "打开";
    } else {
      str = "关闭";
    }

    layer.confirm(`确认${str}评论?`, { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        url: `http://ttapi.research.itcast.cn/mp/v1_0/comments/status?article_id=${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(q),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("hmtoken") || "",
        },
        success: function (res) {
          // console.log(res); 此处结果为undefined
          layer.msg(`${str}评论成功`);
          //根据当前页面删除按钮的个数来判断
          //如果按钮的个数>1，说明当前文章个数至少2条，不做处理
          //如果按钮的个数 =1 ，说明当前的文章格式至少有1条，需要做处理
          if (deleteBtnLen === 1) {
            //页码值最少等于1，如果小于1则不需要进行返回上一页
            q.page = q.page === 1 ? 1 : q.page - 1;
          }
          initReview();
        },
      });
      layer.close(index);
    });
  });
});
