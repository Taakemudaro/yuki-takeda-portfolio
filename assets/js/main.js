"use strict";

// active
const ACTIVE = "active";
// hover
const HOVER = "is-hovered";
// sp responsive
const isSp = () => window.innerWidth <= 768;

/**
 * drawer menu
 */
const menuBtn = document.querySelector(".menu__btn");
const menuBg = document.querySelector(".menu__bg");
const menu = document.querySelector(".menu");
const menuLogo = document.querySelector(".menu__logo");
const menuNavItems = document.querySelectorAll(".nav__item--menu");

const toggleActiveMenu = () => {
  const toggleActive = menuBg.classList.toggle(ACTIVE);
  if (toggleActive) {
    menu.classList.add(ACTIVE);
    menuBtn.classList.add(ACTIVE);
  } else {
    menu.classList.remove(ACTIVE);
    menuBtn.classList.remove(ACTIVE);
  }
};

if (menuBtn && menuBg && menu && menuLogo && menuNavItems) {
  menuBtn.addEventListener("click", toggleActiveMenu);
  menuLogo.addEventListener("click", toggleActiveMenu);
  menuBg.addEventListener("click", toggleActiveMenu);
  menuNavItems.forEach((menuNavItem) => {
    menuNavItem.addEventListener("click", toggleActiveMenu);
  });
}

/**
 * works / contact Item hover
 */
const itemElements = document.querySelectorAll(
  ".works__item--left, .works__item--right, .introduction__item--left, .introduction__item--center, .introduction__item--right, .contact__box"
);

const toggleHoverImg = (e, isActive) => {
  const parent = e.currentTarget;
  // get hover elements
  const imgs = parent.querySelectorAll(
    ".works__item-img, .introduction__item-img, .works__item-img--banner, .introduction__item-img--banner, .contact__img--pc, .contact__img--sp"
  );
  // mouseenterの場合、add / mouseleaveの場合、remove
  imgs.forEach((img) => {
    img.classList.toggle(HOVER, isActive);
  });
};

if (itemElements.length > 0) {
  itemElements.forEach((itemElement) => {
    itemElement.addEventListener("mouseenter", (e) => toggleHoverImg(e, true));
    itemElement.addEventListener("mouseleave", (e) => toggleHoverImg(e, false));
  });
}

/**
 * fade in
 */
const fadeElements = document.querySelectorAll(
  ".fadein, .fadein-ltr, .fadein-rtl"
);

const fadeAnimation = (entries, obs) => {
  entries.forEach((entry) => {
    const target = entry.target;
    if (entry.isIntersecting) {
      // delay設定(default 0s)
      const delay = Number(target.dataset.delay) || 0;
      // duration設定(default 1000s)
      const duration = Number(target.dataset.duration) || 1000;
      switch (true) {
        case target.classList.contains("fadein-ltr"):
          target.animate(
            {
              opacity: [0, 1],
              filter: ["blur(.4rem)", "blur(0)"],
              translate: ["-50px 0", "0 0"],
            },
            {
              duration: duration,
              delay: delay,
              easing: "ease",
              fill: "forwards",
            }
          );
          break;
        case target.classList.contains("fadein-rtl"):
          target.animate(
            {
              opacity: [0, 1],
              filter: ["blur(.4rem)", "blur(0)"],
              translate: ["50px 0", "0 0"],
            },
            {
              duration: duration,
              delay: delay,
              easing: "ease",
              fill: "forwards",
            }
          );
          break;
        case target.classList.contains("fadein"):
          target.animate(
            {
              opacity: [0, 1],
              filter: ["blur(.4rem)", "blur(0)"],
              translate: ["0 50px", "0 0"],
            },
            {
              duration: duration,
              delay: delay,
              easing: "ease",
              fill: "forwards",
            }
          );
          break;
      }
      obs.unobserve(target);
    }
  });
};

if (fadeElements.length > 0) {
  // IntersectionObserver
  const fadeObserver = new IntersectionObserver(fadeAnimation);

  fadeElements.forEach((fadeElement) => {
    fadeObserver.observe(fadeElement);
  });
}

/**
 * header fade in / out（下スクロール時にフェードアウト）
 */
document.addEventListener("DOMContentLoaded", () => {
  const headerElement = document.querySelector(".header");

  if (headerElement) {
    const headerHeight = headerElement.offsetHeight;

    // スタートポジション（可変）
    let startScrollPos = 0;

    const handleScroll = () => {
      const scrollPos = window.pageYOffset;
      if (scrollPos > startScrollPos && scrollPos > headerHeight) {
        headerElement.style.top = `-${headerHeight}px`;
      } else {
        headerElement.style.top = 0;
      }
      startScrollPos = scrollPos;
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleScroll);
  }
});

/**
 * header logo fade in / out（FVで非表示）
 */
const fvElement = document.querySelector(".fv");
const headerLogoElement = document.querySelector(".header__logo");

const fadeHeaderAnimation = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      headerLogoElement.classList.add("is-invisible");
    } else {
      headerLogoElement.classList.remove("is-invisible");
    }
  });
};

if (fvElement && headerLogoElement) {
  const fadeHeaderObserver = new IntersectionObserver(fadeHeaderAnimation);
  fadeHeaderObserver.observe(fvElement);
}

/**
 * contact swiper
 */
const checkSwiper = document.querySelector(".swiper");

window.addEventListener("load", () => {
  if (checkSwiper) {
    const swiper = new Swiper(checkSwiper, {
      speed: 100000,
      slidesPerView: "auto",
      spaceBetween: 20,
      loop: true,
      allowTouchMove: false,

      freeMode: {
        enabled: true,
        momentum: false,
      },

      autoplay: {
        delay: 0,
      },
    });
  }
});

/**
 * about footprint fade in / out
 */
const profileElement = isSp()
  ? document.querySelector(".profile__bridge")
  : document.querySelector(".profile");
const footprint = document.querySelector(".footprint");
const clipSteps = ["0 75% 0 0", "0 50% 0 0", "0 25% 0 0", "0 0 0 0"];

const fadeClip = (entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      clipSteps.forEach((clip, i) => {
        setTimeout(() => {
          footprint.style.clipPath = `inset(${clip})`;
          footprint.style.opacity = 1;
          footprint.style.transform = "translateY(0) rotate(-60deg)";
        }, i * 500);
      });
      obs.unobserve(entry.target);
    }
  });
};
if (profileElement && footprint) {
  const fedeFootprintObserver = new IntersectionObserver(fadeClip);
  fedeFootprintObserver.observe(profileElement);
}

/**
 * about thought parallax（countries）
 */
const parallaxEffect = () => {
  const parallaxElements = document.querySelectorAll(
    ".thought__countries--upper, .thought__countries--lower"
  );
  const ELEMENT_SPEED = 0.2;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach((parallaxElement) => {
      const elementRate = scrolled * ELEMENT_SPEED;
      parallaxElement.style.backgroundPosition = isSp()
        ? `${elementRate}px center`
        : `center ${elementRate}px`;
    });
  };
  if (parallaxElements.length === 0) return;
  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();
};
parallaxEffect();
