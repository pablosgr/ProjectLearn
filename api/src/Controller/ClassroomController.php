<?php

namespace App\Controller;

use App\Service\ClassroomService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/classroom', name: 'classroom')]
#[OA\Tag(name: 'Classrooms')]
final class ClassroomController extends AbstractController{
    #[Route('', name: 'classroom_Create', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new classroom')]
    #[OA\RequestBody(
        description: 'Classroom data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101'),
                new OA\Property(property: 'teacher', type: 'integer', example: 1),
                new OA\Property(property: 'description', type: 'string', example: 'Basic mathematics course'),
                new OA\Property(property: 'color', type: 'string', example: '#FF5733')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Classroom created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Classroom created successfully'),
                new OA\Property(property: 'id', type: 'integer', example: 1)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    public function create_classroom(
        ClassroomService $classroomService,
        Request $request
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $classroomService -> createClassroom($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'classroom_delete', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Delete a classroom')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Classroom ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Classroom deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Classroom not found'
    )]
    public function delete_classroom(
        int $id,
        ClassroomService $classroomService,
    ): JsonResponse
    {

        $result  = $classroomService -> deleteClassroom($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'classroom_update', methods: ['PUT'])]
    #[OA\Put(summary: 'Update a classroom')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Classroom ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\RequestBody(
        description: 'Classroom data to update',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Mathematics 201'),
                new OA\Property(property: 'description', type: 'string', example: 'Advanced mathematics course'),
                new OA\Property(property: 'color', type: 'string', example: '#3366FF')
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Classroom updated successfully'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'Classroom not found'
    )]
    public function update_classroom(
        int $id,
        ClassroomService $classroomService,
        Request $request
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $classroomService -> updateClassroom($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'classroom_List', methods: ['GET'])]
    #[OA\Get(summary: 'Get all classrooms')]
    #[OA\Response(
        response: 200,
        description: 'Returns all classrooms',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101'),
                    new OA\Property(property: 'teacher', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe')
                    ]),
                    new OA\Property(property: 'description', type: 'string', example: 'Basic mathematics course'),
                    new OA\Property(property: 'color', type: 'string', example: '#FF5733')
                ]
            )
        )
    )]
    public function list_classrooms(
        ClassroomService $classroomService
    ): JsonResponse
    {
        $result  = $classroomService -> listAllClassrooms();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'user_list_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get classrooms by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (teacher, name, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'teacher'
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
        description: 'Returns classrooms matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101'),
                    new OA\Property(property: 'teacher', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe')
                    ]),
                    new OA\Property(property: 'description', type: 'string', example: 'Basic mathematics course'),
                    new OA\Property(property: 'color', type: 'string', example: '#FF5733')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No classrooms found'
    )]
    public function users_param_list(
        string $param,
        Request $request, 
        ClassroomService $classroomService
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');

        $result  = $classroomService -> listClassroomsByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
