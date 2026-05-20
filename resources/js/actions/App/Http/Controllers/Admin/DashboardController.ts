import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
const index750aeb224105761400ee952169bd178c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index750aeb224105761400ee952169bd178c.url(options),
    method: 'get',
})

index750aeb224105761400ee952169bd178c.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
index750aeb224105761400ee952169bd178c.url = (options?: RouteQueryOptions) => {
    return index750aeb224105761400ee952169bd178c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
index750aeb224105761400ee952169bd178c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index750aeb224105761400ee952169bd178c.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
index750aeb224105761400ee952169bd178c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index750aeb224105761400ee952169bd178c.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
const index750aeb224105761400ee952169bd178cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index750aeb224105761400ee952169bd178c.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
index750aeb224105761400ee952169bd178cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index750aeb224105761400ee952169bd178c.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/admin/dashboard'
*/
index750aeb224105761400ee952169bd178cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index750aeb224105761400ee952169bd178c.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index750aeb224105761400ee952169bd178c.form = index750aeb224105761400ee952169bd178cForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
const index3013a377ced7597dcdb8281acb1d2eac = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index3013a377ced7597dcdb8281acb1d2eac.url(options),
    method: 'get',
})

index3013a377ced7597dcdb8281acb1d2eac.definition = {
    methods: ["get","head"],
    url: '/staff/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
index3013a377ced7597dcdb8281acb1d2eac.url = (options?: RouteQueryOptions) => {
    return index3013a377ced7597dcdb8281acb1d2eac.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
index3013a377ced7597dcdb8281acb1d2eac.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index3013a377ced7597dcdb8281acb1d2eac.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
index3013a377ced7597dcdb8281acb1d2eac.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index3013a377ced7597dcdb8281acb1d2eac.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
const index3013a377ced7597dcdb8281acb1d2eacForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index3013a377ced7597dcdb8281acb1d2eac.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
index3013a377ced7597dcdb8281acb1d2eacForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index3013a377ced7597dcdb8281acb1d2eac.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
* @see app/Http/Controllers/Admin/DashboardController.php:21
* @route '/staff/dashboard'
*/
index3013a377ced7597dcdb8281acb1d2eacForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index3013a377ced7597dcdb8281acb1d2eac.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index3013a377ced7597dcdb8281acb1d2eac.form = index3013a377ced7597dcdb8281acb1d2eacForm

export const index = {
    '/admin/dashboard': index750aeb224105761400ee952169bd178c,
    '/staff/dashboard': index3013a377ced7597dcdb8281acb1d2eac,
}

const DashboardController = { index }

export default DashboardController