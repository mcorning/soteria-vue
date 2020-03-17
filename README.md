# secours-vue

bitly: <http://bit.ly/2SOMXEo>

## orm-localforage

```
$fetch:  Load data from the IndexedDB store associated to a model and persist them in the Vuex Store
$get:    Load data by id from the IndexedDB store associated and persist it to Vuex Store
$create: Like VuexORM insertOrUpdate, but also persist data to IndexedDB
$update: Update records using VuexORM update or insertOrUpdate then persist changes to IndexedDB
$delete: Like VuexORM delete, but also remove data from IndexedDB
```

## router guards

<https://router.vuejs.org/guide/advanced/data-fetching.html>

<https://stackoverflow.com/questions/49621891/vuejs-route-navigation-guard-on-async-auth-state-request>

with:

```[{
    path: '/reporting',
    name: 'Reporting',
    component: reporting,
    meta: {
        adminOnly: true
    }
},
...]
```

from this:

```
if (to.matched.some(route => route.meta.adminOnly)) {
    if (store.getters.userInfo.isAdmin) {
        next()
    } else {
      next('/')
    }
} else {
    next()
}
```

to this:

```
if (store.getters.userInfo.isAdmin === null) {
    const watcher = store.watch(store.getters.userInfo.isAdmin, isAdmin => {
        watcher(); // stop watching
        if (isAdmin) next();
        else next('/');
    });
}
else if (store.getters.userInfo.isAdmin) next();
else next('/');
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
