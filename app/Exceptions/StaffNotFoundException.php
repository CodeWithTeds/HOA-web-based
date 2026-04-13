<?php

namespace App\Exceptions;

use Exception;

class StaffNotFoundException extends Exception
{
    public function render($request)
    {
        return request()->expectsJson()
            ? response()->json(['message' => $this->getMessage()], 404)
            : abort(404, $this->getMessage());
    }
}
