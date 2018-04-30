

var addieren = function(a, b){
  if( typeof a == 'undefined') a = 0;
  if(typeof b == 'undefined') b = 0;
  if( typeof a == 'string') a = a.replace(',', '.');
  if( typeof b == 'string') b = b.replace(',', '.');
  if ( isFinite(a)) a *= 1;
  if ( isFinite(b)) b *= 1;
  return a + b;

}
