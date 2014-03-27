StartTest(function(t) {
	document.body.innerHTML = '<input id="foo" type="text" value="Default" />';
	var field = document.getElementById('foo');

	t.chain(
		function(next) {
			t.selectText(field);
			t.type(field, 'Replacement', next);
		},
		function() {
			t.is(field.value, 'Replacement', 'Selecting text and typing replaces original value.');
		}
	);
});