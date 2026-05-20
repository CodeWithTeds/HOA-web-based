import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FacilityController::destroy
* @see app/Http/Controllers/Admin/FacilityController.php:56
* @route '/admin/facilities/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/facilities/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::destroy
* @see app/Http/Controllers/Admin/FacilityController.php:56
* @route '/admin/facilities/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::destroy
* @see app/Http/Controllers/Admin/FacilityController.php:56
* @route '/admin/facilities/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::destroy
* @see app/Http/Controllers/Admin/FacilityController.php:56
* @route '/admin/facilities/{id}'
*/
const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::destroy
* @see app/Http/Controllers/Admin/FacilityController.php:56
* @route '/admin/facilities/{id}'
*/
destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/facilities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::index
* @see app/Http/Controllers/Admin/FacilityController.php:18
* @route '/admin/facilities'
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
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/facilities/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::create
* @see app/Http/Controllers/Admin/FacilityController.php:25
* @route '/admin/facilities/create'
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
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/facilities/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::edit
* @see app/Http/Controllers/Admin/FacilityController.php:30
* @route '/admin/facilities/{id}/edit'
*/
editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
export const calendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

calendar.definition = {
    methods: ["get","head"],
    url: '/admin/facilities/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
const calendarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: calendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
calendarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: calendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::calendar
* @see app/Http/Controllers/Admin/FacilityController.php:37
* @route '/admin/facilities/calendar'
*/
calendarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: calendar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

calendar.form = calendarForm

/**
* @see \App\Http\Controllers\Admin\FacilityController::store
* @see app/Http/Controllers/Admin/FacilityController.php:44
* @route '/admin/facilities'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/facilities',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::store
* @see app/Http/Controllers/Admin/FacilityController.php:44
* @route '/admin/facilities'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::store
* @see app/Http/Controllers/Admin/FacilityController.php:44
* @route '/admin/facilities'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::store
* @see app/Http/Controllers/Admin/FacilityController.php:44
* @route '/admin/facilities'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::store
* @see app/Http/Controllers/Admin/FacilityController.php:44
* @route '/admin/facilities'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\FacilityController::update
* @see app/Http/Controllers/Admin/FacilityController.php:50
* @route '/admin/facilities/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/facilities/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\FacilityController::update
* @see app/Http/Controllers/Admin/FacilityController.php:50
* @route '/admin/facilities/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityController::update
* @see app/Http/Controllers/Admin/FacilityController.php:50
* @route '/admin/facilities/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::update
* @see app/Http/Controllers/Admin/FacilityController.php:50
* @route '/admin/facilities/{id}'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FacilityController::update
* @see app/Http/Controllers/Admin/FacilityController.php:50
* @route '/admin/facilities/{id}'
*/
updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const FacilityController = { destroy, index, create, edit, calendar, store, update }

export default FacilityController