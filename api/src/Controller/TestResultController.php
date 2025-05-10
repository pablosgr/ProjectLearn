<?php

namespace App\Controller;

use App\Service\TestResultService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/testresult', name: 'testresult')]
#[OA\Tag(name: 'Test Results')]
final class TestResultController extends AbstractController{
    #[Route('', name: 'post_test_result', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new test result')]
    #[OA\RequestBody(
        description: 'Test result data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'user', type: 'integer', example: 1),
                new OA\Property(property: 'classroom', type: 'integer', example: 2),
                new OA\Property(property: 'test', type: 'integer', example: 3),
                new OA\Property(property: 'score', type: 'number', example: 85),
                new OA\Property(property: 'total_questions', type: 'integer', example: 10),
                new OA\Property(property: 'correct_answers', type: 'integer', example: 8),
                new OA\Property(property: 'status', type: 'string', example: 'completed'),
                new OA\Property(property: 'started_at', type: 'string', format: 'date-time', example: '2025-05-08T10:15:00'),
                new OA\Property(property: 'ended_at', type: 'string', format: 'date-time', example: '2025-05-08T10:45:00')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Test result created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Test result created successfully'),
                new OA\Property(property: 'id', type: 'integer', example: 1)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
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
    #[OA\Get(summary: 'Get all test results')]
    #[OA\Response(
        response: 200,
        description: 'Returns all test results',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'student', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe')
                    ]),
                    new OA\Property(property: 'classroom', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 2),
                        new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101')
                    ]),
                    new OA\Property(property: 'test', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 3),
                        new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam')
                    ]),
                    new OA\Property(property: 'score', type: 'number', example: 85),
                    new OA\Property(property: 'status', type: 'string', example: 'completed'),
                    new OA\Property(property: 'completed_at', type: 'string', format: 'date-time', example: '2025-05-08T10:45:00')
                ]
            )
        )
    )]
    public function get_all_test_results(
        TestResultService $testResultService
    ): JsonResponse
    {
        $result  = $testResultService -> listAllTestResults();

        return $this -> json($result['body'], $result['status']);
    }
    
    
    #[Route('/{param}', name: 'get_test_result', methods: ['GET'])]
    #[OA\Get(summary: 'Get test results by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (student, classroom, test)',
        schema: new OA\Schema(type: 'string'),
        example: 'student'
    )]
    #[OA\Parameter(
        name: 'value',
        in: 'query',
        description: 'Parameter value (ID)',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns test results matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'student', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe')
                    ]),
                    new OA\Property(property: 'classroom', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 2),
                        new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101')
                    ]),
                    new OA\Property(property: 'test', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 3),
                        new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam')
                    ]),
                    new OA\Property(property: 'score', type: 'number', example: 85),
                    new OA\Property(property: 'status', type: 'string', example: 'completed'),
                    new OA\Property(property: 'completed_at', type: 'string', format: 'date-time', example: '2025-05-08T10:45:00')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No results found'
    )]
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
