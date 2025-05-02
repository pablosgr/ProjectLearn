<?php

namespace App\Controller;

use App\Service\ClassroomService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/classroom', name: 'classroom')]

final class ClassroomController extends AbstractController{
    #[Route('', name: 'classroom_Create', methods: ['POST'])]
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
    public function delete_classroom(
        int $id,
        ClassroomService $classroomService,
    ): JsonResponse
    {

        $result  = $classroomService -> deleteClassroom($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'classroom_update', methods: ['PUT'])]
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
    public function list_classrooms(
        ClassroomService $classroomService
    ): JsonResponse
    {
        $result  = $classroomService -> listAllClassrooms();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'user_list_param', methods: ['GET'])]
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
