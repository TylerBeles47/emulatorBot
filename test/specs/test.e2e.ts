import { $, expect } from '@wdio/globals'

describe('Instagram Login Automation', () => {
    it('should log in with valid credentials', async () => {
        // Wait for the app screen to be fully loaded and ready
        await driver.pause(7000);

        // --- 1. Enter Username ---
        // This relative XPath is robust and finds the input field next to its label.
        const usernameInput = await $('//android.view.View[@content-desc="Username, email or mobile number"]/../following-sibling::android.widget.EditText');
        await expect(usernameInput).toBeDisplayed({ message: 'Username input field was not found!' });
        await usernameInput.setValue("Tbell_lifts");

        // --- 2. Enter Password ---
        // This uses the same reliable strategy for the password field.
        const passwordInput = await $('//android.view.View[@content-desc="Password"]/../following-sibling::android.widget.EditText');
        await expect(passwordInput).toBeDisplayed({ message: 'Password input field was not found!' });
        await passwordInput.setValue("M0gM0nst3r47");

        // --- 3. Click Log In ---
        // The accessibility ID is the best possible locator for the login button.
        const loginButton = await $('~Log in');
        await expect(loginButton).toBeDisplayed({ message: 'Login button was not found!' });
        await loginButton.click();

        // --- 4. Verify Successful Login ---
        // Wait 10 seconds for the main feed to load completely after login.
        await driver.pause(10000);


        try {
            const notNowButton = await $('//android.widget.Button[@text="Not now"]');
            await notNowButton.waitForDisplayed({ timeout: 15000 });
            await notNowButton.click();
            console.log('Handled a post-login dialog by clicking "Not now".');
        } catch (error) {
            console.log('A post-login dialog did not appear, which is okay. Continuing...');
        }



        // After logging in, use the Appium Inspector on the home screen to find a
        // reliable locator for a home screen element (e.g., the Home icon or your profile icon).
        const homeIcon = await $('~Home'); // This is a placeholder, verify with Inspector!
        await expect(homeIcon).toBeDisplayed({ message: 'Home screen icon not found after login!' });

        console.log('SUCCESS: Login was successful and the home screen is visible!');
    });
});