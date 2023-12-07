import frida, sys

def on_message(message, data):
    print(message)

process_name = "uncrackable1"

#후킹 대상 함수가 존재하는 클래스 ,well-known 메서드는 공식문서 참고
#현재 클래스를 hook_target 으로 재구성한다.
#종료되는 걸 그냥 로그 찍는걸로 변경
jscode = """
console.log("[+] Start Script");

Java.perform(function(){
    console.log("[+] Hooking System.exit");
    var exitClass = Java.use("java.lang.System"); 
    exitClass.exit.implementation = function(){ 
        console.log("[+] System.exit called"); 
    }
});
"""

process = frida.get_usb_device(1).attach(process_name)#장치에서 패키지에 맞는 프로세스 가져옴
script = process.create_script(jscode)
script.on("message", on_message)
print("[+] Running Hook")
script.load()
sys.stdin.read()


