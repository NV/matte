/*global require,exports,describe,it,expect,runs */
var Montage = require("montage").Montage,
    TestPageLoader = require("support/testpageloader").TestPageLoader,
    Promise = require("montage/core/promise").Promise,
    Popup = require("montage/ui/popup/popup.reel").Popup,
    ActionEventListener = require("montage/core/event/action-event-listener").ActionEventListener;


var testPage = TestPageLoader.queueTest("popup-test", function() {
    var test = testPage.test;

    var getElementPosition = function(obj) {
            var curleft = 0, curtop = 0, curHt = 0, curWd = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                    curHt += obj.offsetHeight;
                    curWd += obj.offsetWidth;
                } while ((obj = obj.offsetParent));
            }
            return {
                top: curtop,
                left: curleft,
                height: curHt,
                width: curWd
            };
            //return [curleft,curtop, curHt, curWd];
    };

    describe("ui/popup-spec", function() {
        it("should load", function() {
            expect(testPage.loaded).toBeTruthy();
        });

        describe("once loaded", function() {

            describe("Popup", function() {

                describe("show/hide", function() {
                    var popup;
                    beforeEach(function () {
                        popup = test.popup;
                    });
                    it("should not initially be displayed", function() {
                        expect(popup.displayed).toBe(false);

                    });
                    //BAD these tests rely on sequential execution
                    it("should show", function() {
                        popup.show();
                        testPage.waitForComponentDraw(popup);
                        runs(function() {
                            //console.log('after initial show', popup.element);
                            expect(popup.element.classList.contains("montage-invisible")).toBe(false);
                        });

                    });
                    it("should hide", function() {
                        popup.hide();
                        testPage.waitForComponentDraw(popup);
                        runs(function() {
                            //console.log('after first hide');
                            expect(popup.element.classList.contains("montage-invisible")).toBe(true);
                        });

                    });
                    it("should show again", function() {
                        popup.show();
                        testPage.waitForComponentDraw(popup);
                        runs(function() {
                            //console.log('after show 1', popup.element);
                            // if this fails, it means that the popup.draw is not called after it was hidden once
                            expect(popup.element.classList.contains("montage-invisible")).toBe(false);
                        });
                    });
                });
                /*
                it("non-modal popup is hidden when clicked outside the popup", function() {

                    var popup = test.popup;


                    expect(popup.displayed).toBe(false);
                    popup.show();

                    testPage.waitForDraw();
                    runs(function() {
                        expect(popup.displayed).toBe(true);
                        var eventInfo = Montage.create(EventInfo).initWithElementAndPosition(null, 1, 1);
                        console.log('about to click outside the popup');

                        testPage.mouseEvent(eventInfo, 'click', function(evt) {
                            popup.needsDraw = true;
                            testPage.waitForDraw();
                            runs(function() {
                                console.log('after drawing');
                                expect(popup.displayed).toBe(false);
                            });

                        });


                    });

                });
                */

            });


            it("is positioned relative to anchor by default", function() {
                var popup = test.popup;
                var anchor = popup.anchorElement, anchorHt, anchorWd, anchorPosition;

                var anchorPosition = getElementPosition(anchor);
                anchorHt = parseFloat(anchor.style.height || 0) || anchor.offsetHeight || 0;
                anchorWd = parseFloat(anchor.style.width || 0) || anchor.offsetWidth || 0;

                var show = Promise.defer();

                popup.addEventListener('show', function(event) {
                    show.resolve(event);
                });

                popup.show();

                return show.promise.then(function() {
                    console.log('show -');
                    var popupPosition = getElementPosition(popup.element);
                    expect(popupPosition.top).toEqual(anchorPosition.top + anchorHt);
                    popup.hide();
                });
            });



            it("is positioned at specified position", function() {
                var popup = test.popup;
                popup.position = {top: 1, left: 10};

                var show = Promise.defer();

                popup.addEventListener('show', function() {
                    show.resolve(event);
                });

                popup.show();

                return show.promise.then(function() {
                    var popupPosition = getElementPosition(popup.element);
                    console.log('show -', popupPosition);
                    expect(popupPosition.top).toBe(1);
                    expect(popupPosition.left).toBe(10);

                    popup.hide();
                });


            });

        });

    });
});
