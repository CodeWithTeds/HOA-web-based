import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::index
* @see app/Http/Controllers/Admin/ChatController.php:19
* @route '/admin/chat'
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
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
export const show = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/chat/{residentId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
show.url = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { residentId: args }
    }

    if (Array.isArray(args)) {
        args = {
            residentId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        residentId: args.residentId,
    }

    return show.definition.url
            .replace('{residentId}', parsedArgs.residentId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
show.get = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
show.head = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
const showForm = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
showForm.get = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::show
* @see app/Http/Controllers/Admin/ChatController.php:26
* @route '/admin/chat/{residentId}'
*/
showForm.head = (args: { residentId: string | number } | [residentId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ChatController::store
* @see app/Http/Controllers/Admin/ChatController.php:36
* @route '/admin/chat'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ChatController::store
* @see app/Http/Controllers/Admin/ChatController.php:36
* @route '/admin/chat'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ChatController::store
* @see app/Http/Controllers/Admin/ChatController.php:36
* @route '/admin/chat'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::store
* @see app/Http/Controllers/Admin/ChatController.php:36
* @route '/admin/chat'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ChatController::store
* @see app/Http/Controllers/Admin/ChatController.php:36
* @route '/admin/chat'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const ChatController = { index, show, store }

export default ChatController