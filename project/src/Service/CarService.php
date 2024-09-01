<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Car;
use App\Exception\SystemException;
use App\Exception\UserException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

readonly class CarService
{
    use ValidatorTrait;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator)
    {
    }

    public function getAll(?array $criteria): array
    {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('c');
        $qb->from(Car::class, 'c');
        if (!empty($criteria["search"])) {
            $qb->andWhere(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like("lower(c.brand)", ":search"),
                        $qb->expr()->like("lower(c.model)", ":search"),
                        $qb->expr()->like("lower(c.number)", ":search"),
                    )
                )
            );
            $qb->setParameter("search", "%" . mb_strtolower($criteria["search"]) . "%");
        }
        $qb->addOrderBy("c.id", "DESC");

        $limit = (int) ($criteria['limit'] ?? 10);
        $page = $criteria['page'] ?? 1;
        $offset = ($page - 1) * $limit;

        $qb->setMaxResults($limit);
        $qb->setFirstResult($offset);

        $cars = $qb->getQuery()->getResult();

        $qb->setMaxResults(null);
        $qb->setFirstResult(null);
        $qb->resetDQLPart("orderBy");
        $totalCars = $qb->select('COUNT(c.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            "cars"  => $cars,
            "total" => $totalCars,
        ];
    }

    public function save(array $data): Car
    {
        $car = $data["car"] ?? null;
        if (!$car) {
            $car = new Car();
        }

        $car->setNumber($data['number']);
        $car->setBrand($data['brand']);
        $car->setModel($data['model']);

        $error = $this->validate($car);

        if (!empty($error)) {
            throw new UserException($error, Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($car);
        $this->entityManager->flush();

        return $car;
    }

    public function delete(int $id): void
    {
        $car = $this->entityManager->getRepository(Car::class)->find($id);
        if (!$car) {
            throw new SystemException('Машина не найдена', Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($car);
        $this->entityManager->flush();
    }
}