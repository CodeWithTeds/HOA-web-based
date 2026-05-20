import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import periods from './periods'
import payments from './payments'
import invoices from './invoices'
/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/billing/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportMethod
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::index
* @see app/Http/Controllers/Admin/BillingController.php:28
* @route '/admin/billing'
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
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
export const createPeriod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createPeriod.url(options),
    method: 'get',
})

createPeriod.definition = {
    methods: ["get","head"],
    url: '/admin/billing/create-period',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
createPeriod.url = (options?: RouteQueryOptions) => {
    return createPeriod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
createPeriod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createPeriod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
createPeriod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createPeriod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
const createPeriodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createPeriod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
createPeriodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createPeriod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::createPeriod
* @see app/Http/Controllers/Admin/BillingController.php:41
* @route '/admin/billing/create-period'
*/
createPeriodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createPeriod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

createPeriod.form = createPeriodForm

const billing = {
    export: Object.assign(exportMethod, exportMethod),
    index: Object.assign(index, index),
    createPeriod: Object.assign(createPeriod, createPeriod),
    periods: Object.assign(periods, periods),
    payments: Object.assign(payments, payments),
    invoices: Object.assign(invoices, invoices),
}

export default billing