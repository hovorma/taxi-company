<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Driver;
use App\Service\DriverService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

#[Route('/api/drivers', name: 'api_driver_')]
class DriverController extends AppController
{

    public function __construct(
        private readonly DriverService $driverService)
    {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $criteria = $request->query->all();
        $driversData = $this->driverService->getAll($criteria);
        $drivers     = [];

        foreach ($driversData["drivers"] as $driver) {
            $drivers[] = [
                'id'       => $driver->getId(),
                'name'     => $driver->getName(),
                'birthday' => $driver->getBirthday()->format('Y-m-d'),
                'car'      => [
                    'id'     => $driver->getCar()->getId(),
                    'brand'  => $driver->getCar()->getBrand(),
                    'model'  => $driver->getCar()->getModel(),
                    'number' => $driver->getCar()->getNumber(),
                ],
            ];
        }

        $data = [
            "drivers" => $drivers,
            "total"   => $driversData["total"],
            "page"    => $criteria["page"] ?? 1,
            "limit"   => $criteria["limit"] ?? 10,
        ];

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Driver $driver): JsonResponse
    {
        return $this->json($driver);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $this->driverService->save($data);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }

        return $this->json([], 201);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['PUT'])]
    public function edit(Request $request, Driver $driver): JsonResponse
    {
        try {
            $data           = json_decode($request->getContent(), true);
            $data["driver"] = $driver;

            $this->driverService->save($data);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }

        return $this->json([]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        try {
            $this->driverService->delete($id);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }

        return $this->json([]);
    }

    #[Route('/{id}/history', name: 'history', methods: ['GET'])]
    public function history(int $id): JsonResponse
    {
        try {
            $data = $this->driverService->history($id);

            return $this->json([
                'driverName' => $data["driver"]->getName(),
                'history'    => $data["history"],
            ]);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }
    }
}
