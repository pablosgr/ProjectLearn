<?php

namespace App\Controller;

use App\Service\TestService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/test', name: 'test')]
#[OA\Tag(name: 'Tests')]
final class TestController extends AbstractController{
    #[Route('', name: 'post_test', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new test')]
    #[OA\RequestBody(
        description: 'Test data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam'),
                new OA\Property(property: 'author', type: 'integer', example: 1),
                new OA\Property(property: 'category', type: 'integer', example: 2)
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Test created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Test created successfully'),
                new OA\Property(property: 'id', type: 'integer', example: 1)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'Author or category not found'
    )]
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
    #[OA\Delete(summary: 'Delete a test')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Test ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Test deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Test not found'
    )]
    public function delete_test(
        int $id,
        TestService $testService,
    ): JsonResponse
    {
        $result  = $testService -> deleteTest($id);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/{id}', name: 'update_test', methods: ['PUT'])]
    #[OA\Put(summary: 'Update a test')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Test ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\RequestBody(
        description: 'Test data to update',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Final Exam'),
                new OA\Property(property: 'category', type: 'integer', example: 3)
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Test updated successfully'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'Test or category not found'
    )]
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
    #[OA\Get(summary: 'Get all tests')]
    #[OA\Response(
        response: 200,
        description: 'Returns all tests',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam'),
                    new OA\Property(property: 'author', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe')
                    ]),
                    new OA\Property(property: 'category', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 2),
                        new OA\Property(property: 'name', type: 'string', example: 'Mathematics')
                    ]),
                    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2025-05-01T10:00:00'),
                    new OA\Property(property: 'questions', type: 'array', items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'question_text', type: 'string', example: 'What is 2+2?'),
                            new OA\Property(property: 'type', type: 'string', example: 'multiple_choice'),
                            new OA\Property(property: 'options', type: 'array', items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 1),
                                    new OA\Property(property: 'option_text', type: 'string', example: 'Four'),
                                    new OA\Property(property: 'is_correct', type: 'boolean', example: true),
                                    new OA\Property(property: 'index_order', type: 'integer', example: 1)
                                ]
                            ))
                        ]
                    ))
                ]
            )
        )
    )]
    public function get_all_tests(
        TestService $testService
    ): JsonResponse
    {
        $result  = $testService -> listAllTests();

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/{param}', name: 'get_test_by_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get tests by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (author, category, name, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'category'
    )]
    #[OA\Parameter(
        name: 'value',
        in: 'query',
        description: 'Parameter value',
        schema: new OA\Schema(type: 'string'),
        example: '2'
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns tests matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam'),
                    new OA\Property(property: 'category', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 2),
                        new OA\Property(property: 'name', type: 'string', example: 'Mathematics')
                    ]),
                    new OA\Property(property: 'author', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                        new OA\Property(property: 'username', type: 'string', example: 'johndoe')
                    ]),
                    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2025-05-01T10:00:00'),
                    new OA\Property(property: 'questions', type: 'array', items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'question_text', type: 'string', example: 'What is 2+2?'),
                            new OA\Property(property: 'type', type: 'string', example: 'multiple_choice'),
                            new OA\Property(property: 'options', type: 'array', items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 1),
                                    new OA\Property(property: 'option_text', type: 'string', example: 'Four'),
                                    new OA\Property(property: 'is_correct', type: 'boolean', example: true),
                                    new OA\Property(property: 'index_order', type: 'integer', example: 1)
                                ]
                            ))
                        ]
                    ))
                ]
            )
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid parameter'
    )]
    #[OA\Response(
        response: 404,
        description: 'No tests found'
    )]
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
