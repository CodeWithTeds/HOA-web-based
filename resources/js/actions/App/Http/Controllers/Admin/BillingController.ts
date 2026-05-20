import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/admin/billing/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
*/
exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::exportCsv
* @see app/Http/Controllers/Admin/BillingController.php:112
* @route '/admin/billing/export'
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

/**
* @see \App\Http\Controllers\Admin\BillingController::storePeriod
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
export const storePeriod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePeriod.url(options),
    method: 'post',
})

storePeriod.definition = {
    methods: ["post"],
    url: '/admin/billing/periods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::storePeriod
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
storePeriod.url = (options?: RouteQueryOptions) => {
    return storePeriod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::storePeriod
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
storePeriod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePeriod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::storePeriod
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
const storePeriodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePeriod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::storePeriod
* @see app/Http/Controllers/Admin/BillingController.php:51
* @route '/admin/billing/periods'
*/
storePeriodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePeriod.url(options),
    method: 'post',
})

storePeriod.form = storePeriodForm

/**
* @see \App\Http\Controllers\Admin\BillingController::generateInvoices
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
export const generateInvoices = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateInvoices.url(args, options),
    method: 'post',
})

generateInvoices.definition = {
    methods: ["post"],
    url: '/admin/billing/periods/{id}/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::generateInvoices
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
generateInvoices.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return generateInvoices.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::generateInvoices
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
generateInvoices.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateInvoices.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::generateInvoices
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
const generateInvoicesForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateInvoices.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::generateInvoices
* @see app/Http/Controllers/Admin/BillingController.php:63
* @route '/admin/billing/periods/{id}/generate'
*/
generateInvoicesForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateInvoices.url(args, options),
    method: 'post',
})

generateInvoices.form = generateInvoicesForm

/**
* @see \App\Http\Controllers\Admin\BillingController::recordPayment
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
export const recordPayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordPayment.url(options),
    method: 'post',
})

recordPayment.definition = {
    methods: ["post"],
    url: '/admin/billing/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::recordPayment
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
recordPayment.url = (options?: RouteQueryOptions) => {
    return recordPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::recordPayment
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
recordPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordPayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::recordPayment
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
const recordPaymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recordPayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::recordPayment
* @see app/Http/Controllers/Admin/BillingController.php:74
* @route '/admin/billing/payments'
*/
recordPaymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recordPayment.url(options),
    method: 'post',
})

recordPayment.form = recordPaymentForm

/**
* @see \App\Http\Controllers\Admin\BillingController::verifyPayment
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
export const verifyPayment = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: verifyPayment.url(args, options),
    method: 'patch',
})

verifyPayment.definition = {
    methods: ["patch"],
    url: '/admin/billing/payments/{payment}/verify',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::verifyPayment
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
verifyPayment.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return verifyPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::verifyPayment
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
verifyPayment.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: verifyPayment.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::verifyPayment
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
const verifyPaymentForm = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::verifyPayment
* @see app/Http/Controllers/Admin/BillingController.php:84
* @route '/admin/billing/payments/{payment}/verify'
*/
verifyPaymentForm.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

verifyPayment.form = verifyPaymentForm

/**
* @see \App\Http\Controllers\Admin\BillingController::rejectPayment
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
export const rejectPayment = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejectPayment.url(args, options),
    method: 'patch',
})

rejectPayment.definition = {
    methods: ["patch"],
    url: '/admin/billing/payments/{payment}/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::rejectPayment
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
rejectPayment.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rejectPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::rejectPayment
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
rejectPayment.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejectPayment.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::rejectPayment
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
const rejectPaymentForm = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejectPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::rejectPayment
* @see app/Http/Controllers/Admin/BillingController.php:94
* @route '/admin/billing/payments/{payment}/reject'
*/
rejectPaymentForm.patch = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejectPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

rejectPayment.form = rejectPaymentForm

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
export const showInvoice = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showInvoice.url(args, options),
    method: 'get',
})

showInvoice.definition = {
    methods: ["get","head"],
    url: '/admin/billing/invoices/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
showInvoice.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showInvoice.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
showInvoice.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
showInvoice.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showInvoice.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
const showInvoiceForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
showInvoiceForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showInvoice.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BillingController::showInvoice
* @see app/Http/Controllers/Admin/BillingController.php:104
* @route '/admin/billing/invoices/{id}'
*/
showInvoiceForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showInvoice.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showInvoice.form = showInvoiceForm

const BillingController = { exportCsv, index, createPeriod, storePeriod, generateInvoices, recordPayment, verifyPayment, rejectPayment, showInvoice }

export default BillingController