// 데이터 추출 함수
if (ObjC.available) {
    console.log("모든 클래스와 메서드를 추출하여 send로 전송합니다...");

    var classNames = Object.keys(ObjC.classes);

    classNames.forEach(function(className) {
        try {
            var cls = ObjC.classes[className];
            var methods = cls.$methods;

            // 클래스와 메서드 정보를 Python으로 전송
            send({ className: className, methods: methods });
        } catch (e) {
            console.error("[!] 클래스 로드 오류: " + className + " - " + e);
        }
    });

    console.log("모든 클래스와 메서드 추출이 완료되었습니다.");
} else {
    console.log("Objective-C가 사용 불가능합니다. 이 스크립트는 iOS에서만 동작합니다.");
}

Thread.sleep(10);