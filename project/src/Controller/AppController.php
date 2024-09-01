<?php

declare(strict_types=1);

namespace App\Controller;

use App\Exception\SystemException;
use App\Exception\UserException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AppController extends AbstractController
{
    protected function handleException(Throwable $e): JsonResponse
    {
        $message = "Просите, ошибка.";
        $responseCode = Response::HTTP_BAD_REQUEST;
        if ($e instanceof UserException) {
            $message = $e->getMessage();
            $responseCode = $e->getCode();
        } elseif ($e instanceof SystemException) {
            $responseCode = $e->getCode();
        }

        return $this->json(['error' => $message], $responseCode);
    }
}