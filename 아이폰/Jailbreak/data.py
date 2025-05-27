import frida
import os
import json



device = frida.get_remote_device()
pid = device.spawn(["app package])  # 앱 ID
session = device.attach(pid)

with open("script.js", "r", encoding="utf-8") as f:
    script_content = f.read()
script = session.create_script(script_content)

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


script.on("message", on_message)
script.load()


device.resume(pid)

input("Enter 키 종료\n")

