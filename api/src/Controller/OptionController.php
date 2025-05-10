<?php

namespace App\Controller;

use App\Service\OptionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/option', name: 'option')]
#[OA\Tag(name: 'Options')]
final class OptionController extends AbstractController{
    #[Route('', name: 'post_option', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new option')]
    #[OA\RequestBody(
        description: 'Option data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'question_id', type: 'integer', example: 1),
                new OA\Property(property: 'text', type: 'string', example: 'This is an option'),
                new OA\Property(property: 'is_correct', type: 'boolean', example: true)
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Option created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Option created successfully'),
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
        description: 'Question not found'
    )]
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
    #[OA\Delete(summary: 'Delete an option')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Option ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Option deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Option not found'
    )]
    public function delete_option(
        int $id,
        OptionService $optionService,
    ): JsonResponse
    {
        $result  = $optionService -> deleteOption($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'update_option', methods: ['PUT'])]
    #[OA\Put(summary: 'Update an option')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Option ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\RequestBody(
        description: 'Option data to update',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'text', type: 'string', example: 'Updated option text'),
                new OA\Property(property: 'is_correct', type: 'boolean', example: false)
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Option updated successfully'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'Option not found'
    )]
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
    #[OA\Get(summary: 'Get all options')]
    #[OA\Response(
        response: 200,
        description: 'Returns all options',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'question', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'text', type: 'string', example: 'What is 2+2?')
                    ]),
                    new OA\Property(property: 'text', type: 'string', example: 'Four'),
                    new OA\Property(property: 'is_correct', type: 'boolean', example: true)
                ]
            )
        )
    )]
    public function get_all_options(
        OptionService $optionService
    ): JsonResponse
    {
        $result  = $optionService -> listAllOptions();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_option_by_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get options by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (question, is_correct, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'question'
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
        description: 'Returns options matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'question', type: 'object', properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'text', type: 'string', example: 'What is 2+2?')
                    ]),
                    new OA\Property(property: 'text', type: 'string', example: 'Four'),
                    new OA\Property(property: 'is_correct', type: 'boolean', example: true)
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No options found'
    )]
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
