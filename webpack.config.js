const fs = require('fs')
const { Compilation } = require('webpack')
class RemoveLogs {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        console.log('Hello from the custom plugin')
        compiler.hooks.done.tap('RemoveLogs', stats => {
            try {
                console.log('将要移除所有的console')
                this.removeAllLogs(stats)
            } catch (error) {
                console.log(error)
            }
        })
        compiler.hooks.compilation.tap('HelloCompilation', compilation => {
            compilation.hooks.chunkIds.tap('HelloCompilationPlugin', (c) => {
                this.filename = Array.from(c)[0].name
            })
        })
    }

    removeAllLogs(stats) {
        const { path, filename } = stats.compilation.options.output;
        let filePath = (path + '/' + filename).replace(/\[name\]/g, this.filename)
        console.log('filePath', filePath)

        try {
            fs.readFile(filePath, "utf-8", (err, data) => {
                const regx = /console.log\(['|"](.*?)['|"]\)/
                console.log('data-0---', data)
                const newData = data.replace(regx, "")
                if (err) console.log(err)
                fs.writeFile(filePath, newData, (err) => {
                    if (err) return console.log(err)
                    console.log('logs removed')
                })
            })
        } catch (error) {
            console.log(error)
        }


    }
}



module.exports = {
    entry: './index.js',
    plugins: [new RemoveLogs()]
}