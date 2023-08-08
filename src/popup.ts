class Popup {
    dom: {
        root: HTMLDivElement,
        yearSetting: HTMLInputElement,
        mostRecentPostType: HTMLSelectElement,
        saveSettingsButton: HTMLButtonElement,
        positiveFeedback: HTMLSpanElement,
        negativeFeedback: HTMLSpanElement,
    }

    constructor(root: HTMLDivElement) {
        this.dom = {
            root: root,
            yearSetting: root.querySelector<HTMLInputElement>("#yearSetting"),
            mostRecentPostType: root.querySelector<HTMLSelectElement>("#mostRecentPostType"),
            saveSettingsButton: root.querySelector<HTMLButtonElement>("#saveSettingsButton"),
            positiveFeedback: root.querySelector<HTMLSpanElement>("#positiveFeedback"),
            negativeFeedback: root.querySelector<HTMLSpanElement>("#negativeFeedback"),
        }

        $(this.dom.positiveFeedback).hide();
        $(this.dom.negativeFeedback).hide();

        this.addEventListeners();
    }

    /**
     * Holds asynchronous init tasks that cannot be executed in the constructor
     */
    public async init() {
        await this.loadChromeSettings();
    }

    /**
     * Load settings from chrome sync storage
     */
    private async loadChromeSettings() {
        const yearSettingResult = await chrome.storage.sync.get(['yearSetting']);
        if (yearSettingResult.yearSetting !== undefined) {
            this.dom.yearSetting.value = yearSettingResult.yearSetting.value;
        }
        const mostRecentPostTypeResult = await chrome.storage.sync.get(['mostRecentPostType']);
        if (mostRecentPostTypeResult.mostRecentPostType !== undefined) {
            this.dom.mostRecentPostType.value = mostRecentPostTypeResult.mostRecentPostType.value;
        }
    }

    /**
     * Add event listeners to elements in the dom
     */
    private addEventListeners() {
        this.dom.saveSettingsButton.addEventListener("click", async () => {
            await this.saveChromeSettings();
        });
    }

    /**
     * Creates a feedback message to be displayed to the user
     * @param type positive | negative
     * @param message feedback message
     */
    private createFeedback(type: string, message: string) {
        switch (type) {
            case "positive":
                this.dom.positiveFeedback.innerHTML = message;
                this.dom.positiveFeedback.style.display = "block";
                $(this.dom.positiveFeedback).delay(3000).fadeOut(1000);
                break;

            case "negative":
                this.dom.negativeFeedback.innerHTML = message;
                this.dom.negativeFeedback.style.display = "block";
                break;

            default: 
                console.error(`Feedback type ${type} unsupported!`)
        }
    }

    /**
     * Saves settings to chrome sync storage 
     */
    private async saveChromeSettings() {
        // Save settings
        await chrome.storage.sync.set({ yearSetting: {value: this.dom.yearSetting.value}, mostRecentPostType: {value: this.dom.mostRecentPostType.value}});
        
        // Give the user a feedback message
        this.createFeedback("positive", "Successfully updated settings");

        // Notify the content script about the changes
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tabs[0].id, { action: 'settingsUpdated' }).catch(() => {});
    }
}

// Async statements can only be executed from a module, export {} makes the file a module.
export {}

const popup = new Popup(document.querySelector<HTMLDivElement>("#main"));
await popup.init();