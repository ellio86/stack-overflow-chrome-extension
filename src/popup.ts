class Popup {
    dom: {
        root: HTMLDivElement,
        yearSetting: HTMLInputElement
        saveSettingsButton: HTMLButtonElement
    }

    constructor(root: HTMLDivElement) {
        this.dom = {
            root: root,
            yearSetting: root.querySelector<HTMLInputElement>("#yearSetting"),
            saveSettingsButton: root.querySelector<HTMLButtonElement>("#saveSettingsButton")
        }
        this.addEventListeners();
    }

    public async init() {
        await this.loadChromeSettings();
    }

    /**
     * Load settings from chrome sync storage
     */
    private async loadChromeSettings() {
        const result = await chrome.storage.sync.get(['yearSetting']);
        if (result.yearSetting !== undefined) {
            this.dom.yearSetting.value = result.yearSetting.value;
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
     * Saves settings to chrome sync storage 
     */
    private async saveChromeSettings() {
        // Save settings
        await chrome.storage.sync.set({ yearSetting: {value: this.dom.yearSetting.value}});
        
        // Notify the content script about the changes
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tabs[0].id, { action: 'settingsUpdated' });
    }
}
// Async statements can only be executed from a module, export {} makes the file a module.
export {}

const popup = new Popup(document.querySelector<HTMLDivElement>("#main"));
await popup.init();