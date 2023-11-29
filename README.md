# 프리다란?
Ole가 개발한 DBI(Dynamic Binary Instrumentation)
프레임 워크로, 프로세스를 모니터(추적, 분석) 및 디버깅하는 데 
사용할 수 있는 툴킷

# 프리다 특징
- 다양한 플랫폼에서 프로세스에 대한 인젝션이 가능해 큰 확장성을 가짐
- 윈도우, 맥OS, GNU/Linux, iOS, Android 및 QNX에서 자바스크립트를
네이티브 앱(공식 스토어를 통해 받은 앱)에 삽입 가능

 

 

# 프리다 주요 기능
- AppMon과 Needle 등의 도구에서 프리다를 기반으로 사용
: AppMon은 맥 OS, iOS 및 안드로이드에서 기본 앱의 시스템 API 호출을
모니터링하고 변경하는 자동화된 프레임 워크
: Needle 2016년 8월 블랙햇 USA에서 출시된 iOS 보안 테스팅 프레임 워크
: 안드로이드의 드로저와 비슷한 도구

 

- 함수 후킹 (특정 함수에 연결하여 반환 값 변경, 함수 재작성(로그출력, 내부로직 변경) 등)
- 애플리케이션 디버깅 가능
- 힙 메모리 내 객체 인스턴스 검색 및 사용
- 실시간 트래픽 스니핑 또는 암호 해독
- 탈옥 또는 루팅 되지 않은 단말기에서도 사용 가능


# 설치 목록 및 방법
녹스앱플레이어 +adb환경설정

(루팅된 단말기를 사용하는 경우 adb설정만)

-파이썬 

-프리다 설치

-프리다 서버


녹스 기준 root켜기 체크
녹스 설치 폴더 \bin 에 간편사용을 위해 환경변수 설정

루팅된 폰의 경우 usb디버깅 껐다가 키기


프리다 설치
pip install frida-tools


이후 adb shell 환경에서
getprop ro.product.cpu.abi
통해 버전을 확인후
https://github.com/frida/frida/releases에 가서
frida-server-버전-android-arm 혹은 x86_64인데
일반 녹스 기준 x86_64였음


adb push frida-server /data/local/tmp
를 통해 서버파일 푸쉬


권한 변경 후 
./frida-server & 백그라운드 실행 (편의상)


포트 사용중이면 kill 후 다시 가동



다시 frida-tools이 설치된 CLI로 돌아와서
frida-ps -U
하면 연결되어있는 디바이스의  프로세스가 보인다.


