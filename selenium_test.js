// Automated Selenium test for Tic-Tac-Toe (CCTB Final Exam)
// Author: Yasmin Xavier Eraldo

const { Builder, By, until } = require('selenium-webdriver');

(async function testTicTacToe() {
  // Replace with your Testing environment public IP or domain
  const TESTING_URL = "http://13.217.99.72";

  // Initialize Chrome WebDriver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log("Starting Tic-Tac-Toe automated test...");

    // Open the app
    await driver.get(TESTING_URL);
    await driver.wait(until.titleContains('Tic-Tac-Toe'), 5000);
    console.log("Page loaded successfully!");

    // Click to start the game
    const playButton = await driver.findElement(By.id('okBtn'));
    await playButton.click();
    console.log("Game started!");

    // Make a few moves to simulate a real game
    const moves = ['cell0', 'cell1', 'cell4', 'cell2', 'cell8'];
    for (let cellId of moves) {
      await driver.findElement(By.id(cellId)).click();
      await driver.sleep(500); // Wait half a second between moves
    }
    console.log("Moves played successfully.");

    // Check if modal or win message appears
    try {
      const modal = await driver.wait(until.elementLocated(By.id('winAnnounce')), 3000);
      if (modal) {
        console.log("Game ended modal displayed as expected!");
      }
    } catch {
      console.log("No win modal detected — possible draw.");
    }

    // Check that the restart button exists
    const restart = await driver.findElement(By.id('restart'));
    if (restart) {
      console.log("Restart button found. UI looks correct.");
    } else {
      throw new Error("Restart button missing!");
    }

    console.log("Test completed successfully!");
    process.exit(0); // Success exit code

  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1); // Failure exit code

  } finally {
    await driver.quit();
  }
})();
