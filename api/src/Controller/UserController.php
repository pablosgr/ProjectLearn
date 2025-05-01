<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/user', name: 'user')]

final class UserController extends AbstractController{
    #[Route('', name: 'user_register', methods: ['POST'])]
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


    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'])]
    public function user_delete(
        string $id,
        UserService $userService
    ): JsonResponse
    {

        $result  = $userService -> deleteUser($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'user_update', methods: ['PUT'])]
    public function user_update(
        string $id,
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request -> getContent();
        $data = json_decode($body, true);

        $result  = $userService -> updateUser($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'user_list', methods: ['GET'])]
    public function users_list(
        UserService $userService
    ): JsonResponse
    {
        $result  = $userService -> listAllUsers();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'user_list_param', methods: ['GET'])]
    public function users_param_list(
        string $param,
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');

        $result  = $userService -> listUsersByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
