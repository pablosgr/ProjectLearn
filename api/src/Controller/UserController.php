<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/user', name: 'user')]

final class UserController extends AbstractController{
    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function user_register(
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request -> getContent();
        $data = json_decode($body, true);

        $result  = $userService -> registerUser($data);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/delete', name: 'user_delete', methods: ['DELETE'])]
    public function user_delete(
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request -> getContent();
        $data = json_decode($body, true);

        $result  = $userService -> deleteUser($data);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/list', name: 'users_list', methods: ['GET'])]
    public function users_list(
        UserService $userService
    ): JsonResponse
    {
        $result  = $userService -> listUsers();

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/listparam', name: 'users_param_list', methods: ['GET'])]
    public function users_param_list(
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request -> getContent();
        $data = json_decode($body, true);

        $result  = $userService -> listUsersByParam($data);

        return $this -> json($result['body'], $result['status']);
    }
}
