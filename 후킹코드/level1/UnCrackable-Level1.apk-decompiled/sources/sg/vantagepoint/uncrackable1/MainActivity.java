package sg.vantagepoint.uncrackable1;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import owasp.mstg.uncrackable1.R;
import sg.vantagepoint.a.b;
import sg.vantagepoint.a.c;
/* loaded from: classes.dex */
public class MainActivity extends Activity {
    private void a(String str) {
        AlertDialog create = new AlertDialog.Builder(this).create(); //create 객체 알림 대화 상자
        create.setTitle(str); 
        create.setMessage("This is unacceptable. The app is now going to exit.");
        create.setButton(-3, "OK", new DialogInterface.OnClickListener() { // from class: sg.vantagepoint.uncrackable1.MainActivity.1
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i) {
                System.exit(0); // 종료시키는 이 부분을 후킹으로 변조하면 종료를 막을 수 있다.
            }
        });
        create.setCancelable(false);
        create.show();
    }

    @Override // android.app.Activity
    protected void onCreate(Bundle bundle) { //생명주기상 먼저 실행됨
        if (c.a() || c.b() || c.c()) { //sg.vantagepoint.a.c에 메소드를 이용하여 조건문을 이용하여 루팅 감지
            a("Root detected!"); // void a 호출 즉 루트 감지로 종료됨.
        }
        if (b.a(getApplicationContext())) {  //sg.vantagepoint.a.b 조건문을 이용하여 디버깅 탐지
            a("App is debuggable!"); //void a호출 즉 디버깅 감지로 종료됨
        }
        super.onCreate(bundle);
        setContentView(R.layout.activity_main);
    }

    public void verify(View view) {
        String str;
        String obj = ((EditText) findViewById(R.id.edit_text)).getText().toString();
//텍스트필드의 값을 가져옴
        AlertDialog create = new AlertDialog.Builder(this).create();
        if (a.a(obj)) { //이 부분이 항상 참이면 뚫림 어떻게 해야할까?
            create.setTitle("Success!");
            str = "This is the correct secret.";
        } else {
            create.setTitle("Nope...");
            str = "That's not it. Try again.";
        }
        create.setMessage(str);
        create.setButton(-3, "OK", new DialogInterface.OnClickListener() { // from class: sg.vantagepoint.uncrackable1.MainActivity.2
        //DialogInterface.OnClickListener 버튼 클릭 처
            @Override // android.content.DialogInterface.OnClickListener
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss(); //대화상자 제거 
            }
        });
        create.show();
    }
}
