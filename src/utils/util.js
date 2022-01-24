function dateFmt(date, rule) {
    rule = rule || "yyyy-MM-dd hh:mm:ss"
    const o = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(rule)) {
            const val = o[k] + ''
            rule = rule.replace(RegExp.$1, ("00" + val).substr(val.length))
        }

    }
    return rule
}

function generateRoutes(menuList) {
    let routes = []
    const deep = (list) => {
        while (list.length) {
            let item = list.pop()
            if (item.action) {
                routes.push({
                    name: item.component,
                    path: item.path,
                    meta: {
                        title: item.menuName
                    },
                    component: item.component,
                })
            }
            if (item.children && !item.action) {
                deep(item.children)
            }
        }
    }
    deep(menuList)
    return routes
}

export default {
    dateFmt,
    generateRoutes,
}