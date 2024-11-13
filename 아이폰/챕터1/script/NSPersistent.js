if (ObjC.available) {
  try {
      var coordinatorClass = ObjC.classes.NSPersistentStoreCoordinator;

      // NSPersistentStoreCoordinator 초기화 및 호출
      var instance = coordinatorClass.alloc().init();
      console.log("NSPersistentStoreCoordinator instance: " + instance);

  } catch (error) {
      console.error("오류 발생: " + error.message);
  }
} else {
  console.log("Objective-C 런타임을 사용할 수 없습니다.");
}

Interceptor.attach(ObjC.classes.NSPersistentStoreCoordinator["- addPersistentStoreWithType:configuration:URL:options:error:"].implementation, {
  onEnter: function (args) {
      console.log("[*] Persistent Store Type: " + ObjC.Object(args[2]).toString());
      console.log("[*] Store URL: " + ObjC.Object(args[4]).toString());
  }
});
