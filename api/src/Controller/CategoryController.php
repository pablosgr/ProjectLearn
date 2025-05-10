<?php

namespace App\Controller;

use App\Service\CategoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;

#[Route('/api/category', name: 'category')]
#[OA\Tag(name: 'Categories')]
final class CategoryController extends AbstractController{
    #[Route('', name: 'post_category', methods: ['POST'])]
    #[OA\Post(summary: 'Create a new category')]
    #[OA\RequestBody(
        description: 'Category data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Mathematics')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Category created successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Category created successfully'),
                new OA\Property(property: 'id', type: 'integer', example: 1)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    public function create_category(
        Request $request,
        CategoryService $categoryService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $result  = $categoryService -> createCategory($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'delete_category', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Delete a category')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Category ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'Category deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'Category not found'
    )]
    public function delete_category(
        int $id,
        CategoryService $categoryService,
    ): JsonResponse
    {
        $result  = $categoryService -> deleteCategory($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_categories', methods: ['GET'])]
    #[OA\Get(summary: 'Get all categories')]
    #[OA\Response(
        response: 200,
        description: 'Returns all categories',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Mathematics')
                ]
            )
        )
    )]
    public function get_category(
        CategoryService $categoryService
    ): JsonResponse
    {
        $result  = $categoryService -> listAllCategories();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_category_by_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get categories by parameter')]
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
        example: 'Mathematics'
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns categories matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'Mathematics')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No categories found'
    )]
    public function get_category_by_param(
        string $param,
        CategoryService $categoryService,
        Request $request
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');
        $result  = $categoryService -> listCategoryByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }
}
