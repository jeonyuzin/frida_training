if (ObjC.available) {
    // 클래스 정의 가져오기
    var CouchbaseLiteViewController = ObjC.classes._TtC7DVIA_v227CouchbaseLiteViewController;

    if (CouchbaseLiteViewController) {
        // 메서드 후킹
        Interceptor.attach(
            CouchbaseLiteViewController["- couchbaseUserName"].implementation,
            {
                onEnter: function (args) {
                    console.log("[*] couchbaseUserName 메서드 진입");
                },
                onLeave: function (retval) {
                    console.log("[*] 반환된 값: " + ObjC.Object(retval).toString());
                }
            }
        );
    } else {
        console.error("[!] 클래스가 로드되지 않았습니다.");
    }
} else {
    console.error("[!] Objective-C 런타임을 사용할 수 없습니다.");
}
