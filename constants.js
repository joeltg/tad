const ID_KEY = "<--prototype-id-->"
const KIKI = "<--prototype-key-->"
const FONT_KEY = "<--prototype-font-->"
const SIZE_KEY = "<--prototype-size-->"
const THEME_KEY = "<--prototype-theme-->"
const VALUE_KEY = "<--prototype-value-->"
const SETTINGS_KEY = "<--prototype-settings-->"
const SNAPSHOT_KEY = "<- -prototype-snapshot-->"

const CTRL_KEY = navigator.platform === "MacIntel" ? "⌘" : "Ctrl"

const DEFAULT_THEME = "light"
const DARK_THEME = "dark"
const THEMES = new Set([DEFAULT_THEME, DARK_THEME])

const DEFAULT_SIZE = "medium"
const SIZES = {
	small: "Small",
	medium: "Medium",
	large: "Large",
	// ["x-large"]: "Extra Large",
}

const DEFAULT_FONT = "quattro"
const FONTS = {
	book: "ET Book",
	go: "Go Regular",
	quattro: "iA Writer Quattro",
	mono: "iA Writer Mono",
	fira: "Fira Code",
}

const inputSpacing = {
	quattro: "0.05em",
	mono: "0",
	fira: "0",
	book: "0.1em",
	go: "0.1em",
}

const quoteSpacing = {
	quattro: "-1.75ch",
	mono: "-2ch",
	fira: "-2ch",
	book: "-1em",
	go: "-0.87em",
}

const listSpacing = {
	quattro: "-1.75ch",
	mono: "-2ch",
	fira: "-2ch",
	book: "-0.68em",
	go: "-0.87em",
}

const offsets = {
	quattro: ["-1.75ch", "-2.75ch", "-3.75ch"],
	mono: ["-2ch", "-3ch", "-4ch"],
	fira: ["-2ch", "-3ch", "-4ch"],
	book: ["-0.94em", "-1.64em", "-2.35em"],
	go: ["-0.87em", "-1.44em", "-2.05em"],
}

const computedStyle = getComputedStyle(document.documentElement)
const style = document.documentElement.style

const properties = ["text", "highlight", "background", "highlight-text"]
function SET_THEME(theme, temp) {
	properties.forEach(property => {
		const variable = `--panel-${property}-color`
		const reference = `var(${variable})`
		const value =
			theme === null
				? reference
				: computedStyle.getPropertyValue(`--${theme}-${property}-color`)
		if (temp) {
			style.setProperty(`--${property}-color`, value)
		} else {
			style.setProperty(variable, value)
			style.setProperty(`--${property}-color`, reference)
		}
	})
}

function SET_FONT(font, temp) {
	if (temp) {
		if (font === null) {
			style.setProperty("--h1-offset", "var(--panel-h1-offset)")
			style.setProperty("--h2-offset", "var(--panel-h2-offset)")
			style.setProperty("--h3-offset", "var(--panel-h3-offset)")
			style.setProperty("--font-family", "var(--panel-font-family)")
			style.setProperty("--quote-spacing", "var(--panel-quote-spacing)")
			style.setProperty("--input-spacing", "var(--panel-input-spacing)")
			style.setProperty("--list-spacing", "var(--panel-list-spacing)")
		} else {
			style.setProperty("--h1-offset", offsets[font][0])
			style.setProperty("--h2-offset", offsets[font][1])
			style.setProperty("--h3-offset", offsets[font][2])
			style.setProperty("--font-family", FONTS[font])
			style.setProperty("--quote-spacing", quoteSpacing[font])
			style.setProperty("--input-spacing", inputSpacing[font])
			style.setProperty("--list-spacing", listSpacing[font])
		}
	} else {
		style.setProperty("--panel-h1-offset", offsets[font][0])
		style.setProperty("--panel-h2-offset", offsets[font][1])
		style.setProperty("--panel-h3-offset", offsets[font][2])
		style.setProperty("--panel-font-family", FONTS[font])
		style.setProperty("--panel-quote-spacing", quoteSpacing[font])
		style.setProperty("--panel-input-spacing", inputSpacing[font])
		style.setProperty("--panel-list-spacing", listSpacing[font])
		style.setProperty("--h1-offset", "var(--panel-h1-offset)")
		style.setProperty("--h2-offset", "var(--panel-h2-offset)")
		style.setProperty("--h3-offset", "var(--panel-h3-offset)")
		style.setProperty("--font-family", "var(--panel-font-family)")
		style.setProperty("--quote-spacing", "var(--panel-quote-spacing)")
		style.setProperty("--input-spacing", "var(--panel-input-spacing)")
		style.setProperty("--list-spacing", "var(--panel-list-spacing)")
	}
}

function SET_SIZE(size, temp) {
	if (temp) {
		if (size === null) {
			style.setProperty("--font-size", "var(--panel-font-size)")
		}
		style.setProperty("--font-size", size)
	} else {
		style.setProperty("--panel-font-size", size)
		style.setProperty("--font-size", "var(--panel-font-size)")
	}
}

{
	const font = localStorage.getItem(FONT_KEY)
	if (font && FONTS.hasOwnProperty(font)) {
		SET_FONT(font, false)
	}

	const size = localStorage.getItem(SIZE_KEY)
	if (size && SIZES.hasOwnProperty(size)) {
		SET_SIZE(size, false)
	}

	const theme = localStorage.getItem(THEME_KEY)
	if (theme && THEMES.has(theme)) {
		SET_THEME(theme, false)
	}
}
