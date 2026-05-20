import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ResidentController::destroy
* @see app/Http/Controllers/Admin/ResidentController.php:119
* @route '/admin/residents/{resident}'
*/
export const destroy = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/residents/{resident}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::destroy
* @see app/Http/Controllers/Admin/ResidentController.php:119
* @route '/admin/residents/{resident}'
*/
destroy.url = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resident: args }
    }

    if (Array.isArray(args)) {
        args = {
            resident: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resident: args.resident,
    }

    return destroy.definition.url
            .replace('{resident}', parsedArgs.resident.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::destroy
* @see app/Http/Controllers/Admin/ResidentController.php:119
* @route '/admin/residents/{resident}'
*/
destroy.delete = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::destroy
* @see app/Http/Controllers/Admin/ResidentController.php:119
* @route '/admin/residents/{resident}'
*/
const destroyForm = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::destroy
* @see app/Http/Controllers/Admin/ResidentController.php:119
* @route '/admin/residents/{resident}'
*/
destroyForm.delete = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/residents/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::exportCsv
* @see app/Http/Controllers/Admin/ResidentController.php:133
* @route '/admin/residents/export'
*/
exportCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportCsv.form = exportCsvForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/residents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::index
* @see app/Http/Controllers/Admin/ResidentController.php:33
* @route '/admin/residents'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/residents/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::create
* @see app/Http/Controllers/Admin/ResidentController.php:49
* @route '/admin/residents/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::store
* @see app/Http/Controllers/Admin/ResidentController.php:60
* @route '/admin/residents'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/residents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::store
* @see app/Http/Controllers/Admin/ResidentController.php:60
* @route '/admin/residents'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::store
* @see app/Http/Controllers/Admin/ResidentController.php:60
* @route '/admin/residents'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::store
* @see app/Http/Controllers/Admin/ResidentController.php:60
* @route '/admin/residents'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::store
* @see app/Http/Controllers/Admin/ResidentController.php:60
* @route '/admin/residents'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
export const show = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/residents/{resident}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
show.url = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resident: args }
    }

    if (Array.isArray(args)) {
        args = {
            resident: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resident: args.resident,
    }

    return show.definition.url
            .replace('{resident}', parsedArgs.resident.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
show.get = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
show.head = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
const showForm = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
showForm.get = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::show
* @see app/Http/Controllers/Admin/ResidentController.php:74
* @route '/admin/residents/{resident}'
*/
showForm.head = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
export const edit = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/residents/{resident}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
edit.url = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resident: args }
    }

    if (Array.isArray(args)) {
        args = {
            resident: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resident: args.resident,
    }

    return edit.definition.url
            .replace('{resident}', parsedArgs.resident.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
edit.get = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
edit.head = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
const editForm = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
editForm.get = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::edit
* @see app/Http/Controllers/Admin/ResidentController.php:89
* @route '/admin/residents/{resident}/edit'
*/
editForm.head = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Admin\ResidentController::update
* @see app/Http/Controllers/Admin/ResidentController.php:105
* @route '/admin/residents/{resident}'
*/
export const update = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/residents/{resident}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ResidentController::update
* @see app/Http/Controllers/Admin/ResidentController.php:105
* @route '/admin/residents/{resident}'
*/
update.url = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { resident: args }
    }

    if (Array.isArray(args)) {
        args = {
            resident: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        resident: args.resident,
    }

    return update.definition.url
            .replace('{resident}', parsedArgs.resident.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResidentController::update
* @see app/Http/Controllers/Admin/ResidentController.php:105
* @route '/admin/residents/{resident}'
*/
update.put = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::update
* @see app/Http/Controllers/Admin/ResidentController.php:105
* @route '/admin/residents/{resident}'
*/
const updateForm = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ResidentController::update
* @see app/Http/Controllers/Admin/ResidentController.php:105
* @route '/admin/residents/{resident}'
*/
updateForm.put = (args: { resident: string | number } | [resident: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const ResidentController = { destroy, exportCsv, index, create, store, show, edit, update }

export default ResidentController