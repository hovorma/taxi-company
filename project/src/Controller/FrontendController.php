<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontendController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'react_routing', requirements: ['reactRouting' => '^(?!api).*$'], defaults: ['reactRouting' => null])]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }
}
