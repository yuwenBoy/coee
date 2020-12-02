
import Main from '@/views/Main'

// 需要左侧菜单展示
export const appRouter = [
    {
        path: '/list',
        icon: 'list',
        title: '发票业务',
        component: Main,
        children: [
            { path: '/list', meta: { title: '创建发票/行程单' }, name: 'list', component: () => import('@/views/list') },
            { path: '/ItineraryInvoice',meta: { title: '行程单列表' }, name: 'Itinerary', component: () => import('@/views/ListTravelItinerary') },
            { path: '/invoiceManagement', meta: { title: '票号库管理' }, name: 'invoiceManagement', component: () => import('@/views/invoiceManagement') },
            { path: '/TaxInvoice', meta: { title: '发票列表' }, name: 'TaxInvoice', component: () => import('@/views/ListTaxInvoice') }
        ]
    },
    {
        path: '/Express',
        icon: 'list',
        title: '快递管理',
        component: Main,
        children: [
            { path: '/Express/Create', meta: { title: '申请快递' }, name: 'ExpressCreate', component: () => import('@/views/Express/Create') },
            { path: '/Express/List',meta: { title: '快递列表' }, name: 'ExpressList', component: () => import('@/views/Express/List') },
            { path: '/Express/Address', meta: { title: '常用地址簿' }, name: 'ExpressAddress', component: () => import('@/views/Express/Address') }
        ]
    }
]

export const otherRouter = {
    path: '/listDetail',
    name: 'otherRouter',
    redirect: '/list',
    component: Main,
    children: [
        { path: '/TaxInfo/:Id', meta: { title: '发票详情' }, name: 'TaxInfo', component: () => import('@/views/TaxInfo') },
        { path: '/InvoiceInfo/:Id',meta: {  title: '行程单详情' }, name: 'InvoiceInfo', component: () => import('@/views/ItineraryInfo') },
        { path: '/ExpressDetail/:Id',meta: {  title: '快递详情' }, name: 'ExpressDetail', component: () => import('@/views/Express/Detail') }
    ]
};

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};


export const is403 = {
    path: 'is403',
    name: 'is403',
    meta: {
        title: '没有权限'
    },
    component: () => import('@/views/OnError/is403')
};

export const is404 = {
    path: 'is404',
    name: 'is404',
    meta: {
        title: '页面消失'
    },
    component: () => import('@/views/OnError/is404')
};

export const is500 = {
    path: 'is500',
    name: 'is500',
    meta: {
        title: '出错了'
    },
    component: () => import('@/views/OnError/is500')
};

export const welcome = {
    path: '/',
    name: 'welcome',
    redirect: '/welcome',
    component: Main,
    children: [
        {path: '/welcome',meta: {  title: '欢迎' }, name: 'welcome',component:() => import('@/views/welcome')}
    ]
}


export const routers=[
    is403,
    is404,
    is500,
    loginRouter,
    otherRouter,
    welcome,
    ...appRouter
]