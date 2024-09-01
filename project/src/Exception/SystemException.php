<?php

declare(strict_types=1);

namespace App\Exception;

use Exception;
use Throwable;

class SystemException extends Exception implements Throwable
{

    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
