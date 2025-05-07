<?php

namespace App\Controller;

use App\Service\TestResultService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/testresult', name: 'testresult')]

final class TestResultController extends AbstractController{
    #[Route('', name: 'post_test_result', methods: ['POST'])]
    public function create_test_result(
        TestResultService $testResultService,
        Request $request
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $testResultService -> createTestResult($data);

        return $this -> json($result['body'], $result['status']);
    }

    
    #[Route('', name: 'list_all_test_results', methods: ['GET'])]
    public function get_all_test_results(
        TestResultService $testResultService
    ): JsonResponse
    {
        $result  = $testResultService -> listAllTestResults();

        return $this -> json($result['body'], $result['status']);
    }
    
    
    #[Route('/{param}', name: 'get_test_result', methods: ['GET'])]
    public function get_test_result(
        string $param,
        TestResultService $testResultService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $testResultService -> listTestResultsByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
