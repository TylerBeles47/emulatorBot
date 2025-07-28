

/**
 * Generates a comment based on keywords found in the post's caption.
 * @param {string} caption The caption of the Instagram post.
 * @returns {string} A relevant comment.
 */
function generateComment(caption: string): string {
    const lowerCaseCaption = caption.toLowerCase();

    if (lowerCaseCaption.includes('workout') || lowerCaseCaption.includes('fitness') || lowerCaseCaption.includes('gym')) {
        return 'Great workout! Looks intense! 💪';
    } else if (lowerCaseCaption.includes('food') || lowerCaseCaption.includes('recipe')) {
        return 'That looks delicious! 😋';
    } else if (lowerCaseCaption.includes('travel') || lowerCaseCaption.includes('adventure')) {
        return 'Amazing travel spot! So jealous!';
    } else {
        return 'Love this post! 🙌';
    }
}

describe('Instagram Loop Commenting', () => {

    // This test assumes you are already on a post grid (e.g., for a location or hashtag).
    it('should loop through and comment on 5 specific posts from the grid', async () => {

        console.log('--- Starting Comment Loop ---');
        // A brief pause to ensure the screen is settled before starting.
        await driver.pause(3000);

        // Define the specific grid positions of the posts you want to comment on.
        // The script will target these in order.
        const postCoordinates = [
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 2, col: 1 },
            { row: 2, col: 2 }
        ];

        let postsCommented = 0;

        // We use a 'for...of' loop to iterate through each coordinate object.
        for (const coords of postCoordinates) {
            console.log(`\n--- Attempting to process post at row ${coords.row}, column ${coords.col} ---`);

            // Construct a specific XPath selector for the post at the current row and column.
            // Using 'contains' makes the selector more robust if the content-desc has extra text.
            const postSelector = `//android.widget.Button[contains(@content-desc, "row ${coords.row}, column ${coords.col}")]`;
            const postButton = await $(postSelector);

            try {
                // Wait for the post to be visible and then click it.
                await postButton.waitForDisplayed({ timeout: 10000 });
                await postButton.click();
                console.log(`Clicked on post at row ${coords.row}, column ${coords.col}.`);
            } catch (error) {
                console.error(`Could not find or click post at row ${coords.row}, column ${coords.col}. Skipping.`);
                continue; // Skip to the next iteration if the post isn't found
            }
            
            await driver.pause(2000);

            // --- Commenting Logic ---
            const commentButton = await $('id:com.instagram.android:id/row_feed_button_comment');
            await commentButton.waitForDisplayed({ timeout: 10000 });
            await commentButton.click();
            await driver.pause(2000);

            // Using XPath to be more specific, targeting the first comment which is the post's caption.
            const captionElement = await $('(//android.widget.TextView[@resource-id="com.instagram.android:id/row_comment_textview_comment"])[1]');
            await captionElement.waitForDisplayed({ timeout: 15000 });
            const captionText = await captionElement.getText();
            const commentToPost = generateComment(captionText);
            console.log(`Generated Comment: "${commentToPost}"`);

            const commentInput = await $('id:com.instagram.android:id/layout_comment_thread_edittext');
            await commentInput.setValue(commentToPost);
            await driver.pause(1000);

            const postCommentButton = await $('id:com.instagram.android:id/layout_comment_thread_post_button');
            await postCommentButton.click();
            postsCommented++;
            console.log(`Posted comment #${postsCommented}.`);
            await driver.pause(3000);

            // --- Navigate back to the grid to continue the loop ---
            console.log('Navigating back to the post grid...');
            await driver.back(); // Back from comments screen to the post
            await driver.pause(1000);
            await driver.back(); // Back from the post to the grid
            await driver.pause(1000);
            await driver.back(); // Third back action as requested
            await driver.pause(2000); // Wait for grid to be stable before next loop
        }

        console.log(`\n✅ SUCCESS: Finished the loop. Commented on ${postsCommented} posts.`);
    });
});