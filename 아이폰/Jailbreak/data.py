import frida
import os
import json



# 원격 iOS 장치에 연결
device = frida.get_remote_device()
pid = device.spawn(["com.kbstar.kbbank"])  # 앱 ID
session = device.attach(pid)

# 스크립트 파일 로드
with open("script.js", "r", encoding="utf-8") as f:
    script_content = f.read()
script = session.create_script(script_content)

# 수신된 데이터를 파일로 저장하는 함수
def on_message(message, data):
    if message["type"] == "send":
        payload = message["payload"]
        class_name = payload["className"]
        methods = payload["methods"]
        class_dir = os.path.join(os.getcwd(), class_name)
        os.makedirs(class_dir, exist_ok=True)
        # 클래스 이름을 파일명으로 사용하여 메서드 저장
        with open(os.path.join(class_dir, f"{class_name}_methods.txt"), 
                  "w", encoding="utf-8") as file:
            file.write(f"클래스: {class_name}\n")
            for method in methods:
                file.write(f"메서드: {method}\n")
                
    elif message["type"] == "error":
        print(f"에러 발생: {message['stack']}")

# Frida 스크립트와 Python의 메시지 핸들러 연결
script.on("message", on_message)
script.load()

# 앱 실행
device.resume(pid)

# 스크립트가 실행되는 동안 대기
input("Enter 키를 눌러 종료합니다...\n")

