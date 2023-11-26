package sg.vantagepoint.uncrackable1;

import android.util.Base64;
import android.util.Log;
/* loaded from: classes.dex */
public class a {
    public static boolean a(String str) {
        byte[] bArr;
        byte[] bArr2 = new byte[0];
        try {
            bArr = sg.vantagepoint.a.a.a(b("8d127684cbc37c17616d806cf50473cc"), Base64.decode("5UJiFctbmgbDoLXmpL12mkno8HT4Lv8dlat8FxR2GOc=", 0));
        } catch (Exception e) {
            Log.d("CodeCheck", "AES error:" + e.getMessage());
            bArr = bArr2;
        }
        return str.equals(new String(bArr)); //입력한 문자열과 복호화된 문자열이 같으면 정답  이게 true면 항상 뚤림
        // 후킹 포인트 1 항상 
    }

    public static byte[] b(String str) {
        int length = str.length(); //길이 받아서
        byte[] bArr = new byte[length / 2]; //length /2 만큼의 byte배열 생성 
        for (int i = 0; i < length; i += 2) { //2씩증
            bArr[i / 2] = (byte) ((Character.digit(str.charAt(i), 16) << 4) + Character.digit(str.charAt(i + 1), 16));
        }                         //(기수 연산 후 쉬프트 연산) + (다음 문자, 전자와 같은 방) 
        return bArr; //byte배열 리턴
    }
}
