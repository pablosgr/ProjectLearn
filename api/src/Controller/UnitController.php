<?php

namespace App\Controller;

use App\Service\UnitService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/unit', name: 'unit')]

final class UnitController extends AbstractController{
    #[Route('', name: 'post_unit', methods: ['POST'])]
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
    public function delete_unit(
        int $id,
        UnitService $unitService,
    ): JsonResponse
    {
        $result  = $unitService -> deleteUnit($id);

        return $this -> json($result['body'], $result['status']);
    }

    #[Route('/{id}', name: 'update_unit', methods: ['PUT'])]
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
    public function get_unit(
        UnitService $unitService
    ): JsonResponse
    {
        $result  = $unitService -> listAllUnits();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_unit_by_param', methods: ['GET'])]
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
