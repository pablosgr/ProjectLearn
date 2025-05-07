<?php

namespace App\Controller;

use App\Service\StudentClassService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/enrollment', name: 'enrollment')]

class StudentClassController extends AbstractController
{
    public function __construct(
        private StudentClassService $studentClassService
    ) {}

    #[Route('', name: 'enroll_student', methods: ['POST'])]
    public function enroll(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $result = $this->studentClassService->enrollStudent($data);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('', name: 'delete_enrollment', methods: ['DELETE'])]
    public function removeEnrollment(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $result = $this->studentClassService->removeEnrollment($data);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }

    #[Route('/classroom/{id}', name: 'list_enrollments', methods: ['GET'])]
    public function getClassStudents(int $id): JsonResponse
    {
        $result = $this->studentClassService->listClassStudents($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }
}
