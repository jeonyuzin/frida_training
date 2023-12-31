package android.support.v7.widget;

import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.support.v4.a.a.b;
import android.util.AttributeSet;
import android.util.TypedValue;
/* loaded from: classes.dex */
public class aw {
    private final Context a;
    private final TypedArray b;
    private TypedValue c;

    private aw(Context context, TypedArray typedArray) {
        this.a = context;
        this.b = typedArray;
    }

    public static aw a(Context context, int i, int[] iArr) {
        return new aw(context, context.obtainStyledAttributes(i, iArr));
    }

    public static aw a(Context context, AttributeSet attributeSet, int[] iArr) {
        return new aw(context, context.obtainStyledAttributes(attributeSet, iArr));
    }

    public static aw a(Context context, AttributeSet attributeSet, int[] iArr, int i, int i2) {
        return new aw(context, context.obtainStyledAttributes(attributeSet, iArr, i, i2));
    }

    public float a(int i, float f) {
        return this.b.getFloat(i, f);
    }

    public int a(int i, int i2) {
        return this.b.getInt(i, i2);
    }

    public Typeface a(int i, int i2, b.a aVar) {
        int resourceId = this.b.getResourceId(i, 0);
        if (resourceId == 0) {
            return null;
        }
        if (this.c == null) {
            this.c = new TypedValue();
        }
        return android.support.v4.a.a.b.a(this.a, resourceId, this.c, i2, aVar);
    }

    public Drawable a(int i) {
        int resourceId;
        return (!this.b.hasValue(i) || (resourceId = this.b.getResourceId(i, 0)) == 0) ? this.b.getDrawable(i) : android.support.v7.b.a.b.b(this.a, resourceId);
    }

    public void a() {
        this.b.recycle();
    }

    public boolean a(int i, boolean z) {
        return this.b.getBoolean(i, z);
    }

    public int b(int i, int i2) {
        return this.b.getColor(i, i2);
    }

    public Drawable b(int i) {
        int resourceId;
        if (!this.b.hasValue(i) || (resourceId = this.b.getResourceId(i, 0)) == 0) {
            return null;
        }
        return l.a().a(this.a, resourceId, true);
    }

    public int c(int i, int i2) {
        return this.b.getInteger(i, i2);
    }

    public CharSequence c(int i) {
        return this.b.getText(i);
    }

    public int d(int i, int i2) {
        return this.b.getDimensionPixelOffset(i, i2);
    }

    public String d(int i) {
        return this.b.getString(i);
    }

    public int e(int i, int i2) {
        return this.b.getDimensionPixelSize(i, i2);
    }

    public ColorStateList e(int i) {
        int resourceId;
        ColorStateList a;
        return (!this.b.hasValue(i) || (resourceId = this.b.getResourceId(i, 0)) == 0 || (a = android.support.v7.b.a.b.a(this.a, resourceId)) == null) ? this.b.getColorStateList(i) : a;
    }

    public int f(int i, int i2) {
        return this.b.getLayoutDimension(i, i2);
    }

    public CharSequence[] f(int i) {
        return this.b.getTextArray(i);
    }

    public int g(int i, int i2) {
        return this.b.getResourceId(i, i2);
    }

    public boolean g(int i) {
        return this.b.hasValue(i);
    }
}
