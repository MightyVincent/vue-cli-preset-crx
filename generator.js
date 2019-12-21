module.exports = (api, options, rootOptions) => {

    let {name, description, pages} = options
    console.log(options, rootOptions)

    api.extendPackage({
        scripts: {
            "dev": "vue-cli-service build --mode development --watch",
        },
        devDependencies: {
            "@types/chrome": "latest",
            "copy-webpack-plugin": "latest",
            "crx-auto-reload-plugin": "latest",
            "json5": "latest",
            "zip-webpack-plugin": "latest"
        }
    })

    // 复制并用 ejs 渲染 `./template` 内所有的文件
    api.render('./template')

    api.postProcessFiles(function() {
        console.log(`----------length: ${arguments.length}`)
        console.log(Object.keys(arguments[0]))
    })

}
