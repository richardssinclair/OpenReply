Open Reply Task

I really enjoyed working on this technical task. I used vanilla JavaScript and plain CSS, along with the User JavaScript and CSS Chrome extension, as recommended.

One challenge I encountered was handling the transition between the Phones tab and other tabs. To solve this, I used a MutationObserver to detect changes in the Filter dropdowns and TariffCards — particularly to check when new cards appeared after switching tariffs.

I did notice that the test doesn't behave correctly on mobile devices. I believe this is due to a selector I used to target the filters, which changes from three dropdowns on desktop to a single dropdown on mobile.

Given more time, I’d like to fix the mobile-specific issue and also clean up the MutationObserver logic for better readability and performance.

There’s also room to improve the CSS by tidying up the structure and adopting the BEM naming convention.

Please note: you'll need to copy the JavaScript and CSS into your own code injection tool, such as the User JavaScript and CSS extension for Chrome.