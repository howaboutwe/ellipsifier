describe('Ellipsifier', function () {
  beforeEach(function() {
    results = function(text, charLimit, opts) {
      var ellipsifier = new Ellipsifier(text, charLimit, opts);
      return ellipsifier.result;
    }
  });

  it('trims a string to the given character limit and appends an ellipsis', function () {
    expect(results('to be or not to be', 5)).toEqual('to be&nbsp;&hellip;');
  });

  it('returns the string unmodified if the given character limit is not reached', function () {
    expect(results('to be or not to be', 50)).toEqual('to be or not to be');
  });

  it('optionally adds an ellipsis class', function() {
    expect(
      results('to be or not to be', 5, {class: 'ellipsified'})
    ).toEqual('to be&nbsp;<span class=\'ellipsified\'>&hellip;</span>');
  });

  it("doesn't count HTML markup as part of the char limit", function() {
    expect(
      results('to <strong>be or</strong> not to be', 20)
    ).toEqual('to <strong>be or</strong> not to be');
  });

  it('leaves HTML markup alone when ellipsifying', function() {
    expect(
      results('to <strong>be or</strong> not to be', 5)
    ).toEqual('to <strong>be</strong>&nbsp;&hellip;');
  });

  it('respects nested HTML when ellipsifying', function() {
    expect(
      results('to <strong>be <em>or</em></strong> not to be', 8)
    ).toEqual('to <strong>be <em>or</em></strong>&nbsp;&hellip;');
  });

  it('respects nested unary tags when ellipsifying', function() {
    expect(
      results('to <strong>be <br />or</strong> not to be', 8)
    ).toEqual('to <strong>be <br />or</strong>&nbsp;&hellip;');
  });

  it('adds the ellipsi class even if it has to deal with HTML', function() {
    expect(
      results('to <strong>be or</strong> not to be', 5, {class: 'ellipsified'})
    ).toEqual(
      'to <strong>be</strong>&nbsp;<span class=\'ellipsified\'>&hellip;</span>'
    );
  });

  it('returns a blank string for null text', function() {
    expect(results(null, 5)).toEqual('');
  });
});
