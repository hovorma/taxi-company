<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\DriverCarHistoryRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DriverCarHistoryRepository::class)]
#[ORM\HasLifecycleCallbacks]
class DriverCarHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\SequenceGenerator(sequenceName: 'driver_car_history_id_seq')]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Driver::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Driver $driver = null;

    #[ORM\ManyToOne(targetEntity: Car::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Car $car = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private DateTimeInterface $createdAt;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDriver(): ?Driver
    {
        return $this->driver;
    }

    public function setDriver(?Driver $driver): self
    {
        $this->driver = $driver;

        return $this;
    }

    public function getCar(): ?Car
    {
        return $this->car;
    }

    public function setCar(?Car $car): self
    {
        $this->car = $car;

        return $this;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?DateTimeInterface
    {
        return $this->updatedAt;
    }
}