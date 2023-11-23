setImmediate(function () { 
    /*setImmdediate 이벤트  주기 끝에 코드를 실행
    현재 이벤트 루프의 모든 입출력 작업 후 다음 이벤트 루프에 스케줄링된
    모든 타이머 이전에 실행된다. */
    Java.perform(function () { 
        var root_bypass=Java.use("java.lang.System"); //자바를 다루기 위한 Frida 함수
        root_bypass.exit.implementation = function(arg){ //System.exit(0)가 있는 메소드를 대체한다.
            console.log("root pass");
        }


        console.log("중간");

        /*
        //항상 트루로 우회
        var all_true=Java.use("sg.vantagepoint.uncrackable1.a");
        all_true.a.implementation= function(arg1){
            return true;
        }
        */

        //아스키 값 알아내기
        var decryptClass = Java.use("sg.vantagepoint.a.a");//이 클래스파일에서
		decryptClass.a.implementation = function(arg1, arg2){ //a메소드를 재구현 인자는 맞춰줘야함.
			var secret_string = this.a(arg1, arg2);
			console.log("\n[+] Secret String ASCII 값 :"+ secret_string + "\n");
			for(var i=0; i<secret_string.length; i++){
				console.log("[+] Secret String 값 :"+ String.fromCharCode(secret_string[i]));
			}
			return secret_string;
		}
    })



});