// מחלקות מלאות (לא מורכבות דינמית) כדי ש-Tailwind יזהה אותן בסריקה
export const STATUS = {
  scheduled:   { label: 'מתוכנן',        cls: 'bg-[#F5EFEB] text-[#7D4F35]' },
  checked_in:  { label: 'בדירה',         cls: 'bg-[#EBF1EC] text-[#2E4A35]' },
  checked_out: { label: 'ממתין לניקיון', cls: 'bg-[#FBEAE5] text-[#944230]' },
  cleaned:     { label: 'נוקה ומוכן',    cls: 'bg-[#EFF3F0] text-[#5C7A66]' },
};

// הסטטוס הבא בכפתור העדכון המהיר
export const NEXT_STATUS = {
  scheduled:   { to: 'checked_in',  label: 'סימון: הגיעו' },
  checked_in:  { to: 'checked_out', label: 'סימון: עזבו' },
  checked_out: { to: 'cleaned',     label: 'סימון: נוקה' },
};
