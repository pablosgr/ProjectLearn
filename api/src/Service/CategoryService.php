<?php

namespace App\Service;

use App\Entity\Category;;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class CategoryService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private CategoryRepository $categoryRepository,
    ) {}
    

    public function createCategory(?array $data = null): array
    {
        if (!isset($data['name']) || empty($data)) {
            return [
                'body' => ['error' => 'Missing name field'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        if ($this->categoryRepository->findOneBy(['name' => $data['name']])) {
            return [
                'body' => ['error' => 'Category already exists'],
                'status' => Response::HTTP_CONFLICT
            ];
        }

        $category = new Category();
        $category->setName($data['name']);
        
        $this->entityManager->persist($category);
        $this->entityManager->flush();

        return [
            'body' => [
                'message' => 'Category registered successfully',
                'category_name' => $category->getName()
            ],
            'status' => Response::HTTP_CREATED
        ];
    }


    public function deleteCategory(int $id): array
    {
        $category = $this->categoryRepository->find($id);
        if (!$category) {
            return [
                'body' => ['error' => 'Category not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        $this->entityManager->remove($category);
        $this->entityManager->flush();

        return [
            'body' => ['message' => 'Category deleted successfully'],
            'status' => Response::HTTP_OK
        ];
    }


    public function updateCategory(int $id, ?array $data = null): array
    {
        $category = $this->categoryRepository->find($id);
        if (!$category) {
            return [
                'body' => ['message' => 'Category not found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }

        if (empty($data) || !isset($data['name'])) {
            return [
                'body' => ['error' => 'Missing or incorrect field in body request'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $newName = $data['name'];
        $category->setName($newName);
        $this->entityManager->flush();

        return [
            'body' => ['message' => "Category name successfully updated to $newName"],
            'status' => Response::HTTP_OK
        ];
    }


    public function listAllCategories(): array
    {
        $categories = $this->categoryRepository->findAll();
        if (!$categories) {
            return [
                'body' => ['message' => 'No categories found'],
                'status' => Response::HTTP_OK
            ];
        }

        $categoryList = [];
        foreach ($categories as $category) {
            $categoryList[] = [
                'id' => $category->getId(),
                'name' => $category->getName()
            ];
        }

        return [
            'body' => $categoryList,
            'status' => Response::HTTP_OK
        ];
    }


    public function listCategoryByParam(?string $param, ?string $query_value): array
    {
        $paramOptions = ['id', 'name'];

        if (empty($param) || !in_array($param, $paramOptions)) {
            return [
                'body' => ['error' => 'Parameter missing or not allowed'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }
        
        if ($query_value === null) {
            return [
                'body' => ['error' => 'Missing value parameter in query string'],
                'status' => Response::HTTP_BAD_REQUEST
            ];
        }

        $category = $this->categoryRepository->findBy([$param => $query_value]);
        if (empty($category)) {
            return [
                'body' => ['error' => 'No categories found'],
                'status' => Response::HTTP_NOT_FOUND
            ];
        }
        $categoryList = [];

        foreach ($category as $cat) {
            $categoryList[] = [
                'id' => $cat->getId(),
                'name' => $cat->getName(),
            ];
        }

        return [
            'body' => ['categories' => $categoryList],
            'status' => Response::HTTP_OK
        ];
    }
}
