import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Resident\BillingController::index
* @see app/Http/Controllers/Resident/BillingController.php:18
* @route '/billing'
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
* @see \App\Http\Controllers\Resident\BillingController::uploadProof
* @see app/Http/Controllers/Resident/BillingController.php:25
* @route '/billing/proof'
*/
export const uploadProof = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadProof.url(options),
    method: 'post',
})

uploadProof.definition = {
    methods: ["post"],
    url: '/billing/proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Resident\BillingController::uploadProof
* @see app/Http/Controllers/Resident/BillingController.php:25
* @route '/billing/proof'
*/
uploadProof.url = (options?: RouteQueryOptions) => {
    return uploadProof.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\BillingController::uploadProof
* @see app/Http/Controllers/Resident/BillingController.php:25
* @route '/billing/proof'
*/
uploadProof.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadProof.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Resident\BillingController::uploadProof
* @see app/Http/Controllers/Resident/BillingController.php:25
* @route '/billing/proof'
*/
const uploadProofForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadProof.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Resident\BillingController::uploadProof
* @see app/Http/Controllers/Resident/BillingController.php:25
* @route '/billing/proof'
*/
uploadProofForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadProof.url(options),
    method: 'post',
})

uploadProof.form = uploadProofForm

const BillingController = { index, uploadProof }

export default BillingController