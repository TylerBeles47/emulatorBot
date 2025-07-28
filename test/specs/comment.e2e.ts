import { $, expect } from '@wdio/globals';

/**
 * Generates a comment based on keywords found in the post's caption.
 * * --- AI INTEGRATION POINT ---
 * This is a simplified simulation of an AI model. In a real-world scenario,
 * you would replace this function's logic with an API call to a generative AI
 * service (like Google's Gemini API). You would send the caption text to the API
 * and use the returned text as the comment.
 * * @param {string} caption The caption of the Instagram post.
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


// This test suite assumes the previous script has just run, leaving the app
// on the comment screen of a post.
describe('Instagram AI Commenting', () => {

    it('should read the post caption and post a relevant comment', async () => {
        
        // Let the post and comment section fully load
        await driver.pause(3000); 

        // --- 1. Find and Extract the Caption Text ---
        // Using the corrected resource-id for the caption's text view.
        const captionElement = await $('id:com.instagram.android:id/row_comment_textview_comment');
        await captionElement.waitForDisplayed({ timeout: 15000, timeoutMsg: "Could not find the post's caption." });
        
        const captionText = await captionElement.getText();
        console.log(`Extracted Caption: "${captionText}"`);

        // --- 2. Generate a Relevant Comment ---
        const commentToPost = generateComment(captionText);
        console.log(`Generated Comment: "${commentToPost}"`);

        // --- 3. Find the Comment Input Box and Type the Comment ---
        const commentInput = await $('id:com.instagram.android:id/layout_comment_thread_edittext');
        await commentInput.waitForDisplayed({ timeout: 10000, timeoutMsg: "Comment input box not found." });
        await commentInput.setValue(commentToPost);
        await driver.pause(1000); // Pause after typing

        // --- 4. Find and Click the Post Button ---
        const postButton = await $('id:com.instagram.android:id/layout_comment_thread_post_button');
        await expect(postButton).toBeDisplayed({ message: 'Post button not found!' });
        await postButton.click();
        console.log('Clicked the Post button.');

        // --- 5. Final Verification ---
        // Add a final pause to see the result before the script ends.
        await driver.pause(5000);
        console.log('SUCCESS: The comment should now be posted.');
    });
});
