<?php

declare(strict_types=1);

namespace App\Service;

trait ValidatorTrait
{
    public function validate(object $entity): string
    {
        $errors = $this->validator->validate($entity);

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