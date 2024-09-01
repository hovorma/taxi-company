<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Car;
use App\Entity\Driver;
use App\Entity\DriverCarHistory;
use App\Exception\SystemException;
use App\Exception\UserException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use DateTime;
use Symfony\Component\Validator\Validator\ValidatorInterface;

readonly class DriverService
{
    use ValidatorTrait;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface     $validator)
    {
    }

    public function getAll(?array $criteria): array
    {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('d');
        $qb->from(Driver::class, 'd');
        if (!empty($criteria["search"])) {
            $qb->andWhere(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like("lower(d.name)", ":search"),
                    )
                )
            );
            $qb->setParameter("search", "%" . mb_strtolower($criteria["search"]) . "%");
        }

        if (!empty($criteria["car"])) {
            $qb->andWhere(
                $qb->expr()->andX(
                    $qb->expr()->eq("d.car", ":car"),
                )
            );
            $qb->setParameter("car", $criteria["car"]);
        }
        $qb->addOrderBy("d.id", "DESC");

        $limit = (int) ($criteria['limit'] ?? 10);
        $page = $criteria['page'] ?? 1;
        $offset = ($page - 1) * $limit;

        $qb->setMaxResults($limit);
        $qb->setFirstResult($offset);

        $drivers = $qb->getQuery()->getResult();

        $qb->setMaxResults(null);
        $qb->setFirstResult(null);
        $qb->resetDQLPart("orderBy");
        $totalDrivers = $qb->select('COUNT(d.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            "drivers" => $drivers,
            "total"   => $totalDrivers,
        ];
    }

    public function save(?array $data): Driver
    {
        $car = $this->entityManager->getRepository(Car::class)->find($data['car']);
        if (!$car) {
            throw new SystemException('Машина не найдена', Response::HTTP_NOT_FOUND);
        }

        $driver = $data["driver"] ?? null;
        $create = false;

        if (!$driver) {
            $driver = new Driver();
            $create = true;
        } else if ($driver->getCar()->getId() !== $car->getId()) {
            $driverCarHistory = new DriverCarHistory();
            $driverCarHistory->setDriver($driver);
            $driverCarHistory->setCar($car);

            $this->entityManager->persist($driverCarHistory);
        }
        $driver->setName($data['name']);
        $driver->setBirthday(new DateTime($data['birthday']));
        $driver->setCar($car);

        $error = $this->validate($driver);

        if (!empty($error)) {
            throw new UserException($error, Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($driver);

        if ($create) {
            $driverCarHistory = new DriverCarHistory();
            $driverCarHistory->setDriver($driver);
            $driverCarHistory->setCar($car);

            $this->entityManager->persist($driverCarHistory);
        }

        $this->entityManager->flush();

        return $driver;
    }

    public function delete(int $id): void
    {
        $driver = $this->entityManager->getRepository(Driver::class)->find($id);
        if (!$driver) {
            throw new SystemException('Водитель не найден', Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($driver);
        $this->entityManager->flush();
    }

    public function history(int $id): array
    {
        $driver = $this->entityManager->getRepository(Driver::class)->find($id);
        if (!$driver) {
            throw new SystemException("Водитель не найден", Response::HTTP_NOT_FOUND);
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

        return [
            "driver"  => $driver,
            "history" => $historyData,
        ];
    }
}