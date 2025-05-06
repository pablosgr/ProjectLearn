<?php

namespace App\Controller;

use App\Service\OptionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/option', name: 'option')]

final class OptionController extends AbstractController{
    #[Route('', name: 'post_option', methods: ['POST'])]
    public function create_option(
        OptionService $optionService,
        Request $request
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $optionService -> createOption($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_option', methods: ['DELETE'])]
    public function delete_option(
        int $id,
        OptionService $optionService,
    ): JsonResponse
    {
        $result  = $optionService -> deleteOption($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'update_option', methods: ['PUT'])]
    public function update_option(
        int $id,
        Request $request,
        OptionService $optionService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $optionService -> updateOption($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_options', methods: ['GET'])]
    public function get_all_options(
        OptionService $optionService
    ): JsonResponse
    {
        $result  = $optionService -> listAllOptions();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_option_by_param', methods: ['GET'])]
    public function get_option_by_param(
        string $param,
        OptionService $optionService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $optionService -> listOptionsByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
