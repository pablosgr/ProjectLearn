<?php

namespace App\Controller;

use App\Service\UnitService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/unit', name: 'unit')]
#[OA\Tag(name: 'Units')]
final class UnitController extends AbstractController{
    #[Route('', name: 'post_unit', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new unit')]
    #[OA\RequestBody(
        description: 'Unit data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Chapter 1: Introduction'),
                new OA\Property(property: 'classroom_id', type: 'integer', example: 1),
                new OA\Property(property: 'description', type: 'string', example: 'Introduction to the course')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Unit created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Unit created successfully'),
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
        description: 'Classroom not found'
    )]
    public function create_unit(
        Request $request,
        UnitService $unitService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $unitService -> createUnit($data);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/{id}', name: 'delete_unit', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Delete a unit')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Unit ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Unit deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Unit not found'
    )]
    public function delete_unit(
        int $id,
        UnitService $unitService,
    ): JsonResponse
    {
        $result  = $unitService -> deleteUnit($id);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/{id}', name: 'update_unit', methods: ['PUT'])]
    #[OA\Put(summary: 'Update a unit')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Unit ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\RequestBody(
        description: 'Unit data to update',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Chapter 1: Revised Introduction'),
                new OA\Property(property: 'description', type: 'string', example: 'Revised introduction to the course')
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Unit updated successfully'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'Unit not found'
    )]
    public function update_unit(
        int $id,
        Request $request,
        UnitService $unitService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $unitService -> updateUnit($id, $data);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('', name: 'list_all_units', methods: ['GET'])]
    #[OA\Get(summary: 'Get all units')]
    #[OA\Response(
        response: 200,
        description: 'Returns all units',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Chapter 1: Introduction'),
                    new OA\Property(property: 'classroom', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101')
                    ]),
                    new OA\Property(property: 'description', type: 'string', example: 'Introduction to the course')
                ]
            )
        )
    )]
    public function get_unit(
        UnitService $unitService
    ): JsonResponse
    {
        $result  = $unitService -> listAllUnits();

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/{param}', name: 'get_unit_by_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get units by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (classroom, name, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'classroom'
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
        description: 'Returns units matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Chapter 1: Introduction'),
                    new OA\Property(property: 'classroom', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'name', type: 'string', example: 'Mathematics 101')
                    ]),
                    new OA\Property(property: 'description', type: 'string', example: 'Introduction to the course')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No units found'
    )]
    public function get_unit_by_param(
        string $param,
        UnitService $unitService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $unitService -> listUnitByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
