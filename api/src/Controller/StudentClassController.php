<?php

namespace App\Controller;

use App\Service\StudentClassService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

#[Route('/api/enrollment', name: 'enrollment')]
#[OA\Tag(name: 'Student Enrollments')]
class StudentClassController extends AbstractController
{
    public function __construct(
        private StudentClassService $studentClassService
    ) {}

    #[Route('', name: 'enroll_student', methods: ['POST'])]
    #[OA\Post(summary: 'Enroll a student in a classroom')]
    #[OA\RequestBody(
        description: 'Enrollment data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'classroom_id', type: 'integer', example: 1),
                new OA\Property(property: 'student_id', type: 'integer', example: 2)
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Student enrolled successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Student enrolled successfully'),
                new OA\Property(property: 'classroom_name', type: 'string', example: 'Mathematics 101'),
                new OA\Property(property: 'student_name', type: 'string', example: 'John Doe')
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Missing required fields'
    )]
    #[OA\Response(
        response: 404,
        description: 'Classroom or student not found'
    )]
    #[OA\Response(
        response: 409,
        description: 'Student already enrolled'
    )]
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
    #[OA\Delete(summary: 'Remove student enrollment from classroom')]
    #[OA\RequestBody(
        description: 'Enrollment data to delete',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'classroom_id', type: 'integer', example: 1),
                new OA\Property(property: 'student_id', type: 'integer', example: 2)
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Enrollment successfully removed'
    )]
    #[OA\Response(
        response: 400,
        description: 'Missing required fields'
    )]
    #[OA\Response(
        response: 404,
        description: 'Enrollment not found'
    )]
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
    #[OA\Get(summary: 'Get students enrolled in a classroom')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Classroom ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'List of enrolled students',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                    new OA\Property(property: 'email', type: 'string', example: 'john@example.com')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'Classroom not found'
    )]
    public function getClassStudents(int $id): JsonResponse
    {
        $result = $this->studentClassService->listClassStudents($id);
        
        return new JsonResponse(
            $result['body'],
            $result['status']
        );
    }
}
