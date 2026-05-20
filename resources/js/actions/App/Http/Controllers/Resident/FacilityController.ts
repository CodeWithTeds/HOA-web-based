import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/facilities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\FacilityController::index
* @see app/Http/Controllers/Resident/FacilityController.php:20
* @route '/facilities'
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
* @see \App\Http\Controllers\Resident\FacilityController::storeBooking
* @see app/Http/Controllers/Resident/FacilityController.php:40
* @route '/facilities/book'
*/
export const storeBooking = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBooking.url(options),
    method: 'post',
})

storeBooking.definition = {
    methods: ["post"],
    url: '/facilities/book',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Resident\FacilityController::storeBooking
* @see app/Http/Controllers/Resident/FacilityController.php:40
* @route '/facilities/book'
*/
storeBooking.url = (options?: RouteQueryOptions) => {
    return storeBooking.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\FacilityController::storeBooking
* @see app/Http/Controllers/Resident/FacilityController.php:40
* @route '/facilities/book'
*/
storeBooking.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBooking.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Resident\FacilityController::storeBooking
* @see app/Http/Controllers/Resident/FacilityController.php:40
* @route '/facilities/book'
*/
const storeBookingForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeBooking.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Resident\FacilityController::storeBooking
* @see app/Http/Controllers/Resident/FacilityController.php:40
* @route '/facilities/book'
*/
storeBookingForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeBooking.url(options),
    method: 'post',
})

storeBooking.form = storeBookingForm

const FacilityController = { index, storeBooking }

export default FacilityController