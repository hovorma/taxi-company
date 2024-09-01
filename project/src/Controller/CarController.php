<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Car;
use App\Service\CarService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

#[Route('/api/cars', name: 'api_car_')]
class CarController extends AppController
{
    public function __construct(
        private readonly CarService $carService)
    {
    }

    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $criteria = $request->query->all();
        $carsData = $this->carService->getAll($criteria);

        $data = [
            "cars"  => $carsData["cars"],
            "total" => $carsData["total"],
            "page"  => $criteria["page"] ?? 1,
            "limit" => $criteria["limit"] ?? 10,
        ];

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Car $car): JsonResponse
    {
        return $this->json($car);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $this->carService->save($data);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }

        return $this->json([]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['PUT'])]
    public function edit(Request $request, Car $car): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $data["car"] = $car;

            $this->carService->save($data);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }

        return $this->json([]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        try {
            $this->carService->delete($id);
        } catch (Throwable $e) {
            return parent::handleException($e);
        }

        return $this->json([]);
    }
}
