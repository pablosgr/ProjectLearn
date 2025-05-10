<?php

namespace App\Controller;

use App\Service\QuestionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use OpenApi\Attributes as OA;

#[Route('/api/question', name: 'question')]
#[OA\Tag(name: 'Questions')]
final class QuestionController extends AbstractController{
    #[Route('', name: 'post_question', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new question')]
    #[OA\RequestBody(
        description: 'Question data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'test_id', type: 'integer', example: 1),
                new OA\Property(property: 'text', type: 'string', example: 'What is 2+2?'),
                new OA\Property(property: 'type', type: 'string', example: 'multiple_choice'),
                new OA\Property(property: 'points', type: 'integer', example: 5)
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Question created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Question created successfully'),
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
        description: 'Test not found'
    )]
    public function create_question(
        Request $request,
        QuestionService $questionService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $questionService -> createQuestion($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_question', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Delete a question')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Question ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Question deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Question not found'
    )]
    public function delete_question(
        int $id,
        QuestionService $questionService,
    ): JsonResponse
    {
        $result  = $questionService -> deleteQuestion($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'update_question', methods: ['PUT'])]
    #[OA\Put(summary: 'Update a question')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Question ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\RequestBody(
        description: 'Question data to update',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'text', type: 'string', example: 'What is 3+3?'),
                new OA\Property(property: 'type', type: 'string', example: 'multiple_choice'),
                new OA\Property(property: 'points', type: 'integer', example: 10)
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Question updated successfully'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'Question not found'
    )]
    public function update_question(
        int $id,
        Request $request,
        QuestionService $questionService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $questionService -> updateQuestion($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_questions', methods: ['GET'])]
    #[OA\Get(summary: 'Get all questions')]
    #[OA\Response(
        response: 200,
        description: 'Returns all questions',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'test', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam')
                    ]),
                    new OA\Property(property: 'text', type: 'string', example: 'What is 2+2?'),
                    new OA\Property(property: 'type', type: 'string', example: 'multiple_choice'),
                    new OA\Property(property: 'points', type: 'integer', example: 5),
                    new OA\Property(property: 'options', type: 'array', items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'text', type: 'string', example: 'Four'),
                            new OA\Property(property: 'is_correct', type: 'boolean', example: true)
                        ]
                    ))
                ]
            )
        )
    )]
    public function get_all_questions(
        QuestionService $questionService
    ): JsonResponse
    {
        $result  = $questionService -> listAllQuestions();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_question_by_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get questions by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (test, type, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'test'
    )]
    #[OA\Parameter(
        name: 'value',
        in: 'query',
        description: 'Parameter value',
        schema: new OA\Schema(type: 'string'),
        example: '1'
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns questions matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'test', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam')
                    ]),
                    new OA\Property(property: 'text', type: 'string', example: 'What is 2+2?'),
                    new OA\Property(property: 'type', type: 'string', example: 'multiple_choice'),
                    new OA\Property(property: 'points', type: 'integer', example: 5)
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No questions found'
    )]
    public function get_question_by_param(
        string $param,
        QuestionService $questionService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $questionService -> listQuestionsByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
