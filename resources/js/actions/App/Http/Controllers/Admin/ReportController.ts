import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
*/
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/reports/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
*/
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
*/
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
*/
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
*/
const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
*/
exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::exportCsv
* @see app/Http/Controllers/Admin/ReportController.php:39
* @route '/admin/reports/export'
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
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:27
* @route '/admin/reports'
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

const ReportController = { exportCsv, index }

export default ReportController