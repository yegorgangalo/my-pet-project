// const path = require('path')
// const fs = require('fs')

module.exports = function override(config, env) {
    // fs.writeFileSync(path.resolve(__dirname, 'config.txt'), JSON.stringify(config.module.rules[1], null, 2), (err) => {
    //   if (err)
    //     console.log(err);
    //   else {
    //     console.log("File written successfully\n");
    //   }
    // })

    // This line might break with other react-script versions
    //   delete config.module.rules[1].oneOf[3].include
    config.module.rules[1].oneOf.forEach((item, index) => {
        if (item.include?.includes('src')) {
            delete config.module.rules[1].oneOf[index].include
        }
    })

    return config
}