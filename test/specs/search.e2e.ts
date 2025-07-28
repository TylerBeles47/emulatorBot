// This test suite assumes the user is already logged into the app.
// You should run your login test (test.e2e.ts) before this one.
describe('Instagram Post Search and Interaction', () => {

    it('should find a location and navigate to its most recent post', async () => {
        
        await driver.pause(5000); 

        // --- 1. Navigate to Search Page ---
        const searchTab = await $('id:com.instagram.android:id/search_tab');
        await searchTab.waitForDisplayed({ 
            timeout: 15000, 
            timeoutMsg: "Search tab icon not found!" 
        });
        await searchTab.click();
        await driver.pause(1500);
        console.log('Navigated to the Search page.');

        // --- 2. Search for the Location ---
        const searchInput = await $('id:com.instagram.android:id/action_bar_search_edit_text');
        await searchInput.waitForDisplayed({ timeout: 10000, timeoutMsg: "Search input field not found!"});
        await searchInput.click();
        await searchInput.setValue("crunchMadison");
        await driver.pause(2000);
        console.log('Typed "crunchMadison" into the search bar.');

        // --- 3. Select the Correct Search Result ---
        const searchResult = await $('id:com.instagram.android:id/row_search_user_username');
        await searchResult.waitForDisplayed({ timeout: 10000, timeoutMsg: "Search result not found!" });
        await searchResult.click();
        await driver.pause(2500);
        console.log('Clicked on the "crunchMadison" search result.');

        // --- 4. Click Address & Go to Location Page ---
        const businessAddress = await $('id:com.instagram.android:id/profile_header_business_address');
        await businessAddress.waitForDisplayed({ timeout: 15000, timeoutMsg: "Profile page did not load!" });
        await businessAddress.click();
        console.log('Clicked the business address.');
        
        await driver.pause(1500); 

        const seeLocationButton = await $('//android.widget.TextView[@text="See location"]');
        await seeLocationButton.waitForDisplayed({ timeout: 10000, timeoutMsg: "'See Location' button did not appear!"});
        await seeLocationButton.click();
        await driver.pause(2500);
        console.log('Clicked "See Location" to go to the main location page.');
        
        // --- 5. Switch to "Most Recent" Tab ---
        const mostRecentTab = await $('//android.widget.TextView[@content-desc="Most Recent Posts"]');
        await mostRecentTab.waitForDisplayed({ timeout: 10000, timeoutMsg: '"Most Recent" tab not found!' });
        await mostRecentTab.click();
        
        // Increased pause to allow posts to load
        await driver.pause(4000); 
        console.log('Switched to the "Most Recent Posts" tab and am waiting for posts to load.');

        // --- 6. Open the First Post (Corrected and Final Locator) ---
        // This XPath correctly identifies the element as a Button and uses the stable
        // part of its description ("row 1, column 1") to find the first post reliably.
        const firstPost = await $('//android.widget.Button[contains(@content-desc, "row 1, column 1")]');
        await firstPost.waitForDisplayed({ timeout: 15000, timeoutMsg: "No posts found in the 'Most Recent' tab." });
        await firstPost.click();
        await driver.pause(2000); 
        console.log('Opened the first post.');

        // --- 7. Click the Comment Button ---
        const commentButton = await $('id:com.instagram.android:id/row_feed_button_comment');
        await commentButton.waitForDisplayed({ timeout: 10000, timeoutMsg: "Comment button not found on the post!" });
        await commentButton.click();
        console.log('Clicked the comment button. Ready to type a comment!');

        console.log('SUCCESS: Successfully navigated to the comment section.');
    });
});
