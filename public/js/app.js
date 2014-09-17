$(function() {
    $("#addwebhook").click(addWebHook);
});

function addWebHook() {
  alert('hi');

  $.post("/github/addwebhook", {
    repoName : $("#repoName").text()
  })
  .done(function(hook, error) {

  });
}
