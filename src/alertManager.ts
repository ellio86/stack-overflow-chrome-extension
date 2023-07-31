class AlertManager {
    threadDateCreated: string;
    yearSetting: number = 5;

    constructor(threadDateCreated: string) {
        this.threadDateCreated = threadDateCreated;
        this.addEventListeners();
    }

    /**
     * Async function to be run after instantiating an alert manager.
     * Loads chrome settings and checks the page for dates.
     */
    public async init() {
        await this.loadChromeSettings();
        this.checkDates();
    }

    /**
     * Adds event listeners - namely chrome.runtime.onMessage
     */
    private addEventListeners() {
        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
            if (message.action === 'settingsUpdated') {
                // Retrieve the updated settings from sync storage
                const result = await chrome.storage.sync.get(['yearSetting'])
                this.applySettings(result.yearSetting);
            }
        });
    }

    /**
     * Applies settings from parameters
     * @param yearSetting yearSetting value to apply
     */
    private applySettings(yearSetting) {
        if(yearSetting.value !== undefined) {
            this.yearSetting = +yearSetting.value;
        }
    }

    /**
     * Loads chrome settings from sync storage
     */
    private async loadChromeSettings() {
        const result = await chrome.storage.sync.get(['yearSetting']);
        this.applySettings(result.yearSetting);
    }

    /**
     * Creates alert to be shown to the user
     */
    private createAlert() {
        alert(`This thread could be outdated! It is over ${this.yearSetting} years old. Proceed with caution!`);
    }

    /**
     * Checks the dates for the thread
     */
    private checkDates() {
        const now = new Date();
        console.log(`Year Detected=${new Date(this.threadDateCreated).getFullYear()}, ${this.yearSetting} years ago=${now.getFullYear() - this.yearSetting}`)
        if(new Date(this.threadDateCreated).getFullYear() < now.getFullYear() - this.yearSetting) {
            this.createAlert();
        }
    }
}

class Alert {
    dom: {}

    constructor() {
        this.dom = {}
    }

    /**
     * Take the user to the most recent answer of the thread
     */
    private showMostRecentAnswer() {

    }
}
// Async statements can only be executed from a module, export {} makes the file a module.
export {}

const threadCreationDate = document.querySelectorAll<HTMLTimeElement>("#content time")[0].dateTime;
const alertManager = new AlertManager(threadCreationDate);
await alertManager.init();

