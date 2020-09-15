$(function(){
  var layer = layui.layer
  
$('#btnLogout').click(function(){
  
  layer.confirm('是否退出?', {icon: 3, title:'提示'}, function(index){
    //do something
    localStorage.removeItem('token')
    // 2.跳转到登录页面
    location.href = "/login.html"
    
    layer.close(index);
  });
})

})