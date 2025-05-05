<?php

namespace App\Controller;

use App\Service\TestService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/test', name: 'test')]

final class TestController extends AbstractController{
    #[Route('', name: 'post_test', methods: ['POST'])]
    public function create_test(
        Request $request,
        TestService $testService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $testService -> createTest($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_test', methods: ['DELETE'])]
    public function delete_test(
        int $id,
        TestService $testService,
    ): JsonResponse
    {
        $result  = $testService -> deleteTest($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'update_test', methods: ['PUT'])]
    public function update_test(
        int $id,
        Request $request,
        TestService $testService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $testService -> updateTest($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_tests', methods: ['GET'])]
    public function get_all_tests(
        TestService $testService
    ): JsonResponse
    {
        $result  = $testService -> listAllTests();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_test_by_param', methods: ['GET'])]
    public function get_test_by_param(
        string $param,
        TestService $testService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $testService -> listTestsByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
