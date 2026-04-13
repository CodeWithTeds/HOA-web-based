<?php

namespace App\Repositories\Billing;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

interface BillingRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get paginated invoices with optional filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedInvoices(array $filters = [], int $perPage = 25): LengthAwarePaginator;

    /**
     * Get summaries for a billing period.
     *
     * @param int|null $billingPeriodId
     * @return array
     */
    public function getSummaries(int $billingPeriodId = null): array;
}
