<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Driver;
use App\Entity\Car;
use App\Entity\DriverCarHistory;
use App\Repository\DriverRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/drivers', name: 'api_driver_')]
class DriverController extends AbstractController
{

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator)
    {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(DriverRepository $driverRepository): JsonResponse
    {
        $drivers = $driverRepository->findAll();
        $data    = [];

        foreach ($drivers as $driver) {
            $data[] = [
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
        $data = json_decode($request->getContent(), true);

        $car = $this->entityManager->getRepository(Car::class)->find($data['car']);
        if (!$car) {
            return $this->json(['error' => 'Машина не найдена'], 404);
        }

        $driver = new Driver();
        $driver->setName($data['name']);
        $driver->setBirthday(new DateTime($data['birthday']));
        $driver->setCar($car);

        $error = $this->validateDriver($driver);

        if (!empty($error)) {
            return $this->json(['error' => $error], 400);
        }

        $this->entityManager->persist($driver);

        $driverCarHistory = new DriverCarHistory();
        $driverCarHistory->setDriver($driver);
        $driverCarHistory->setCar($car);

        $this->entityManager->persist($driverCarHistory);

        $this->entityManager->flush();

        return $this->json([], 201);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['PUT'])]
    public function edit(Request $request, Driver $driver): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $car = $this->entityManager->getRepository(Car::class)->find($data['car']);
        if (!$car) {
            return $this->json(['error' => 'Машина не найдена'], 404);
        }

        if ($driver->getCar() !== $car) {
            $driverCarHistory = new DriverCarHistory();
            $driverCarHistory->setDriver($driver);
            $driverCarHistory->setCar($car);

            $this->entityManager->persist($driverCarHistory);
        }

        $driver->setName($data['name']);
        $driver->setBirthday(new DateTime($data['birthday']));
        $driver->setCar($car);

        $error = $this->validateDriver($driver);

        if (!empty($error)) {
            return $this->json(['error' => $error], 400);
        }

        $this->entityManager->persist($driver);
        $this->entityManager->flush();

        return $this->json([]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete($id): JsonResponse
    {
        $driver = $this->entityManager->getRepository(Driver::class)->find($id);
        if (!$driver) {
            return $this->json(['error' => 'Водитель не найден'], 404);
        }

        $this->entityManager->remove($driver);
        $this->entityManager->flush();

        return $this->json([]);
    }

    #[Route('/{id}/history', name: 'history', methods: ['GET'])]
    public function history($id): JsonResponse
    {
        $driver = $this->entityManager->getRepository(Driver::class)->find($id);
        if (!$driver) {
            return $this->json(['error' => 'Водитель не найден'], 404);
        }

        $history = $this->entityManager->getRepository(DriverCarHistory::class)->findBy(['driver' => $driver]);

        $historyData = [];
        foreach ($history as $entry) {
            $historyData[] = [
                'carBrand'  => $entry->getCar()->getBrand(),
                'carModel'  => $entry->getCar()->getModel(),
                'createdAt' => $entry->getCreatedAt()->format('Y-m-d H:i:s'),
                'updatedAt' => $entry->getUpdatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json([
            'driverName' => $driver->getName(),
            'history'    => $historyData,
        ]);
    }

    private function validateDriver(Driver $driver): string
    {
        $errors = $this->validator->validate($driver);

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
