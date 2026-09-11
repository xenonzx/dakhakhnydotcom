// Add your javascript here

window.darkMode = false;

const stickyClasses = ["fixed", "h-14"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = [
	"border-neutral-300/50",
	"bg-white/80",
	"dark:border-neutral-600/40",
	"dark:bg-neutral-900/60",
	"backdrop-blur-2xl",
];
const unstickyClassesContainer = ["border-transparent"];
let headerElement = null;

function init() {
	headerElement = document.getElementById("header");

	if (
		localStorage.getItem("dark_mode") &&
		localStorage.getItem("dark_mode") === "true"
	) {
		window.darkMode = true;
		showNight();
	} else {
		showDay();
	}
	initDarkToggle();
	stickyHeaderFuncionality();
	applyMenuItemClasses();
	evaluateHeaderPosition();
	mobileMenuFunctionality();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}

function initDarkToggle() {
	const darkToggle = document.getElementById("darkToggle");
	if (darkToggle) {
		darkToggle.addEventListener("click", () => {
			document.documentElement.classList.add("duration-300");

			if (document.documentElement.classList.contains("dark")) {
				localStorage.removeItem("dark_mode");
				showDay(true);
			} else {
				localStorage.setItem("dark_mode", true);
				showNight(true);
			}
		});
	}
}

window.stickyHeaderFuncionality = () => {
	window.addEventListener("scroll", () => {
		evaluateHeaderPosition();
	});
};

window.evaluateHeaderPosition = () => {
	if (!headerElement) return;
	if (window.scrollY > 16) {
		headerElement.firstElementChild?.classList.add(...stickyClassesContainer);
		headerElement.firstElementChild?.classList.remove(
			...unstickyClassesContainer,
		);
		headerElement.classList.add(...stickyClasses);
		headerElement.classList.remove(...unstickyClasses);
		const menu = document.getElementById("menu");
		if (menu) {
			menu.classList.add("top-[56px]");
			menu.classList.remove("top-[75px]");
		}
	} else {
		headerElement.firstElementChild?.classList.remove(...stickyClassesContainer);
		headerElement.firstElementChild?.classList.add(...unstickyClassesContainer);
		headerElement.classList.add(...unstickyClasses);
		headerElement.classList.remove(...stickyClasses);
		const menu = document.getElementById("menu");
		if (menu) {
			menu.classList.remove("top-[56px]");
			menu.classList.add("top-[75px]");
		}
	}
};

function showDay(animate) {
	document.getElementById("sun").classList.remove("setting");
	document.getElementById("moon").classList.remove("rising");

	let timeout = 0;

	if (animate) {
		timeout = 500;

		document.getElementById("moon").classList.add("setting");
	}

	setTimeout(() => {
		document.getElementById("dayText").classList.remove("hidden");
		document.getElementById("nightText").classList.add("hidden");

		document.getElementById("moon").classList.add("hidden");
		document.getElementById("sun").classList.remove("hidden");

		if (animate) {
			document.documentElement.classList.remove("dark");
			document.getElementById("sun").classList.add("rising");
		}
	}, timeout);
}

function showNight(animate) {
	document.getElementById("moon").classList.remove("setting");
	document.getElementById("sun").classList.remove("rising");

	let timeout = 0;

	if (animate) {
		timeout = 500;

		document.getElementById("sun").classList.add("setting");
	}

	setTimeout(() => {
		document.getElementById("nightText").classList.remove("hidden");
		document.getElementById("dayText").classList.add("hidden");

		document.getElementById("sun").classList.add("hidden");
		document.getElementById("moon").classList.remove("hidden");

		if (animate) {
			document.documentElement.classList.add("dark");
			document.getElementById("moon").classList.add("rising");
		}
	}, timeout);
}

window.applyMenuItemClasses = () => {
	const menuItems = document.querySelectorAll("#menu a");
	for (let i = 0; i < menuItems.length; i++) {
		if (menuItems[i].pathname === window.location.pathname) {
			menuItems[i].classList.add("text-neutral-900", "dark:text-white");
		}
	}
	//:class="{ 'text-neutral-900 dark:text-white': window.location.pathname == '{menu.url}', 'text-neutral-700 dark:text-neutral-400': window.location.pathname != '{menu.url}' }"
};

function mobileMenuFunctionality() {
	document.getElementById("openMenu").addEventListener("click", () => {
		openMobileMenu();
	});

	document.getElementById("closeMenu").addEventListener("click", () => {
		closeMobileMenu();
	});
}

window.openMobileMenu = () => {
	document.getElementById("openMenu").classList.add("hidden");
	document.getElementById("closeMenu").classList.remove("hidden");
	document.getElementById("menu").classList.remove("hidden");
	document.getElementById("mobileMenuBackground").classList.add("opacity-0");
	document.getElementById("mobileMenuBackground").classList.remove("hidden");

	setTimeout(() => {
		document
			.getElementById("mobileMenuBackground")
			.classList.remove("opacity-0");
	}, 1);
};

window.closeMobileMenu = () => {
	document.getElementById("closeMenu").classList.add("hidden");
	document.getElementById("openMenu").classList.remove("hidden");
	document.getElementById("menu").classList.add("hidden");
	document.getElementById("mobileMenuBackground").classList.add("hidden");
};
