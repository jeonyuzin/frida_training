
var context;

var awaitForCondition = function (callback) {
  var int = setInterval(function () { //반복시작
    context = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();
      if (context != NULL) {
          clearInterval(int); //clear로 반복 종료
          callback(context);
          return;
      }
  }, 0);
}
setImmediate(function() {
  Java.perform(function () {



    var Activity = Java.use("android.app.Activity");
    var main_activity = Java.use('com.example.final_test.MainActivity');
	var game = Java.use('com.example.final_test.Game');
    /*var lastActivity = "";
    Activity.onResume.implementation = function () {
        lastActivity = String(Java.retain(this));
        this.onResume();
        console.log("activity : " + lastActivity);
    };*/
    Activity.startActivity.overload('android.content.Intent').implementation=function(p1){
      console.log("Hooking android.app.Activity.startActivity(p1) successfully,p1="+p1);
      console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
      console.log(decodeURIComponent(p1.toUri(256)));
      this.startActivity(p1);
    };

    awaitForCondition((baseAddr)=>{ //콜백 하지 않으면 메인 엑티비티가 올라오기전에 호출 시 에러 발생한다.
      console.log("STARTING HOOK ");
      
      var intentClazz = Java.use("android.content.Intent");
      var activityClazz = Java.use("com.example.final_test.Game");
      var intentObj = intentClazz.$new(context, activityClazz.class);
      intentObj.setFlags(0x10000000);
      context.startActivity(intentObj);
      console.log("startActivity");

    });
  });
});