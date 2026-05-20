import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/billing/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::store
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\BillingController::verify
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
export const verify = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: verify.url(args, options),
    method: 'patch',
})

verify.definition = {
    methods: ["patch"],
    url: '/admin/billing/payments/{payment}/verify',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::verify
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
verify.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: args.payment,
    }

    return verify.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::verify
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
verify.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: verify.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::verify
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
const verifyForm = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verify.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::verify
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
verifyForm.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verify.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

verify.form = verifyForm

/**
* @see \App\Http\Controllers\Admin\BillingController::reject
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
export const reject = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

reject.definition = {
    methods: ["patch"],
    url: '/admin/billing/payments/{payment}/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::reject
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
reject.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: args.payment,
    }

    return reject.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::reject
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
reject.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::reject
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
const rejectForm = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::reject
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
rejectForm.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

reject.form = rejectForm

const payments = {
    store: Object.assign(store, store),
    verify: Object.assign(verify, verify),
    reject: Object.assign(reject, reject),
}

export default payments