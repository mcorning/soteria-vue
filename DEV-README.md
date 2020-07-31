# Soteria-vue

## Design

### Roles

Soteria-Vue works with two Roles. A human is behind both Roles.

1. Room
2. Visitor

The person behind the Room can change; they can be a Room manager (e.g., Care Home Manager) or a receptionist. Rooms are part of Organizations. Organizations are secure data repositories.

The Visitor is always the same person.

### Capabilities

Soteria-Vue has three levels of service (SLA):

1. Local Contact Tracing (requires no interaction with Room)
2. Symptom Tracking (with visual Risk Score) (enables limited interaction with Room)
3. Cryptographic (automated Room risk policy verification using personal and covid credentials)




## Overview

Soteria-vue uses VueJs on the front end, Trinsic server on the backend, and Azure functions in the middle.

For local development:
  1. use the `serve` script for Soteria-vue
  2. use the `start` script for streetcred

> NOTE: to enable local development and debugging we updated the start script by adding the cors argument:
>
>     "start": "func host start --cors *",

## To debug Soteria-vue:

1. run the `serve` script
2. Press F5

You should see (Network IP may differ):
>App running at:
>
>- Local:   http://localhost:8080/
>   - Network: http://192.168.1.7:8080/
>
>   Note that the development build is not optimized.
>   To create a production build, run npm run build.

## To debug SoteriaStreetcred:

1. be sure you close any session in the terminal with a `ctrl-c` 
2. Press F5
3. wait for the screen to display

> Http Functions:
>
>         Streetcred: [GET,POST] http://localhost:7071/api/Streetcred
>
> [6/12/2020 1:23:52 AM] Host lock lease acquired by instance ID '000000000000000000000000C12FDB8F'.
>
> [6/12/2020 1:23:53 AM] Debugger attached.
>
>> NOTE: if you start using the azure function before you see the last line, the debugger will not be working. Wait until the debugger attaches before you use the debugger on the function.

---------------------------------------------------------------------------------------------------------------------------

## Old Material (may be deprecated)

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
