import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/billing/periods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\BillingController::generate
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
export const generate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(args, options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/admin/billing/periods/{id}/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::generate
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
generate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return generate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::generate
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
generate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::generate
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
const generateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::generate
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
generateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generate.url(args, options),
    method: 'post',
})

generate.form = generateForm

const periods = {
    store: Object.assign(store, store),
    generate: Object.assign(generate, generate),
}

export default periods