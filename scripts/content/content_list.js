$(function () {
  var form = layui.form;
  var laydate = layui.laydate;
  var laypage = layui.laypage;

  //定义查询参数
  var q = {
    // status: null, //文章状态
    // channel_id: null, //频道
    // begin_pubdate: null,//文章发布起始时间
    // end_pubdate: null,//文章发布结束时间
    page: 1, //页数，默认是 1
    per_page: 10, //每页数量，默认每页 10 条
    // response_type: '',//返回数据字符串
  };

  laydate.render({
    elem: "#test1",
    range: "到",
    format: "yyyy-M-d",
    done: function (value, date, endDate) {
      if (!value) {
        delete q.begin_pubdate;
        delete q.end_pubdate;
        return;
      }

      q.begin_pubdate =
        date.year + "-" + padZero(date.month) + "-" + padZero(date.date);
      q.end_pubdate =
        endDate.year +
        "-" +
        padZero(endDate.month) +
        "-" +
        padZero(endDate.date);
    },
  });

  //定义一个补零函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  initTable();
  //渲染查询列表结果处理函数
  function initTable() {
    $.ajax({
      url: "http://ttapi.research.itcast.cn/mp/v1_0/articles",
      method: "GET",
      data: q,
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
        $("#jieguo").html(res.data.total_count);
        var strhtml = template("text_list", res.data);
        $("tbody").html(strhtml);
        //调用分页处理函数
        rendPage(res.data.total_count);
      },
    });
  }

  //定义图片过滤器
  template.defaults.imports.coverimages = function (img) {
    if (img.length === 0) {
      return "/assets/backgrounds/error.gif";
    }
    return img[0];
  };

  //定义文章审核状态过滤器
  template.defaults.imports.shenhe = function (status) {
    if (status === 0) {
      return "草稿";
    } else if (status === 1) {
      return "待审核";
    } else if (status === 2) {
      return "审核通过";
    } else if (status === 3) {
      return "审核失败";
    } else if (status === 4) {
      return "已删除";
    }
  };

  //渲染频道处理函数
  channel();
  function channel() {
    $.ajax({
      url: "http://ttapi.research.itcast.cn/mp/v1_0/channels",
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("hmtoken") || "",
      },
      success: function (res) {
        // console.log(res);
        var strhtml = template("pindao", res.data);
        $("select").html(strhtml);
        form.render();
      },
    });
  }

  //监听单选状态
  form.on("radio(ridio)", function (data) {
    // console.log(data.value); //被点击的radio的value值
    if (!data.value) {
      return delete q.status;
    }
    q.status = data.value;
    //   initTable()
  });

  //   监听下拉框中的值
  form.on("select(filter)", function (data) {
    console.log(data.value); //得到被选中的值
    if (!data.value) {
      return delete q.channel_id;
    }
    q.channel_id = data.value;
    //   initTable()
  });

  //注册筛选按钮事件
  $("#sizer").on("submit", function (e) {
    //阻止表单默认提交行为
    e.preventDefault();
    initTable();
  });

  //分页处理函数
  function rendPage(total) {
    laypage.render({
      elem: "pageBox", //此处不需要加#
      count: total, //数据总条数
      limit: q.per_page, //每页的条数
      curr: q.page, //起始页面
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [10, 15, 25, 40, 50],
      //触发jump的方式有两种
      //1.初始化的时候，调用laypage.render
      //2.切换页码值得时候，会触发
      jump: function (obj, first) {
        q.page = obj.curr;
        // zai jump 回调函数中，可以去到所有配置项的值
        // 所有可以使用 obj.limit 获取到最新的每页显示条数
        q.per_page = obj.limit;
        // console.log(q.pagenum);

        // initTable()  不能直接调用会造成递归，造成死循环

        if (!first) {
          initTable();
        }
      },
    });
  }

  //注册点击修改按钮页面跳转
  $("tbody").on("click", "btnicon1", function () {
    location.href = "/admin/content/art_pub.html";
  });

  //注册点击删除文章事件
  $("tbody").on("click", ".btnicon2", function () {
    //获取对应的id值
    var id = $(this).attr("data-id");
    var deleteBtnLen = $(".btnicon2").length;

    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        url: `http://ttapi.research.itcast.cn/mp/v1_0/articles/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("hmtoken") || "",
        },
        success: function (res) {
          // console.log(res); 此处结果为undefined
          layer.msg("删除文章成功");
          //根据当前页面删除按钮的个数来判断
          //如果按钮的个数>1，说明当前文章个数至少2条，不做处理
          //如果按钮的个数 =1 ，说明当前的文章格式至少有1条，需要做处理
          if (deleteBtnLen === 1) {
            //页码值最少等于1，如果小于1则不需要进行返回上一页
            q.page = q.page === 1 ? 1 : q.page - 1;
          }

          initTable();
        },
      });

      layer.close(index);
    });
  });
});
