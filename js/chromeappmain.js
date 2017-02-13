chrome.app.runtime.onLaunched.addListener(function () {
    // Center window on screen.
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    chrome.app.window.create('../index.html', {
        id: "SapiensOptio",
        outerBounds: {
            width: screenWidth,
            height: screenHeight,
            left: 0,
            top: 0
        }
    });
});