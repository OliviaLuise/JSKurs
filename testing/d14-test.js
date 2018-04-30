QUnit.test('mein erster Test', function(assert){
  assert.ok(1=='1', 'automatische Typumwandlung');
});

QUnit.test('zahlen addieren', function(assert){
  assert.ok(typeof addieren == 'function', 'Funktion gibt es');
  assert.equal(addieren(1,2), 3, 'Zahlen addieren');
  assert.equal(addieren('1', '2'), 3, 'Addieren mit Typumwandlung');
  assert.equal(addieren('a','b'), 'ab', 'nicht numerische Werte werden verkettet');
  assert.equal(addieren('1,5', 1.2), 2.7, 'Komma mit Punkt und Beistrich möglich');
  assert.equal(addieren(), 0, 'Funktion ohne Parameter');
});
