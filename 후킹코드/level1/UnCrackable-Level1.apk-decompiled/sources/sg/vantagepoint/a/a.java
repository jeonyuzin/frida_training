package sg.vantagepoint.a;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
/* loaded from: classes.dex */
public class a {
    public static byte[] a(byte[] bArr, byte[] bArr2) {
        SecretKeySpec secretKeySpec = new SecretKeySpec(bArr, "AES/ECB/PKCS7Padding"); //비밀키 명세 및 생
        Cipher cipher = Cipher.getInstance("AES"); //chiper 암호화 복호화하는 클래스  ,변환 알고리즘만 명
        
        //https://docs.oracle.com/javase/8/docs/api/constant-values.html#javax.crypto.Cipher.WRAP_MODE    
        cipher.init(2, secretKeySpec); //복호화 시작

       
        return cipher.doFinal(bArr2); //Cipher 객체 초기화 후 실제 작업(암호화, 복호화)을 수행하기 위해 doFinal()메서드 호출
        //문자 리턴  
        //후킹 포인트2 원본 값 출력
    }
}
