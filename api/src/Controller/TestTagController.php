<?php

namespace App\Controller;

use App\Service\TestTagService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/testtags', name: 'test_tags')]
#[OA\Tag(name: 'Test Tags')]
class TestTagController extends AbstractController
{
    public function __construct(
        private TestTagService $testTagService
    ) {}

    #[Route('', name: 'add_test_tag', methods: ['POST'])]
    #[OA\Post(summary: 'Add a tag to a test')]
    #[OA\RequestBody(
        description: 'Tag-test relation data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'tag_id', type: 'integer', example: 1),
                new OA\Property(property: 'test_id', type: 'integer', example: 2)
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Tag added to test successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Tag added to test successfully'),
                new OA\Property(property: 'tag_name', type: 'string', example: 'Algebra'),
                new OA\Property(property: 'test_name', type: 'string', example: 'Midterm Exam')
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Missing required fields'
    )]
    #[OA\Response(
        response: 404,
        description: 'Tag or test not found'
    )]
    #[OA\Response(
        response: 409,
        description: 'Tag already applied to test'
    )]
    public function addTagToTest(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $result = $this->testTagService->addTagToTest($data);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/tag/{tagId}/test/{testId}', name: 'remove_test_tag', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Remove a tag from a test')]
    #[OA\Parameter(
        name: 'tagId',
        in: 'path',
        description: 'Tag ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Parameter(
        name: 'testId',
        in: 'path',
        description: 'Test ID',
        schema: new OA\Schema(type: 'integer'),
        example: 2
    )]
    #[OA\Response(
        response: 200,
        description: 'Tag removed from test successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Tag, test, or relation not found'
    )]
    public function removeTagFromTest(int $tagId, int $testId): JsonResponse
    {
        $result = $this->testTagService->removeTagFromTest($tagId, $testId);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/test/{id}', name: 'get_test_tags', methods: ['GET'])]
    #[OA\Get(summary: 'Get all tags associated with a test')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Test ID',
        schema: new OA\Schema(type: 'integer'),
        example: 2
    )]
    #[OA\Response(
        response: 200,
        description: 'List of test tags',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Algebra')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Test not found'
    )]
    public function getTestTags(int $id): JsonResponse
    {
        $result = $this->testTagService->getTestTags($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/tag/{id}', name: 'get_tests_by_tag', methods: ['GET'])]
    #[OA\Get(summary: 'Get all tests with a specific tag')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Tag ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'List of tests with the tag',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 2),
                    new OA\Property(property: 'name', type: 'string', example: 'Midterm Exam'),
                    new OA\Property(property: 'category', type: 'string', example: 'Mathematics'),
                    new OA\Property(property: 'author', type: 'string', example: 'Jane Doe')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Tag not found'
    )]
    public function getTestsByTag(int $id): JsonResponse
    {
        $result = $this->testTagService->getTestsByTag($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }
}
