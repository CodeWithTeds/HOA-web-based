import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::index
* @see app/Http/Controllers/Api/TaskController.php:26
* @route '/api/v1/tasks'
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
* @see \App\Http\Controllers\Api\TaskController::store
* @see app/Http/Controllers/Api/TaskController.php:35
* @route '/api/v1/tasks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TaskController::store
* @see app/Http/Controllers/Api/TaskController.php:35
* @route '/api/v1/tasks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::store
* @see app/Http/Controllers/Api/TaskController.php:35
* @route '/api/v1/tasks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TaskController::store
* @see app/Http/Controllers/Api/TaskController.php:35
* @route '/api/v1/tasks'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TaskController::store
* @see app/Http/Controllers/Api/TaskController.php:35
* @route '/api/v1/tasks'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
export const show = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
show.url = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: args.task,
    }

    return show.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
show.get = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
show.head = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
const showForm = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
showForm.get = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::show
* @see app/Http/Controllers/Api/TaskController.php:41
* @route '/api/v1/tasks/{task}'
*/
showForm.head = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
export const update = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/tasks/{task}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
update.url = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: args.task,
    }

    return update.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
update.put = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
update.patch = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
const updateForm = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
updateForm.put = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TaskController::update
* @see app/Http/Controllers/Api/TaskController.php:51
* @route '/api/v1/tasks/{task}'
*/
updateForm.patch = (args: { task: string | number } | [task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Api\TaskController::destroy
* @see app/Http/Controllers/Api/TaskController.php:64
* @route '/api/v1/tasks/{task}'
*/
export const destroy = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TaskController::destroy
* @see app/Http/Controllers/Api/TaskController.php:64
* @route '/api/v1/tasks/{task}'
*/
destroy.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return destroy.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::destroy
* @see app/Http/Controllers/Api/TaskController.php:64
* @route '/api/v1/tasks/{task}'
*/
destroy.delete = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\TaskController::destroy
* @see app/Http/Controllers/Api/TaskController.php:64
* @route '/api/v1/tasks/{task}'
*/
const destroyForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TaskController::destroy
* @see app/Http/Controllers/Api/TaskController.php:64
* @route '/api/v1/tasks/{task}'
*/
destroyForm.delete = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const tasks = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default tasks