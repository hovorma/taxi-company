<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Car;
use App\Repository\CarRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/cars', name: 'api_car_')]
class CarController extends AbstractController
{

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator)
    {
    }

    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(CarRepository $carRepository): JsonResponse
    {
        $cars = $carRepository->findAll();
        return $this->json($cars);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Car $car): JsonResponse
    {
        return $this->json($car);
    }

    #[Route('/new', name: 'new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $car = new Car();
        $car->setNumber($data['number']);
        $car->setBrand($data['brand']);
        $car->setModel($data['model']);

        $error = $this->validateCar($car);

        if (!empty($error)) {
            return $this->json(['error' => $error], 400);
        }

        $this->entityManager->persist($car);
        $this->entityManager->flush();

        return $this->json($car);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['PUT'])]
    public function edit(Request $request, Car $car): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $car->setNumber($data['number']);
        $car->setBrand($data['brand']);
        $car->setModel($data['model']);

        $error = $this->validateCar($car);

        if (!empty($error)) {
            return $this->json(['error' => $error], 400);
        }

        $this->entityManager->persist($car);
        $this->entityManager->flush();

        return $this->json($car);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Car $car): JsonResponse
    {
        $this->entityManager->remove($car);
        $this->entityManager->flush();

        return $this->json([]);
    }

    private function validateCar(Car $car): string
    {
        $errors = $this->validator->validate($car);

        $error = "";
        if (count($errors) > 0) {
            $errorMessages = [];

            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }

            $error = implode(", ", $errorMessages);
        }

        return $error;
    }
}
