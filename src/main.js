import '@material/mwc-drawer';

let ticking = false;
const $ionApp = document.querySelector("ion-app");
const $searchModal = document.querySelector("#search-modal");
const $versionsPopover = document.querySelector("#versions-popover");
const $developersPopover = document.querySelector("#developers-popover");
const $textSegment = document.querySelector(".text-segment");
const $textGrids = document.querySelectorAll(".text-grid");
const $portfolioHeader = document.querySelector(".portfolio-header");
const $portfolioToolbar = document.querySelector(".portfolio-toolbar");
const $portfolioLogo = document.querySelector(".portfolio-logo");
const $portfolioSegment = document.querySelector(".portfolio-segment");
const $portfolioGrids = document.querySelectorAll(".portfolio-grid");
const $portfolioTab = document.querySelector(".portfolio-tab");
const $portfolioContent = document.querySelector(".portfolio-content");
const $themeToggle = document.querySelector('#themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const $dashboardDrawer = document.querySelector('.dashboard-drawer');
const $dashboardMenu = document.querySelector('.dashboard-menu');
const $portfolioDrawer = document.querySelector('.portfolio-drawer');
const $portfolioMenu = document.querySelector('.portfolio-menu');
const $androidDrawer = document.querySelector('.android-drawer');
const $androidMenu = document.querySelector('.android-menu');

$dashboardMenu.addEventListener('click', () => {
    $dashboardDrawer.open = !$dashboardDrawer.open
});

$portfolioMenu.addEventListener('click', () => {
    $portfolioDrawer.open = !$portfolioDrawer.open
});

$androidMenu.addEventListener('click', () => {
    $androidDrawer.open = !$androidDrawer.open
});

function toggleDarkTheme(shouldAdd) {
    document.body.classList.toggle('dark', shouldAdd);
}

function loadApp() {
    $themeToggle.checked = prefersDark.matches;
}

toggleDarkTheme(prefersDark.matches);

$themeToggle.addEventListener('ionChange', (event) => toggleDarkTheme(event.detail.checked));
prefersDark.addEventListener('change', (event) => toggleDarkTheme(event.matches));

window.addEventListener('load', () => loadApp());

// const i = new IntersectionObserver((e) => {
//   if (e[0].isIntersecting) {
//     $portfolioLogo.style.position = 'relative';
//     $portfolioLogo.style.height = '150px';
//     $portfolioLogo.style.width = '150px';
//     $portfolioSegment.hidden = false;

//     // $portfolioToolbar.style.position = 'fixed';
//   } else {
//     $portfolioLogo.style.position = 'fixed';
//     $portfolioLogo.style.height = '50px';
//     $portfolioLogo.style.width = '50px';
//     $portfolioSegment.hidden = true;
//     // $portfolioToolbar.style.position = 'relative';
//   }
// }, {
//   threshold: 0.9
// });
// i.observe($portfolioToolbar);

$portfolioContent.addEventListener(
    "ionScroll",
    function (event) {
        if (ticking && event.detail.scrollTop <= 100) {
            ticking = false;
            $portfolioLogo.style.height = "150px";
            $portfolioLogo.style.width = "150px";
            $portfolioSegment.hidden = false;
        }

        if (!ticking && event.detail.scrollTop > 246) {
            ticking = true;
            $portfolioLogo.style.height = "50px";
            $portfolioLogo.style.width = "50px";
            $portfolioSegment.hidden = true;
        }
    },
    true
);

customElements.define(
    "progress-ring",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.originalClass = this.classList.value;
            this.color ? this.classList.value = `${this.originalClass} ion-color ion-color-${this.color}` : this.classList.value = `${this.originalClass} ion-color`;

            this.circumference = 192 * 2 * Math.PI;

            this.shadowRoot.innerHTML = `
            <style>
              :host(.ion-color){color:var(--ion-color-base)}

              circle {
                transition: 0.35s stroke-dasharray;
              }
            </style>
            <svg
              xmlns='http://www.w3.org/2000/svg' 
              class='ionicon'
              viewBox='0 0 512 512'>
                <title>Ring</title>
                <circle
                  cx='256' 
                  cy='256' 
                  r='192' 
                  fill='none'
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='32'
                  stroke-dasharray='${this.value * this.circumference} ${(1 - this.value) * this.circumference}''
                />
                <text 
                  x="256" 
                  y="256" 
                  font-size="64px" 
                  fill='currentColor'
                  text-anchor="middle" 
                  >
                    ${this.value * 100} <tspan font-size="32px">%</tspan>
                </text>
            </svg>
              `;

            this.$circle = this.shadowRoot.querySelector("circle");
            this.$text = this.shadowRoot.querySelector('text');
        }

        get color() {
            return this.getAttribute("color");
        }

        set color(newColor) {
            if (
                [
                    "primary",
                    "secondary",
                    "tertiary",
                    "success",
                    "warning",
                    "danger",
                    "light",
                    "medium",
                    "dark",
                ].includes(newColor)
            ) {
                this.setAttribute("color", newColor);
                this.classList.value = `${this.originalClass} ion-color ion-color-${newColor}`;
            } else {
                this.removeAttribute("color");
            }
        }

        get value() {
            return this.getAttribute("value") ?? 0;
        }

        set value(newValue) {
            if (0 <= newValue && newValue <= 1) {
                console.log(`newValue ${newValue}`);
                this.setAttribute("value", newValue);
                this.$circle.style.strokeDasharray = `${newValue * this.circumference} ${(1 - newValue) * this.circumference}`;
                this.$text.firstChild.nodeValue = newValue * 100;
            } else {
                this.removeAttribute("value");
            }
        }

        // static get observedAttributes() {
        //   return ["value", "test"];
        // }

        // attributeChangedCallback(name, oldValue, newValue) {
        //   console.log(`changed ${name}`);
        //   this.$circle.style.strokeDasharray = `${newValue * this.circumference} ${(1 - newValue) * this.circumference}`;
        //   this.$text.firstChild.nodeValue = newValue * 100;
        // }
    }
);

