<?php

namespace App\Controller;

use App\Service\TestAssignmentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/assignedtests', name: 'assigned_tests')]

class TestAssignmentController extends AbstractController
{
    public function __construct(
        private TestAssignmentService $testAssignmentService
    ) {}

    #[Route('', name: 'assign_test', methods: ['POST'])]
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
    public function removeAssignment(int $classroomId, int $testId): JsonResponse
    {
        $result = $this->testAssignmentService->removeAssignment($classroomId, $testId);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/classroom/{id}', name: 'list_assigned_test', methods: ['GET'])]
    public function getClassroomAssignments(int $id): JsonResponse
    {
        $result = $this->testAssignmentService->listClassroomAssignments($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }
}
