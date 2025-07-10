const banner = `
 <div class="banner-container column">
      <div class="test-row">
        <div class="banner-image-container">
          <img
            class="banner-image"
            src="https://econtent.o2.co.uk/o/econtent/media/get/31c9a925-e29c-4dde-9e5b-88b270f1ee50"
            alt=""
          />
        </div>
        <div class="banner-text-container">
          <p class="blue-text banner-text">
            <strong class="line-one"
              >Great news - you can get 20% off your airtime plan</strong
            >
          </p>
          <p class="line-two blue-text banner-text">
            Once you've placed your order, you can add the discount to your plan
            in My O2.
          </p>
        </div>
        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" id="toggleSwitch" checked />
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="test-row">
        <button class="open-modal-btn">
          <strong><span class="chevron"></span> More about Multisave</strong>
        </button>
      </div>
    </div>`;

const modal = `
  <div class="modal-overlay hidden" id="modalOverlay">
      <!-- Modal Wrapper for animation -->
      <div class="modal-wrapper" id="modal">
        <div class="modal">
          <div class="modal-title-container test-row">
            <h1 class="modal-title">How Multisave works</h1>
            <button class="close-modal-btn"></button>
          </div>
          <p class="blue-text modal-text">
            Body copy: Get 20% off the airtime plan of every new eligible Pay
            Monthly connection that you add to your account, or add other O2
            numbers to your Multisave group to share your savings. You can add
            up to 20 numbers to your group.
          </p>
          <p class="blue-text modal-text">
            For example, if you add a new Pay Monthly connection that costs £19
            a month for the device plan and £16 a month for the airtime plan,
            you’ll get 20% off your airtime plan. That’s a £3.20 monthly saving,
            bringing the airtime plan cost to £12.80 a month.
          </p>
          <p class="blue-text modal-text">
            You can also save 20% on SIM Only airtime plans.
          </p>
          <a
            class="link-text"
            href="https://www.o2.co.uk/multisave"
            target="_blank"
          >
            Find out more about Multisave
          </a>
          <p class="blue-text modal-text">
            <strong>How do I get Multisave?</strong>
          </p>
          <p class="blue-text modal-text">
            Getting started with Multisave is easy. You just need to sign in to
            My O2, but what you do next depends on whether you're on the website
            or the app:
          </p>
          <p class="blue-text modal-text">
            Using the website? Go to the main 'My O2' menu at the top of the
            page, and choose 'Multisave'.
          </p>
          <p class="blue-text modal-text">
            Using the My O2 app? Just go to 'Support', choose 'Products and
            services' and then select 'Multisave'.
          </p>
          <p class="blue-text modal-text">Then follow the on-screen prompts.</p>
          <p class="blue-text modal-text">
            The first number you add will be your ‘lead connection’ and won’t be
            discounted. Every additional number you add to your group will
            benefit from the 20% airtime discount. To add more numbers, just
            repeat the steps above.
          </p>
          <a
            class="link-text"
            href="https://www.o2.co.uk/termsandconditions/other-products-and-services/multisave-discount-terms-and-conditions"
            target="_blank"
          >
            See full Multisave terms
          </a>
        </div>
      </div>
    </div>`;

