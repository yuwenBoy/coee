let util = {

}

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.CheckCustomerRouter = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    let routerObj = null;
    for (let item of routers) {
        if (item.url === name) {
            return item;
        }
        routerObj = util.CheckCustomerRouter(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.getOpenMenu = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    let oMenu = [];
    routers.forEach(menu => {
        menu.children.forEach(m => {
            if (m.url == name) {
                oMenu.push(menu.treeCode);
            }
        });
    });
    return oMenu;
}

export default util