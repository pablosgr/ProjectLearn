<?php

namespace App\Controller;

use App\Service\CategoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/category', name: 'category')]

final class CategoryController extends AbstractController{
    #[Route('', name: 'post_category', methods: ['POST'])]
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
    public function delete_category(
        int $id,
        CategoryService $categoryService,
    ): JsonResponse
    {
        $result  = $categoryService -> deleteCategory($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'list_all_categories', methods: ['GET'])]
    public function get_category(
        CategoryService $categoryService
    ): JsonResponse
    {
        $result  = $categoryService -> listAllCategories();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'get_category_by_param', methods: ['GET'])]
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
