import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transparency',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\TransparencyController::index
* @see app/Http/Controllers/Resident/TransparencyController.php:16
* @route '/transparency'
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

const transparency = {
    index: Object.assign(index, index),
}

export default transparency