package sg.vantagepoint.a;

import android.os.Build;
import java.io.File;
/* loaded from: classes.dex */
public class c {
    public static boolean a() {
        //환경변수에 su(switch user)가 있으면 트루를 보내고 조건문에 걸
        for (String str : System.getenv("PATH").split(":")) {
            if (new File(str, "su").exists()) {
                return true;
            }
        }
        return false;
    }

    public static boolean b() {
        String str = Build.TAGS;
        return str != null && str.contains("test-keys"); // 안드로이드 apk추출시 키 작성
        //테스트 키는 개발자가 생성한 사용자 지정 키로 생성되었음을 의미하고
        //android.os.Build.Build.TAGS; 로 접근가능
        //없거나 개발자가 생성한 키가 아니면 걸
    }

    public static boolean c() {
        //리눅스와 안드로이드에서 사용가능한 루팅파일 및 
        //공부가 더 필요한 부
        //문제는 우회가 가능하다
        //Superuser.apk를 Superuser1.apk로 전환하면 우회됨.
        for (String str : new String[]{"/system/app/Superuser.apk", "/system/xbin/daemonsu", "/system/etc/init.d/99SuperSUDaemon", "/system/bin/.ext/.su", "/system/etc/.has_su_daemon", "/system/etc/.installed_su_daemon", "/dev/com.koushikdutta.superuser.daemon/"}) {
            if (new File(str).exists()) {
                return true;
            }
        }
        return false;
    }
}
