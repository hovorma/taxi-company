<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\DriverRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: DriverRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Driver
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ORM\SequenceGenerator(sequenceName: 'driver_id_seq')]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank(message: 'Имя водителя не может быть пустым')]
    private ?string $name = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank(message: 'Дата рождения не может быть пустой')]
    private ?DateTimeInterface $birthday = null;

    #[ORM\ManyToOne(targetEntity: Car::class)]
    #[ORM\JoinColumn(name: 'car_id', referencedColumnName: 'id', nullable: false)]
    #[Assert\NotNull(message: 'Машина не может быть пустой')]
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getBirthday(): ?DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

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
