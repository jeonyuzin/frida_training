
 var awaitForCondition = function (callback) {
     var int = setInterval(function () { //반복시작
         var addr = Module.findBaseAddress('libfoo.so');
         if (addr) {
             console.log("SO Address found:", addr);
             clearInterval(int); //clear로 반복 종료
             callback(addr);
             return;
         }
     }, 0);
 }
setImmediate(function() {
    Java.perform(function() {
        var root_bypass=Java.use("java.lang.System"); //level1과 같이 루트, 디버깅 우회
        root_bypass.exit.implementation = function(arg){ 
            console.log("root pass");
        }

         // 현재 Async task에서 Debug.isDebuggerConnected()를 계속 탐지하고 있다.
        var Debug = Java.use("android.os.Debug");
        Debug.isDebuggerConnected.implementation = function(){
            return false;
        }
        
        awaitForCondition((baseAddr)=>{
          console.log("STARTING HOOK ");
          
          Interceptor.attach(Module.findExportByName("libfoo.so","strncmp"),{ //주소값을 알때
            onEnter: function(args){ //그냥 호출하면 값이 엄청 많이 나온다.
              //따라서 strncmp(a,b,n) 의 인자 3개에서  입력값이 a로전달되는지 b로되는지 판단 후 조건문을 변경
              var param1 = Memory.readUtf8String(args[0]);
              var param2 = Memory.readUtf8String(args[1]);
              if (param1.indexOf("qwerasdfzxcvuipojkl;nm,")!==-1){ //없으면 -1  있으면 위치값반환 23자리여야함.
                console.log("첫번째인자 "+ param1);
                console.log("두번째인자" +param2);
              }
        },
            onLeave: function(){}
          })
          
        });
      
      
    });
  });