///<reference path="testReference.ts" />

var assert = chai.assert;

describe("Scales", () => {
  it("Scale's copy() works correctly", () => {
    var testCallback: IBroadcasterCallback = (broadcaster: IBroadcaster) => {
      return true; // doesn't do anything
    };
    var scale = new Scale(d3.scale.linear());
    scale.registerListener(testCallback);
    var scaleCopy = scale.copy();
    assert.deepEqual(scale.domain(), scaleCopy.domain(), "Copied scale has the same domain as the original.");
    assert.deepEqual(scale.range(), scaleCopy.range(), "Copied scale has the same range as the original.");
    assert.notDeepEqual((<any> scale).broadcasterCallbacks, (<any> scaleCopy).broadcasterCallbacks,
                              "Registered callbacks are not copied over");
  });

  it("Scale alerts listeners when its domain is updated", () => {
    var scale = new Scale(d3.scale.linear());
    var callbackWasCalled = false;
    var testCallback: IBroadcasterCallback = (broadcaster: IBroadcaster) => {
      assert.equal(broadcaster, scale, "Callback received the calling scale as the first argument");
      callbackWasCalled = true;
    };
    scale.registerListener(testCallback);
    scale.domain([0, 10]);
    assert.isTrue(callbackWasCalled, "The registered callback was called");
  });

  it("QuantitiveScale.widenDomain() functions correctly", () => {
    var scale = new QuantitiveScale(d3.scale.linear());
    assert.deepEqual(scale.domain(), [0, 1], "Initial domain is [0, 1]");
    scale.widenDomain([1, 2]);
    assert.deepEqual(scale.domain(), [0, 2], "Domain was wided to [0, 2]");
    scale.widenDomain([-1, 1]);
    assert.deepEqual(scale.domain(), [-1, 2], "Domain was wided to [-1, 2]");
    scale.widenDomain([0, 1]);
    assert.deepEqual(scale.domain(), [-1, 2], "Domain does not get shrink if \"widened\" to a smaller value");
  });

  it("Linear Scales default to a domain of [Infinity, -Infinity]", () => {
    var scale = new LinearScale();
    var domain = scale.domain();
    assert.deepEqual(domain, [Infinity, -Infinity]);
  });
});