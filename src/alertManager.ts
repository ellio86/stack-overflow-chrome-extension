class AlertManager {
    threadDateCreated: string;
    yearSetting: number = 5;

    constructor(threadDateCreated: string) {
        this.threadDateCreated = threadDateCreated;
        this.addEventListeners();
        this.loadChromeSettings();
        this.checkDates();
    }

    private addEventListeners() {
        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'settingsUpdated') {
            // Retrieve the updated settings from local storage
            chrome.storage.local.get(['yearSetting'], (result) => {
                this.applySettings(result);
            });
            }
        });
    }

    private applySettings(settings) {
        if(settings.yearSetting !== undefined) {
            this.yearSetting = +settings.yearSetting;
        }
    }

    private loadChromeSettings() {
        chrome.storage.local.get(['yearSetting'], (result) => {
            this.applySettings(result);
        });
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
        if(new Date(this.threadDateCreated).getFullYear() <= now.getFullYear() - this.yearSetting) {
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

const threadCreationDate = document.querySelectorAll<HTMLTimeElement>("#content time")[0].dateTime;
const alertManager = new AlertManager(threadCreationDate);
