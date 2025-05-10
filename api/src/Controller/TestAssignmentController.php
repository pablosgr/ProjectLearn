<?php

namespace App\Controller;

use App\Service\TestAssignmentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/assignedtests', name: 'assigned_tests')]
#[OA\Tag(name: 'Test Assignments')]
class TestAssignmentController extends AbstractController
{
    public function __construct(
        private TestAssignmentService $testAssignmentService
    ) {}

    #[Route('', name: 'assign_test', methods: ['POST'])]
    #[OA\Post(summary: 'Assign a test to a classroom')]
    #[OA\RequestBody(
        description: 'Assignment data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'classroom_id', type: 'integer', example: 1),
                new OA\Property(property: 'test_id', type: 'integer', example: 2),
                new OA\Property(property: 'unit_id', type: 'integer', example: 3, nullable: true),
                new OA\Property(property: 'due_date', type: 'string', format: 'date-time', example: '2025-06-15T23:59:59', nullable: true),
                new OA\Property(property: 'time_limit', type: 'integer', example: 45, nullable: true),
                new OA\Property(property: 'visibility', type: 'boolean', example: true, nullable: true),
                new OA\Property(property: 'is_mandatory', type: 'boolean', example: true, nullable: true)
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Test assigned successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Test assigned successfully'),
                new OA\Property(property: 'classroom_name', type: 'string', example: 'Mathematics 101'),
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
        description: 'Classroom, test, or unit not found'
    )]
    #[OA\Response(
        response: 409,
        description: 'Test already assigned to classroom'
    )]
    public function assignTest(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $result = $this->testAssignmentService->assignTest($data);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/classroom/{classroomId}/test/{testId}', name: 'remove_assigned_test', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Remove a test assignment from classroom')]
    #[OA\Parameter(
        name: 'classroomId',
        in: 'path',
        description: 'Classroom ID',
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
        description: 'Test assignment removed successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Classroom, test, or assignment not found'
    )]
    public function removeAssignment(int $classroomId, int $testId): JsonResponse
    {
        $result = $this->testAssignmentService->removeAssignment($classroomId, $testId);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/classroom/{id}', name: 'list_assigned_test', methods: ['GET'])]
    #[OA\Get(summary: 'Get all tests assigned to a classroom')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Classroom ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'List of assigned tests',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'test_id', type: 'integer', example: 1),
                    new OA\Property(property: 'test_name', type: 'string', example: 'Midterm Exam'),
                    new OA\Property(property: 'unit_id', type: 'integer', example: 3, nullable: true),
                    new OA\Property(property: 'unit_name', type: 'string', example: 'Chapter 3', nullable: true),
                    new OA\Property(property: 'assigned_at', type: 'string', format: 'date-time', example: '2025-05-01T10:00:00'),
                    new OA\Property(property: 'due_date', type: 'string', format: 'date-time', example: '2025-05-15T23:59:59', nullable: true),
                    new OA\Property(property: 'time_limit', type: 'integer', example: 45, nullable: true),
                    new OA\Property(property: 'visibility', type: 'boolean', example: true),
                    new OA\Property(property: 'is_mandatory', type: 'boolean', example: true)
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Classroom not found'
    )]
    public function getClassroomAssignments(int $id): JsonResponse
    {
        $result = $this->testAssignmentService->listClassroomAssignments($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }
}