customElements.define(
    "progress-circle",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });

            this.shadowRoot.innerHTML = `
            <div 
              style="
              height: 0;
              padding-bottom: 100%;
              width: 100%;
              position: relative;
              background: conic-gradient(${this.color} ${this.value * 100
            }%, 0, #ecf0f1 ${100 - this.value * 100}%);
              border-radius: 50%;
              ">
              <p
              style="
              background-color: white;
              display: flex;
              align-items: center;
              justify-content: center;

              position: absolute;
              left: 10%;
              top: 10%;
              right: 10%;
              bottom: 10%;
              margin: 0;
              border-radius: 50%;
              ">
                <strong>${this.value * 100}<sup>%</sup></strong>
              </p>
            </div>
          `;

            this.$div = this.shadowRoot.querySelector("div");
            this.$strong = this.shadowRoot.querySelector("strong");
        }

        static get observedAttributes() {
            return ["color", "value"];
        }

        get color() {
            return `var(--ion-color-${this.getAttribute("color")}, #3880ff)`;
        }

        set color(val) {
            if (
                [
                    "primary",
                    "secondary",
                    "tertiary",
                    "success",
                    "warning",
                    "danger",
                    "light",
                    "medium",
                    "dark",
                ].includes(val)
            ) {
                this.setAttribute("color", val);
            } else {
                this.removeAttribute("color");
            }
        }

        get value() {
            return this.getAttribute("value") ?? 0;
        }

        set value(val) {
            if (0 <= val && val <= 1) {
                this.setAttribute("value", val);
            } else {
                this.removeAttribute("value");
            }
        }

        connectedCallback() {
            // this.$div = this.shadowRoot.querySelector('div');
            // this.$strong = this.shadowRoot.querySelector('strong');
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "value") {
                this.$div.style.background = `conic-gradient(${this.color} ${this.value * 100
                }%, 0, #ecf0f1 ${100 - this.value * 100}%)`;
                this.$strong.firstChild.nodeValue = `${this.getAttribute("value") * 100
                }`;
            }

            if (name === "color") {
                this.$div.style.background = `conic-gradient(${this.color} ${this.value * 100
                }%, 0, #ecf0f1 ${100 - this.value * 100}%)`;
            }
        }
    }
);

customElements.define(
    "versions-popover",
    class extends HTMLElement {
        constructor() {
            super();
            // this.attachShadow({ mode: "open" });
            // this.shadowRoot.appendChild($versionsPopover.content.cloneNode(true));
        }

        connectedCallback() {
            this.appendChild($versionsPopover.content.cloneNode(true));
        }
    }
);

async function versionsPopover(event) {
    window._versionsPopover = Object.assign(
        document.createElement("ion-popover"),
        {
            component: "versions-popover",
            event,
        }
    );
    document.body.appendChild(window._versionsPopover);

    await window._versionsPopover.present();
}

customElements.define(
    "developers-popover",
    class extends HTMLElement {
        constructor() {
            super();
            // this.attachShadow({ mode: "open" });
            // this.shadowRoot.appendChild(
            //   $developersPopover.content.cloneNode(true)
            // );
        }

        connectedCallback() {
            this.appendChild($developersPopover.content.cloneNode(true));
        }
    }
);

async function developersPopover(event) {
    window._developersPopover = Object.assign(
        document.createElement("ion-popover"),
        {
            component: "developers-popover",
            event,
        }
    );
    document.body.appendChild(window._developersPopover);

    await window._developersPopover.present();
}

customElements.define(
    "search-modal",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild($searchModal.content.cloneNode(true));
            this.searchbar = this.shadowRoot.querySelector("ion-searchbar");
            this.items = [...this.shadowRoot.querySelectorAll("ion-item")];
            this.inputCallback = this.inputCallback.bind(this);
            this.clearCallback = this.clearCallback.bind(this);
        }

        connectedCallback() {
            this.searchbar.addEventListener("ionInput", this.inputCallback);
            this.searchbar.addEventListener("ionClear", this.clearCallback);
        }

        disconnectedCallback() {
            this.searchbar.removeEventListener("ionInput", this.inputCallback);
            this.searchbar.removeEventListener("ionClear", this.clearCallback);
        }

        inputCallback(event) {
            const query = event.target.value.toLowerCase();

            requestAnimationFrame(() => {
                this.items.forEach((item) => {
                    item.style.display = item.textContent
                        .toLowerCase()
                        .includes(query)
                        ? "block"
                        : "none";
                });
            });
        }

        clearCallback(event) {
            console.log("cancelCallback");
            window.$searchModal.dismiss();
        }
    }
);

async function searchModal(event) {
    window.$searchModal = Object.assign(
        document.createElement("ion-modal"),
        {
            component: "search-modal",
            event,
        }
    );
    document.body.appendChild(window.$searchModal);

    await window.$searchModal.present();
}

$textSegment.addEventListener("ionChange", (event) => {
    $textGrids.forEach((textGrid) => {
        textGrid.getAttribute("value") === event.target.value
            ? (textGrid.hidden = false)
            : (textGrid.hidden = true);
    });
});

$portfolioSegment.addEventListener("ionChange", (event) => {
    $portfolioGrids.forEach((portfolioGrid) => {
        portfolioGrid.getAttribute("value") === event.target.value
            ? (portfolioGrid.hidden = false)
            : (portfolioGrid.hidden = true);
    });
});

function reload() {
    window.location.reload();
}

