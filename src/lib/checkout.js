// דף "לפני שיוצאים": המשימות שהאורחים מסמנים לפני האישור
export const CHECKLIST = [
  'לסגור את כל החלונות ואת דלת המרפסת',
  'לכבות את החשמל בדירה',
  'לכבות את המזגן',
  'לוודא שהמקרר והמקפיא ריקים מכל מזון ושתייה, כולל מוצרים סגורים',
  'לסגור את הגז',
  'להוריד את המצעים שהשתמשתם בהם ולהניח על המיטה',
  'לרוקן את הפח בפח המרכזי שבכניסה למתחם',
];

// הקישור האישי של הזמנה לדף היציאה, באותו אתר שבו האפליקציה פתוחה
export const checkoutLink = (b) => `${location.origin}${location.pathname}?checkout=${b.checkout_token}`;

// קישור ?checkout=... פותח את דף היציאה במקום את האפליקציה
export const checkoutTokenFromUrl = () => new URLSearchParams(location.search).get('checkout');
