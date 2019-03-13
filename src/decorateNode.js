import { Map } from "immutable"
import * as MarkdownIt from "markdown-it"
import * as MarkdownItKatex from "markdown-it-katex"
import { Point, Decoration, Mark } from "slate"

const md = new MarkdownIt({ linkify: true })

md.use(MarkdownItKatex)

function parse(key, text, decorations, environment) {
	const tokens = md.parseInline(text, environment)
	if (tokens.length > 0) {
		const [{ children }] = tokens
		const stack = []
		children.reduce((offset, token) => {
			const { attrs, type, markup, content } = token
			if (type === "text") {
				return offset + content.length
			} else if (type === "image") {
				const [[_, src]] = attrs
				const start = offset + 2 + content.length + 2
				const end = start + src.length
				decorations.push(
					Decoration.create({
						anchor: Point.create({ key, offset: start }),
						focus: Point.create({ key, offset: end }),
						mark: Mark.create({ type: "img", data: Map(attrs) }),
					})
				)
				return end + 1
			} else if (type === "code_inline") {
				const nextOffset =
					offset + markup.length + content.length + markup.length
				const anchor = Point.create({ key, offset: offset })
				const focus = Point.create({ key, offset: nextOffset })
				const mark = Mark.create({ type: "code" })
				decorations.push(Decoration.create({ anchor, focus, mark }))
				return nextOffset
			} else if (type === "math_inline") {
				const nextOffset = offset + 1 + content.length + 1
				const anchor = Point.create({ key, offset: offset })
				const focus = Point.create({ key, offset: nextOffset })
				const mark = Mark.create({ type: "math", data: Map({ src: content }) })
				decorations.push(Decoration.create({ anchor, focus, mark }))
				return nextOffset
			} else if (type === "em_open") {
				stack.push({ markup, offset, type: markup === "*" ? "strong" : "em" })
				return offset + 1
			} else if (type === "strong_open") {
				const type = markup === "**" ? "strong" : "em"
				stack.push({ markup, offset, type })
				return offset + 2
			} else if (type === "link_open") {
				stack.push({ markup, offset, type: "a", data: Map(attrs) })
				if (markup === "linkify") {
					return offset
				} else {
					return offset + 1
				}
			} else if (
				type === "em_close" ||
				type === "strong_close" ||
				type === "link_close"
			) {
				const token = stack.pop()
				const nextOffset =
					type === "link_close"
						? markup === "linkify"
							? offset
							: offset + token.data.get("href").length + 3
						: offset + markup.length
				if (token.markup === markup) {
					const anchor = Point.create({ key, offset: token.offset })
					const focus = Point.create({ key, offset: nextOffset })
					const mark = Mark.create({ type: token.type, data: token.data })
					decorations.push(Decoration.create({ anchor, focus, mark }))
				} else {
					console.error("Token stack out of sync")
				}
				return nextOffset
			}
		}, 0)
		if (stack.length > 0) {
			console.error("Token stack not empty")
		}
	}
}

export default function decorateNode(node, editor, next) {
	if (node.object === "block") {
		const decorations = []
		if (node.type === "img") {
			const { key, text } = node.nodes.get(0)
			const src = node.data.get("src")
			const anchor = Point.create({
				key,
				offset: text.length - 1 - src.length,
			})
			const focus = Point.create({ key, offset: text.length - 1 })
			const mark = Mark.create({ type: "a", data: Map({ href: src }) })
			const decoration = Decoration.create({ anchor, focus, mark })
			decorations.push(decoration)
		} else {
			const env = {}
			node
				.getTexts()
				.forEach(({ key, text }) => parse(key, text, decorations, env))
		}
		return decorations
	}
}