window.addEventListener("load", () => {
  // Target element where the banner will be injected
  const targetEl = document.querySelector(
    ".o2uk-sort-and-filter__dropdown-wrapper"
  );

  if (!targetEl) return;

  let bannerInjected = false;

  // Filter tab container
  const tabContainer = document.querySelector('[role="tablist"]');
  if (!targetEl || !tabContainer) {
    return;
  }

  // Checking phone filter tab is selected
  const isPhoneTabSelected = () => {
    const tab = document.querySelector(
      'button[role="tab"][data-url*="tab=phone"]'
    );
    const isDesktopTabSelected = tab?.getAttribute("aria-selected") === "true";

    const mobileSelect = document.querySelector(
      '.o2uk-select[role="combobox"] .o2uk-select-value-text'
    );
    const mobileSelectedValue = mobileSelect?.textContent.trim() || "";
    const isMobilePhoneSelected =
      mobileSelectedValue.toLowerCase() === "phones";

    return isDesktopTabSelected || isMobilePhoneSelected;
  };

  const injectBanner = () => {
    if (document.querySelector(".banner-container")) return;

    targetEl.insertAdjacentHTML("afterend", modal + banner);
    bannerInjected = true;

    setTimeout(() => {
      const toggle = document.getElementById("toggleSwitch");
      if (toggle) toggle.checked = true;
      setupBannerLogic();
      observeTariffCardChanges();
    }, 0);
  };

  const removeBanner = () => {
    document.querySelector(".banner-container")?.remove();
    document.getElementById("modalOverlay")?.remove();
    bannerInjected = false;
  };

  if (tabContainer) {
    const observer = new MutationObserver(() => {
      const isPhoneTab = isPhoneTabSelected();

      if (isPhoneTab && !bannerInjected) {
        injectBanner();
      } else if (!isPhoneTab && bannerInjected) {
        const toggle = document.getElementById("toggleSwitch");
        if (toggle) toggle.checked = false;

        const bannerContainer = document.querySelector(".banner-container");
        if (bannerContainer) bannerContainer.classList.remove("green-border");

        applyDiscountToAirtime(false);
        removeBanner();
      }
    });

    observer.observe(tabContainer, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class", "aria-selected"],
    });

    if (isPhoneTabSelected()) {
      injectBanner();
    }
  }

  const setupBannerLogic = () => {
    // main logic for banner.
    const toggleOnLineOne = `Great news - you can get 20% off your airtime plan`;
    const toggleOnLineTwo = `Once you've placed your order, you can add the discount to your plan in My O2.`;
    const toggleOffLineOne = `Want 20% off your airtime plan?`;
    const toggleOffLineTwo = `You removed your Multisave discount. Re-add it here.`;

    const lineOneEl = document.querySelector(".line-one");
    const lineTwoEl = document.querySelector(".line-two");

    const toggle = document.getElementById("toggleSwitch");
    const modalOverlay = document.getElementById("modalOverlay");
    const closeModalBtn = document.querySelector(".close-modal-btn");
    const openModalBtn = document.querySelector(".open-modal-btn");
    const bannerContainer = document.querySelector(".banner-container");

    if (!toggle || !modalOverlay || !openModalBtn || !closeModalBtn) return;

    // Modal open
    openModalBtn.addEventListener("click", function () {
      modalOverlay.classList.remove("hidden");
      setTimeout(() => {
        modalOverlay.classList.add("visible");
      }, 10);
    });

    // Modal close
    closeModalBtn.addEventListener("click", function () {
      modalOverlay.classList.remove("visible");
      setTimeout(() => {
        modalOverlay.classList.add("hidden");
      }, 300);
    });

    // Overlay modal close
    modalOverlay.addEventListener("click", function (event) {
      if (event.target === modalOverlay) {
        modalOverlay.classList.remove("visible");
        setTimeout(() => {
          modalOverlay.classList.add("hidden");
        }, 300);
      }
    });

    // Initial toggle state
    if (toggle.checked) {
      bannerContainer?.classList.add("green-border");
      applyDiscountToAirtime(true);
    } else {
      bannerContainer?.classList.remove("green-border");
      applyDiscountToAirtime(false);
    }

    // Toggle logic
    toggle.addEventListener("change", function () {
      const checked = this.checked;

      if (checked) {
        bannerContainer?.classList.add("green-border");
        applyDiscountToAirtime(true);
        lineOneEl.textContent = toggleOnLineOne;
        lineTwoEl.textContent = toggleOnLineTwo;
      } else {
        bannerContainer?.classList.remove("green-border");
        applyDiscountToAirtime(false);
        lineOneEl.textContent = toggleOffLineOne;
        lineTwoEl.textContent = toggleOffLineTwo;
      }
    });
  };

  const applyDiscountToAirtime = (enableDiscount) => {
    const cards = document.querySelectorAll(".tariff-card");

    cards.forEach((card) => {
      const priceWrapper = card.querySelector(
        ".commercial-tariff-card__price-wrapper_base"
      );
      const originalPriceEl = priceWrapper?.querySelector("o2uk-price-new");

      if (!priceWrapper || !originalPriceEl) return;

      const label = card.querySelector(".tariff-card__label");
      const tariffType = label?.textContent || "";
      if (tariffType.includes("ULTIMATE")) return;

      const match = originalPriceEl.textContent.match(/£([\d.]+)/);
      if (!match) return;

      let originalPrice = parseFloat(match[1]);

      if (!originalPriceEl.dataset.originalPrice) {
        originalPriceEl.dataset.originalPrice = originalPrice.toFixed(2);
      } else {
        originalPrice = parseFloat(originalPriceEl.dataset.originalPrice);
      }

      let discountBlock = priceWrapper.querySelector(".discounted-price-block");

      if (!discountBlock) {
        const discountedPrice = (originalPrice * 0.8).toFixed(2);

        discountBlock = document.createElement("div");
        discountBlock.className = "discounted-price-block hidden";

        discountBlock.innerHTML = `
        <p class="pink">£${discountedPrice}</p>
        <p class="price-text">WAS <span class="line-across">£${originalPrice.toFixed(
          2
        )}*</span></p>
        <p class="price-text">A Month</p>
        <p class="price-text">*20% airtime discount applied in My O2</p>
      `;

        priceWrapper.appendChild(discountBlock);
      }

      // Toggle visibility of Old / new price
      if (enableDiscount) {
        originalPriceEl.classList.add("hidden");
        discountBlock.classList.remove("hidden");
      } else {
        originalPriceEl.classList.remove("hidden");
        discountBlock.classList.add("hidden");
      }
    });
  };

  // Checking if more tarrifs get added to the page to apply price change
  const observeTariffCardChanges = () => {
    const wrapper = document.querySelector("o2uk-plan-list-wrapper");
    if (!wrapper) return;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const toggle = document.getElementById("toggleSwitch");
          if (toggle?.checked) {
            applyDiscountToAirtime(true);
          }
        }
      }
    });

    observer.observe(wrapper, {
      childList: true,
      subtree: true,
    });
  };
});
