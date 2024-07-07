setImmediate(function() {
	Java.perform(function() {
		//Challenge 01
		// 해당 클래스 객체를 받아오기 위해 이 객체를 다루겠다
		var chall_01 = Java.use("uk.rossmarks.fridalab.challenge_01");
		// chall_01 클래스 내에 있는 chall01 변수에 접근
		// javascript property 중 value 사용
		chall_01.chall01.value = 1;
		console.log("clear chall01"+chall_01.chall01);
		
		
		
		//호출할 함수는 chall02  instance method vs static metohd?
		//Java.use는 인스턴스화된 객체를 찾는것이아니기때문에 choose를 써야함 ,
		//만약에 static 메소드면 Java.use를 사용해서 바로 받으면 됨. ★★
		//인스턴스화된 객체를 받아서 찾은 객체들을 aa로 받음
		//onResume을 후킹하면 onCreate 이후의 동작을 보장
		Java.choose("uk.rossmarks.fridalab.MainActivity", {
			onMatch: function(instance) {
				instance.chall02(); 
				console.log(instance.completeArr.value);
			},
			onComplete: function() {
				console.log("clear Chall02");
			}
		});

		//메소드 재작성은 use
		var chall_03=Java.use("uk.rossmarks.fridalab.MainActivity");
		chall_03.chall03.implementation=function(){
			return true;
		}

		//chall04를 호출하면서 문자열 인자값을 넘겨주어야함.
		Java.choose("uk.rossmarks.fridalab.MainActivity",{
			onMatch: function(chall_04){
				console.log("frida string found");
				chall_04.chall04("frida");
			},
			onComplete: function(){
				console.log("clear chall04");
			}
		});


		//chall05 항상 frida로 넘기기 , 원본 chall05를 수정하지않고
		var chall_05=Java.use("uk.rossmarks.fridalab.MainActivity");
		//같은메소드여도 다른게 있을 수 있기때문에 정확히 지정해야함
		//public void chall05(String str) 인자타입과 1개의 인자를 받으므로 arg1
		chall_05.chall05.overload("java.lang.String").implementation=function(arg1){
			this.chall05("frida"); //chall05를 탈 때마다 chall05라는 원본 메소드를 사용 대신에 값은 frida로 넘김
			console.log("clear chall05");
		};


		//use와 choose를 사용해서 올바른 값 입력하기
		var chall_07=Java.use("uk.rossmarks.fridalab.challenge_07");
		Java.choose("uk.rossmarks.fridalab.MainActivity",{
			onMatch: function(instance){
				for(var i=9999; i>=1000; i--){
					var int_to_string=String(i);
					if(chall_07.check07Pin(int_to_string)){
						instance.chall07(int_to_string);
						break;
					}
				}
			},
			onComplete: function(){
				console.log("clear chall 07");
			}
		})
		
		//chall08 버튼 이름 바꾸기
		//public boolean chall08() {
//			return ((String) ((Button) findViewById(R.id.check)).getText()).equals("Confirm");
//		}
		var klass=Java.use("android.widget.Button");
		Java.choose("uk.rossmarks.fridalab.MainActivity",{
			onMatch: function(instance){ //R.id ~~바로 못가져와서 실제 숫자(값)가져옴
				//
				var checkid=instance.findViewById(0x7f07002f);
				var check=Java.cast(checkid,klass)
				var string=Java.use("java.lang.String");
				check.setText(string.$new("Confirm")); //check.setText("Confirm"); 그냥 쓰면 에러 
				//new 클래스는 객체를 생성함.
			},
			onComplete: function(){
				console.log("clear chall08");
			}
		});
	});
});

//chall06 i==chall06 , 10sec뒤
//방법1.10ch뒤 chall06을 구해서 입력해줌
//방법2.confirmChall06(int i)함수에 인자로 chall06을 넘겨줌
//
setTimeout(function(){
    console.log("sec 10 start chall06");
    setImmediate(function(){
        Java.perform(function(){
            var chall_06 = Java.use("uk.rossmarks.fridalab.challenge_06");
            chall_06.addChall06.overload("int").implementation = function(arg){
                Java.choose("uk.rossmarks.fridalab.MainActivity", {
                    onMatch: function(instance){
                        instance.chall06(chall_06.chall06.value); // i에 chall06의 값이 들어감
                    },
                    onComplete: function(){
                        console.log("clear chall06");
                    }
                });
            };
        });
    });
}, 10000);



