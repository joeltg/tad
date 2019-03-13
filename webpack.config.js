const options = {
	presets: ["@babel/preset-env", "@babel/preset-react"],
	plugins: ["@babel/plugin-proposal-class-properties"],
}

module.exports = {
	entry: ["@babel/polyfill", "./src/index.jsx"],
	output: {
		filename: "bundle.min.js",
		path: __dirname + "/dist",
	},

	devtool: false,

	resolve: {
		extensions: [".css", ".js", ".jsx", ".json"],
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(?:node_modules|\.min\.js$|dist\/)/,
				use: [{ loader: "babel-loader", options }],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: ["file-loader"],
			},
			{
				test: /\.css$/,
				use: ["to-string-loader", "css-loader"],
			},
		],
	},
}
