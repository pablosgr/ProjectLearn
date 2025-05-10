<?php

namespace App\Controller;

use App\Service\TagService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/tag', name: 'tag')]
#[OA\Tag(name: 'Tags')]
final class TagController extends AbstractController{
    #[Route('', name: 'post_tag', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new tag')]
    #[OA\RequestBody(
        description: 'Tag data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Algebra')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Tag created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Tag created successfully'),
                new OA\Property(property: 'id', type: 'integer', example: 1)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    public function create_tag(
        Request $request,
        TagService $tagService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $tagService -> createTag($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_tag', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Delete a tag')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Tag ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Tag deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Tag not found'
    )]
    public function delete_tag(
        int $id,
        TagService $tagService,
    ): JsonResponse
    {
        $result  = $tagService -> deleteTag($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_tags', methods: ['GET'])]
    #[OA\Get(summary: 'Get all tags')]
    #[OA\Response(
        response: 200,
        description: 'Returns all tags',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Algebra')
                ]
            )
        )
    )]
    public function get_all_tags(
        TagService $tagService
    ): JsonResponse
    {
        $result  = $tagService -> listAllTags();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_tag_by_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get tags by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (name, id, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'name'
    )]
    #[OA\Parameter(
        name: 'value',
        in: 'query',
        description: 'Parameter value',
        schema: new OA\Schema(type: 'string'),
        example: 'Algebra'
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns tags matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Algebra')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No tags found'
    )]
    public function get_tag_by_param(
        string $param,
        TagService $tagService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $tagService -> listTagByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
