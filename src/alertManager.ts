class AlertManager {
    threadDateCreated: string;
    yearSetting: number = 10;
    mostRecentPostType: string;

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
                const ys = await chrome.storage.sync.get(['yearSetting'])
                const mrpt = await chrome.storage.sync.get(['mostRecentPostType'])
                this.applySettings(ys.yearSetting, mrpt.mostRecentPostType);
            }
        });
    }

    /**
     * Applies settings from parameters
     * @param yearSetting yearSetting value to apply
     */
    private applySettings(yearSetting: any, mostRecentPostType: any) {
        if(yearSetting.value !== undefined) {
            this.yearSetting = +yearSetting.value;
        }
        if(mostRecentPostType.value !== undefined) {
            this.mostRecentPostType = mostRecentPostType.value;
        }
    }

    /**
     * Loads chrome settings from sync storage
     */
    private async loadChromeSettings() {
        const yearSettingResult = await chrome.storage.sync.get(['yearSetting']);
        const mostRecentPostTypeResult = await chrome.storage.sync.get(['mostRecentPostType']);
        this.applySettings(yearSettingResult.yearSetting, mostRecentPostTypeResult.mostRecentPostType);
    }

    /**
     * Creates alert to be shown to the user.
     */
    private createAlert() {
        const alert = new Alert(this.yearSetting, this.mostRecentPostType);
        let elementToInsertAfter = document.querySelector<Element>("#announcement-banner")
        if(!elementToInsertAfter) {
            elementToInsertAfter = document.querySelectorAll<Element>("body script")[0]
        } 

        // Add alert to page
        elementToInsertAfter.parentElement.insertBefore(alert.dom.alertContainer, elementToInsertAfter);
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

function removeQueryString(inputString: string) {
    const index = inputString.indexOf("?");
    return index !== -1 ? inputString.substring(0, index) : inputString;
}

function fade(element: HTMLDivElement) {
    let op = 1;  // initial opacity
    let timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = `${op}`;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

class Alert {
    dom: {
        alertContainer: HTMLDivElement,
        alertBody: HTMLDivElement
        alertText: HTMLDivElement
        mostRecentAnswerLink: HTMLAnchorElement
        dismissButton: HTMLAnchorElement
    }

    constructor(yearSetting: number, mostRecentPostType: string) {
        this.dom = {
            alertContainer: document.createElement("div"),
            alertBody: document.createElement("div"),
            alertText: document.createElement("div"),
            mostRecentAnswerLink: document.createElement("a"),
            dismissButton: document.createElement("a")
        }
        this.dom.alertContainer.classList.add("js-announcement-banner", "ff-sans", "fs-body1", "py2", "s-notice", "s-notice__info", "s-notice__important");
        this.dom.alertBody.classList.add("d-flex", "jc-space-between", "wmx12", "mx-auto", "px16", "py8");
        this.dom.alertText.classList.add("flex--item", "mr12", "fw-bold");
        this.dom.dismissButton.classList.add("flex--item", "fc-white", "js-dismiss");
        this.dom.mostRecentAnswerLink.classList.add("s-link", "s-link__underlined", "s-link__inherit", "js-link", "py2", "px6", "fw-normal");

        this.dom.alertContainer.style.background = "red";
        this.dom.alertContainer.style.border = "darkred";

        this.dom.mostRecentAnswerLink.href = `${removeQueryString(window.location.href)}${mostRecentPostType}`;
        
        this.dom.dismissButton.href = "#";
        this.dom.dismissButton.title = "Dismiss";
        this.dom.dismissButton.innerHTML = `<svg aria-hidden="true" class="m0 svg-icon iconClear" width="18" height="18" viewBox="0 0 18 18"><path d="M15 4.41 13.59 3 9 7.59 4.41 3 3 4.41 7.59 9 3 13.59 4.41 15 9 10.41 13.59 15 15 13.59 10.41 9 15 4.41Z"></path></svg>`;

        this.dom.mostRecentAnswerLink.innerHTML = "Go to most recent answer";
        this.dom.alertText.innerHTML = `This thread could be outdated! It is over ${yearSetting} years old. Proceed with caution!`;
        
        this.dom.alertText.appendChild(this.dom.mostRecentAnswerLink);
        this.dom.alertBody.appendChild(this.dom.alertText);
        this.dom.alertBody.appendChild(this.dom.dismissButton);
        this.dom.alertContainer.appendChild(this.dom.alertBody);

        this.addEventListeners();
    }

    private addEventListeners() {
        this.dom.dismissButton.addEventListener("click", () => {
            fade(this.dom.alertContainer);
        });
    }
}
// Async statements can only be executed from a module, export {} makes the file a module.
export {}

const threadCreationDate = document.querySelectorAll<HTMLTimeElement>("#content time")[0].dateTime;
const alertManager = new AlertManager(threadCreationDate);
await alertManager.init();
