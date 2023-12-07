package sg.vantagepoint.uncrackable2;
/* loaded from: classes.dex */
public class CodeCheck {
    private native boolean bar(byte[] bArr); 
    //native 는 임의 어셈블리 코드를 사용하여 컴파일된 동적으로 로드된 라이브러리를 호출 가
    //JNI(Java Native Interface)로 자바코드에서 다른 언어들로 작성된 라이브러리를 호출하거나 반대로 호출되게 하는 프레임워크이다.
    public boolean a(String str) { 
        return bar(str.getBytes());//main에 verify에게 리턴
    }
}
