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

        this.loadChromeSettings();
        this.addEventListeners();
    }

    /**
     * Load settings from chrome local storage
     */
    private loadChromeSettings() {
        chrome.storage.local.get('yearSetting', function(result) {
            if (result.yearSetting !== undefined) {
              this.dom.yearSetting.value = result.yearSetting;
            }
        });
    }

    /**
     * Add event listeners to elements in the dom
     */
    private addEventListeners() {
        this.dom.saveSettingsButton.addEventListener("click", () => {
            this.saveChromeSettings();
        });
    }

    /**
     * Saves settings to chrome local storage 
     */
    private saveChromeSettings() {
        chrome.storage.local.set({ "yearSetting": `${this.dom.yearSetting.value}`}, () => {
            // Notify the content script about the changes
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'settingsUpdated' });
            });
        });
    }
}

const popup = new Popup(document.querySelector<HTMLDivElement>("#main"));